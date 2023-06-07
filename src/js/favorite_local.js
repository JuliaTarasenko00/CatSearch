import { filmAPI } from './API';
// import { markupFilm } from '../index';

const API = new filmAPI();

const KEY_FAVORITE = 'favorite';

const favoriteArr = JSON.parse(localStorage.getItem(KEY_FAVORITE)) ?? [];
const favorite = localStorage.getItem(KEY_FAVORITE) ?? [];

const jsList = document.querySelector('.js_list')

export async function onClickFilm(ev) {
    let filmId = null;
    const btn = document.querySelector('.js_add_collection')
    if (ev.target.classList.contains('js_add_collection')) {
      const { id } = ev.target.closest('li').dataset;
      filmId = await findFilm(Number(id));
      if (filmId) {
        const inStorage = favoriteArr.some(({ id }) => id === filmId);
        if (inStorage) {
          return;
        }
        const film = await API.getCategoriesId(filmId);
        favoriteArr.push(film);
        localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
      }
    }
  }
  
  async function findFilm(ev) {
    const res = await API.getCategoriesId(ev);
    return res.id === ev ? res.id : null;
  }

