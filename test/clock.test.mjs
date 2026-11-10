import test from 'node:test';
import assert from 'node:assert/strict';
import { PlaybackClock, playerErrorMessage } from '../src/player.js';

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test('재생 중에는 경과 시간 × 속도로 보간한다', () => {
  const c = new PlaybackClock();
  c.reset(10, 1000, { playing: true, rate: 1 });
  close(c.time(1500), 10.5);
  c.reset(10, 1000, { playing: true, rate: 0.75 });
  close(c.time(2000), 10.75);
});

test('일시정지 상태에서는 기준값 그대로', () => {
  const c = new PlaybackClock();
  c.reset(42, 1000, { playing: false });
  assert.equal(c.time(5000), 42);
});

test('같은 값이 반복되면 무시하고, 작은 차이는 조금씩 따라간다', () => {
  const c = new PlaybackClock();
  c.reset(10, 0, { playing: true, rate: 1 });
  c.sample(10, 200);
  close(c.time(200), 10.2);
  c.sample(10.1, 200); // 예측 10.2보다 0.1 늦음 → 10.2 - 0.03
  close(c.time(200), 10.17);
});

test('큰 차이(사용자 탐색 등)는 바로 반영한다', () => {
  const c = new PlaybackClock();
  c.reset(10, 0, { playing: true, rate: 1 });
  c.sample(60, 100);
  close(c.time(100), 60);
});

test('오류 코드 101/150은 임베드 차단 문구', () => {
  assert.equal(playerErrorMessage(101), '이 영상은 사이트 안에서 재생할 수 없습니다');
  assert.equal(playerErrorMessage(150), '이 영상은 사이트 안에서 재생할 수 없습니다');
  assert.match(playerErrorMessage(5), /오류 5/);
});

test('외부 재생 시계: 줄 시간으로 맞추면 진행, ±0.5초, 일시정지, 속도', async () => {
  const { createManualClock } = await import('../src/player.js');
  let t = 0;
  const c = createManualClock(() => t);
  assert.equal(c.time(), 0);
  c.seek(56.09);
  c.play();
  t = 2000;
  close(c.time(), 58.09);
  c.nudge(0.5);
  close(c.time(), 58.59);
  c.nudge(-0.5);
  c.pause();
  t = 5000;
  close(c.time(), 58.09);
  c.setRate(0.75);
  c.play();
  t = 9000;
  close(c.time(), 61.09);
  c.seek(-3);
  assert.equal(c.time(), 0);
});
