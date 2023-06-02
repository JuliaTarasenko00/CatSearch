import Pagination from 'tui-pagination';
import { filmAPI } from './js/API';

const refs = {
  ulEl: document.querySelector('.search_film_list'),
  inputEl: document.querySelector('.search_film_input'),
  divPagination: document.getElementById('pagination2'),
};

let genres = [];

const API = new filmAPI();
API.getCategories().then(res => {
  markupFilms(res);
  // initPagination();
});

API.getCategoriesGenres().then(res => genres = res);

function markupFilms(data) {
  const markup = data
    .map(({ poster_path, original_title, original_name, genre_ids, release_date }) => {
      const url = `https://image.tmdb.org/t/p/original${poster_path}`;
      const data = typeof release_date !== 'undefined' ? release_date.split('-')[0] : 2023
      return `<li>
        <img src="${url}" alt="${original_name || original_title}" width="395" height="574" class="search_film_img">
        <div class="search_film_wrap">
          <p class="search_film_title">${original_name || original_title}</p>
          <p class="search_film_genre">${genre_ids} | ${data}</p>
        </div>
      </li>`;
    })
    .join('');
  refs.ulEl.innerHTML = markup;
}


// function initPagination() {
//   const pagination2 = new Pagination(refs.divPagination, {
//     totalItems: API.total_results,
//     // itemsPerPage: API.total_pages,
//     visiblePages: 5,
//     centerAlign: true,
//     totalPages: API.total_pages,
//   });
//   pagination2.getCurrentPage()
// }
// refs.divPagination.addEventListener('click', onClickDivPagination);
