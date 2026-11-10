// 외부 재생 모드 조작 상자. 연습 화면과 보정 도구가 함께 쓴다.
import { h } from './dom.js';

const NUDGE_SEC = 0.5;

export function youtubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

// clock: createManualClock() 결과. extra: 추가 버튼 목록.
// 반환: { el, update } — update()는 프레임마다 불러 버튼 문구를 맞춘다.
export function externalBox({ clock, videoId, message, hint, extra = [] }) {
  const playBtn = h('button.btn.primary', { type: 'button', onclick: () => clock.toggle() });
  const el = h('div.external',
    message && h('p.external-reason', message),
    h('p.external-hint', hint),
    h('div.controls',
      playBtn,
      h('button.btn', { type: 'button', onclick: () => clock.nudge(-NUDGE_SEC) }, `−${NUDGE_SEC}초`),
      h('button.btn', { type: 'button', onclick: () => clock.nudge(NUDGE_SEC) }, `+${NUDGE_SEC}초`),
      extra),
    videoId && h('p', h('a', { href: youtubeUrl(videoId), target: '_blank', rel: 'noopener' }, 'YouTube에서 열기 ↗')));
  const update = () => {
    const text = clock.playing ? '⏸ 시계 멈춤' : '▶ 시계 진행';
    if (playBtn.textContent !== text) playBtn.textContent = text;
  };
  update();
  return { el, update };
}
