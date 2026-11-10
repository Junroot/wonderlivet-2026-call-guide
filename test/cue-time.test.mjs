import test from 'node:test';
import assert from 'node:assert/strict';
import {
  atKind, cueTime, toVideoTime, toLyricTime, currentLineIndex,
  buildTimeline, timedCues, cueState,
} from '../src/cue-time.js';

const lines = [
  { t: 10, text: 'a' },
  { t: 12.5, text: 'b' },
  { t: null, text: 'c' },
  { t: 20, text: 'd' },
];

test('atKind는 세 형식을 구분하고 나머지는 null', () => {
  assert.equal(atKind({ line: 0 }), 'line');
  assert.equal(atKind({ line: 3, offset: 0.4 }), 'line');
  assert.equal(atKind({ t: 83.2 }), 'abs');
  assert.equal(atKind({ t: null }), 'abs-null');
  assert.equal(atKind({}), null);
  assert.equal(atKind({ line: 1.5 }), null);
  assert.equal(atKind({ line: 1, t: 3 }), null);
  assert.equal(atKind({ line: 1, offset: 'x' }), null);
  assert.equal(atKind(null), null);
});

test('줄 기준 콜은 0 기준 첨자 lines[line].t + offset', () => {
  assert.equal(cueTime({ at: { line: 1, offset: 0.4 } }, lines), 12.9);
  assert.equal(cueTime({ at: { line: 0 } }, lines), 10);
  assert.equal(cueTime({ at: { line: 3, offset: -0.5 } }, lines), 19.5);
});

test('절대 시간 콜은 t, 시간 미정이면 null', () => {
  assert.equal(cueTime({ at: { t: 83.2 } }, lines), 83.2);
  assert.equal(cueTime({ at: { t: null } }, lines), null);
});

test('시간 없는 줄이나 범위 밖 줄에 붙은 콜은 null', () => {
  assert.equal(cueTime({ at: { line: 2, offset: 1 } }, lines), null);
  assert.equal(cueTime({ at: { line: 4 } }, lines), null);
});

test('영상 시간 = 가사 시간 + offsetSec', () => {
  assert.equal(toVideoTime(46.3, 2), 48.3);
  assert.equal(toLyricTime(48.3, 2), 46.3);
  assert.equal(toVideoTime(5), 5);
});

test('현재 줄은 t 이하인 마지막 줄, 첫 줄 이전은 -1', () => {
  assert.equal(currentLineIndex(lines, 9.9), -1);
  assert.equal(currentLineIndex(lines, 10), 0);
  assert.equal(currentLineIndex(lines, 15), 1);
  assert.equal(currentLineIndex(lines, 20), 3);
});

test('buildTimeline은 콜을 붙은 줄 뒤에 놓는다', () => {
  const song = {
    lines,
    cues: [
      { at: { t: 2 } },            // 0: 첫 줄 이전 → 맨 앞
      { at: { line: 1 } },         // 1: 줄 1 뒤
      { at: { t: null } },         // 2: 앞 콜과 같은 자리(줄 1 뒤)
      { at: { t: 21 } },           // 3: 줄 3 뒤
      { at: { line: 0, offset: 1 } }, // 4: 줄 0 뒤
    ],
  };
  const order = buildTimeline(song).map((it) => `${it.kind[0]}${it.index}`);
  assert.deepEqual(order, ['c0', 'l0', 'c4', 'l1', 'c1', 'c2', 'l2', 'l3', 'c3']);
});

test('시간 미정 콜이 첫 콜이면 맨 앞', () => {
  const order = buildTimeline({ lines, cues: [{ at: { t: null } }] })
    .map((it) => `${it.kind[0]}${it.index}`);
  assert.deepEqual(order, ['c0', 'l0', 'l1', 'l2', 'l3']);
});

test('cueState: "다음"은 거리와 상관없이 가장 가까운 콜, 1.5초 안이면 soon', () => {
  const song = {
    lines,
    cues: [{ at: { line: 0 } }, { at: { line: 1 } }, { at: { t: null } }],
  };
  const timed = timedCues(song);
  assert.deepEqual(timed.map((c) => c.index), [0, 1]);

  const far = cueState(timed, 5);
  assert.deepEqual(far.next.map((c) => c.index), [0]);
  assert.equal(far.soon, false);
  assert.deepEqual(far.now, []);
  const near = cueState(timed, 8.6);
  assert.deepEqual(near.next.map((c) => c.index), [0]);
  assert.equal(near.soon, true);
  const fired = cueState(timed, 10);
  assert.deepEqual(fired.now.map((c) => c.index), [0]);
  assert.deepEqual(fired.next.map((c) => c.index), [1]);
  assert.equal(fired.soon, false);
  assert.deepEqual(cueState(timed, 12.5).next, []);
});

test('cueState: "지금"은 다음 콜 예고가 시작돼도 함께 유지', () => {
  const timed = timedCues({ lines, cues: [{ at: { t: 10 } }, { at: { t: 11.5 } }] });
  // 콜 0의 until은 줄 1 시작(12.5초)
  const s = cueState(timed, 10.5);
  assert.deepEqual(s.now.map((c) => c.index), [0]);
  assert.deepEqual(s.next.map((c) => c.index), [1]);
  assert.equal(s.soon, true);
  assert.deepEqual(cueState(timed, 11.5).now.map((c) => c.index), [1]);
});

test('cueState: "지금"은 다음 시간 있는 가사 줄이 시작되면 해제', () => {
  // 줄 1(12.5초) 콜은 시간 없는 줄 2를 건너뛰고 줄 3(20초)에서 끝난다
  const timed = timedCues({ lines, cues: [{ at: { line: 1 } }] });
  assert.deepEqual(cueState(timed, 19.9).now.map((c) => c.index), [0]);
  assert.deepEqual(cueState(timed, 20).now, []);
});

test('cueState: 줄 시작 직전 콜도 "지금"을 최소 1.5초 보여준다', () => {
  const timed = timedCues({ lines, cues: [{ at: { t: 19.5 } }] });
  assert.deepEqual(cueState(timed, 20.9).now.map((c) => c.index), [0]);
  assert.deepEqual(cueState(timed, 21).now, []);
});

test('cueState: 마지막 줄 이후 콜은 "지금"을 계속 유지', () => {
  const timed = timedCues({ lines, cues: [{ at: { line: 3 } }] });
  assert.deepEqual(cueState(timed, 100).now.map((c) => c.index), [0]);
});

test('cueState: 같은 시간 콜은 묶어서 보여준다', () => {
  const song = { lines, cues: [{ at: { line: 0 } }, { at: { t: 10 } }] };
  const timed = timedCues(song);
  assert.equal(cueState(timed, 9).next.length, 2);
  assert.equal(cueState(timed, 10.5).now.length, 2);
});

test('시간 미정 콜은 afterLine이 있으면 그 줄 뒤에 놓인다', () => {
  assert.equal(atKind({ t: null, afterLine: 2 }), 'abs-null');
  assert.equal(atKind({ t: null, afterLine: 'x' }), null);
  const song = { lines, cues: [{ at: { line: 0 } }, { at: { t: null, afterLine: 2 } }, { at: { t: null } }] };
  const order = buildTimeline(song).map((it) => `${it.kind[0]}${it.index}`);
  // c2는 afterLine이 없으므로 앞 콜(c1)과 같은 자리
  assert.deepEqual(order, ['l0', 'c0', 'l1', 'l2', 'c1', 'c2', 'l3']);
});
