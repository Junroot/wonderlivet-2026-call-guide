// YouTube IFrame API 로더와 재생 시간 보간.
// getCurrentTime()은 iframe 메시지로 갱신되어 값이 계단식으로 바뀐다.
// 마지막 기준값과 performance.now()로 프레임마다 시간을 보간한다.

const SMALL_DRIFT_SEC = 0.3;
const DRIFT_BLEND = 0.3;

export class PlaybackClock {
  constructor() {
    this.base = 0;
    this.baseAt = 0;
    this.rate = 1;
    this.playing = false;
    this.lastRaw = null;
  }

  time(now) {
    return this.playing ? this.base + ((now - this.baseAt) / 1000) * this.rate : this.base;
  }

  // 일시정지·탐색·속도 변경 때 기준값을 다시 잡는다.
  reset(time, now, { playing = this.playing, rate = this.rate } = {}) {
    this.base = time;
    this.baseAt = now;
    this.playing = playing;
    this.rate = rate;
    this.lastRaw = time;
  }

  // 프레임마다 player.getCurrentTime() 값을 넣는다.
  // 값이 바뀐 순간에만 반영하고, 작은 차이는 조금씩 따라가 강조가 튀지 않게 한다.
  sample(raw, now) {
    if (raw === this.lastRaw) return;
    this.lastRaw = raw;
    const predicted = this.time(now);
    const diff = raw - predicted;
    this.base = this.playing && Math.abs(diff) < SMALL_DRIFT_SEC ? predicted + diff * DRIFT_BLEND : raw;
    this.baseAt = now;
  }
}

// 외부 재생 모드의 사이트 자체 시계. createPlayer 반환 객체와 같은 인터페이스다.
// 사용자가 다른 탭이나 앱에서 곡을 틀고, seek로 시계를 맞춘다.
export function createManualClock(now = () => performance.now()) {
  const clock = new PlaybackClock();
  const at = () => clock.time(now());
  return {
    manual: true,
    ready: true,
    get playing() { return clock.playing; },
    get rate() { return clock.rate; },
    time: at,
    duration: () => 0,
    play: () => clock.reset(at(), now(), { playing: true }),
    pause: () => clock.reset(at(), now(), { playing: false }),
    toggle() {
      if (clock.playing) this.pause();
      else this.play();
    },
    seek: (t) => clock.reset(Math.max(0, t), now()),
    nudge(d) { this.seek(at() + d); },
    setRate: (r) => clock.reset(at(), now(), { rate: r }),
    destroy() {},
  };
}

let apiPromise = null;

export function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => {
        apiPromise = null;
        reject(new Error('YouTube API를 불러오지 못했습니다'));
      };
      document.head.append(s);
    });
  }
  return apiPromise;
}

// 임베드 차단(101/150)과 그 밖의 오류 문구
export function playerErrorMessage(code) {
  if (code === 101 || code === 150) return '이 영상은 사이트 안에서 재생할 수 없습니다';
  if (code === 100) return '영상을 찾을 수 없습니다 (삭제 또는 비공개)';
  return `영상을 재생할 수 없습니다 (오류 ${code})`;
}

// el 안에 플레이어를 만든다. 반환 객체의 time()이 보간된 영상 시간이다.
export async function createPlayer(el, { videoId, onReady, onError, onStateChange } = {}) {
  const YT = await loadYouTubeApi();
  const clock = new PlaybackClock();
  const host = document.createElement('div');
  el.replaceChildren(host);

  let player;
  let ready = false;
  let raf = 0;
  const S = YT.PlayerState;

  const resync = () => {
    if (!ready) return;
    const state = player.getPlayerState();
    clock.reset(player.getCurrentTime() ?? 0, performance.now(), {
      playing: state === S.PLAYING,
      rate: player.getPlaybackRate() ?? 1,
    });
  };

  const loop = () => {
    if (ready && clock.playing) clock.sample(player.getCurrentTime(), performance.now());
    raf = requestAnimationFrame(loop);
  };

  await new Promise((resolve) => {
    player = new YT.Player(host, {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          ready = true;
          resync();
          raf = requestAnimationFrame(loop);
          resolve();
          onReady?.();
        },
        onStateChange: (e) => {
          resync();
          onStateChange?.(e.data);
        },
        onPlaybackRateChange: resync,
        onError: (e) => {
          resolve();
          onError?.(e.data, playerErrorMessage(e.data));
        },
      },
    });
  });

  return {
    manual: false,
    get ready() { return ready; },
    get playing() { return clock.playing; },
    time: () => clock.time(performance.now()),
    duration: () => (ready ? player.getDuration() : 0),
    play: () => player?.playVideo(),
    pause: () => player?.pauseVideo(),
    toggle() {
      if (clock.playing) this.pause();
      else this.play();
    },
    seek(t) {
      if (!ready) return;
      const time = Math.max(0, t);
      player.seekTo(time, true);
      clock.reset(time, performance.now());
    },
    setRate(r) {
      if (!ready) return;
      player.setPlaybackRate(r);
      clock.reset(player.getCurrentTime(), performance.now(), { rate: r });
    },
    destroy() {
      cancelAnimationFrame(raf);
      try { player?.destroy(); } catch { /* 이미 제거됨 */ }
    },
  };
}
