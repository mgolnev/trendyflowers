/**
 * Menus active check
 * Хак, для улучшения работы меню - выделения активного элемента.
 * Именно так - потому что теперь - меню кэшируется, и в нём нельзя использовать collection.current?
 */
(function () {

  var currentHandle = $("meta[name='handle']").attr("content");

  $('[data-handle="' + currentHandle + '"]').each(function(e){

    $(this).addClass('active');
    $(this).parents('.list-item').addClass('active');

  });

}());

/**
 * Alertify init
 */
(function () {

  alertify.defaults = {
    // dialogs defaults
    modal: true,
    basic: false,
    frameless: false,
    movable: true,
    moveBounded: false,
    resizable: true,
    closable: true,
    closableByDimmer: true,
    maximizable: true,
    startMaximized: false,
    pinnable: true,
    pinned: true,
    padding: true,
    overflow: true,
    maintainFocus: true,
    transition: 'fade',
    autoReset: true,
    preventBodyShift: true,

    // notifier defaults
    notifier: {
      // auto-dismiss wait time (in seconds)
      delay: 3,
      // default position
      position: 'top-right'
    },

    // language resources
    glossary: {
      ok: 'OK',
      cancel: Site.messages.button_close,
      send: Site.messages.button_submit,
      title: 'Модалка'
    },

    // theme settings
    theme: {
      ok: 'button button-primary is-simple',
      cancel: 'button button-default'
    }
  };

}());

/**
 * Product
 */
(function () {

  var $product = $('.js-product-wrapper');

  var $galleryThumbs = $('.js-gallery-thumbs');
  var $galleryMain = $('.js-product-gallery-main');
  var $galleryTriggers = $galleryThumbs.find('.js-gallery-trigger');

  if ($galleryThumbs.length) {

    $galleryThumbs.swiper({
      spaceBetween: 10,
      initialSlide: 0,
      centeredSlides: false,
      nextButton: '.js-gallery-thumbs-next',
      prevButton: '.js-gallery-thumbs-prev',
      slidesPerGroup: 4,
      slidesPerView: 4,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      direction: 'vertical',
      loop: false
    });

    $galleryMain.swiper({
      spaceBetween: 10,
      effect: 'slide',
      loop: false,
      centeredSlides: true,
      initialSlide: 0,
      touchRatio: 0.2,
      onSlideChangeEnd: function (e) {
        console.log(e);
        $galleryTriggers.not(':eq(' + e.activeIndex + ')').removeClass('active');
        $galleryTriggers.eq(e.activeIndex).addClass('active');
        $galleryThumbs[0].swiper.slideTo(e.activeIndex);
      }
    });

    $galleryTriggers.on('click', function (e) {
      e.preventDefault();
      var index = $(this).index();
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
      }
      $(this).parent('.swiper-wrapper').find('.swiper-slide').not($(this)).removeClass('active');
      $galleryMain[0].swiper.slideTo(index);
    });

  }

  if ($product.length) {

    var productId = $product.data('product-id');

    var $price = $product.find('.js-product-price');
    var $oldPrice = $product.find('.js-product-old-price');
    var $sku = $product.find('.js-product-sku');
    var $discount = $product.find('.js-label-discount');

    var $variantAvailable = $product.find('.js-variant-available');
    var $variantNotAvailable = $product.find('.js-variant-not-available');
    var $variantPreorder = $product.find('.js-variant-preorder');

    var $counterWrapper = $product.find('.js-counter-wrapper');

    var $productFullInput = $('.js-product-title-input');

    var productTitle = $product.find('.js-product-title').html();

    EventBus.subscribe('update_variant:insales:product', function (data) {
      $('.product-prices.on-page').show();


      var searched = data.first_image.url;
      if (data.first_image.from_variant && !data.action.quantityState.change) {
        $galleryTriggers.each(function(value, key){
          if ($(this).data('link') == searched) {
            $(this).click();
          }
        });
      }

      $productFullInput.val(
        data.title.length ? productTitle + ' (' + data.title + ')' : productTitle
      );

      if (productId == data.product_id) {

        $price.html(Shop.money.format(data.action.price));

        if (data.sku != null) {
          $sku.html('<div class="article-param cell-xl-3">' + Site.messages.labelArticle + '</div><div class="article-value cell-xl-9">' + data.sku + '</div>');
        } else {
          $sku.html('');
        }

        if (data.old_price > data.action.price) {
          $oldPrice.html(Shop.money.format(data.old_price));
          var discount = Math.round((parseFloat(data.old_price) - parseFloat(data.action.price)) / data.old_price * 100);
          $discount.html('<span class="label label-discount">' + discount + '%</span>');
        } else {
          $oldPrice.html('');
          $discount.html('');
        }

        $variantAvailable.hide();
        $variantNotAvailable.hide();
        $variantPreorder.hide();

        if (data.available == true) {

          $variantAvailable.show();
          $counterWrapper.show();

        } else {

          switch (Site.product_status) {

            case 'show':
              $variantAvailable.show();
              $counterWrapper.show();
              break;

            case 'hide':
              $variantNotAvailable.show();
              $counterWrapper.hide();
              break;

            case 'preorder':
              $variantPreorder.show();
              $counterWrapper.hide();
              break;
          }
        }
      }

    });

    if (window.location.hash == "#review_form") {
      $('.tabs-item, .tab-block').removeClass('active');
      $('.tabs-item:last, .tab-block:last').addClass('active');
      $('.js-toggle-review, .js-review-wrapper').addClass('active');
    }

  }

}());

