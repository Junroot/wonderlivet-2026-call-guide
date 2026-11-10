// LRCLIB 응답을 곡 JSON 뼈대로 바꾸는 함수들. 네트워크 호출은 하지 않는다.
import { round2 } from '../../src/cue-time.js';

const TIME_TAG = /\[(\d+):(\d+(?:\.\d+)?)\]/g;

// "[01:02.34]가사" 형식. 한 줄에 시간 태그가 여러 개면 각각 한 줄로 만든다.
// 메타데이터 태그([ar:...])와 빈 줄(간주 표시)은 버린다.
export function parseSynced(lrc) {
  const out = [];
  for (const raw of lrc.split(/\r?\n/)) {
    const times = [];
    TIME_TAG.lastIndex = 0;
    let m;
    let last = 0;
    while ((m = TIME_TAG.exec(raw)) && m.index === last) {
      times.push(Number(m[1]) * 60 + Number(m[2]));
      last = TIME_TAG.lastIndex;
    }
    if (!times.length) continue;
    const rest = raw.slice(last).trim();
    if (!rest) continue;
    for (const t of times) out.push({ t: round2(t), text: rest, ko: null });
  }
  return out.sort((a, b) => a.t - b.t);
}

export function parsePlain(text) {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({ t: null, text: s, ko: null }));
}

// 비교용 제목 정규화: 공백·기호를 지우고 전각 영숫자를 반각으로, 소문자로
export function normalizeTitle(t) {
  return String(t ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, '');
}

// 일반 검색(q) 결과에서 제목이 맞는 것만 남긴다. 다른 곡 가사가 섞이는 것을 막는다.
export function matchingTitle(results, title) {
  const want = normalizeTitle(title);
  if (!want) return [];
  return results.filter((r) => {
    const got = normalizeTitle(r.trackName);
    return got && (got.includes(want) || want.includes(got));
  });
}

// 동기화 가사가 있는 결과 중 길이가 가장 가까운 것. 없으면 일반 가사가 있는 결과.
// 반환: { result, synced: boolean } | null
export function pickBest(results, durationSec) {
  const usable = results.filter((r) => !r.instrumental);
  const closest = (list) => {
    if (!list.length) return null;
    if (typeof durationSec !== 'number') return list[0];
    return list.reduce((best, r) => (
      Math.abs(r.duration - durationSec) < Math.abs(best.duration - durationSec) ? r : best
    ));
  };
  const synced = closest(usable.filter((r) => r.syncedLyrics));
  if (synced) return { result: synced, synced: true };
  const plain = closest(usable.filter((r) => r.plainLyrics));
  if (plain) return { result: plain, synced: false };
  return null;
}

export function buildSkeleton({ id, artistId, title, videoId = '', pick }) {
  const { result, synced } = pick;
  return {
    id,
    artistId,
    title,
    youtube: { videoId, offsetSec: 0 },
    lrclib: { id: result.id, trackName: result.trackName, artistName: result.artistName },
    durationSec: round2(result.duration),
    lines: synced ? parseSynced(result.syncedLyrics) : parsePlain(result.plainLyrics),
    cues: [],
    sources: [],
    review: { pronunciation: false, timing: false },
  };
}
