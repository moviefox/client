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

let page = 1
$(document).ready(() => {
  renderCarousel(page)
  $('#movie-carousel').carousel()
  getPopularMovies(page)

  $(window).on('scroll', () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      page = page + 1
      getPopularMovies(page)
    }
  })
})


