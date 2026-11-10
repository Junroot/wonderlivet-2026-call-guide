// 라인업·곡 색인·곡 파일 불러오기
let catalog = null;

async function getJson(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${path} 불러오기 실패 (${res.status})`);
  return res.json();
}

export async function loadCatalog() {
  if (!catalog) {
    catalog = Promise.all([getJson('data/lineup.json'), getJson('data/songs/index.json')])
      .then(([lineup, index]) => {
        const artists = new Map(lineup.artists.map((a) => [a.id, a]));
        const songs = new Map(index.songs.map((s) => [s.id, s]));
        const songsByArtist = new Map();
        for (const s of index.songs) {
          if (!songsByArtist.has(s.artistId)) songsByArtist.set(s.artistId, []);
          songsByArtist.get(s.artistId).push(s);
        }
        return { lineup, artists, songs, songsByArtist };
      })
      .catch((e) => {
        catalog = null;
        throw e;
      });
  }
  return catalog;
}

export async function loadSong(entry) {
  return getJson(entry.path);
}
