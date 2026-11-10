import { h, formatTime, storage } from '../dom.js';
import { loadCatalog, loadSong } from '../data.js';
import { notFound } from '../router.js';
import { cueIcon } from '../cue-types.js';
import {
  buildTimeline, atKind, currentLineIndex, toVideoTime, toLyricTime, round2,
} from '../cue-time.js';
import {
  isTarget, nextTarget, recordAt, adjust, orderWarnings, offsetFromFirstLine, itemTime,
} from '../editor-core.js';
import { createPlayer, createManualClock } from '../player.js';
import { externalBox } from '../external.js';

const EDIT_RATES = { 1: 0.5, 2: 0.75, 3: 1 };
const workKey = (id) => `wl.edit.${id}`;

function readWork(id) {
  try {
    const w = JSON.parse(storage.get(workKey(id)));
    return w?.song ? w : null;
  } catch {
    return null;
  }
}

export async function editView(container, { id }) {
  const cat = await loadCatalog();
  const entry = cat.songs.get(id);
  if (!entry) return notFound(container, '곡을 찾을 수 없습니다');
  const fresh = await loadSong(entry);
  const saved = readWork(id);

  let cleanup = null;
  let closed = false;
  const start = (work) => {
    if (!closed) cleanup = startEditor(container, cat, fresh, work);
  };

  if (saved) {
    const when = new Date(saved.savedAt).toLocaleString('ko-KR');
    container.replaceChildren(h('section.resume',
      h('h1', fresh.title),
      h('p', `저장된 보정 작업이 있습니다 (${when}).`),
      h('p',
        h('button.btn.primary', { type: 'button', onclick: () => start(saved) }, '이어 하기'),
        ' ',
        h('button.btn', {
          type: 'button',
          onclick: () => {
            storage.remove(workKey(id));
            start(null);
          },
        }, '버리고 파일에서 새로 시작')),
      h('p', h('a', { href: `#/song/${id}` }, '← 연습 화면'))));
  } else {
    start(null);
  }

  return () => {
    closed = true;
    cleanup?.();
  };
}

