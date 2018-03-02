(function () {
  if (Site.template == 'article') {

    new Swiper ('[data-slider="article-related-products"]', {
      slidesPerView: 3,
      spaceBetween: 24,

      breakpoints: {
        380: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 2
        },
        640: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 2
        }
      }
    });

};

})();
