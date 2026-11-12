// 예상 세트리스트(data/setlists.json) 검증 규칙. 파일 입출력 없이 데이터만 받는다.
const WHERE = 'data/setlists.json';
const TIERS = new Set(['sure', 'likely', 'maybe']);
const ENTRY_KEYS = ['basis', 'songs', 'candidates', 'sources', 'note'];
const isStr = (v) => typeof v === 'string' && v.length > 0;
const SPOTIFY_TRACK = /^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]{22}$/;

function isSeen(v) {
  if (v === null) return true;
  if (!Array.isArray(v) || v.length !== 2 || !v.every(Number.isInteger)) return false;
  const [k, n] = v;
  return n >= 1 && k >= 0 && k <= n;
}

// 예상 곡과 후보곡 공통 검사. 예상 곡만 tier가 필요하다.
function checkSong(song, { at, artistId, needsTier, songs, err }) {
  if (!isStr(song?.title)) err(at, '필수 필드 누락: title');
  if (needsTier && !TIERS.has(song?.tier)) err(at, `tier는 sure / likely / maybe 중 하나여야 함: ${song?.tier}`);
  if (!(song && 'seen' in song) || !isSeen(song.seen)) {
    err(at, `seen은 null 또는 [k, n] (정수, 0 ≤ k ≤ n, n ≥ 1)이어야 함: ${JSON.stringify(song?.seen)}`);
  }
  if (song?.songId !== undefined) {
    const target = songs.get(song.songId);
    if (!target) err(at, `없는 songId: ${song.songId}`);
    else if (target.artistId !== artistId) err(at, `다른 아티스트의 songId: ${song.songId} (${target.artistId})`);
  }
  if (song?.spotify !== undefined && !SPOTIFY_TRACK.test(song.spotify)) {
    err(at, `spotify는 https://open.spotify.com/track/<22자 id> 형식이어야 함: ${song.spotify}`);
  }
}

// setlists: data/setlists.json 내용
// artistIds: lineup.json 아티스트 id 집합, songs: 곡 id → { artistId }
// 반환: { errors, warnings }
export function validateSetlists(setlists, { artistIds, songs }) {
  const errors = [];
  const warnings = [];
  const err = (where, message) => errors.push({ where, message });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(setlists?.updated ?? '')) {
    err(WHERE, `updated는 YYYY-MM-DD 형식이어야 함: ${setlists?.updated}`);
  }
  const artists = setlists?.artists;
  if (!artists || typeof artists !== 'object' || Array.isArray(artists)) {
    err(WHERE, '필수 필드 누락: artists (아티스트 id → 항목)');
    return { errors, warnings };
  }

  for (const [artistId, entry] of Object.entries(artists)) {
    const at = `${WHERE} artists.${artistId}`;
    if (!artistIds.has(artistId)) err(at, `lineup.json에 없는 아티스트: ${artistId}`);
    for (const key of ENTRY_KEYS) {
      if (!(entry && key in entry)) err(at, `필수 필드 누락: ${key}${key === 'note' ? ' (없으면 null)' : ''}`);
    }
    if (entry && 'basis' in entry && !isStr(entry.basis)) err(at, 'basis가 비어 있음');
    for (const key of ['songs', 'candidates']) {
      if (!(entry && key in entry)) continue;
      if (!Array.isArray(entry[key])) {
        err(at, `${key}는 배열이어야 함`);
        continue;
      }
      entry[key].forEach((song, i) => checkSong(song, {
        at: `${at} ${key}[${i}]`, artistId, needsTier: key === 'songs', songs, err,
      }));
    }
    if (entry && 'sources' in entry && !(Array.isArray(entry.sources) && entry.sources.some((s) => isStr(s?.url)))) {
      err(at, '출처 URL(sources[].url)이 없음');
    }
  }

  for (const id of artistIds) {
    if (!(id in artists)) warnings.push({ where: WHERE, message: `세트리스트 없음: ${id}` });
  }
  return { errors, warnings };
}
