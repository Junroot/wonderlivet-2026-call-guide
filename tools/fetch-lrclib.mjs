#!/usr/bin/env node
// LRCLIB에서 동기화 가사를 찾아 곡 JSON 뼈대를 만든다. 기존 파일은 덮어쓰지 않는다.
// 사용법:
//   node tools/fetch-lrclib.mjs <아티스트> <곡 제목> [길이(초)] --id <song-id>
//        [--artist-id <id>] [--video <YouTube videoId>] [--title <표시 제목>] [--query <검색어>]
// --artist-id를 생략하면 lineup.json에서 아티스트 이름(name, lrclibName)으로 찾는다.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickBest, buildSkeleton } from './lib/lrclib.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const API = 'https://lrclib.net/api';
const HEADERS = { 'Lrclib-Client': 'wonderlivet-2026-call-guide (personal practice site)' };

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i];
    else pos.push(argv[i]);
  }
  return { pos, opt };
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const { pos, opt } = parseArgs(process.argv.slice(2));
const [artist, track, durationArg] = pos;
if (!artist || !track || !opt.id) {
  fail('사용법: node tools/fetch-lrclib.mjs <아티스트> <곡 제목> [길이(초)] --id <song-id> [--artist-id <id>] [--video <videoId>]');
}
const duration = durationArg ? Number(durationArg) : undefined;

let artistId = opt['artist-id'];
if (!artistId) {
  const lineup = JSON.parse(await readFile(join(ROOT, 'data', 'lineup.json'), 'utf8'));
  const key = artist.toLowerCase();
  const found = lineup.artists.find((a) => [a.name, a.lrclibName].some((n) => n?.toLowerCase() === key));
  if (!found) fail(`lineup.json에서 "${artist}"를 찾지 못했습니다. --artist-id를 지정하세요.`);
  artistId = found.id;
}

const outPath = join(ROOT, 'data', 'songs', artistId, `${opt.id}.json`);
try {
  await access(outPath);
  fail(`이미 존재함: ${outPath} (덮어쓰지 않습니다)`);
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}

async function search(params) {
  const res = await fetch(`${API}/search?${new URLSearchParams(params)}`, { headers: HEADERS });
  if (!res.ok) fail(`LRCLIB 오류 ${res.status}`);
  return res.json();
}

let results = await search({ artist_name: artist, track_name: track });
if (!results.length) results = await search({ q: opt.query ?? `${artist} ${track}` });

const pick = pickBest(results, duration);
if (!pick) fail(`가사를 찾지 못했습니다 (검색 결과 ${results.length}개). 가사 사이트에서 직접 넣어야 합니다.`);

const song = buildSkeleton({
  id: opt.id, artistId, title: opt.title ?? track, videoId: opt.video ?? '', pick,
});
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(song, null, 2)}\n`);

const r = pick.result;
console.log(`LRCLIB id ${r.id}: ${r.artistName} - ${r.trackName} (${r.albumName ?? '-'}, ${r.duration}초)`);
console.log(`후보 ${results.length}개 중 선택. 가사 ${song.lines.length}줄 → ${outPath}`);
if (!pick.synced) console.warn('경고: 동기화 가사가 없어 일반 가사로 만들었습니다. 보정 도구로 줄 시간을 모두 찍어야 함');
if (duration && Math.abs(r.duration - duration) > 2) {
  console.warn(`경고: 요청 길이 ${duration}초와 ${Math.abs(r.duration - duration).toFixed(1)}초 차이`);
}
if (!opt.video) console.warn('알림: youtube.videoId가 비어 있습니다. 영상을 고른 뒤 채우세요.');
