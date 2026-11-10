import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSynced, parsePlain, pickBest, buildSkeleton } from '../tools/lib/lrclib.mjs';

test('parseSynced: 시간 태그, 여러 태그, 메타데이터와 빈 줄 제거', () => {
  const lrc = '[ar:X]\n[00:12.34] 一行目\n[00:15.00]\n[01:02.5][00:20.00]繰り返し\n';
  assert.deepEqual(parseSynced(lrc), [
    { t: 12.34, text: '一行目', ko: null },
    { t: 20, text: '繰り返し', ko: null },
    { t: 62.5, text: '繰り返し', ko: null },
  ]);
});

test('parsePlain: 시간이 null인 줄', () => {
  assert.deepEqual(parsePlain('a\n\n b \n'), [
    { t: null, text: 'a', ko: null },
    { t: null, text: 'b', ko: null },
  ]);
});

const results = [
  { id: 1, duration: 240, syncedLyrics: '[00:01.00]a', plainLyrics: 'a' },
  { id: 2, duration: 250, syncedLyrics: '[00:01.00]a', plainLyrics: 'a' },
  { id: 3, duration: 251, syncedLyrics: null, plainLyrics: 'a' },
  { id: 4, duration: 251, instrumental: true, syncedLyrics: null, plainLyrics: null },
];

test('pickBest: 동기화 가사 중 길이가 가장 가까운 결과', () => {
  assert.deepEqual(pickBest(results, 251), { result: results[1], synced: true });
  assert.equal(pickBest(results, 239).result.id, 1);
  assert.equal(pickBest(results).result.id, 1);
});

test('pickBest: 동기화 가사가 없으면 일반 가사, 둘 다 없으면 null', () => {
  assert.deepEqual(pickBest([results[2], results[3]], 251), { result: results[2], synced: false });
  assert.equal(pickBest([results[3]], 251), null);
  assert.equal(pickBest([], 251), null);
});

test('buildSkeleton: 일반 가사면 t가 null인 뼈대', () => {
  const s = buildSkeleton({ id: 's', artistId: 'a', title: 'T', pick: { result: results[2], synced: false } });
  assert.equal(s.durationSec, 251);
  assert.equal(s.lrclib.id, 3);
  assert.deepEqual(s.lines, [{ t: null, text: 'a', ko: null }]);
  assert.deepEqual(s.review, { pronunciation: false, timing: false });
});
