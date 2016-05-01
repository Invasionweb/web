/*
 |--------------------------------------------------------------------------
 | FUNCTIONS
 |--------------------------------------------------------------------------
 */
function debugX(a) {
    console.log(a);
}
//AJAX REQUESTS
$.requests = [];
$.requests.abortAll = function() {
    $(this).each(function(idx, jqReq) {
        jqReq.abort();
    });
    $.requests.length = 0;
};
//SEND AJAX
function sendAjaxUrl(url, selector, options) {
    $.requests.abortAll();
    var optionsDefault = {
        type: 'GET',
        url: url,
        //dataType: "json",
        beforeSend: function(jqReq) {
            $.requests.push(jqReq);
            if (selector)
                $(selector).trigger("sendAjaxUrlBefore");
        },
        error: function(e) {
            if (selector)
                $(selector).trigger("sendAjaxUrlError");
        },
        success: function(response) {
            if (selector)
                $(selector).trigger("sendAjaxUrlSuccess", [response]);
        },
        complete: function(jqReq) {
            var index = $.requests.indexOf(jqReq);
            //window.location.href = '#rest:' + form.serialize();
            if (index > -1) {
                $.requests.splice(index, 1);
            }
            if (selector)
                $(selector).trigger("sendAjaxUrlComplete");
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            if (selector)
                $(selector).trigger("sendAjaxUrlProgress", [percentVal]);
        }
    };
    $.extend(optionsDefault, options);
    $(this).ajaxSubmit(optionsDefault);
}
/* ANALYTICS */
function gaSSDSLoad(acct) {
    "use strict";
    var gaJsHost = (("https:" === document.location.protocol) ? "https://ssl." : "http://www."),
            pageTracker,
            s;
    s = document.createElement('script');
    s.src = gaJsHost + 'google-analytics.com/ga.js';
    s.type = 'text/javascript';
    s.onloadDone = false;
    function init() {
        pageTracker = _gat._getTracker(acct);
        pageTracker._trackPageview();
    }
    s.onload = function() {
        s.onloadDone = true;
        init();
    };
    s.onreadystatechange = function() {
        if (('loaded' === s.readyState || 'complete' === s.readyState) && !s.onloadDone) {
            s.onloadDone = true;
            init();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}
window.onload = function() {
    "use strict";
    //gaSSDSLoad("");
}; //load after page onload


/* CAROUSEL */
function loadCarousel() {
    $('.carousel:not(".loadedCarousel")').carousel().addClass('loadedCarousel');
    //Enable swiping...
    $(".loadedCarousel .carousel-inner").swipe({
        //Generic swipe handler for all directions
        swipeLeft: function(event, direction, distance, duration, fingerCount) {
            debugX(event);
            $(this).parent().carousel('next');
        },
        swipeRight: function() {
            $(this).parent().carousel('prev');
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold: 0
    });

}
loadCarousel();
/* LIGHTBOX */
function loadLightBox() {
    $('*[data-toggle="lightbox"]:not(".loadedLightBox")')
            .addClass('loadedLightBox')
            .click(function(e) {
                e.preventDefault();
                $(this).ekkoLightbox({
                    left_arrow_class: '.fa .fa-angle-left',
                    right_arrow_class: '.fa .fa-angle-right'
                });

            });
}
loadLightBox();
/*
 |--------------------------------------------------------------------------
 | MENU MOBILE STYLE
 |--------------------------------------------------------------------------
 */
$("#main-menu").headroom({
    // vertical offset in px before element is first unpinned
    offset: 120,
    // scroll tolerance in px before state changes
    //tolerance: 0,
    // or you can specify tolerance individually for up/down scroll
    tolerance: {
        up: 20,
        down: 120
    }
});
/*
 |--------------------------------------------------------------------------
 | SHARRRE
 |--------------------------------------------------------------------------
 */
function loadSharrre() {
    $('.shareme').not('.loadedSharrre').addClass('loadedSharrre').sharrre({
        share: {
            googlePlus: true,
            facebook: true,
            twitter: true
        },
        template:
                '<ul class="social-icons icon-flat icon-animated list-unstyled">' +
                '<li><a href="#" class="facebook"><i class="fa fa-facebook"></i></a></li>' +
                '<li><a href="#" class="twitter"><i class="fa fa-twitter"></i></a></li>' +
                '<li><a href="#" class="googleplus"><i class="fa fa-google-plus"></i></a></li>' +
                '</ul>',
        enableHover: false,
        enableTracking: false,
        enableCounter: true,
        urlCurl: sharreUrl,
        render: function(api, opt) {
            $(api.element).on('click', '.twitter', function() {
                api.openPopup('twitter');
            });
            $(api.element).on('click', '.facebook', function() {
                api.openPopup('facebook');
            });
            $(api.element).on('click', '.googleplus', function() {
                api.openPopup('googlePlus');
            });
        }
    });
}
loadSharrre();
/*
 |--------------------------------------------------------------------------
 | Progess Bar
 |--------------------------------------------------------------------------
 */
//$("body").on("sendAjaxUrlBefore", function() {
$(document).ajaxStart(function() {
    if ($(".loading").length === 0) {
        $("body").append('<div class="loading"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div></div>');
    }
    $(".loading .progress-bar")
            //State ini
            .removeClass('progress-bar-danger')
            .removeClass('progress-bar-success')
            .attr({'aria-valuenow': '0'})
            .css("width", "0%")
            //Active
            .stop().delay(300).attr({'aria-valuenow': '50'}).animate({"width": "50%"});
    $(".loading").slideDown();

});
//$("body").on("sendAjaxUrlComplete", function() {
$(document).ajaxComplete(function() {
    $(".loading .progress-bar").stop().attr({'aria-valuenow': '100'}).animate({"width": "100%"}, function() {
        $('.loading').delay(800).slideUp(600, function() {
        });
    });
});
//$("body").on("sendAjaxUrlError", function() {
$(document).ajaxError(function() {
    $(".loading .progress-bar").addClass('progress-bar-danger');
});
$(document).ajaxSuccess(function(e, response) {
    if (response.responseText === 'ok')
        $(".loading .progress-bar").addClass('progress-bar-success');
});

/*
 |--------------------------------------------------------------------------
 | PAGE SLIDE
 |--------------------------------------------------------------------------
 */
function loadPageSlide() {
    console.log('loadPage!');
    $(".portfolioSheet:not('.loadedPage')").addClass('loadedPage').pageslide({
        direction: "left",
        modal: true,
        iframe: false,
        speed: "300"
    });
}
loadPageSlide();
//FIXES - LOADER
$('#pageslide').bind("loadPage", function() {
    loadSharrre();
    loadLightBox();
    loadCarousel();
    //FIX CONTROL BUTTONS
    $(this).find('.carousel-control').click(function(e) {
        e.preventDefault();
        var carousel = '#' + $(this).parent('.carousel').attr('id');
        if ($(this).hasClass('left')) {
            $(carousel).carousel('prev');
        } else {
            $(carousel).carousel('next');

        }
    });
    //setTimeout(function(){loadPageSlide();}, 1000);
    loadPageSlide();

});

/*
 |--------------------------------------------------------------------------
 | ISOTOPE masonry
 |--------------------------------------------------------------------------
 */
var $container = $('.isotopeWrapper');
//launch ISOTOPE
isotopeReload();
function isotopeReload() {
    $container.isotope({itemSelector: '.isotopeItem'});
}
function isotopeFilterSelector(conteiner, selector) {
    conteiner.isotope({
        filter: selector,
        animationOptions: {
            duration: 1000,
            easing: 'easeOutQuart',
            queue: false
        }
    });
}
$(window).smartresize(function() {
    isotopeReload();
});
/*
 |--------------------------------------------------------------------------
 | EVENTS TRIGGER AFTER ALL IMAGES ARE LOADED
 |--------------------------------------------------------------------------
 */
$(window).load(function() {
    "use strict";

//END WINDOW LOAD
});