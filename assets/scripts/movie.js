//google sign in
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile()
  var id_token = googleUser.getAuthResponse().id_token
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  $.ajax('http://localhost:3000/???????????????????????????????????', {
    method: 'POST',
    headers: { id_token }
  })
    .done(response => {
      //terima token
      //terima nama user
      //show content
    })
    .fail(err => {
      signOut()
      console.log(err)
    })
}

//google sign out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

const hideWhenSearch = () => {
  $('#movie-carousel').hide()
  $('#popular-container').hide()
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
  $('#gsignin').hide()
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
    loginPage()
  })
})


