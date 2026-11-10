// 해시 라우팅: #/, #/artist/<id>, #/song/<id>, #/edit/<id>
// 화면 함수는 (container, params, query)를 받고, 정리 함수를 돌려줄 수 있다.
import { h } from './dom.js';

export function parseHash(hash) {
  const raw = hash.replace(/^#/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  if (parts.length === 0) return { name: 'home', params: {}, query };
  if (parts.length === 2 && ['artist', 'song', 'edit'].includes(parts[0])) {
    return { name: parts[0], params: { id: parts[1] }, query };
  }
  return { name: 'notFound', params: {}, query };
}

export function notFound(container, message = '페이지를 찾을 수 없습니다') {
  container.replaceChildren(
    h('section.not-found',
      h('h1', message),
      h('p', h('a', { href: '#/' }, '첫 화면으로'))),
  );
}

export function startRouter(container, routes) {
  let cleanup = null;
  let seq = 0;

  async function render() {
    const my = ++seq;
    cleanup?.();
    cleanup = null;
    const { name, params, query } = parseHash(location.hash);
    const view = routes[name] ?? ((c) => notFound(c));
    window.scrollTo(0, 0);
    try {
      const result = await view(container, params, query);
      if (my !== seq) {
        // 화면을 그리는 사이 주소가 바뀌었다
        if (typeof result === 'function') result();
        return;
      }
      cleanup = typeof result === 'function' ? result : null;
    } catch (e) {
      if (my !== seq) return;
      console.error(e);
      container.replaceChildren(
        h('section.not-found', h('h1', '불러오기 실패'), h('p', e.message), h('p', h('a', { href: '#/' }, '첫 화면으로'))),
      );
    }
  }

  window.addEventListener('hashchange', render);
  render();
}
