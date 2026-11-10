// 콜·가사 시간 계산. 사이트와 tools/validate.mjs가 함께 쓴다.
// 가사 시간: LRCLIB 기준 시간(초). 영상 시간 = 가사 시간 + youtube.offsetSec.

export const CUE_TYPES = ['call', 'clap', 'jump', 'singalong', 'motion', 'penlight', 'other'];

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

export function round2(v) {
  return Math.round(v * 100) / 100;
}

// at 형식 판별: 'line' = { line, offset? }, 'abs' = { t: 숫자 }, 'abs-null' = { t: null, afterLine? }.
// afterLine은 시간 미정 콜을 목록에서 어느 줄 뒤에 둘지 정하는 선택 필드다(0 기준, -1이면 맨 앞).
// 어느 형식도 아니면 null.
export function atKind(at) {
  if (!at || typeof at !== 'object') return null;
  if ('line' in at) {
    if (!Number.isInteger(at.line) || 't' in at) return null;
    if ('offset' in at && !isNum(at.offset)) return null;
    return 'line';
  }
  if ('t' in at) {
    if (at.t === null) return !('afterLine' in at) || Number.isInteger(at.afterLine) ? 'abs-null' : null;
    if (isNum(at.t)) return 'abs';
  }
  return null;
}

// 콜의 가사 시간. 계산할 수 없으면 null.
// { line, offset }은 0 기준 첨자로 lines[line].t + offset이다.
export function cueTime(cue, lines) {
  const at = cue?.at;
  switch (atKind(at)) {
    case 'line': {
      const t = lines[at.line]?.t;
      return isNum(t) ? t + (at.offset ?? 0) : null;
    }
    case 'abs':
      return at.t;
    default:
      return null;
  }
}

export function toVideoTime(lyricTime, offsetSec = 0) {
  return lyricTime + offsetSec;
}

export function toLyricTime(videoTime, offsetSec = 0) {
  return videoTime - offsetSec;
}

// 가사 시간 now에 해당하는 줄 첨자. 첫 줄 이전이면 -1.
// 시간이 없는 줄은 건너뛴다.
export function currentLineIndex(lines, now) {
  let idx = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].t;
    if (!isNum(t)) continue;
    if (t <= now) idx = i;
    else break;
  }
  return idx;
}

// 화면 목록 순서. 가사 줄마다 그 줄 뒤에 붙는 콜을 이어 붙인다.
// - 줄 기준 콜: 자신이 붙은 줄 뒤
// - 절대 시간 콜: 그 시간 이전의 마지막 시간 있는 줄 뒤 (첫 줄보다 이르면 맨 앞)
// - 시간 미정 콜: afterLine 줄 뒤. 없으면 cues[]에서 바로 앞 콜과 같은 자리 (첫 콜이면 맨 앞)
// 같은 자리의 콜은 cues[] 순서를 따른다.
// 결과: [{ kind: 'line', index } | { kind: 'cue', index }]
export function buildTimeline(song) {
  const lines = song.lines ?? [];
  const cues = song.cues ?? [];
  const anchors = [];
  let prev = -1;
  cues.forEach((cue, i) => {
    let anchor;
    switch (atKind(cue.at)) {
      case 'line':
        anchor = Math.min(Math.max(cue.at.line, -1), lines.length - 1);
        break;
      case 'abs':
        anchor = currentLineIndex(lines, cue.at.t);
        break;
      default:
        anchor = Number.isInteger(cue.at?.afterLine)
          ? Math.min(Math.max(cue.at.afterLine, -1), lines.length - 1)
          : prev;
    }
    anchors[i] = anchor;
    prev = anchor;
  });

  const byAnchor = new Map();
  anchors.forEach((a, i) => {
    if (!byAnchor.has(a)) byAnchor.set(a, []);
    byAnchor.get(a).push(i);
  });

  const items = [];
  for (const i of byAnchor.get(-1) ?? []) items.push({ kind: 'cue', index: i });
  lines.forEach((_, li) => {
    items.push({ kind: 'line', index: li });
    for (const i of byAnchor.get(li) ?? []) items.push({ kind: 'cue', index: i });
  });
  return items;
}

export const PREVIEW_SEC = 1.5;
const MIN_NOW_SEC = 1.5;
const SAME_TIME_SEC = 0.05;

// 시간 계산이 가능한 콜을 시간 순으로. [{ index, time, until }]
// until: "지금" 표시를 끝낼 가사 시간. 콜 이후 처음 시작하는 시간 있는 줄의 t이고,
// 최소 MIN_NOW_SEC는 보여준다. 뒤에 줄이 없으면 Infinity.
export function timedCues(song) {
  const lines = song.lines ?? [];
  const out = [];
  (song.cues ?? []).forEach((cue, index) => {
    const time = cueTime(cue, lines);
    if (time === null) return;
    const nextLine = lines.find((l) => isNum(l.t) && l.t > time);
    const until = nextLine ? Math.max(nextLine.t, time + MIN_NOW_SEC) : Infinity;
    out.push({ index, time, until });
  });
  return out.sort((a, b) => a.time - b.time || a.index - b.index);
}

// 콜 표시 영역 상태.
// next: 1.5초 안에 다가오는 콜 묶음, now: 마지막으로 발동한 콜 묶음.
// "지금" 상태는 다음 가사 줄이 시작되거나(until) 다음 콜 예고가 시작되면 끝난다.
export function cueState(timed, now) {
  let firstFuture = timed.findIndex((c) => c.time > now);
  if (firstFuture === -1) firstFuture = timed.length;

  const group = (start, dir) => {
    if (start < 0 || start >= timed.length) return [];
    const base = timed[start].time;
    const out = [];
    for (let i = start; i >= 0 && i < timed.length; i += dir) {
      if (Math.abs(timed[i].time - base) > SAME_TIME_SEC) break;
      out.push(timed[i]);
    }
    return dir < 0 ? out.reverse() : out;
  };

  const next = firstFuture < timed.length && timed[firstFuture].time - now <= PREVIEW_SEC
    ? group(firstFuture, 1)
    : [];
  const fired = group(firstFuture - 1, -1);
  const active = fired.length && now < Math.max(...fired.map((c) => c.until)) ? fired : [];
  return { next, now: next.length ? [] : active };
}
