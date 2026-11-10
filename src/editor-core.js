// 타이밍 보정 규칙. 화면과 분리해 node --test로 검사한다.
// items: buildTimeline(song) 결과, recorded: 이번 작업에서 기록한 줄 기준 콜 첨자 Set
import { atKind, round2 } from './cue-time.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

// Space 자동 진행의 대상이 되는 항목인가
export function isTarget(song, item, recorded) {
  if (item.kind === 'line') return !isNum(song.lines[item.index].t);
  const cue = song.cues[item.index];
  const kind = atKind(cue.at);
  if (kind === 'abs-null') return true;
  if (kind === 'line') return !recorded.has(item.index) && isNum(song.lines[cue.at.line]?.t);
  return false;
}

// pos 뒤에서 첫 대상의 위치. 없으면 -1.
export function nextTarget(song, items, pos, recorded) {
  for (let i = pos + 1; i < items.length; i++) {
    if (isTarget(song, items[i], recorded)) return i;
  }
  return -1;
}

// 항목의 가사 시간 (줄 기준 콜은 계산값). 없으면 null.
export function itemTime(song, item) {
  if (item.kind === 'line') return song.lines[item.index].t ?? null;
  const at = song.cues[item.index].at;
  if (atKind(at) === 'line') {
    const t = song.lines[at.line]?.t;
    return isNum(t) ? t + (at.offset ?? 0) : null;
  }
  return isNum(at.t) ? at.t : null;
}

// 현재 가사 시간 lyricT를 항목에 기록한다. song을 직접 바꾼다.
// 반환: { ok: true } | { ok: false, message }
export function recordAt(song, item, lyricT, recorded) {
  const t = round2(lyricT);
  if (item.kind === 'line') {
    song.lines[item.index].t = t;
    return { ok: true };
  }
  const cue = song.cues[item.index];
  if (atKind(cue.at) === 'line') {
    const base = song.lines[cue.at.line]?.t;
    if (!isNum(base)) return { ok: false, message: '붙은 가사 줄의 시간이 없어 먼저 줄 시간을 찍어야 합니다' };
    cue.at = { ...cue.at, offset: round2(t - base) };
    recorded.add(item.index);
    return { ok: true };
  }
  cue.at = { t };
  return { ok: true };
}

// 선택 항목을 delta초 조정한다. 줄 기준 콜은 offset을 바꾼다.
// 반환: 조정 후 가사 시간, 조정할 수 없으면 null
export function adjust(song, item, delta, recorded) {
  if (item.kind === 'line') {
    const line = song.lines[item.index];
    if (!isNum(line.t)) return null;
    line.t = round2(line.t + delta);
    return line.t;
  }
  const cue = song.cues[item.index];
  const kind = atKind(cue.at);
  if (kind === 'line') {
    cue.at = { ...cue.at, offset: round2((cue.at.offset ?? 0) + delta) };
    recorded.add(item.index);
    return itemTime(song, item);
  }
  if (kind === 'abs') {
    cue.at = { t: round2(cue.at.t + delta) };
    return cue.at.t;
  }
  return null;
}

// 앞의 시간 있는 줄보다 시간이 작은 줄의 첨자
export function orderWarnings(lines) {
  const out = new Set();
  let prev = null;
  lines.forEach((line, i) => {
    if (!isNum(line.t)) return;
    if (prev !== null && line.t < prev) out.add(i);
    prev = line.t;
  });
  return out;
}

// "첫 가사 줄을 지금으로": 영상 시간과 첫 (시간 있는) 줄 t의 차이
export function offsetFromFirstLine(lines, videoT) {
  const first = lines.find((l) => isNum(l.t));
  return first ? round2(videoT - first.t) : null;
}
