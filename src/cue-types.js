import { h } from './dom.js';

export const CUE_META = {
  call: { icon: '📣', label: '외치기' },
  clap: { icon: '👏', label: '박수' },
  jump: { icon: '🦘', label: '점프' },
  singalong: { icon: '🎤', label: '떼창' },
  motion: { icon: '🙌', label: '손동작' },
  penlight: { icon: '', label: '펜라이트' },
  other: { icon: '✨', label: '기타' },
};

// 펜라이트는 color로 칠한 막대 아이콘, 나머지는 이모지
export function cueIcon(type, color) {
  const meta = CUE_META[type] ?? CUE_META.other;
  if (type === 'penlight') {
    return h('span.cue-icon.penlight', {
      title: meta.label,
      'aria-label': meta.label,
      style: color ? { '--pen': color } : undefined,
    });
  }
  return h('span.cue-icon', { title: meta.label, 'aria-label': meta.label }, meta.icon);
}

export function reviewBadges(review) {
  return [
    review?.pronunciation === false && h('span.badge.warn', '발음 검수 전'),
    review?.timing === false && h('span.badge.warn', '타이밍 검수 전'),
  ];
}
