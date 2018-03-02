
function copySrc (self) {
  var src = $(self).attr('data-image-large');
  var href = $(self).attr('href');
  var title = $(self).attr('title');
  var count = $(self).attr('data-gallery-count');

  $(self).parent()
    .siblings()
    .find('a')
    .removeClass('is-checked');
  $(self).addClass('is-checked');

  $('#gallery').attr({
    href: href,
    title: title,
    'data-gallery-count': count
  })
    .find('img')
    .attr({
      src: src,
      alt: title
    });
}

(function () {
  if (Site.template !== 'product') {
    return;
  }

  var _galleryThumbs = {
    slidesPerView: 3,
    spaceBetween: 16,
    autoHeight: true,
    lazyLoading: true,
    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 3 }
    }
  };

  var _productSliderOptions = {
    slidesPerView: 4,
    spaceBetween: 16,
    breakpoints: {
      380: { slidesPerView: 1 },
      480: { slidesPerView: 2 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  };

  var SimillarSwiper = new Swiper('[data-slider="similar-products"]', _productSliderOptions);
  var RelatedSwiper = new Swiper('[data-slider="related-products"]', _productSliderOptions);
  var BundleSwiper = new Swiper('[data-slider="bundle-products"]', _productSliderOptions);

  if ($('[data-slider="gallery-thumbs"]').length) {
    var MainSwiper = new Swiper('[data-slider="gallery-thumbs"]', _galleryThumbs);
  }

  var MobileSwiper = new Swiper('[data-slider="gallery-thumbs-mobile"]', _galleryThumbs);

  EventBus.subscribe('update_variant:insales:product', function (variant) {
    if (!variant.first_image.from_variant) {
      return;
    }

    if (variant.action.quantityState.change) {
      return;
    }

    var currentSlideNumber = $('[data-slider="gallery-thumbs-mobile"]')
      .find('[href="' + variant.first_image.original_url + '"]')
      .attr('data-slide-number');

    var currentSlide = $('[data-slider="gallery-thumbs"]')
      .find('[href="' + variant.first_image.original_url + '"]');

    MobileSwiper.slideTo(currentSlideNumber - 1);

    if (MainSwiper) {
      MainSwiper.slideTo(currentSlideNumber - 1);
    }
    copySrc(currentSlide);
  });
})();

// Copy src select image in main-image
(function () {
  if (Site.template !== 'product') {
    return;
  }

  $(document).on('click', '.js-copy-src', function (event) {
    event.preventDefault();
    copySrc(this);
    var product_id = $('.product-control').attr('data-compare');
    var select_variant;
    var href = $(this).attr('href');

    Products.get(product_id)
      .done(function (product) {
        select_variant = _.find(product.variants, function (variant) {
          return (href == variant.first_image.original_url);
        });

        if (!select_variant) {
          return;
        }
        Products.getInstance($('.product-form'))
          .done(function (_product) {
            return _product.variants.setVariant(select_variant.id);
          });
      });
  });

  // Find main-image in fancybox gallery, and emulate click on fancybox
  $(document).on('click', '#gallery', function (event) {
    event.preventDefault();

    var count = $('#gallery').attr('data-gallery-count');

    $('.mobile-wrapper').find('[data-slide-number="' + count + '"]')
      .trigger('click');

    return false;
  });
})();

EventBus.subscribe('update_variant:insales:product', function (variant) {
  if (!variant.action.product.is('[data-main-form]')) {
    return;
  }
  $('.product-prices.on-page').show();

  var $product = variant.action.product;
  var $buttonBuy = $('.js-variant-shown');
  var $buttonHidden = $('.js-variant-hidden');
  var $quickCheckout = $product.find('[data-quick-checkout]');
  var $buttonPreorder = $('.js-variant-preorder');
  var $priceCurrent = $product.find('.js-product-price');
  var $priceOld = $product.find('.js-product-old-price');
  var $skuWrapper = $product.find('.js-product-sku-wrapper');
  var $sku = $product.find('.js-product-sku');
  var $quantity = $product.find('.js-variant-counter');

  var notAvailable = InsalesThemeSettings.product_not_available;

  window.__savedVariant = variant;
  $buttonBuy.hide();
  $quantity.hide();
  $buttonHidden.hide();
  $buttonPreorder.hide();
  $quickCheckout
    .hide()
    .prop('disabled', true);

  $priceCurrent
    .html(Shop.money.format(variant.action.price));
  $priceOld
    .html(Shop.money.format((_.toFinite(variant.old_price) > _.toFinite(variant.price)) ? variant.old_price : null));

  if (variant.sku) {
    $skuWrapper.show();
    $sku.text(variant.sku);
  }
  else {
    $skuWrapper.hide();
  }

  if (variant.available) {
    $buttonBuy.show();
    $quantity.show();
    $quickCheckout
      .show()
      .prop('disabled', false);
  }
  else {
    switch (notAvailable) {
      case 'preorder':
        $buttonPreorder.show();
        $quickCheckout.hide();
        break;
      case 'hidden':
        $buttonHidden.show();
        $quickCheckout.hide();
        $quantity.hide();
        break;
      case 'shown':
        $buttonBuy.show();
        $quantity.show();
        $quickCheckout
          .show()
          .prop('disabled', false);
        break;
    }
  }
});

(function () {
  $(document).on('click', '.js-variant-preorder', function (event) {
    event.preventDefault();

    var _variant = window.__savedVariant;
    var preorderForm = {
      fields: [
        {
          title: Site.messages.field_email,
          name: 'from',
          required: true,
        },
        {
          title: Site.messages.field_name,
          name: 'name',
          required: true,
        },
        {
          type: 'hidden',
          name: 'preorder_caption',
          value: Site.messages.preorder
        },
        {
          type: 'hidden',
          name: 'subject',
          value: Site.messages.preorder
        },
        {
          title: Site.messages.label_product,
          name: 'product',
          type: 'hidden',
          value: _variant.action.productJSON.title,
        },
        {
          title: 'Вариант',
          name: 'variant',
          type: 'hidden',
          value: _variant.title,
        },
      ],
      combineOrder: { content: { fields: [ 'preorder_caption', 'product', 'variant' ] } }
    };

    alertify.modal({ formDefination: preorderForm }).set('title', Site.messages.preorder);
  });
})();

EventBus.subscribe('update_variant:insales:product', function (data) {
  var _discountElement = $('[data-labels-id="' + data.action.productJSON.id + '"]').find('.js-label-discount');
  var _discount = null;

  if (!data.action.product.is('[data-main-form]')) {
    return;
  }

  if (data.old_price && data.old_price > data.price) {
    _discount = (data.price * -100) / data.old_price + 100;
    _discountElement
      .text(_.round(_discount, 0) + '%')
      .removeClass('hidden');
  }
  else {
    _discountElement.addClass('hidden');
  }
});
