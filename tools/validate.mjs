#!/usr/bin/env node
// 곡 데이터를 검사하고, 오류가 없을 때만 data/songs/index.json을 생성한다.
// 사용법: node tools/validate.mjs [--root <사이트 루트>]
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAll } from './lib/validate-songs.mjs';
import { validateSetlists } from './lib/validate-setlists.mjs';

const args = process.argv.slice(2);
const rootIdx = args.indexOf('--root');
const root = rootIdx >= 0 ? args[rootIdx + 1] : fileURLToPath(new URL('..', import.meta.url));

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function listSongFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await listSongFiles(p));
    else if (e.name.endsWith('.json') && p !== join(root, 'data', 'songs', 'index.json')) out.push(p);
  }
  return out.sort();
}

const errors = [];
let lineup = null;
try {
  lineup = await readJson(join(root, 'data', 'lineup.json'));
} catch (e) {
  errors.push({ where: 'data/lineup.json', message: `읽기 실패: ${e.message}` });
}

const songs = [];
for (const file of await listSongFiles(join(root, 'data', 'songs'))) {
  const path = relative(root, file).split(sep).join('/');
  try {
    songs.push({ path, data: await readJson(file) });
  } catch (e) {
    errors.push({ where: path, message: `JSON 읽기 실패: ${e.message}` });
  }
}

const result = lineup ? validateAll({ lineup, songs }) : { errors: [], warnings: [], index: null };
errors.push(...result.errors);

let setlistCount = 0;
try {
  const setlists = await readJson(join(root, 'data', 'setlists.json'));
  if (lineup) {
    const r = validateSetlists(setlists, {
      artistIds: new Set((lineup.artists ?? []).map((a) => a.id)),
      songs: new Map(songs.map(({ data }) => [data?.id, { artistId: data?.artistId }])),
    });
    errors.push(...r.errors);
    result.warnings.push(...r.warnings);
  }
  setlistCount = Object.keys(setlists?.artists ?? {}).length;
} catch (e) {
  errors.push({ where: 'data/setlists.json', message: `읽기 실패: ${e.message}` });
}

for (const w of result.warnings) console.warn(`경고  ${w.where}: ${w.message}`);
for (const e of errors) console.error(`오류  ${e.where}: ${e.message}`);
console.log(`곡 ${songs.length}개, 세트리스트 ${setlistCount}팀, 오류 ${errors.length}개, 경고 ${result.warnings.length}개`);

if (errors.length || !result.index) {
  console.error('오류가 있어 index.json을 생성하지 않았습니다.');
  process.exit(1);
}
await writeFile(join(root, 'data', 'songs', 'index.json'), `${JSON.stringify(result.index, null, 2)}\n`);
console.log('data/songs/index.json 생성 완료');
