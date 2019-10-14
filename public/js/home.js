$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });
  setInterval(function () {
    $('.carousel').carousel("next");
  }, 2000);

});

$(document).ready(function() {
  var NavTop = $('.nav').offset().top;
  var Nav = function() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > NavTop) { 
      $('.nav').addClass('sticky');
    } else {
      $('.nav').removeClass('sticky'); 
    }
  };

Nav();

  $(window).scroll(function() {
    Nav();
  });
});

$(window).scroll(function() {    
  var scroll = $(window).scrollTop();

  if (scroll >= 100) {
      $("#Top_bar").addClass("is-sticky");
  } else {
      $("#Top_bar").removeClass("is-sticky");
  }
});