function startEditor(container, cat, fresh, work) {
  const song = work ? work.song : structuredClone(fresh);
  const recorded = new Set(work?.recorded ?? []);
  const artist = cat.artists.get(song.artistId);
  const items = buildTimeline(song);

  let player = null;
  let destroyed = false;
  let external = null; // 외부 재생 모드의 조작 상자
  let currentRate = 1;
  let raf = 0;
  let sel = nextTarget(song, items, -1, recorded);
  if (sel < 0) sel = 0;
  let playingLine = -2;

  const save = () => {
    const ok = storage.set(workKey(song.id), JSON.stringify({
      song, recorded: [...recorded], savedAt: new Date().toISOString(),
    }));
    if (!ok) setStatus('브라우저 저장소에 저장하지 못했습니다. 작업을 자주 내려받으세요.', true);
  };

  // 상태 표시
  const statusEl = h('p.status', { role: 'status' });
  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.classList.toggle('error', isError);
  }

  // 목록
  const rows = items.map((it, pos) => h('li.edit-row', {
    onclick: () => select(pos),
  }));
  const list = h('ol.edit-list', rows);

  function renderRow(pos) {
    const it = items[pos];
    const row = rows[pos];
    const t = itemTime(song, it);
    const parts = [h('span.edit-time', t === null ? '—' : formatTime(t))];
    row.className = 'edit-row';
    if (it.kind === 'line') {
      const line = song.lines[it.index];
      row.classList.add('kind-line');
      parts.push(h('span.edit-label', h('span.edit-index', `${it.index}`), line.text || '(빈 줄)'));
      if (orderWarnings(song.lines).has(it.index)) parts.push(h('span.badge.error', '순서 역전'));
    } else {
      const cue = song.cues[it.index];
      const kind = atKind(cue.at);
      row.classList.add('kind-cue');
      parts.push(h('span.edit-label', cueIcon(cue.type, cue.color), ' ', cue.text || cue.note || cue.type));
      if (kind === 'line') {
        parts.push(h('span.edit-offset', `+${(cue.at.offset ?? 0).toFixed(2)}`));
        if (recorded.has(it.index)) parts.push(h('span.badge.ok', '✓'));
      } else {
        parts.push(h('span.badge', kind === 'abs-null' ? '시간 미정' : '절대'));
      }
    }
    if (isTarget(song, it, recorded)) row.classList.add('is-target');
    if (pos === sel) row.classList.add('is-selected');
    if (it.kind === 'line' && it.index === playingLine) row.classList.add('is-playing');
    row.replaceChildren(...parts);
  }
  const renderAll = () => rows.forEach((_, i) => renderRow(i));

  function select(pos, { scroll = true } = {}) {
    const prev = sel;
    sel = pos;
    if (prev >= 0 && prev < rows.length) renderRow(prev);
    if (sel >= 0) {
      renderRow(sel);
      if (scroll) rows[sel].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // 조작
  const offsetInput = h('input', {
    type: 'number', step: '0.01', value: String(song.youtube.offsetSec ?? 0), id: 'offset-input',
    onchange: () => {
      const v = Number(offsetInput.value);
      if (!Number.isFinite(v)) return;
      song.youtube.offsetSec = round2(v);
      save();
      setStatus(`offsetSec = ${song.youtube.offsetSec}`);
    },
  });
  const firstLineBtn = h('button.btn', {
    type: 'button',
    onclick: () => {
      if (!player?.ready) return;
      const v = offsetFromFirstLine(song.lines, player.time());
      if (v === null) return setStatus('시간이 있는 가사 줄이 없습니다', true);
      song.youtube.offsetSec = v;
      offsetInput.value = String(v);
      save();
      setStatus(`offsetSec = ${v} (첫 가사 줄 기준)`);
    },
  }, '첫 가사 줄을 지금으로');

  const playBtn = h('button.btn.primary', { type: 'button', onclick: () => player?.toggle() }, '▶ 재생');
  const rateBtns = Object.entries(EDIT_RATES).map(([key, r]) => h('button.btn', {
    type: 'button', onclick: () => setRate(r), dataset: { rate: String(r) },
  }, `${r}배 (${key})`));
  function setRate(r) {
    currentRate = r;
    player?.setRate(r);
    rateBtns.forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.rate) === r ? 'true' : 'false'));
  }
  const skip = (d) => player?.ready && player.seek(player.time() + d);
  const clockEl = h('span.clock');
  const durationEl = h('p.muted');

  const timingCheck = h('input', { type: 'checkbox', id: 'timing-done', checked: song.review.timing === true });
  const exportText = () => {
    song.review.timing = timingCheck.checked;
    save();
    return `${JSON.stringify(song, null, 2)}\n`;
  };
  const downloadBtn = h('button.btn.primary', {
    type: 'button',
    onclick: () => {
      const url = URL.createObjectURL(new Blob([exportText()], { type: 'application/json' }));
      const a = h('a', { href: url, download: `${song.id}.json` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`${song.id}.json 내려받기 → data/songs/${song.artistId}/에 덮어쓰고 npm run validate`);
    },
  }, 'JSON 내려받기');
  const copyBtn = h('button.btn', {
    type: 'button',
    onclick: async () => {
      try {
        await navigator.clipboard.writeText(exportText());
        setStatus('클립보드에 복사했습니다');
      } catch {
        setStatus('클립보드 복사에 실패했습니다. 내려받기를 쓰세요.', true);
      }
    },
  }, '클립보드 복사');
  const discardBtn = h('button.btn.danger', {
    type: 'button',
    onclick: () => {
      storage.remove(workKey(song.id));
      setStatus('저장된 작업을 지웠습니다. 새로고침하면 파일 내용으로 돌아갑니다.');
    },
  }, '저장된 작업 지우기');

  const playerBox = h('div.player-box.locked');
  container.replaceChildren(h('div.editor',
    h('div.editor-side',
      h('nav.crumbs', h('a', { href: `#/song/${song.id}` }, '← 연습 화면')),
      h('header.page-header',
        h('h1', `보정: ${song.title}`),
        h('p.muted', artist?.name)),
      playerBox,
      h('div.controls',
        playBtn,
        h('button.btn', { type: 'button', onclick: () => skip(-5) }, '−5초'),
        h('button.btn', { type: 'button', onclick: () => skip(5) }, '+5초'),
        rateBtns),
      h('p', clockEl),
      h('div.field',
        h('label', { for: 'offset-input' }, 'offsetSec'), offsetInput, firstLineBtn),
      durationEl,
      h('details.help', { open: true },
        h('summary', '키 조작'),
        h('ul',
          h('li', h('kbd', 'Space'), ' 선택 항목에 현재 시간 기록, 다음 대상으로'),
          h('li', h('kbd', '←'), h('kbd', '→'), ' ±0.1초, ', h('kbd', 'Shift'), ' ±0.01초 (1초 전부터 다시 재생)'),
          h('li', h('kbd', '↑'), h('kbd', '↓'), ' 선택 이동, 항목을 눌러도 선택'),
          h('li', h('kbd', 'K'), ' 재생/일시정지, ', h('kbd', '1'), h('kbd', '2'), h('kbd', '3'), ' 속도 0.5/0.75/1배'))),
      h('div.export',
        h('label', timingCheck, ' 타이밍 검수 완료'),
        h('div.controls', downloadBtn, copyBtn, discardBtn)),
      statusEl),
    h('div.editor-main', list)));

  renderAll();
  if (rows[sel]) rows[sel].scrollIntoView({ block: 'center' });

  function record() {
    if (!player?.ready) return setStatus('영상이 아직 준비되지 않았습니다', true);
    if (sel < 0) return setStatus('선택된 대상이 없습니다. 항목을 누르세요.', true);
    const r = recordAt(song, items[sel], toLyricTime(player.time(), song.youtube.offsetSec), recorded);
    if (!r.ok) return setStatus(r.message, true);
    save();
    const done = sel;
    sel = nextTarget(song, items, done, recorded);
    renderAll();
    if (sel >= 0) rows[sel].scrollIntoView({ block: 'center', behavior: 'smooth' });
    setStatus(sel >= 0 ? '' : '남은 대상이 없습니다. 항목을 눌러 다시 고를 수 있습니다.');
  }

  function nudge(delta) {
    if (sel < 0) return;
    const t = adjust(song, items[sel], delta, recorded);
    if (t === null) return setStatus('시간이 없는 항목은 조정할 수 없습니다. 먼저 Space로 기록하세요.', true);
    save();
    renderAll();
    // 외부 재생 모드에서는 외부 음원을 되감을 수 없으므로 값만 바꾼다
    if (player?.ready && !player.manual) {
      player.seek(toVideoTime(t, song.youtube.offsetSec) - 1);
      player.play();
    }
  }

  const onKey = (e) => {
    const el = e.target;
    const typing = (el?.tagName === 'INPUT' && el.type !== 'checkbox') || el?.tagName === 'TEXTAREA' || el?.tagName === 'SELECT';
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === 'Space') {
      // 포커스된 버튼·체크박스가 Space로 함께 눌리지 않게 한다
      if (el instanceof HTMLElement && el !== document.body) el.blur();
      e.preventDefault();
      record();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      nudge((e.shiftKey ? 0.01 : 0.1) * (e.key === 'ArrowLeft' ? -1 : 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(rows.length - 1, Math.max(0, sel + (e.key === 'ArrowUp' ? -1 : 1)));
      select(next);
    } else if (e.key === 'k' || e.key === 'K') {
      player?.toggle();
    } else if (EDIT_RATES[e.key]) {
      setRate(EDIT_RATES[e.key]);
    }
  };
  window.addEventListener('keydown', onKey);

  // 외부 재생 모드: 다른 탭·앱에서 곡을 틀고 사이트 시계로 기록한다
  function startExternal(message) {
    player?.destroy();
    player = createManualClock();
    player.setRate(currentRate);
    const syncBtn = h('button.btn', {
      type: 'button',
      onclick: () => {
        const t = sel >= 0 ? itemTime(song, items[sel]) : null;
        if (t === null) return setStatus('선택 항목에 시간이 없습니다. 시간이 있는 줄을 고르세요.', true);
        player.seek(toVideoTime(t, song.youtube.offsetSec));
        player.play();
      },
    }, '선택 항목이 지금 시작');
    const zeroBtn = h('button.btn', {
      type: 'button',
      onclick: () => {
        player.seek(0);
        player.play();
      },
    }, '곡 시작(0초)이 지금');
    external = externalBox({
      clock: player,
      videoId: song.youtube.videoId,
      message,
      hint: '다른 탭이나 앱에서 곡을 틀고, 시간이 있는 줄을 고른 뒤 그 줄이 들리는 순간 "선택 항목이 지금 시작"을 누르세요. ←/→ 조정 후 다시 재생은 되지 않습니다.',
      extra: [syncBtn, zeroBtn],
    });
    playerBox.classList.remove('locked');
    playerBox.classList.add('external-mode');
    playerBox.replaceChildren(external.el);
  }

  if (song.youtube.videoId) {
    createPlayer(playerBox, {
      videoId: song.youtube.videoId,
      onError: (_code, message) => {
        if (!destroyed) startExternal(message);
      },
    }).then((p) => {
      if (destroyed || external) return p.destroy();
      player = p;
      setRate(1);
    }).catch((e) => startExternal(e.message));
  } else {
    startExternal('youtube.videoId가 비어 있습니다');
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!player?.ready) return;
    external?.update();
    const videoT = player.time();
    const lyricT = toLyricTime(videoT, song.youtube.offsetSec);
    clockEl.textContent = `영상 ${formatTime(videoT)} · 가사 ${formatTime(lyricT)}`;
    playBtn.textContent = player.playing ? '⏸ 일시정지' : '▶ 재생';

    const d = player.duration();
    if (d > 0 && song.youtube.durationSec !== round2(d)) {
      // 영상 길이만 바뀐 것은 작업으로 치지 않는다. 다음 저장이나 내보내기에 함께 담긴다.
      song.youtube.durationSec = round2(d);
    }
    const expected = song.durationSec + song.youtube.offsetSec;
    const durationText = song.youtube.durationSec
      ? `영상 길이 ${song.youtube.durationSec}초 · 가사 길이 + offset ${round2(expected)}초`
      : '';
    if (durationEl.textContent !== durationText) durationEl.textContent = durationText;

    const li = currentLineIndex(song.lines, lyricT);
    if (li !== playingLine) {
      const prevPos = items.findIndex((it) => it.kind === 'line' && it.index === playingLine);
      playingLine = li;
      const pos = items.findIndex((it) => it.kind === 'line' && it.index === li);
      if (prevPos >= 0) renderRow(prevPos);
      if (pos >= 0) renderRow(pos);
    }
  }
  raf = requestAnimationFrame(tick);

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    player?.destroy();
  };
}
