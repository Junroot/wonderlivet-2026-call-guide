import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSetlists } from '../tools/lib/validate-setlists.mjs';

const artistIds = new Set(['oral']);
const songs = new Map([
  ['oral-kyouran', { artistId: 'oral' }],
  ['other-song', { artistId: 'other' }],
]);

function makeEntry(over = {}) {
  return {
    basis: '최근 페스 6회',
    songs: [{ title: '狂乱 Hey Kids!!', tier: 'sure', seen: [5, 6], songId: 'oral-kyouran' }],
    candidates: [],
    sources: [{ label: 'setlist.fm', url: 'https://www.setlist.fm/' }],
    note: null,
    ...over,
  };
}

const check = (entry, { updated = '2026-11-12', ids = artistIds } = {}) =>
  validateSetlists({ updated, artists: { oral: entry } }, { artistIds: ids, songs });
const messages = (list) => list.map((e) => e.message).join('\n');

test('정상 항목은 오류·경고 없음', () => {
  const r = check(makeEntry());
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
});

test('lineup에 없는 아티스트 키는 오류', () => {
  const r = validateSetlists({ updated: '2026-11-12', artists: { oral: makeEntry(), nope: makeEntry() } },
    { artistIds, songs });
  assert.match(messages(r.errors), /lineup\.json에 없는 아티스트: nope/);
  assert.equal(r.errors[0].where, 'data/setlists.json artists.nope');
});

test('정해진 값이 아닌 tier는 오류', () => {
  const r = check(makeEntry({ songs: [{ title: 'x', tier: 'certain', seen: [1, 2] }] }));
  assert.match(messages(r.errors), /tier/);
  assert.equal(r.errors[0].where, 'data/setlists.json artists.oral songs[0]');
});

test('형식이 틀린 seen은 오류', () => {
  for (const seen of [[3, 2], [1, 0], [1.5, 3], '2/3', [1], [-1, 3]]) {
    const r = check(makeEntry({ songs: [{ title: 'x', tier: 'maybe', seen }] }));
    assert.match(messages(r.errors), /seen/, `seen=${JSON.stringify(seen)}`);
  }
});

test('seen이 null이거나 [0, n]이면 통과', () => {
  for (const seen of [null, [0, 4]]) {
    const r = check(makeEntry({ songs: [{ title: 'x', tier: 'maybe', seen }] }));
    assert.deepEqual(r.errors, [], `seen=${JSON.stringify(seen)}`);
  }
});

test('다른 아티스트 곡이나 없는 곡을 가리키는 songId는 오류', () => {
  for (const songId of ['other-song', 'missing']) {
    const r = check(makeEntry({ songs: [{ title: 'x', tier: 'sure', seen: [1, 1], songId }] }));
    assert.match(messages(r.errors), /songId/, songId);
  }
});

test('candidates도 같은 규칙으로 검사하되 tier는 없어도 된다', () => {
  const ok = check(makeEntry({ candidates: [{ title: 'y', seen: [1, 6] }] }));
  assert.deepEqual(ok.errors, []);
  const bad = check(makeEntry({ candidates: [{ title: 'y', seen: [5, 2] }] }));
  assert.match(messages(bad.errors), /seen/);
  assert.equal(bad.errors[0].where, 'data/setlists.json artists.oral candidates[0]');
});

test('필수 필드가 빠지면 오류 (note: null은 통과)', () => {
  for (const key of ['basis', 'songs', 'candidates', 'sources', 'note']) {
    const entry = makeEntry();
    delete entry[key];
    const r = check(entry);
    assert.match(messages(r.errors), new RegExp(key), key);
  }
});

test('제목이 없는 곡은 오류', () => {
  const r = check(makeEntry({ songs: [{ title: '', tier: 'sure', seen: [1, 1] }] }));
  assert.match(messages(r.errors), /title/);
});

test('URL이 있는 출처가 없으면 오류', () => {
  const r = check(makeEntry({ sources: [{ label: 'x' }] }));
  assert.match(messages(r.errors), /출처/);
});

test('updated 형식이 틀리면 오류', () => {
  const r = check(makeEntry(), { updated: '11/12' });
  assert.match(messages(r.errors), /updated/);
  assert.equal(r.errors[0].where, 'data/setlists.json');
});

test('lineup에 있는데 세트리스트가 없는 아티스트는 경고만', () => {
  const r = check(makeEntry(), { ids: new Set(['oral', 'jo0ji']) });
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 1);
  assert.match(messages(r.warnings), /jo0ji/);
});
