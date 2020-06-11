/*  ---------------------------------------------------
    Template Name: Ogani
    Description:  Ogani eCommerce  HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function (Rs.) {

    /*------------------
        Preloader
    --------------------*/
    Rs.(window).on('load', function () {
        Rs.(".loader").fadeOut();
        Rs.("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        Rs.('.featured__controls li').on('click', function () {
            Rs.('.featured__controls li').removeClass('active');
            Rs.(this).addClass('active');
        });
        if (Rs.('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    Rs.('.set-bg').each(function () {
        var bg = Rs.(this).data('setbg');
        Rs.(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    Rs.(".humberger__open").on('click', function () {
        Rs.(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        Rs.(".humberger__menu__overlay").addClass("active");
        Rs.("body").addClass("over_hid");
    });

    Rs.(".humberger__menu__overlay").on('click', function () {
        Rs.(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        Rs.(".humberger__menu__overlay").removeClass("active");
        Rs.("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    Rs.(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*-----------------------
        Categories Slider
    ------------------------*/
    Rs.(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });


    Rs.('.hero__categories__all').on('click', function(){
        Rs.('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    Rs.(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    Rs.(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    Rs.(".product__details__pic__slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = Rs.(".price-range"),
        minamount = Rs.("#minamount"),
        maxamount = Rs.("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function (event, ui) {
            minamount.val('Rs.' + ui.values[0]);
            maxamount.val('Rs.' + ui.values[1]);
        }
    });
    minamount.val('Rs.' + rangeSlider.slider("values", 0));
    maxamount.val('Rs.' + rangeSlider.slider("values", 1));

    /*--------------------------
        Select
    ----------------------------*/
    Rs.("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    Rs.('.product__details__pic__slider img').on('click', function () {

        var imgurl = Rs.(this).data('imgbigurl');
        var bigImg = Rs.('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            Rs.('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = Rs.('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var Rs.button = Rs.(this);
        var oldValue = Rs.button.parent().find('input').val();
        if (Rs.button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        Rs.button.parent().find('input').val(newVal);
    });

})(jQuery);