/**
 * Office
 */
// Фикс для чекбокса восстановления пароля
$(function () {

  function toggle_password(value) {
    if (value) {
      $('#change_password_fields').show();
      $('#change_password_fields input').removeAttr("disabled");
    } else {
      $('#change_password_fields').hide();
      $('#change_password_fields input').attr("disabled", "disabled");
    }
    ;
  };
  $("form#contacts :checkbox").click(function () {
    if ($(this).attr("id") == "client_change_password") {
      toggle_password(this.checked);
    }
  });
  toggle_password($('#client_change_password').attr('checked'));
});

// Фикс для поля "Населенный пункт в личном кабинете"
(function () {

  var $addressField = $('#shipping_address_full_locality_name');

  if ($addressField.length) {
    $addressField.parents('.field.fc:first').addClass('old-theme-fix');
  }

}());

$(document).ready(function () {

  /**
   * Object-fit hack
   */
  if (!Modernizr.objectfit) {

    $('.with-object-fit').each(function () {
      var $container = $(this),
        imgUrl = $container.find('img').prop('src');

      if (imgUrl) {
        $container
          .css('backgroundImage', 'url(' + imgUrl + ')')
          .addClass('is-trick');
      }
    });
  }


  /**
   * On-edge elements (NOT BROWSER)
   */
  (function () {

    var resizeTimer = 0;
    edgeElements('.js-edge-calc');

    window.onresize = function (event) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {

        edgeElements('.js-edge-calc');

      }, 250);
    };

    function getOffset(elem) {
      return parseInt(window.getComputedStyle(elem).getPropertyValue('margin-right')) + parseInt(window.getComputedStyle(elem).getPropertyValue('margin-left'));
    }

    function edgeElements(containerClass) {

      var list = [].slice.call(document.querySelectorAll(containerClass));

      list.forEach(function (elem, idx) {

        var items = [].slice.call(elem.children);

        var maxWidth = elem.clientWidth,
          marginWidth = 0,
          summaryWidth = 0,
          sideElements = [],
          previousElem = {};

        if (maxWidth) {

          items.forEach(function (elem, idx) {
            elem.classList.remove('on-edge');
            summaryWidth += elem.clientWidth + getOffset(elem);
            if (summaryWidth > maxWidth) {
              previousElem.classList.add('on-edge');
              sideElements.push(previousElem);
              summaryWidth = elem.clientWidth + getOffset(elem);
            }
            previousElem = elem;
          });
        }

      })
    }

  }());


  /**
   * Promo slider
   */
  (function () {

    var $promoSlider = $('.js-promo-slider');

    if ($promoSlider.length) {

      var sliderDelay = false;

      if (Site.promoSlider.autoPlay) {

        if (Site.promoSlider.autoPlayTime != 0) {
          sliderDelay = Site.promoSlider.autoPlayTime;
        } else {
          sliderDelay = 300;
        }
      }

      $promoSlider.swiper({
        pagination: '.js-promo-slider-pagination',
        autoplay: sliderDelay,
        loop: true,
        effect: 'slide',
        paginationClickable: true,
        autoHeight: true,
        nextButton: '.js-promo-slider-next',
        prevButton: '.js-promo-slider-prev'
      });

    }

  }());


  /**
   * Toggle trigger
   */
  (function () {

    var $toggle = $('.js-toggle');

    $toggle.on('click touchstart', function (e) {
      e.preventDefault();

      var $target;
      var $self = $(this);

      if ($self.data('target') == 'next') {
        $target = $self.next();
      } else if ($self.data('target') == 'parent') {
        $target = $self.parents('.dropdown:first');
      } else {
        $target = $($self.data('target'));
      }

      if ($self.data('group')) {

        var $groupItems = $("[data-group=" + $self.data('group') + "]");

        $groupItems.each(function () {

          var $nonTarget;

          if ($(this).data('target') == 'next') {
            $nonTarget = $(this).next();
          } else if ($(this).data('target') == 'parent') {
            $nonTarget = $(this).parents('.dropdown:first');
          } else {
            $nonTarget = $(this).data('target');
          }

          $nonTarget.not($target).removeClass('toggled');
        });
      }

      if ($('body').not('toggle-opened')) {
        $('body').addClass('toggle-opened');
        $target.find('.input-field:first').focus();
      }

      $target.toggleClass('toggled');

    });

    $(document).on('click touchstart', '.toggle-opened', function (e) {
      if (!$(e.target).closest(".dropdown").length) {
        $('.toggled').removeClass('toggled');
        $(this).removeClass('toggle-opened');
      }
    });

  }());


  /**
   * Collapse
   */
  (function () {

    var $toggle = $('.collapse-toggle');

    $toggle.on('click', function (e) {
      e.preventDefault();

      var $self = $(this);
      var $target;

      if ($self.data('target')) {
        $target = $($self.data('target'));
        var $targetToggle = $target.find('.collapse-toggle');
      } else {
        $target = $($self.parents('.collapse:first'));
      }

      console.log($target);

      if ($targetToggle) {
        $targetToggle.toggleClass('is-active')
      }

      $self.toggleClass('is-active');
      $target.toggleClass('is-opened');
    });

  }());


  /**
   * Filter inputs control
   */
  (function () {

    var $totalCounter = $('.js-filter-total-counter');

    $('.js-filter-checkbox').each(function (e) {

      filterControl($(this));

    });

    $('.js-filter-trigger').on('change', function (e) {

      $(this).parents('form:first').submit();

    });

    $('.js-filter-field').change(function (e) {
      e.preventDefault();
      var $parent = $(this).parents('.filter:first');
      filterControl($parent);
    });

    $('.js-filter-price-clear').click(function (e) {
      e.preventDefault();
      var $rangeInputs = $(this).parents('.filter:first').find('.js-input');
      $rangeInputs.prop('disabled', true);
      $(this).parents('form:first').submit();
    });

    $('.js-filter-clear').click(function (e) {

      e.preventDefault();

      var $parent = $(this).parents('.filter:first');
      var $filterCount = $parent.find('.js-filter-count:first');
      var $checkedInputs = $parent.find('.js-filter-field:checked');

      $parent.removeClass('toggled active');
      $checkedInputs.prop('checked', false);
      $filterCount.html('');
      $(this).parents('form:first').submit();

    });

    function filterControl($parent) {

      $totalCounter.html($('.js-filter-field:checked').length);

      var $filterCount = $parent.find('.js-filter-count:first');
      var $checkedInputs = $parent.find('.js-filter-field:checked');

      if ($checkedInputs.length > 0) {
        $filterCount.html($checkedInputs.length);
        $parent.addClass('active');
      } else {
        $filterCount.html('');
        $parent.removeClass('active');
      }
    }

  }());


  /**
   * Perfect scrollbar init
   */
  (function () {

    $('.js-scrollable').perfectScrollbar({
      suppressScrollX: true
    });

  }());


  /**
   * Simple tabs
   */
  (function () {

    $(document).on('click', '[data-toggle="tabs"]', function (e) {
      e.preventDefault();
      var $this = $(this);
      var $target = $($this.attr('href'));
      $target.parent().children('.tab-block').removeClass('active');
      $this.parents('.tabs-menu').children('.tabs-item').removeClass('active');
      $this.parent().addClass('active');
      $target.addClass('active');
    });

  })();


  /**
   * News feed
   */
  (function () {

    var newsFeed = new Swiper('.js-news-feed', {
      pagination: '.js-news-feed-pagination',
      autoplay: 5000,
      uniqueNavElements: true,
      slidesPerView: 2,
      loop: false,
      simulateTouch: false,
      paginationClickable: true,
      autoHeight: true,
      breakpoints: {
        980: {
          slidesPerView: 1,
          spaceBetweenSlides: 10
        }
      }
    });

  }());

  /**
   * Left toolbar
   */
  (function () {

    $('.left-toolbar-trigger').on('click', function (e) {
      e.preventDefault();

      $('.left-toolbar').toggleClass('active');
      $('body').toggleClass('toolbar-opened');

    });

    $('.left-toolbar-overlay').on('click', function (e) {
      e.preventDefault();
      $('.left-toolbar').toggleClass('active');
      $('body').toggleClass('toolbar-opened');
    });

  }());

  /**
   * Range slider
   */
  (function () {

    var $rangeSliders = $('.js-range-slider-wrapper');

    $rangeSliders.each(function () {

      $wrapper = $(this);

      var $slider = $wrapper.find('.js-range-slider');
      var $inputFrom = $wrapper.find('.js-input-from');
      var $inputTo = $wrapper.find('.js-input-to');
      var $labelFrom = $wrapper.find('.js-label-from');
      var $labelTo = $wrapper.find('.js-label-to');

      $slider.ionRangeSlider({
        type: "double",
        min: 0,
        max: 1000,
        onChange: function (data) {
          $inputFrom.val(data.from);
          $inputTo.val(data.to);
          $labelFrom.html(data.from);
          $labelTo.html(data.to);
        },
        onFinish: function (data) {

          data.from > data.min ?
            $inputFrom.prop('disabled', false).attr('disabled', false)
            : $inputFrom.prop('disabled', true).attr('disabled', true);

          data.to < data.max ?
            $inputTo.prop('disabled', false).attr('disabled', false)
            : $inputTo.prop('disabled', true).attr('disabled', true);
        }
      });

      var $ionSlider = $slider.data("ionRangeSlider");

      $inputFrom.change(function () {
        $ionSlider.update({
          from: this.value
        });
      });

      $inputTo.change(function () {
        $ionSlider.update({
          to: this.value
        });
      });

    });

  }());


  /**
   * Lightbox gallery by magnific
   */
  (function () {
    $('.popup-gallery').magnificPopup({
      type: 'image',
      tLoading: 'Загрузка #%curr%...',
      mainClass: 'mfp-img-mobile',
      removalDelay: 100,
      midClick: true,
      callbacks: {
        beforeOpen: function () {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
          this.st.mainClass = this.st.el.attr('data-effect');
        }
      },
      titleSrc: 'title',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: Site.messages.imageNotUploaded,
        titleSrc: function (item) {
          return item.el.attr('title');
        }
      }
    });
  }());


  /**
   * Phone mask
   */
  (function () {
    $('.phone-mask').inputmask('+9(999)999-99-99');
  }());


  /**
   * Preorder modal
   */
  (function () {

    $(".js-preorder-open").magnificPopup({
      removalDelay: 100, //delay removal by X to allow out-animation
      midClick: true
    });

  }());


  /**
   * Preorder form
   */
  (function () {
    var $preorderForm = $('.js-preorder-form');

    $preorderForm.validate({
      errorClass: 'is-error',
      rules: {
        'name': {
          required: true,
          minlength: 3
        },
        'phone': {
          required: true,
          minlength: 13
        }
      },
      submitHandler: function (form) {

        Shop.sendMessage(
          $preorderForm.serializeObject()
          )
          .done(function (response) {
            alertify.success(response.notice);
            $preorderForm.trigger('reset');
            $.magnificPopup.close();
          })
          .fail(function (response) {
            $.each(response.errors, function (i, val) {
              alertify.error(val[0]);
            });
          });
      }
    });
  }());

  /**
  * FEEDBACK WIDGET
  */
  // Проверяет на кол-во отправленных заапросов звонка, ограничивает их
  (function(){

    if (Site.template != 'index') {
      return;
    }

    $(document).on('submit','.js-widget-feedback', function(event) {
      var $widgetFeedback = $(this);
      var msg = $widgetFeedback.serializeObject();
      var val_send;
      var max_send =  $(this).attr('data-max-send');

      event.preventDefault();
      sessionStorage.getItem('send_success') ? val_send  = sessionStorage.getItem('send_success') : val_send = 0;

      if (max_send <= val_send) {
        maxSendError();
        $(this).find('.button-widget-feedback').attr('disabled','disabled').addClass('is-secondary');
        return false;
      }
      Shop.sendMessage(msg)
      .done(function (response) {
        alertify.success(response.notice);
        $widgetFeedback.trigger('reset');
        val_send++;
        sessionStorage.setItem('send_success', val_send);
      })
      .fail(function (response) {
        $.each(response.errors, function (i, val) {
          alertify.error(val[0]);
        });
      });
    })

  }());

  /**
   * Cart
   */
  (function () {

    var $shopcartAmount = $('.js-shopcart-amount');
    var $shopcartSumm = $('.js-shopcart-summ');
    var $shopcartDiscountSumm = $('.js-discount-summ');
    var $shopcartTotalSumm = $('.js-shopcart-total-summ');
    var $shopcartTotalPrice = $('.js-total-price');
    var $discountComment = $('#js-discount-comment');
    var $discountNotices = $('#js-discount-notices');

    EventBus.subscribe('add_items:insales:cart', function (data) {
      alertify.success(Site.messages.productAddedToCart);
    });

    EventBus.subscribe('delete_items:insales:cart', function (data) {

      var itemId = data.action.items[0];

      $('[data-item-id=' + itemId + ']').slideUp('fast', function () {
        $(this).remove();
      });

      alertify.success(Site.messages.productRemovedFromCart);

      if (data.items_count == 0) {
        $('.shopping-cart.container').html('<div class="notice notice-info text-center">' + Site.messages.cartIsEmpty + '</div>');
        alertify.message('Корзина очищена');
      }

    });

    EventBus.subscribe('update_items:insales:cart', function (data) {
      if (data.discounts && data.discounts.length) {
        $discountComment.html('<div class="summ-caption discount-comment">Сумма заказа: <span class="js-shopcart-summ"> ' + Shop.money.format(data.items_price) + ' </span> <br>"' + data.discounts[0].description + '": <span class="js-discount-summ"> ' + Shop.money.format(data.discounts[0].amount) + ' </span> </div>');
      } else {
        $discountComment.html('');
      }

      $shopcartAmount.html(Math.round((data.items_count) * 1000) / 1000);

      if (data.items_count > 0) {
        if (!$shopcartAmount.hasClass('active')) {
          $shopcartAmount.addClass('active');
        }
      } else {
        if ($shopcartAmount.hasClass('active')) {
          $shopcartAmount.removeClass('active');
        }
      }

      $shopcartSumm.html(Shop.money.format(data.items_price));
      $shopcartTotalSumm.html(Shop.money.format(data.total_price));
      $shopcartTotalPrice.html(Math.floor(data.total_price));
      if (data.discounts.length > 0) {
        $shopcartDiscountSumm.html(Shop.money.format(data.discounts[0].amount));
      }
    });

    EventBus.subscribe('update_variant:insales:item', function (data) {

      var $item = $(data.action.product);
      var $itemSumm = $item.find('.js-item-total-price');
      var $itemPrice = $item.find('.js-item-price');

      $itemPrice.html(Shop.money.format(data.action.price));
      $itemSumm.html(Shop.money.format(data.action.price * data.action.quantity.current));
    });

  }());


  /**
   * Compare
   */
  (function () {

    var $compareCount = $('.js-compare-amount');
    var $compareTable = $('.js-compare-table');

    var compareWrapper = '#js-compare-wrapper';
    var compareInner = '#js-compare-inner';
    var compareUrl = document.location.href;

    var compareViewToggler = '.js-same-toggle';
    var sameRows = '.same-row';

    if (!$.cookie('compare-view')) {
      $(sameRows).hide();
      $(compareViewToggler).addClass('active');
    }

    $(document).on('click', compareViewToggler, function (e) {
      e.preventDefault();

      $(compareViewToggler).toggleClass('active');
      $(sameRows).toggle();

      if (!$(this).hasClass('active')) {
        $.cookie("compare-view", 'true');
      } else {
        $.removeCookie("compare-view");
      }

    });

    EventBus.subscribe('init:insales:compares', function (data) {
      for (i = 0; i < data.products.length; i++) {
        $('[data-compare="' + data.products[i].id + '"] .compare-add').addClass('active');
      }
    });

    EventBus.subscribe('add_item:insales:compares', function (data) {
      $(data.action.button[0]).addClass('active');
      alertify.success(Site.messages.productAddedToComparison);
    });

    EventBus.subscribe('remove_item:insales:compares', function (data) {

      if (Site.template != 'compare') {
        $(data.action.button[0]).prev('.compare-add').removeClass('active');
      } else {
        $('[data-compared-id=' + data.action.item + ']').fadeOut(300, function () {
          $(this).remove();
        });
      }

      alertify.message(Site.messages.productRemovedFromComparison);

    });

    EventBus.subscribe('overload:insales:compares', function (data) {
      alertify.warning(Site.messages.maximumNumberOfComparable);
    });

    EventBus.subscribe('update_items:insales:compares', function (data) {

      if (data.products.length > 0) {
        $compareCount.html(data.products.length);
        $compareCount.addClass('active');
      } else {
        $compareCount.removeClass('active');
      }
    });

    EventBus.subscribe('update_items:insales:compares', function (data) {
      if (Site.template == 'compare') {
        $(compareWrapper).load(compareWrapper + ' ' + compareInner, function () {
          if (!$.cookie('compare-view')) {
            $(sameRows).hide();
            $(compareViewToggler).addClass('active');
          }
        });
      }

    });

  }());

});

