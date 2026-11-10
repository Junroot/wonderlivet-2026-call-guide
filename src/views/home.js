import { h } from '../dom.js';
import { loadCatalog } from '../data.js';

function todayString(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

// 오늘과 같거나 이후인 가장 가까운 공연일. 모두 지났으면 첫째 날.
export function defaultDay(days, today = todayString()) {
  return (days.find((d) => d.date >= today) ?? days[0])?.date;
}

// 시작 시간 순, 시간 미정은 뒤로
function byStart(a, b) {
  if (a.start && b.start) return a.start.localeCompare(b.start);
  if (a.start) return -1;
  if (b.start) return 1;
  return 0;
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function dayParts(date) {
  const d = new Date(`${date}T00:00:00`);
  return { day: String(d.getDate()).padStart(2, '0'), dow: DOW[d.getDay()] };
}

export function stageClass(a) {
  return a.stage ? `stage-${a.stage.toLowerCase()}` : 'stage-unknown';
}

export function timeText(a) {
  return a.start ? `${a.start}${a.end ? ` - ${a.end}` : ''}` : '시간 미정';
}

export function slotText(a) {
  const stage = a.stage ? `${a.stage} STAGE` : '스테이지 미정';
  return `${stage} · ${timeText(a)}`;
}

export async function homeView(container, _params, query) {
  const { lineup, songsByArtist } = await loadCatalog();
  const selected = lineup.days.some((d) => d.date === query.d) ? query.d : defaultDay(lineup.days);

  const tabs = h('nav.day-tabs', { role: 'tablist' },
    lineup.days.map((d) => {
      const { day, dow } = dayParts(d.date);
      return h('a.day-tab', {
        href: `#/?d=${d.date}`,
        role: 'tab',
        'aria-selected': d.date === selected ? 'true' : 'false',
        'aria-label': d.label,
      }, h('strong', day), h('sup', dow));
    }));

  const artists = lineup.artists
    .filter((a) => a.date === selected && songsByArtist.has(a.id))
    .sort(byStart);

  const list = artists.length
    ? h('ul.artist-list', artists.map((a) => h('li',
      h('a.artist-card', { href: `#/artist/${a.id}`, class: stageClass(a) },
        h('span.artist-name', a.name),
        h('span.artist-time', timeText(a)),
        h('span.artist-meta',
          [a.nameKo !== a.name && a.nameKo, a.stage ? `${a.stage} STAGE` : '스테이지 미정', `${songsByArtist.get(a.id).length}곡`]
            .filter(Boolean).join(' · '))))))
    : h('p.empty', '이 날은 아직 곡 데이터가 있는 아티스트가 없습니다.');

  container.replaceChildren(
    h('header.site-header',
      h('p.eyebrow', 'CALL GUIDE · 개인 연습용'),
      h('h1.display', lineup.festival?.name ?? 'WONDERLIVET 2026'),
      h('p.site-sub', '콜 연습', lineup.festival?.venue && h('span.muted', ` · ${lineup.festival.venue}`))),
    tabs,
    list,
    lineup.lineupNote ? h('p.footnote', lineup.lineupNote) : '',
  );
}
