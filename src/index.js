import Pagination from 'tui-pagination';
import { filmAPI } from './js/API';

const refs = {
  ulEl: document.querySelector('.search_film_list'),
  inputEl: document.querySelector('.search_film_input'),
  divPagination: document.getElementById('pagination2'),
  form: document.getElementById('form'),
  btnReset: document.querySelector('.btn_reset'),
  toTop: document.querySelector('.to_top')
};

let categories = {};

const API = new filmAPI();

API.getCategoriesGenres()
  .then(res => {
    res.forEach(({ id, name }) => {
      categories[id] = name;
    });
    return API.getCategories();
  })
  .then(categoriesData => {
    markupFilm(categoriesData);
  })
  .catch(Error);

function markupFilm(data) {
  const markup = data
    .map(
      ({
        poster_path,
        original_name,
        original_title,
        genre_ids,
        release_date,
        vote_average,
        first_air_date,
      }) => {
        let url = poster_path
          ? `https://image.tmdb.org/t/p/original${poster_path}`
          : 'https://www.tgv.com.my/assets/images/404/movie-poster.jpg';
        const year = yearsFilm(release_date, first_air_date);
        let genre = categoriesFilms(genre_ids);
        return `<li class="search_film_img_wrap">
<img src="${url}" alt="${original_name || original_title}"
  width="395" height="574" class="search_film_img"/>
<div class="wrap">
  <div class="search_film_wrap">
    <p class="search_film_title">${original_name || original_title}</p>
    <p class="search_film_genre">${genre} | ${year}</p>
    <p class="stars is-hidden">${vote_average}</p>
  </div>

</div>
</li>`;
      }).join('');
  refs.ulEl.innerHTML = markup;
}

function categoriesFilms(genreIds) {
  let categoriesFilm = genreIds
    .filter(genre => genre !== undefined)
    .map(genre => {
      if (!categories[genre]) {
        return 'Film';
      }
      return categories[genre];
    });
  // console.log(categoriesFilm.length);
  if (categoriesFilm.length > 2) {
    categoriesFilm = categoriesFilm.slice(0, 2);
  }
  if (categoriesFilm.length === 0) {
    return 'Film';
  }
  return categoriesFilm.join(', ');
}

function yearsFilm(release_date, first_air_date) {
  const year =
    typeof release_date !== 'undefined'
      ? release_date.split('-')[0]
      : first_air_date.split('-')[0];
  return year;
}

refs.form.addEventListener('submit', onSubmit);
function onSubmit(ev) {
  ev.preventDefault();
  const value = ev.currentTarget.elements.film_name.value.trim();
  if (value.length >= 1) {
    refs.btnReset.classList.remove('is-hidden');
  }
  API.getCategoriesQuery(value).then(res => markupFilm(res));
}

refs.btnReset.addEventListener('click', () => {
  refs.btnReset.classList.add('is-hidden');
  refs.form.reset();
});

function Error(err) {
  console.log(err);
}
