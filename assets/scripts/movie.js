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
}

const showHomePage = () => {
  $('#movie-carousel').show()
  $('#popular-container').show()
  $('#gsignin').hide()
  $('#result-search-movie').hide()
}

const loginPage = () => {
  $('#result-search-movie').hide()
  hideWhenSearch()
  $('#gsignin').show()
}

const renderSearchMovie = () => {
  pageSearch = 1
  hideWhenSearch()
  let title = $('#query-search-movie').val()
  title = '"' + title + '"'
  $('span.findSearchTerm').text(title)
  $('#result-search-movie').show()
  searchMovie(title, pageSearch)
}

let page = 1
let pageSearch = 1
$(document).ready(() => {

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

  $('#jakarta').on('click', (e) => {
    e.preventDefault()
    let city = e.currentTarget.id
    console.log('masuk', city);
    cinemaList(city)
  })

})


