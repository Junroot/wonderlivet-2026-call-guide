// 곡 데이터 검증 규칙(song-data 명세). 파일 입출력 없이 데이터만 받는다.
import { CUE_TYPES, atKind } from '../../src/cue-time.js';

const DURATION_TOLERANCE_SEC = 2;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// 필수 필드와 검사 함수
const REQUIRED = [
  ['id', isStr],
  ['artistId', isStr],
  ['title', isStr],
  ['youtube.videoId', isStr],
  ['youtube.offsetSec', isNum],
  ['durationSec', isNum],
  ['lines', Array.isArray],
  ['cues', Array.isArray],
  ['sources', Array.isArray],
  ['review.pronunciation', (v) => typeof v === 'boolean'],
  ['review.timing', (v) => typeof v === 'boolean'],
];

export function validateLineup(lineup) {
  const errors = [];
  const where = 'data/lineup.json';
  const dates = new Set((lineup?.days ?? []).map((d) => d.date));
  if (!dates.size) errors.push({ where, message: 'days[]가 비어 있음' });
  const seen = new Set();
  (lineup?.artists ?? []).forEach((a, i) => {
    const at = `${where} artists[${i}]`;
    for (const key of ['id', 'name', 'nameKo', 'date']) {
      if (!isStr(a[key])) errors.push({ where: at, message: `필수 필드 누락: ${key}` });
    }
    for (const key of ['stage', 'start', 'end']) {
      if (!(key in a)) errors.push({ where: at, message: `필수 필드 누락: ${key} (모르면 null)` });
    }
    if (a.date && !dates.has(a.date)) errors.push({ where: at, message: `days[]에 없는 일자: ${a.date}` });
    if (seen.has(a.id)) errors.push({ where: at, message: `artist id 중복: ${a.id}` });
    seen.add(a.id);
    if (!Array.isArray(a.rituals)) {
      errors.push({ where: at, message: '필수 필드 누락: rituals (없으면 [])' });
    } else {
      a.rituals.forEach((r, j) => {
        const rt = `${at} rituals[${j}]`;
        if (!isStr(r.name)) errors.push({ where: rt, message: '필수 필드 누락: name' });
        if (!isStr(r.description)) errors.push({ where: rt, message: '필수 필드 누락: description' });
        if (!Array.isArray(r.sources) || !r.sources.some((s) => isStr(s?.url))) {
          errors.push({ where: rt, message: '출처 URL(sources[].url)이 없음' });
        }
      });
    }
  });
  return errors;
}

