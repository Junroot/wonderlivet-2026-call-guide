import { startRouter } from './router.js';
import { homeView } from './views/home.js';
import { artistView } from './views/artist.js';
import { songView } from './views/song.js';
import { editView } from './views/edit.js';

startRouter(document.getElementById('app'), {
  home: homeView,
  artist: artistView,
  song: songView,
  edit: editView,
});
