import test from 'node:test';
import assert from 'node:assert/strict';
import { staggerPlacement } from '../src/views/home.js';

const a = (stage) => ({ stage });

test('스테이지가 번갈아 나오면 한 줄씩 내려가며 열을 바꾼다', () => {
  assert.deepEqual(staggerPlacement([a('LIVET'), a('WONDER'), a('LIVET'), a('WONDER')]), [
    { row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 1 }, { row: 4, col: 2 },
  ]);
});

test('같은 스테이지가 연달아 나오면 앞 카드와 겹치지 않게 두 줄 내려간다', () => {
  assert.deepEqual(staggerPlacement([a('LIVET'), a('LIVET'), a('WONDER')]), [
    { row: 1, col: 1 }, { row: 3, col: 1 }, { row: 4, col: 2 },
  ]);
});

test('스테이지 미정은 왼쪽 열에 둔다', () => {
  assert.deepEqual(staggerPlacement([a('WONDER'), a(null)]), [
    { row: 1, col: 2 }, { row: 2, col: 1 },
  ]);
});
