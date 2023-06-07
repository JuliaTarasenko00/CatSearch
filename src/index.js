import { filmAPI } from './js/API';
import { createPagination } from './js/pagination';
// import { KEY_FAVORITE } from './js/local';
import { onClickFilm } from './js/favorite_local';

const refs = {
  ulEl: document.querySelector('.search_film_list'),
  inputEl: document.querySelector('.search_film_input'),
  divPagination: document.getElementById('pagination'),
  form: document.getElementById('form'),
  btnReset: document.querySelector('.btn_reset'),
  toTop: document.querySelector('.to_top'),
  falseResultMessage: document.querySelector('.cards__message'),
  collection: document.querySelector('.collection'),
};

let categories = {};
let currentPage = 1;
let searchQuery = '';

const API = new filmAPI();

API.getCategoriesGenres()
  .then(res => {
    res.forEach(({ id, name }) => {
      categories[id] = name;
    });
    return API.getCategories(currentPage);
  })
  .then(categoriesData => {
    markupFilm(categoriesData.results);
    paginationTrendWeek(categoriesData);
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
        id,
      }) => {
        let url = poster_path
          ? `https://image.tmdb.org/t/p/original${poster_path}`
          : 'https://www.tgv.com.my/assets/images/404/movie-poster.jpg';
        const year = yearsFilm(release_date, first_air_date);
        let genre = categoriesFilms(genre_ids);
        return `<li class="search_film_img_wrap" data-id='${id}'>
<img src="${url}" alt="${original_name || original_title}"
  width="395" height="574" class="search_film_img"/>
<div class="wrap">
  <div class="search_film_wrap">
    <p class="search_film_title">${original_name || original_title}</p>
    <p class="search_film_genre">${genre} | ${year}</p>
    <p class="stars is-hidden">${vote_average}</p>
  </div>
  <button type="button" class="js_add_collection" data-id="${id}">Add to collection</button>
</div>
</li>`;
      }
    )
    .join('');
  refs.ulEl.innerHTML = markup;
}

refs.ulEl.addEventListener('click', onClickFilm);

function categoriesFilms(genreIds) {
  let categoriesFilm = [];
  if (typeof genreIds !== 'undefined') {
    categoriesFilm = genreIds
      .filter(genre => typeof genre !== 'undefined')
      .map(genre => {
        if (!categories[genre]) {
          return 'Film';
        }
        return categories[genre];
      });
  }
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
      : typeof first_air_date !== 'undefined'
      ? first_air_date.split('-')[0]
      : '';
  return year;
}

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(ev) {
  ev.preventDefault();
  currentPage = 1;
  searchQuery = ev.currentTarget.elements.film_name.value.trim();
  refs.divPagination.classList.add('display-hidden');
  refs.falseResultMessage.classList.add('display-hidden');

  if (searchQuery.length >= 1) {
    refs.btnReset.classList.remove('is-hidden');
  }

  const response = await API.getCategoriesQuery(searchQuery, currentPage);
  refs.ulEl.innerHTML = '';

  markupFilm(response.results);
  paginationSearchFilms(response);
  addFalseResultText(response);
}

function paginationTrendWeek(response) {
  if (response.total_results > 20) {
    refs.divPagination.classList.remove('display-hidden');

    const pagination = createPagination(
      response.total_results,
      response.total_pages
    );

    pagination.on('afterMove', event => {
      currentPage = event.page;
      API.getCategories(currentPage)
        .then(data => {
          markupFilm(data.results);
          window.scrollTo({
            top: 450,
            behavior: 'smooth',
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  }
}

function paginationSearchFilms(response) {
  if (response.total_results > 20) {
    refs.divPagination.classList.remove('display-hidden');

    const pagination = createPagination(
      response.total_results,
      response.total_pages
    );

    pagination.on('afterMove', event => {
      currentPage = event.page;
      API.getCategoriesQuery(searchQuery, currentPage)
        .then(data => {
          markupFilm(data.results);
          window.scrollTo({
            top: 450,
            behavior: 'smooth',
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  }
}

function addFalseResultText(response) {
  if (response.total_results === 0) {
    refs.falseResultMessage.classList.remove('display-hidden');
  }
}

refs.btnReset.addEventListener('click', () => {
  refs.btnReset.classList.add('is-hidden');
  refs.form.reset();
});

function Error(err) {
  console.log(err);
}
export {
  markupFilm
}