import { h } from '../dom.js';
import { loadCatalog } from '../data.js';
import { notFound } from '../router.js';
import { cueIcon, reviewBadges } from '../cue-types.js';
import { slotText, stageClass } from './home.js';

const TIER_LABEL = { sure: '확실', likely: '유력', maybe: '가능' };

function sourceLinks(sources) {
  return sources.map((s, i) => [
    i > 0 && ' · ',
    h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label ?? s.url),
  ]);
}

const seenText = (seen) => seen && `${seen[0]}/${seen[1]}`;

function setlistSection(setlist, updated) {
  const { songs, candidates } = setlist;
  return h('section.setlist',
    h('h2.section-label', h('span', 'SETLIST'), songs.length ? `예상 세트리스트 (약 ${songs.length}곡)` : '예상 세트리스트'),
    songs.length
      ? h('ol.setlist-songs', songs.map((s) => h('li.setlist-song',
        h('span.setlist-title', s.title),
        h('span.tier', { class: `tier-${s.tier}` }, TIER_LABEL[s.tier] ?? s.tier),
        s.seen && h('span.setlist-seen', { title: '최근 공연 등장 횟수' }, seenText(s.seen)),
        s.songId && h('a.setlist-practice', { href: `#/song/${s.songId}` }, '▶ 연습'),
        s.note && h('span.setlist-note', s.note))))
      : h('p.empty', '예상할 근거가 부족합니다.'),
    candidates.length > 0 && h('p.setlist-candidates', '후보: ', candidates.map((c, i) => [
      i > 0 && ' · ',
      c.songId ? h('a', { href: `#/song/${c.songId}` }, c.title) : c.title,
      c.seen && ` (${seenText(c.seen)})`,
    ])),
    setlist.note && h('p.setlist-memo', setlist.note),
    h('p.sources', `근거: ${setlist.basis}`),
    h('p.sources', '출처: ', sourceLinks(setlist.sources), updated && ` · 갱신 ${updated}`));
}

export async function artistView(container, { id }) {
  const { lineup, artists, songsByArtist, setlists, setlistsUpdated } = await loadCatalog();
  const artist = artists.get(id);
  if (!artist) return notFound(container, '아티스트를 찾을 수 없습니다');
  const songs = songsByArtist.get(id) ?? [];
  const day = lineup.days.find((d) => d.date === artist.date);

  container.replaceChildren(
    h('nav.crumbs', h('a', { href: `#/?d=${artist.date}` }, `← ${day?.label ?? '목록'}`)),
    h('header.page-header',
      h('p.eyebrow', h('span.stage-chip', { class: stageClass(artist) }, artist.stage ? `${artist.stage} STAGE` : 'STAGE TBA')),
      h('h1.display', artist.name),
      artist.nameKo !== artist.name && h('p.artist-name-ko', artist.nameKo),
      h('p.muted', `${day?.label ?? artist.date} · ${slotText(artist)}`)),

    artist.rituals?.length > 0 ? h('section.rituals',
      h('h2.section-label', h('span', 'RITUAL'), '공연 의식'),
      artist.rituals.map((r) => h('article.ritual',
        h('h3', r.name),
        h('p', r.description),
        h('p.sources', '출처: ', sourceLinks(r.sources))))) : '',

    setlists.has(id) ? setlistSection(setlists.get(id), setlistsUpdated) : '',

    h('section.songs',
      h('h2.section-label', h('span', 'SONGS'), `곡 ${songs.length}개`),
      songs.length
        ? h('ul.song-list', songs.map((s) => h('li',
          h('a.song-card', { href: `#/song/${s.id}` },
            h('span.song-title', s.title),
            h('span.song-cues', s.cueTypes.map((t) => cueIcon(t))),
            h('span.song-badges', reviewBadges(s.review))))))
        : h('p.empty', '아직 곡 데이터가 없습니다.')),
  );
}
