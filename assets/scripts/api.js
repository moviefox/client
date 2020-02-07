const renderCarousel = (page) => {
  page = page ? page : 1
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/movies/popular/' + page
  })
    .done(movies => {
      movies = movies.results
      let contentHtml = ''
      for (let i = 0; i < 3; i++) {
        const movie = movies[i];
        const active = i === 0 ? 'active' : ''
        contentHtml += '<div class="carousel-item ' + active + ' ">'
        contentHtml += '<img src="http://image.tmdb.org/t/p/w1280/' + movie.backdrop_path + ' " class="transparent d-block w-100" alt="' + movie.title + '"/>'
        contentHtml += '<div class="carousel-caption d-none d-md-block">'
        contentHtml += '<h5>' + movie.title + '</h5>'
        contentHtml += '</div>'
        contentHtml += '</div>'
      }
      $('#movie-carousel .carousel-inner').html(contentHtml)
    })
    .fail(err => {
      $('#movie-carousel .carousel-inner').html('')
    })
}

const getPopularMovies = (page) => {
  page = page ? page : 1
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/movies/popular/' + page
  })
    .done(movies => {
      movies = movies.results
      let contentHtml = ''
      for (let i = 0; i < movies.length; i++) {
        const movie = movies[i]
        const name = movie.title ? movie.title : movie.name
        contentHtml += '<div onclick="getDetail(' + "'" + name + "'" + ')" class="col-lg-4 col-sm-6 movie-cart">'
        contentHtml += '<a onclick="getDetail(' + "'" + name + "'" + ')" class="pointer">'
        contentHtml += '<img onclick="getDetail(' + "'" + name + "'" + ')" class="img-thumbnail" src="http://image.tmdb.org/t/p/w500/' + movie.poster_path + '">'
        contentHtml += '<h5 class="light-blue">' + name + '</h5>'
        contentHtml += '<p class="movie-overview">' + movie.overview + '</p>'
        contentHtml += '<a>'
        contentHtml += '</div>'
      }
      $('#popular-container .row').append(contentHtml)
    })
    .fail(err => {
      $('#popular-container .row').append('')
    })
}

const searchMovie = (title, page) => {
  title = title.trim()
  window.history.replaceState({}, '', '/');
  $('#loader').show()
  page = page ? page : 1
  let data
  $.ajax({
    url: `http://localhost:3000/movies/search/${page}?title=${title}`,
    method: 'GET'
  })
    .then(movies => {
      data = movies
      movies = movies.results
      let contentHtml = ''
      if (movies.length) {
        contentHtml += '<div id="result-movie">'
        contentHtml += '<h1 class="findHeader">'
        contentHtml += 'Results for '
        contentHtml += '<span class="findSearchTerm">' + title + '</span>'
        contentHtml += '</h1>'
        contentHtml += '</div>'
        for (let i = 0; i < movies.length; i++) {
          const movie = movies[i]
          contentHtml += '<div class="media text-muted pt-3">'
          if (movie.poster_path) {
            contentHtml += '<img class="img-thumbnail" src="http://image.tmdb.org/t/p/w92/' + movie.poster_path + '">'
          } else {
            contentHtml += '<img class="img-thumbnail" style="width:92px;" src="./assets/images/poster-default.jpg">'
          }
          contentHtml += '<div class="media-body found-movie pb-3 mb-0 small lh-125">'
          contentHtml += '<div class="movie-info">'
          contentHtml += '<a class="pointer"><strong class="d-block text-gray-dark light-blue">' + movie.title + '</strong></a>'
          contentHtml += '<div><label>Release date</label>&nbsp: ' + movie.release_date.split('-').reverse().join('-') + '</div>'
          contentHtml += '<div class="found-movie-rating">'
          contentHtml += '<h6>Rating</h6>'
          contentHtml += '<i class="fa fa-star rating-star" aria-hidden="true"></i>'
          contentHtml += '<span class="score">' + movie.vote_average + '</span>'
          contentHtml += '</div>'
          contentHtml += '</div>'
          contentHtml += '</div>'
          contentHtml += '</div>'
        }

        contentHtml += '<div id="pagination-search"></div>'
      } else {
        if (page === 1 && !movies.length) {
          contentHtml += `<h1>Sorry we don't find your movies</h1>`
        }
      }
      $('#loader').hide()
      $('#result-search-movie').html(contentHtml)
      if (data.total_results > 0) {
        $('#pagination-search').pagination({
          items: data.total_results,
          itemsOnPage: 20,
          cssStyle: 'light-theme',
          currentPage: page,
          onPageClick: (page, event) => {
            searchMovie(title, page)
            if (page === 1) {
              window.location.hash = ''
            }
          }
        })
      }
    })
    .catch(err => {
      $('#result-search-movie').html('')
    })
}
