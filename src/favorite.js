const KEY_FAVORITE = 'favorite';

const list = document.querySelector('.js_list');
const favorite = JSON.parse(localStorage.getItem(KEY_FAVORITE)) ?? [];

function markupFilm(favorite) {
  const markup = favorite
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
        // let genre = categoriesFilms(genre_ids);
        return `<li class="search_film_img_wrap" data-id='${id}'>
<img src="${url}" alt="${original_name || original_title}"
  width="395" height="574" class="search_film_img"/>
<div class="wrap">
  <div class="search_film_wrap">
    <p class="search_film_title">${original_name || original_title}</p>
    <p class="search_film_genre"> | ${year}</p>
    <p class="stars is-hidden">${vote_average}</p>
  </div>
  <button type="button" class="js_add_collection" data-id="${id}">Add to collection</button>
</div>
</li>`;
      }
    )
    .join('');
  list.innerHTML = markup;
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

markupFilm(favorite);
