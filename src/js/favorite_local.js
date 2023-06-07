import { filmAPI } from './API';
// import { markupFilm } from '../index';

const API = new filmAPI();

const KEY_FAVORITE = 'favorite';

const favoriteArr = JSON.parse(localStorage.getItem(KEY_FAVORITE)) ?? [];
const favorite = localStorage.getItem(KEY_FAVORITE) ?? [];

const jsList = document.querySelector('.js_list');

export async function onClickFilm(ev) {
  let filmId = null;
  const btn = ev.target.closest('.js_add_collection');

  if (btn) {
    const { id } = btn.closest('li').dataset;
    filmId = await findFilm(Number(id));
    if (filmId) {
      const inStorage = favoriteArr.some(({ id }) => id === filmId);
      if (inStorage) {
        // Видалення фільму з localStorage
        favoriteArr.splice(
          favoriteArr.findIndex(film => film.id === filmId),
          1
        );
        localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
        btn.textContent = 'Add';
      } else {
        const film = await API.getCategoriesId(filmId);
        favoriteArr.push(film);
        localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
        btn.textContent = 'Delete';
      }
    }
  }
}

async function findFilm(ev) {
  const res = await API.getCategoriesId(ev);
  return res.id === ev ? res.id : null;
}
