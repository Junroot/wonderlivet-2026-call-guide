import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTimeline, toLyricTime } from '../src/cue-time.js';
import {
  isTarget, nextTarget, recordAt, adjust, orderWarnings, offsetFromFirstLine, itemTime,
} from '../src/editor-core.js';

function makeSong() {
  return {
    lines: [
      { t: 30, text: '1' },
      { t: 35, text: '2' },
      { t: 40, text: '3' },
      { t: 44, text: '4' },
      { t: null, text: '5' },
      { t: null, text: '6' },
    ],
    cues: [
      { type: 'call', at: { line: 4, offset: 0 } },
      { type: 'jump', at: { t: null } },
    ],
  };
}
const pos = (items, kind, index) => items.findIndex((it) => it.kind === kind && it.index === index);

test('줄 시간이 없으면 그 줄이 먼저 대상, 줄 기준 콜은 그 뒤', () => {
  const song = makeSong();
  const items = buildTimeline(song);
  const rec = new Set();
  // 순서: l0 l1 l2 l3 l4 c0 c1 l5
  const first = nextTarget(song, items, -1, rec);
  assert.deepEqual(items[first], { kind: 'line', index: 4 });
  assert.equal(isTarget(song, items[pos(items, 'cue', 0)], rec), false);
});

test('5번째 줄: 영상 48.30초, offsetSec 2.0 → t = 46.30, 다음 대상으로 진행', () => {
  const song = makeSong();
  const items = buildTimeline(song);
  const rec = new Set();
  const p = pos(items, 'line', 4);
  assert.deepEqual(recordAt(song, items[p], toLyricTime(48.3, 2), rec), { ok: true });
  assert.equal(song.lines[4].t, 46.3);
  const next = nextTarget(song, items, p, rec);
  assert.deepEqual(items[next], { kind: 'cue', index: 0 });
});

test('줄 기준 콜: lines[4].t 46.30, 영상 50.10초, offsetSec 2.0 → offset 1.80', () => {
  const song = makeSong();
  song.lines[4].t = 46.3;
  const items = buildTimeline(song);
  const rec = new Set();
  const p = pos(items, 'cue', 0);
  recordAt(song, items[p], toLyricTime(50.1, 2), rec);
  assert.deepEqual(song.cues[0].at, { line: 4, offset: 1.8 });
  assert.ok(rec.has(0));
  assert.equal(isTarget(song, items[p], rec), false);
  assert.deepEqual(items[nextTarget(song, items, p, rec)], { kind: 'cue', index: 1 });
});

test('시간 미정 콜: 영상 85.20초, offsetSec 2.0 → { t: 83.20 }', () => {
  const song = makeSong();
  const items = buildTimeline(song);
  recordAt(song, items[pos(items, 'cue', 1)], toLyricTime(85.2, 2), new Set());
  assert.deepEqual(song.cues[1].at, { t: 83.2 });
});

test('이미 시간이 있는 줄을 직접 골라 기록하면 덮어쓴다', () => {
  const song = makeSong();
  const items = buildTimeline(song);
  recordAt(song, items[pos(items, 'line', 1)], 36.25, new Set());
  assert.equal(song.lines[1].t, 36.25);
});

test('줄 시간이 없는 줄 기준 콜은 기록할 수 없다', () => {
  const song = makeSong();
  const items = buildTimeline(song);
  const r = recordAt(song, items[pos(items, 'cue', 0)], 50, new Set());
  assert.equal(r.ok, false);
});

test('←: t 46.30 → 46.20, →: offset 1.80 → 1.90, Shift 0.01', () => {
  const song = makeSong();
  song.lines[4].t = 46.3;
  song.cues[0].at = { line: 4, offset: 1.8 };
  const items = buildTimeline(song);
  const rec = new Set();
  assert.equal(adjust(song, items[pos(items, 'line', 4)], -0.1, rec), 46.2);
  assert.equal(adjust(song, items[pos(items, 'cue', 0)], 0.1, rec), 48.1);
  assert.equal(song.cues[0].at.offset, 1.9);
  assert.equal(adjust(song, items[pos(items, 'line', 4)], 0.01, rec), 46.21);
  assert.equal(adjust(song, items[pos(items, 'line', 5)], 0.1, rec), null);
  assert.equal(itemTime(song, items[pos(items, 'cue', 0)]), 46.21 + 1.9);
});

test('순서 역전 경고: 6번째 줄이 5번째보다 작으면 표시', () => {
  const song = makeSong();
  song.lines[4].t = 46.3;
  song.lines[5].t = 46.0;
  assert.deepEqual([...orderWarnings(song.lines)], [5]);
});

test('첫 가사 줄을 지금으로: 첫 줄 12.00, 영상 15.40 → 3.40', () => {
  assert.equal(offsetFromFirstLine([{ t: 12 }, { t: 14 }], 15.4), 3.4);
  assert.equal(offsetFromFirstLine([{ t: null }, { t: 14 }], 15.4), 1.4);
  assert.equal(offsetFromFirstLine([{ t: null }], 15.4), null);
});