// songs: [{ path, data }] (path는 사이트 루트 기준, 예: data/songs/oral/oral-kyouran.json)
// 반환: { errors, warnings, index } — errors가 있으면 index는 null
export function validateAll({ lineup, songs }) {
  const errors = validateLineup(lineup);
  const warnings = [];
  const artistIds = new Set((lineup?.artists ?? []).map((a) => a.id));
  const ids = new Map();

  for (const { path, data: song } of songs) {
    const err = (message) => errors.push({ where: path, message });
    const warn = (message) => warnings.push({ where: path, message });

    let missing = false;
    for (const [key, check] of REQUIRED) {
      if (!check(get(song, key))) {
        err(`필수 필드 누락 또는 형식 오류: ${key}`);
        missing = true;
      }
    }
    if (missing && (!Array.isArray(song?.lines) || !Array.isArray(song?.cues))) continue;

    if (isStr(song.id)) {
      if (ids.has(song.id)) err(`id 중복: ${song.id} (${ids.get(song.id)}와 겹침)`);
      else ids.set(song.id, path);
    }
    if (isStr(song.artistId) && !artistIds.has(song.artistId)) {
      err(`lineup.json에 없는 artistId: ${song.artistId}`);
    }
    if (Array.isArray(song.sources)) {
      if (!song.sources.length) err('sources[]가 비어 있음 (응원 정보 출처가 최소 하나 필요)');
      song.sources.forEach((s, i) => {
        if (!isStr(s?.url)) err(`sources[${i}].url 없음`);
      });
    }
    const expected = `data/songs/${song.artistId}/${song.id}.json`;
    if (isStr(song.id) && isStr(song.artistId) && path !== expected) {
      warn(`파일 위치가 규칙과 다름 (기대: ${expected})`);
    }

    // 가사 줄
    let prevT = null;
    let prevIdx = -1;
    const untimed = [];
    song.lines.forEach((line, i) => {
      if (typeof line?.text !== 'string') err(`lines[${i}].text 없음`);
      if (!(line && 'ko' in line)) err(`lines[${i}].ko 없음 (한국어 곡은 null)`);
      if (line?.t === null || line?.t === undefined) {
        untimed.push(i);
        return;
      }
      if (!isNum(line.t)) {
        err(`lines[${i}].t가 숫자가 아님`);
        return;
      }
      if (prevT !== null && line.t < prevT) {
        warn(`가사 줄 시간 역전: lines[${i}].t=${line.t} < lines[${prevIdx}].t=${prevT}`);
      }
      prevT = line.t;
      prevIdx = i;
    });
    if (untimed.length) {
      warn(`시간이 없는 줄 ${untimed.length}개: lines[${untimed.slice(0, 5).join(', ')}${untimed.length > 5 ? ', …' : ''}]`);
    }

    // 콜
    const untimedCues = [];
    song.cues.forEach((cue, i) => {
      if (!CUE_TYPES.includes(cue?.type)) {
        err(`cues[${i}].type 허용되지 않은 값: ${JSON.stringify(cue?.type)}`);
      }
      if (cue?.type === 'penlight' && !isStr(cue.color)) {
        warn(`cues[${i}] penlight 콜에 color가 없음`);
      }
      const kind = atKind(cue?.at);
      if (kind === null) {
        err(`cues[${i}].at 형식 오류: ${JSON.stringify(cue?.at)}`);
      } else if (kind === 'line') {
        if (cue.at.line < 0 || cue.at.line >= song.lines.length) {
          err(`cues[${i}].at.line=${cue.at.line} 범위 밖 (가사 ${song.lines.length}줄, 0~${song.lines.length - 1})`);
        }
      } else if (kind === 'abs-null') {
        untimedCues.push(i);
      }
    });
    if (untimedCues.length) {
      warn(`시간이 없는 콜 ${untimedCues.length}개: cues[${untimedCues.join(', ')}]`);
    }

    // 검수와 길이
    if (song.review?.pronunciation === false) warn('발음 검수 미완료');
    if (song.review?.timing === false) warn('타이밍 검수 미완료');
    const vd = song.youtube?.durationSec;
    if (isNum(vd) && isNum(song.durationSec) && isNum(song.youtube?.offsetSec)) {
      const diff = vd - (song.durationSec + song.youtube.offsetSec);
      if (Math.abs(diff) > DURATION_TOLERANCE_SEC) {
        warn(`영상 길이 ${vd}초와 durationSec + offsetSec = ${song.durationSec + song.youtube.offsetSec}초가 ${Math.abs(diff).toFixed(1)}초 차이`);
      }
    }
  }

  if (errors.length) return { errors, warnings, index: null };

  const index = {
    songs: songs
      .map(({ path, data }) => ({
        id: data.id,
        artistId: data.artistId,
        title: data.title,
        ...(data.order !== undefined ? { order: data.order } : {}),
        path,
        cueTypes: CUE_TYPES.filter((t) => data.cues.some((c) => c.type === t)),
        review: { pronunciation: data.review.pronunciation, timing: data.review.timing },
      }))
      .sort((a, b) => a.artistId.localeCompare(b.artistId)
        || (a.order ?? Infinity) - (b.order ?? Infinity)
        || a.path.localeCompare(b.path)),
  };
  return { errors, warnings, index };
}
