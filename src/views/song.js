import { h, formatTime, storage } from '../dom.js';
import { loadCatalog, loadSong } from '../data.js';
import { notFound } from '../router.js';
import { cueIcon, reviewBadges } from '../cue-types.js';
import {
  buildTimeline, timedCues, cueState, cueTime, currentLineIndex, toVideoTime, toLyricTime,
} from '../cue-time.js';
import { createPlayer, createManualClock } from '../player.js';
import { externalBox } from '../external.js';

const KO_KEY = 'wl.showKo';
const RATES = [0.75, 1];
const USER_SCROLL_PAUSE_MS = 3000;

export function cueBody(cue, { untimed = false } = {}) {
  return [
    cueIcon(cue.type, cue.color),
    h('span.cue-text',
      h('span.cue-main', cue.text || ''),
      cue.ko && h('span.cue-ko.ko', cue.ko),
      cue.note && h('span.cue-note', cue.note),
      untimed && h('span.badge', '시간 미정')),
  ];
}

export async function songView(container, { id }) {
  const cat = await loadCatalog();
  const entry = cat.songs.get(id);
  if (!entry) return notFound(container, '곡을 찾을 수 없습니다');
  const song = await loadSong(entry);
  const artist = cat.artists.get(song.artistId);
  const offset = song.youtube.offsetSec ?? 0;
  const items = buildTimeline(song);
  const timed = timedCues(song);

  let showKo = storage.get(KO_KEY) !== '0';
  let player = null;
  let destroyed = false;
  let rate = 1;
  let embedBlocked = !song.youtube.videoId;
  let external = null; // 외부 재생 모드의 조작 상자
  let startSeq = 0;
  let raf = 0;
  let userScrollAt = 0;
  let lastLine = -2;
  let lastStateKey = '';

  // 가사·콜 목록
  const lineEls = [];
  const cueEls = [];
  const list = h('ol.lyrics', items.map((it) => {
    if (it.kind === 'line') {
      const line = song.lines[it.index];
      const el = h('li.line', {
        class: line.t === null ? 'untimed' : '',
        onclick: () => {
          if (typeof line.t !== 'number' || !player?.ready) return;
          player.seek(toVideoTime(line.t, offset));
          player.play();
        },
      },
      h('span.line-text', line.text),
      line.ko && h('span.line-ko.ko', line.ko));
      lineEls[it.index] = el;
      return el;
    }
    const cue = song.cues[it.index];
    const el = h('li.cue', { dataset: { type: cue.type } }, cueBody(cue, { untimed: cueTime(cue, song.lines) === null }));
    cueEls[it.index] = el;
    return el;
  }));

  // 콜 표시 영역: 위 칸은 늘 "지금", 아래 줄은 늘 "다음"
  const slot = (label) => {
    const labelEl = h('span.panel-label', label);
    const body = h('div.panel-body');
    return { el: h('div.cue-slot', labelEl, body), label: labelEl, body, key: '' };
  };
  const nowSlot = slot('지금');
  const nextSlot = slot('다음');
  const panel = h('section.cue-panel', { 'aria-live': 'off' },
    timed.length
      ? [nowSlot.el, nextSlot.el]
      : h('span.panel-label', '시간이 정해진 콜이 없습니다'));

  // 조작
  const timeEl = h('span.clock', '0:00.00');
  const rateBtns = RATES.map((r) => h('button.btn', {
    type: 'button',
    'aria-pressed': r === 1 ? 'true' : 'false',
    onclick: () => {
      rate = r;
      player?.setRate(r);
      rateBtns.forEach((b, i) => b.setAttribute('aria-pressed', RATES[i] === r ? 'true' : 'false'));
    },
  }, `${r}배`));
  const koBtn = h('button.btn', { type: 'button' });
  const modeBtn = h('button.btn', {
    type: 'button',
    onclick: () => (external ? startVideo() : startExternal()),
  });
  const root = h('div.practice');
  const applyKo = () => {
    root.classList.toggle('hide-ko', !showKo);
    koBtn.textContent = showKo ? '발음 숨기기' : '발음 보이기';
    koBtn.setAttribute('aria-pressed', showKo ? 'true' : 'false');
  };
  koBtn.addEventListener('click', () => {
    showKo = !showKo;
    storage.set(KO_KEY, showKo ? '1' : '0');
    applyKo();
  });
  applyKo();

  const playerBox = h('div.player-box');
  const top = h('div.practice-top', playerBox, panel,
    h('div.controls', rateBtns, koBtn, modeBtn, timeEl));

  root.append(
    h('div.practice-side',
      h('nav.crumbs', h('a', { href: `#/artist/${song.artistId}` }, `← ${artist?.name ?? '아티스트'}`)),
      h('header.page-header',
        h('h1', song.title),
        h('p.muted', artist?.name),
        h('p.badges', reviewBadges(song.review))),
      top),
    h('div.practice-main',
      !song.lines.length && h('p.notice', '이 곡은 가사 없이 콜만 들어 있습니다. 콜 시간은 영상 기준입니다.'),
      list,
      h('section.sources',
        h('h2.section-label', h('span', 'SOURCE'), '응원 정보 출처'),
        h('ul', song.sources.map((s) => h('li', h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label ?? s.url))))),
      h('p.footnote', h('a', { href: `#/edit/${song.id}` }, '타이밍 보정 화면 →'))),
  );
  container.replaceChildren(root);

  function updateModeBtn() {
    modeBtn.hidden = embedBlocked;
    modeBtn.textContent = external ? '영상으로 재생' : '외부에서 재생';
  }

  // 외부 재생 모드: 다른 탭·앱에서 곡을 틀고 사이트 시계로 진행한다
  function startExternal(message) {
    startSeq++;
    player?.destroy();
    player = createManualClock();
    player.setRate(rate);
    external = externalBox({
      clock: player,
      videoId: song.youtube.videoId,
      message,
      hint: '다른 탭이나 앱에서 곡을 틀고, 가사 줄이 시작되는 순간 그 줄을 누르면 시계가 맞춰집니다.',
    });
    playerBox.replaceChildren(external.el);
    playerBox.classList.add('external-mode');
    updateModeBtn();
  }

  function startVideo() {
    const my = ++startSeq;
    player?.destroy();
    player = null;
    external = null;
    playerBox.classList.remove('external-mode');
    playerBox.replaceChildren();
    updateModeBtn();
    createPlayer(playerBox, {
      videoId: song.youtube.videoId,
      onError: (code, message) => {
        if (my !== startSeq) return;
        if (code === 101 || code === 150) embedBlocked = true;
        startExternal(message);
      },
    }).then((p) => {
      if (destroyed || my !== startSeq) p.destroy();
      else player = p;
    }).catch((e) => {
      if (my === startSeq) startExternal(e.message);
    });
  }

  if (song.youtube.videoId) startVideo();
  else startExternal('아직 영상이 지정되지 않았습니다');

  // 사용자가 직접 스크롤하면 잠시 자동 스크롤을 멈춘다
  const markUserScroll = () => { userScrollAt = performance.now(); };
  window.addEventListener('wheel', markUserScroll, { passive: true });
  window.addEventListener('touchmove', markUserScroll, { passive: true });

  function scrollToLine(el) {
    const tr = top.getBoundingClientRect();
    const lr = list.getBoundingClientRect();
    const overlaps = getComputedStyle(top).position === 'sticky' && tr.right > lr.left && tr.left < lr.right;
    const covered = overlaps ? Math.max(0, tr.bottom) : 0;
    const er = el.getBoundingClientRect();
    const target = window.scrollY + er.top + er.height / 2 - (covered + (window.innerHeight - covered) / 2);
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }

  const ids = (group) => group.map((c) => c.index).join(',');

  // 칸의 콜 묶음이 바뀔 때만 다시 그린다. 새 줄은 CSS 애니메이션으로 들어오고,
  // 비워질 때는 지우지 않고 흐리게 사라지게 둔다(다음 콜이 들어올 때 교체).
  function setSlotCues(slot, group) {
    const key = ids(group);
    if (key === slot.key) return;
    slot.key = key;
    if (!group.length) {
      slot.body.classList.add('is-leaving');
      return;
    }
    slot.body.classList.remove('is-leaving');
    slot.body.replaceChildren(...group.map((c) => h('div.panel-cue', cueBody(song.cues[c.index]))));
  }

  function renderPanel(state, now) {
    const key = `${ids(state.now)}|${ids(state.next)}|${state.soon}`;
    if (key !== lastStateKey) {
      lastStateKey = key;
      nowSlot.el.dataset.state = state.now.length ? 'now' : 'idle';
      nowSlot.label.textContent = state.now.length ? '지금!' : '지금';
      setSlotCues(nowSlot, state.now);
      nextSlot.el.dataset.state = state.soon ? 'soon' : 'idle';
      setSlotCues(nextSlot, state.next);
      cueEls.forEach((el) => el?.classList.remove('is-next', 'is-now'));
      for (const c of state.now) cueEls[c.index]?.classList.add('is-now');
      if (state.soon) for (const c of state.next) cueEls[c.index]?.classList.add('is-next');
    }
    const sec = state.next.length ? Math.max(0, state.next[0].time - now) : null;
    const nextLabel = sec === null ? '다음 콜 없음'
      : `다음 · ${sec < 10 ? sec.toFixed(1) : Math.round(sec)}초 후`;
    if (nextSlot.label.textContent !== nextLabel) nextSlot.label.textContent = nextLabel;
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!player?.ready) return;
    external?.update();
    const videoT = player.time();
    const now = toLyricTime(videoT, offset);
    timeEl.textContent = formatTime(videoT);

    const li = currentLineIndex(song.lines, now);
    if (li !== lastLine) {
      lineEls[lastLine]?.classList.remove('is-current');
      lastLine = li;
      const el = lineEls[li];
      if (el) {
        el.classList.add('is-current');
        if (performance.now() - userScrollAt > USER_SCROLL_PAUSE_MS) scrollToLine(el);
      }
    }
    if (timed.length) renderPanel(cueState(timed, now), now);
  }
  raf = requestAnimationFrame(tick);

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', markUserScroll);
    window.removeEventListener('touchmove', markUserScroll);
    player?.destroy();
  };
}
