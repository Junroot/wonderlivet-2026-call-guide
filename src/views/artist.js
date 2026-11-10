import { h } from '../dom.js';
import { loadCatalog } from '../data.js';
import { notFound } from '../router.js';
import { cueIcon, reviewBadges } from '../cue-types.js';
import { slotText } from './home.js';

export async function artistView(container, { id }) {
  const { lineup, artists, songsByArtist } = await loadCatalog();
  const artist = artists.get(id);
  if (!artist) return notFound(container, '아티스트를 찾을 수 없습니다');
  const songs = songsByArtist.get(id) ?? [];
  const day = lineup.days.find((d) => d.date === artist.date);

  container.replaceChildren(
    h('nav.crumbs', h('a', { href: `#/?d=${artist.date}` }, `← ${day?.label ?? '목록'}`)),
    h('header.page-header',
      h('h1', artist.name),
      artist.nameKo !== artist.name && h('p.artist-name-ko', artist.nameKo),
      h('p.muted', `${day?.label ?? artist.date} · ${slotText(artist)}`)),

    artist.rituals?.length > 0 && h('section.rituals',
      h('h2', '공연 의식'),
      artist.rituals.map((r) => h('article.ritual',
        h('h3', r.name),
        h('p', r.description),
        h('p.sources', '출처: ', r.sources.map((s, i) => [
          i > 0 && ' · ',
          h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label ?? s.url),
        ]))))),

    h('section.songs',
      h('h2', `곡 ${songs.length}개`),
      songs.length
        ? h('ul.song-list', songs.map((s) => h('li',
          h('a.song-card', { href: `#/song/${s.id}` },
            h('span.song-title', s.title),
            h('span.song-cues', s.cueTypes.map((t) => cueIcon(t))),
            h('span.song-badges', reviewBadges(s.review))))))
        : h('p.empty', '아직 곡 데이터가 없습니다.')),
  );
}
