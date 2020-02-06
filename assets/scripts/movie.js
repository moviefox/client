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