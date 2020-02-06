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
        contentHtml += '<div class="col-lg-4 col-sm-6 movie-cart">'
        contentHtml += '<a class="pointer">'
        contentHtml += '<img class="img-thumbnail" src="http://image.tmdb.org/t/p/w500/' + movie.poster_path + '">'
        contentHtml += '<h5 class="light-blue">' + movie.title + '</h5>'
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
