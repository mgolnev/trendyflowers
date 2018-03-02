(function () {
  $('.js-open-sidebar').on('click', function () {
    alertify.panel({
      target: $('[data-modal="mobile-sidebar"]').html(),
      position: 'left',
      onOpen: function (modal) {
        var $sidebarBlocks = $(modal).find('.sidebar-block-content');

        $sidebarBlocks.each(function () {
          var $menu = $(this).find('.mobile-sidebar-menu').first();

          InSalesUI.Menu.create($menu);
        });
      }
    });
  });
$('.js-open-contacts').on('click',function(){
  $('.contacts-top-menu-block').removeClass('hidden');
  $(this).addClass('is-active');
  // console.log('Открывается!');
})
$(document).on('click touchstart',function(elem){
  var contacts_top = $(elem.target).closest('.contacts-top-menu-block').length;
  var js_open_contacts = $(elem.target).closest('.js-open-contacts').length;
  if (!contacts_top && !js_open_contacts){
      $('.contacts-top-menu-block').addClass('hidden');
      $(".js-open-contacts").removeClass('is-active');
        // console.log('Закрывается!');
  }
});
$('.contacts-overlay').on('click',function(){
  $('.contacts-top-menu-block').addClass('hidden');
  $(".js-open-contacts").removeClass('is-active');
})
// Open modal search or search panel in dependence window width
$('.js-open-search-panel').on('click', function (elem) {
// console.log(window.innerWidth );
  if (window.innerWidth  <= 768){
        alertify.panel({
          target: $('[data-modal="search-form"]').html(),
          position: 'top', hideAfter: false
        });
        // console.log("Тут должна открыться модалка");
  }
  else {
    var search_container = $('.js-toggle-search');
    var search_button = $('.js-open-search-panel');
    var contacts_header =   $('.js-contacts-header');
    search_button.addClass('hidden');
    search_container.removeClass('hidden');
    // console.log("Тут должна открыться панелька");
    }
});

// Closest search-panel when click on other documents
$(document).on('click touchstart',function(elem){
  var toggle_search = $(elem.target).closest('.js-toggle-search').length;
  var open_panel = $(elem.target).closest('.js-open-search-panel').length;

  if (  !toggle_search && (window.innerWidth  >= 768) && !open_panel ){
    var search_container = $('.js-toggle-search');
    var search_button = $('.js-open-search-panel');
    var contacts_header =  $('.js-contacts-header');
    search_container.addClass('hidden');
    search_button.removeClass('hidden');
    // console.log("Тут должна скрыться панелька");
  }
});

var toggleForms = function(button, form){
  button.on('click', function(){
    form.toggle();

    if (form.is(":hidden")){
      button.addClass('is-unchecked');
      button.removeClass('is-checked');
      $('.js-comments-toggle-notice').hide()
    }
    else{
      button.addClass('is-checked');
      button.removeClass('is-unchecked');
    }
    var form_clear =  InSalesUI.Form.get(form);
    form_clear.clear();
  });
};

toggleForms($('.js-comments-toggle'),$('#comment_form'));
toggleForms($('.js-reviews-toggle'),$('#review_form'));

if (window.innerWidth  <= 768){
  if ($('.hidden-breadcrumbs').hasClass("js-hidden-bread")){

    $('.breadcrumb-item').each(function(index){
      if ((index > 2) && (index != $(".breadcrumb-item").size() - 1))
      {
        $(this).addClass("hidden");
        // console.log($(this).text());
      }
    })
    $('.js-hidden-bread').click(function(){
      $('.breadcrumb-item').removeClass("hidden");
      $('.js-hidden-bread').parent().addClass("hidden");
    })
  }
}


})();
