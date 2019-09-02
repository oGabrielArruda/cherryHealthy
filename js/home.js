$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });
  setInterval(function () {
    $('.carousel').carousel("next");
  }, 2000);

});