// Jquery smartresize
(function ($, sr) {

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this, args = arguments;

      function delayed() {
        if (!execAsap)
          func.apply(obj, args);
        timeout = null;
      };

      if (timeout)
        clearTimeout(timeout);
      else if (execAsap)
        func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
  }
  // smartresize
  jQuery.fn[sr] = function (fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };

})(jQuery, 'smartresize');

// Collection menu on mobile
(function () {

  var $menu = $('.collection-menu-horizontal');
  var $dropdowns = $menu.find('.dropdown');

  if (device.tablet() || device.mobile()) {
    $dropdowns.addClass('on-mobile').append('<button type="button" class="dropdown-button"><i class="ion ion-ios-arrow-right"></i></button>');
  }

  $(document).on('touchstart', '.dropdown-opened', function (e) {

    if (!$(e.target).closest('.dropdown.on-mobile').length) {

      $('body').removeClass('dropdown-opened');
      $('.dropdown.on-mobile').removeClass('is-opened');
    }
  });

  var pressTimer;

  $(document).on('touchstart', '.dropdown-button', function (e) {

    var $body = $('body');
    var $self = $(this).parents('.dropdown:first');

    $self.toggleClass('is-opened');

    if (!$body.hasClass('dropdown-opened')) {
      $body.addClass('dropdown-opened');
    }
  });

}());
