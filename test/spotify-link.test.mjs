import test from 'node:test';
import assert from 'node:assert/strict';
import { spotifyLink } from '../src/views/artist.js';

const artist = { name: 'THE ORAL CIGARETTES' };

test('트랙 주소가 있으면 그 주소로 바로 간다', () => {
  const url = 'https://open.spotify.com/track/2EHcM94vAEYFlNXXosOHRp';
  assert.deepEqual(spotifyLink({ title: '狂乱 Hey Kids!!', spotify: url }, artist), { href: url, direct: true });
});

test('트랙 주소가 없으면 아티스트명 + 곡명 검색 주소를 만든다', () => {
  assert.deepEqual(spotifyLink({ title: '狂乱 Hey Kids!!' }, artist), {
    href: 'https://open.spotify.com/search/THE%20ORAL%20CIGARETTES%20%E7%8B%82%E4%B9%B1%20Hey%20Kids!!',
    direct: false,
  });
});

test('검색어의 / ? # 는 주소를 깨지 않게 인코딩한다', () => {
  const { href } = spotifyLink({ title: 'A/B? #1' }, { name: 'X' });
  assert.equal(href, 'https://open.spotify.com/search/X%20A%2FB%3F%20%231');
});
