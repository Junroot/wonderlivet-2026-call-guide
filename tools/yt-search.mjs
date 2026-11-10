#!/usr/bin/env node
// YouTube 검색 결과에서 영상 후보를 뽑고, oEmbed로 외부 임베드 가능 여부를 확인한다.
// 사용법: node tools/yt-search.mjs "<검색어>" [최대 개수]
// 출력: videoId, 길이, 임베드 가능 여부, 채널, 제목
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const [query, maxArg = '10'] = process.argv.slice(2);
if (!query) {
  console.error('사용법: node tools/yt-search.mjs "<검색어>" [최대 개수]');
  process.exit(1);
}

const url = `https://www.youtube.com/results?${new URLSearchParams({ search_query: query, hl: 'ja', gl: 'JP' })}`;
const html = await (await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ja,en;q=0.8' } })).text();
const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
if (!m) {
  console.error('검색 결과를 읽지 못했습니다');
  process.exit(1);
}

const videos = [];
(function walk(o) {
  if (Array.isArray(o)) return o.forEach(walk);
  if (!o || typeof o !== 'object') return;
  const v = o.videoRenderer;
  if (v?.videoId) {
    const text = (x) => x?.simpleText ?? x?.runs?.map((r) => r.text).join('') ?? '';
    videos.push({ id: v.videoId, title: text(v.title), channel: text(v.ownerText), length: text(v.lengthText) });
  }
  Object.values(o).forEach(walk);
})(JSON.parse(m[1]));

// oEmbed가 200이면 임베드 가능, 401/403이면 임베드 차단
async function embeddable(id) {
  const res = await fetch(`https://www.youtube.com/oembed?${new URLSearchParams({ url: `https://www.youtube.com/watch?v=${id}`, format: 'json' })}`);
  return res.ok ? 'embed O' : `embed X(${res.status})`;
}

for (const v of videos.slice(0, Number(maxArg))) {
  console.log([v.id, v.length.padStart(5), (await embeddable(v.id)).padEnd(12), v.channel, '|', v.title].join('  '));
}
