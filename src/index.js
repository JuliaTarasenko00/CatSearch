import Pagination from 'tui-pagination';
import { filmAPI } from './js/API';

const refs = {
  ulEl: document.querySelector('.search_film_list'),
  inputEl: document.querySelector('.search_film_input'),
  divPagination: document.getElementById('pagination2'),
};

const API = new filmAPI();
API.getCategoriesGenres().then(genresData => {
  const genreMap = createGenreMap(genresData);
  // console.log(genreMap);
  API.getCategories().then(res => {
    // console.log(res, genreMap);
    markupFilms(res, genreMap);
    // initPagination();
  });
});


function createFilmMarkup({
  poster_path,
  original_title,
  original_name,
  release_date,
  first_air_date,
}, genreNames, vote_average) {
  const url = `https://image.tmdb.org/t/p/original${poster_path}`;
  const year = typeof release_date !== 'undefined'
    ? release_date.split('-')[0]
    : first_air_date.split('-')[0];
  return `<li class="search_film_img_wrap">
    <img src="${url}" alt="${original_name || original_title}"
      width="395" height="574" class="search_film_img"/>
    <div class="wrap">
      <div class="search_film_wrap">
        <p class="search_film_title">${original_name || original_title}</p>
        <p class="search_film_genre">${genreNames} | ${year}</p>
        <p class="stars is-hidden">${vote_average}</p>
      </div>
    </div>
  </li>`;
}

function markupFilms(data, genreMap) {
  const markup = data.map((film) => {
    // console.log(film)
    const genreNames = createGenreNames(film.genre_ids, genreMap);
    const voteAverage = film.vote_average; 

    return createFilmMarkup(film, genreNames, voteAverage);
  }).join('');

  refs.ulEl.innerHTML = markup;
}

function createGenreMap(genresData) {
  const accGenresData = genresData.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
  // console.log(acc);
    return acc;
  }, {});
  return accGenresData;
}

function createGenreNames(genre_ids, genreMap) {
  let genreNames = genre_ids.map(genreId => {
    if (!genreMap[genreId]) {
      return 'Film';
    }
    return genreMap[genreId];
  });

  if (genreNames.length > 2) {
    genreNames = genreNames.slice(0, 2);
  }
  return genreNames;
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
