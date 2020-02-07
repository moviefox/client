//google sign in
function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token
  $.ajax('http://localhost:3000/users/gSign', {
    method: 'POST',
    headers: {
      token: id_token
    }
  })
    .done(response => {
      localStorage.token = response.token
      $('#navbar-login').hide()
      $('#navbarDropdown').show()
      $('#navbarDropdown').text(response.name)
      $('#gsignin').hide()
      showHomePage()
    })
    .fail(err => {
      signOut()
    })
}

//google sign out
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

const hideWhenSearch = () => {
  $('#movie-carousel').hide()
  $('#popular-container').hide()
  $('#gsignin').hide()
  $('#favourite-movies table').hide()
}

const showHomePage = () => {
  $('#movie-carousel').show()
  $('#popular-container').show()
  $('#gsignin').hide()
  $('#result-search-movie').hide()
  $('#movie-details').hide()
  $('#favourite-movies table').hide()
}

const hideHomePage = () => {
  $('#movie-carousel').hide()
  $('#popular-container').hide()
  $('#gsignin').hide()
  $('#result-search-movie').hide()
  $('#favourite-movies table').hide()
}

const loginPage = () => {
  $('#result-search-movie').hide()
  hideWhenSearch()
  $('#gsignin').show()
  $('#movie-details').hide()
}

const renderSearchMovie = () => {
  pageSearch = 1
  hideWhenSearch()
  let title = $('#query-search-movie').val()
  title = '"' + title + '"'
  $('span.findSearchTerm').text(title)
  $('#result-search-movie').show()
  $('#movie-details').hide()
  searchMovie(title, pageSearch)
}

const getDetail = (movie) => {
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/movies/detail',
    data: {
      title: movie
    }
  })
    .done(movie => {
      hideHomePage()
      $('#movie-details').show()
      $('#movie-title').text(movie.Title)
      $('#poster').html(`<img width="182" height="268" src="${movie.Poster}" alt="${movie.Title}">`)
      $('#movie-year').text(`${movie.Year}`)
      $('#movie-plot').text(`${movie.Plot}`)
      if (localStorage.token) {
        $('#login-first').hide()
        $('#favourite-btn').show()
        const data = []
        data.push(movie)
        $('#btn-favourite-movies').attr('onclick', 'favouriteMovie(' + JSON.stringify(data) + ')')
      } else {
        $('#login-first').show()
        $('#favourite-btn').hide()
      }
    })
    .fail(err => {
      console.log(err)
    })
}

const favouriteMovie = (movie) => {
  movie = movie[0]
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/movies',
    headers: {
      token: localStorage.token
    },
    data: {
      title: movie.Title,
      year: movie.Year,
      plot: movie.Plot,
      poster: movie.Poster
    }
  })
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
}

const deleteFavourites = (id) => {
  $.ajax({
    method: 'DELETE',
    url: 'http://localhost:3000/movies/' + id,
    headers: {
      token: localStorage.token
    }
  })
    .then(deleted => {
      getFavouriteMovies()
    })
    .catch(err => {
      console.log(err)
    })
}

const getFavouriteMovies = () => {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/users/movie',
    headers: {
      token: localStorage.token
    }
  })
    .then(data => {
      let contentHtml = ''
      for (const movie of data[0].Movies) {
        contentHtml += '<tr>'
        contentHtml += '<td>' + movie.title + '</td>'
        contentHtml += '<td>' + movie.year + '</td>'
        contentHtml += '<td><img width="182" height="268" src="' + movie.poster + '" alt="' + movie.title + '"></td>'
        contentHtml += '<td>' + movie.plot + '</td>'
        contentHtml += '<td>'
        contentHtml += '<a style="color:red;" class="delete-favourites link pointer" onclick="deleteFavourites(' + movie.id + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>'
        contentHtml += '</td>'
        contentHtml += '</tr>'
      }
      $('#favourite-movies table').html(contentHtml)
    })
    .catch(err => {
      console.log(err)
    })
}

let page = 1
let pageSearch = 1
$(document).ready(() => {

  $('#favourite-movies table').hide()
  $('#movie-details').hide()
  if (localStorage.token) {
    $('#navbarDropdown').show()
    $('#navbar-login').hide()
  } else {
    $('#navbarDropdown').hide()
    $('#navbar-login').show()
  }

  $('#gsignin').hide()
  $('#loader').hide()
  $('#result-search-movie').hide()
  renderCarousel(page)
  $('#movie-carousel').carousel()
  getPopularMovies(page)

  $(window).on('scroll', () => {
    if ($('#popular-container').css('display') == 'block') {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        page = page + 1
        getPopularMovies(page)
      }
    }
  })

  $('#btn-search-movie').on('click', (e) => {
    e.preventDefault();
    renderSearchMovie()
  })

  $('#query-search-movie').on('keypress', (e) => {
    if (e.keyCode === 13) {
      renderSearchMovie()
    }
  })

  $('.navbar-brand').on('click', (e) => {
    e.preventDefault()
    showHomePage()
  })

  $('#navbar-login').on('click', (e) => {
    e.preventDefault()
    window.history.pushState({}, '', '/')
    loginPage()
  })

  $('#navbar-logout').on('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    signOut()
    $('#navbar-login').show()
    $('#navbarDropdown').text('')
    $('#navbarDropdown').hide()
  })

  $('#movie-favourites').on('click', (e) => {
    hideHomePage()
    $('#movie-details').hide()
    $('#favourite-movies table').show()
    getFavouriteMovies()
  })
})


