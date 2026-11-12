import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { validateAll } from '../tools/lib/validate-songs.mjs';

const run = promisify(execFile);
const VALIDATE = fileURLToPath(new URL('../tools/validate.mjs', import.meta.url));

const lineup = {
  days: [{ date: '2026-11-20', label: '11/20 (금)' }],
  artists: [{
    id: 'oral', name: 'THE ORAL CIGARETTES', nameKo: '오랄 시가렛', date: '2026-11-20',
    stage: null, start: null, end: null, rituals: [],
  }],
};

function makeSong(over = {}) {
  return {
    id: 'oral-test',
    artistId: 'oral',
    title: 'テスト',
    youtube: { videoId: 'abc', offsetSec: 0 },
    lrclib: { id: 1 },
    durationSec: 200,
    lines: Array.from({ length: 30 }, (_, i) => ({ t: i * 5, text: `line ${i}`, ko: `라인 ${i}` })),
    cues: [{ type: 'call', text: 'Hey!', at: { line: 0 } }],
    sources: [{ label: 'blog', url: 'https://example.com' }],
    review: { pronunciation: true, timing: true },
    ...over,
  };
}

const check = (song) => validateAll({
  lineup,
  songs: [{ path: 'data/songs/oral/oral-test.json', data: song }],
});
const messages = (list) => list.map((e) => e.message).join('\n');

test('정상 데이터는 오류·경고 없이 색인을 만든다', () => {
  const r = check(makeSong());
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  assert.deepEqual(r.index.songs, [{
    id: 'oral-test', artistId: 'oral', title: 'テスト',
    path: 'data/songs/oral/oral-test.json', cueTypes: ['call'],
    review: { pronunciation: true, timing: true },
  }]);
});

test('30줄 곡의 line: 30은 범위 오류, 색인 없음', () => {
  const r = check(makeSong({ cues: [{ type: 'clap', text: '', at: { line: 30 } }] }));
  assert.equal(r.index, null);
  assert.match(messages(r.errors), /cues\[0\]\.at\.line=30 범위 밖/);
  assert.equal(r.errors[0].where, 'data/songs/oral/oral-test.json');
});

test('30줄 곡의 line: 29는 정상', () => {
  const r = check(makeSong({ cues: [{ type: 'clap', text: '', at: { line: 29 } }] }));
  assert.deepEqual(r.errors, []);
  assert.ok(r.index);
});

test('빈 sources[]는 오류', () => {
  const r = check(makeSong({ sources: [] }));
  assert.equal(r.index, null);
  assert.match(messages(r.errors), /sources\[\]가 비어 있음/);
});

test('lineup에 없는 artistId는 오류', () => {
  const r = check(makeSong({ artistId: 'nobody' }));
  assert.equal(r.index, null);
  assert.match(messages(r.errors), /lineup\.json에 없는 artistId: nobody/);
});

test('{ t: null } 콜은 경고만 내고 색인을 막지 않는다', () => {
  const r = check(makeSong({ cues: [{ type: 'jump', text: '', at: { t: null } }] }));
  assert.deepEqual(r.errors, []);
  assert.match(messages(r.warnings), /시간이 없는 콜 1개/);
  assert.ok(r.index);
});

test('허용되지 않은 콜 종류와 at 형식은 오류', () => {
  const r = check(makeSong({ cues: [{ type: 'scream', text: '', at: { line: 0 } }, { type: 'call', at: { foo: 1 } }] }));
  assert.match(messages(r.errors), /type 허용되지 않은 값: "scream"/);
  assert.match(messages(r.errors), /cues\[1\]\.at 형식 오류/);
});

test('필수 필드 누락과 id 중복은 오류', () => {
  const song = makeSong();
  delete song.youtube.offsetSec;
  const r = validateAll({
    lineup,
    songs: [
      { path: 'data/songs/oral/oral-test.json', data: song },
      { path: 'data/songs/oral/oral-test2.json', data: makeSong() },
    ],
  });
  assert.match(messages(r.errors), /youtube\.offsetSec/);
  assert.match(messages(r.errors), /id 중복: oral-test/);
});

test('경고: 시간 역전, 시간 없는 줄, 검수 미완료, 영상 길이 차이', () => {
  const song = makeSong({
    review: { pronunciation: false, timing: false },
    youtube: { videoId: 'abc', offsetSec: 3, durationSec: 206 },
  });
  song.lines[5].t = 1;
  song.lines[6].t = null;
  const r = check(song);
  assert.deepEqual(r.errors, []);
  const w = messages(r.warnings);
  assert.match(w, /시간 역전: lines\[5\]/);
  assert.match(w, /시간이 없는 줄 1개: lines\[6\]/);
  assert.match(w, /발음 검수 미완료/);
  assert.match(w, /타이밍 검수 미완료/);
  assert.match(w, /3\.0초 차이/);
});

test('영상 길이 차이 2초 이내는 경고 없음', () => {
  const r = check(makeSong({ youtube: { videoId: 'abc', offsetSec: 3, durationSec: 204.5 } }));
  assert.deepEqual(r.warnings, []);
});

test('CLI: 오류가 있으면 종료 코드 1, 색인 없음 / 경고만 있으면 색인 생성', async () => {
  const root = await mkdtemp(join(tmpdir(), 'wl-validate-'));
  try {
    await mkdir(join(root, 'data', 'songs', 'oral'), { recursive: true });
    await writeFile(join(root, 'data', 'lineup.json'), JSON.stringify(lineup));
    await writeFile(join(root, 'data', 'setlists.json'), JSON.stringify({ updated: '2026-11-12', artists: {} }));
    const songPath = join(root, 'data', 'songs', 'oral', 'oral-test.json');
    const indexPath = join(root, 'data', 'songs', 'index.json');

    await writeFile(songPath, JSON.stringify(makeSong({ artistId: 'nobody' })));
    await assert.rejects(run('node', [VALIDATE, '--root', root]), (e) => e.code === 1);
    assert.equal(existsSync(indexPath), false);

    await writeFile(songPath, JSON.stringify(makeSong({ cues: [{ type: 'jump', text: '', at: { t: null } }] })));
    const { stdout, stderr } = await run('node', [VALIDATE, '--root', root]);
    assert.match(stderr, /시간이 없는 콜/);
    assert.match(stdout, /index\.json 생성 완료/);
    const index = JSON.parse(await readFile(indexPath, 'utf8'));
    assert.equal(index.songs[0].id, 'oral-test');
    assert.deepEqual(index.songs[0].cueTypes, ['jump']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('afterLine 범위 밖은 오류', () => {
  const r = check(makeSong({ cues: [{ type: 'clap', text: '', at: { t: null, afterLine: 30 } }] }));
  assert.match(messages(r.errors), /afterLine=30 범위 밖/);
  assert.deepEqual(check(makeSong({ cues: [{ type: 'clap', text: '', at: { t: null, afterLine: 29 } }] })).errors, []);
});
