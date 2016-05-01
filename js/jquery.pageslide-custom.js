/*
 * jQuery pageSlide
 * Version 2.0
 * http://srobbin.com/jquery-pageslide/
 * jQuery Javascript plugin which slides a webpage over to reveal an additional interaction pane.
 * Copyright (c) 2011 Scott Robbin (srobbin.com)
 * Dual licensed under the MIT and GPL licenses.
 * 
 * Modified by InvasionWeb.com 2014
 */
(function($) {
    // Convenience vars for accessing elements
    var
            History = window.History, //historial
            MainHistoryUrl = window.location.href, //historial
            MainHistoryTitle = document.title, //historial
            $selector = '#pageslide',
            $body = $('body'),
            $pageslide = $($selector),
            _sliding = false, // Mutex to assist closing only once
            _lastCaller;        // Used to keep track of last element to trigger pageslide
    // If the pageslide element doesn't exist, create it
    if ($pageslide.length === 0) {
        $pageslide = $('<div />').attr('id', 'pageslide').css('display', 'none').appendTo($('body'));
    }
    /*
     * Private methods 
     */
    function _load(url, useIframe) {
        if (url.indexOf("#") === 0) {// Are we loading an element from the page or a URL?
            $(url).clone(true).appendTo($pageslide.empty()).show();// Load a page element
        } else {
            if (useIframe) {// Load a URL. Into an iframe?
                var iframe = $("<iframe />").attr({src: url, frameborder: 0, hspace: 0}).css({width: "100%", height: "100%"});
                $pageslide.html(iframe);
            } else {
                $pageslide.html('', $selector);
                sendAjaxUrl(url, $selector);
                $($selector).one("sendAjaxUrlSuccess", function(e, response) {
                    $pageslide.html(response);
                    $($selector).trigger("loadPage");
                });
            }
        }
    }

    // Function that controls opening of the pageslide
    function _start(speed) {
        var slideWidth = $pageslide.outerWidth(true),
                bodyAnimateIn = {},
                slideAnimateIn = {};
        if ($pageslide.is(':visible') || _sliding)// If the slide is open or opening, just ignore the call
            return;
        _sliding = true;
        $pageslide.css({left: 'auto', right: '-' + slideWidth + 'px'});
        bodyAnimateIn['margin-left'] = '-=' + slideWidth;
        slideAnimateIn['right'] = '+=' + slideWidth;
        $($selector).one("sendAjaxUrlComplete", function() {
            $body.animate(bodyAnimateIn, speed);// Animate the slide, and attach this slide's settings to the element
            $pageslide.show().animate(slideAnimateIn, speed, function() {
                _sliding = false;
            });
        });
    }
    /*
     * Declaration 
     */
    $.fn.pageslide = function(options) {
        var $elements = this;
        // On click
        $elements.on('click', function(e) {
            // Prevent the default behavior and stop propagation
            e.preventDefault();
            e.stopPropagation();
            var $self = $(this),
                    settings = $.extend({href: $self.attr('href')}, options);
            //History State! & ICON LOADER
            //window.history.pushState('forward', null, window.location.href);
            //History.pushState(null, $(this).attr('title'), $(this).attr('href'));
            history.pushState(null, $(this).attr('title'), $(this).attr('href'));


            //console.log('pushState '+window.location.href);
            $self.find('span.fa').removeClass('off').addClass('fa-spinner fa-spin');

            if ($pageslide.is(':visible') && $self[0] === _lastCaller) {
                // If we clicked the same element twice, toggle closed
                $.pageslide.close();
            } else {
                // Open
                $.pageslide(settings);
                // Record the last element to trigger pageslide
                _lastCaller = $self[0];
            }
            $('html, body').css('overflow', 'hidden');
            $($selector).css('overflow', 'auto');
            //ICONOS DE CARGA!!
            $($selector).one("sendAjaxUrlComplete", function() {
                $self.parent().find('span.fa').removeClass('fa-spinner fa-spin').addClass('off');
            });
        });
    };
    /*
     * Default settings 
     */
    $.fn.pageslide.defaults = {
        speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
        modal: false, // If set to true, you must explicitly close pageslide using $.pageslide.close();
        iframe: true, // By default, linked pages are loaded into an iframe. Set this to false if you don't want an iframe.
        href: null        // Override the source of the content. Optional in most cases, but required when opening pageslide programmatically.
    };

    /*
     * Public methods 
     */
    // Open the pageslide
    $.pageslide = function(options) {
        var settings = $.extend({}, $.fn.pageslide.defaults, options);// Extend the settings with those the user has provided
        _load(settings.href, settings.iframe);
        if ($pageslide.is(':hidden')) {
            _start(settings.speed);
        }
        $pageslide.data(settings);
    };
    // Close the pageslide
    $.pageslide.close = function(callback) {
        //History.pushState(null, MainHistoryTitle, MainHistoryUrl);
        history.pushState(null, MainHistoryTitle, MainHistoryUrl);

        //History.back();
        var $pageslide = $($selector),
                slideWidth = $pageslide.outerWidth(true) - 17,
                speed = $pageslide.data('speed'),
                bodyAnimateIn = {},
                slideAnimateIn = {}

        // If the slide isn't open, just ignore the call
        if ($pageslide.is(':hidden') || _sliding)
            return;
        _sliding = true;
        bodyAnimateIn['margin-left'] = '=' + 0;
        slideAnimateIn['right'] = '-=' + slideWidth;
        $pageslide.animate(slideAnimateIn, speed);
        $body.animate({'margin-left': 0}, speed, function() {
            $pageslide.hide();
            _sliding = false;
            if (typeof callback !== 'undefined') {
                callback();
            }
        });
        $('html, body').css('overflow', 'visible');
    };



    /* Events */
    // Don't let clicks to the pageslide close the window
    $pageslide.click(function(e) {
        e.stopPropagation();
    });
    // Close the pageslide if the document is clicked or the users presses the ESC key, unless the pageslide is modal
    $(document).bind('click keyup', function(e) {
        // If this is a keyup event, let's see if it's an ESC key
        if (e.type === "keyup" && e.keyCode === 27) {
            $.pageslide.close();
        }
        // Make sure it's visible, and we're not modal	    
        if ($pageslide.is(':visible') && !$pageslide.data('modal')) {
            $.pageslide.close();
        }
    });
    //NEW
//    window.History.Adapter.bind(window, 'statechange', function() {
//        var State = window.History.getState();
//        window.History.log(State.data, State.title, State.url);
//        console.log('hi=');
//        return false;
//    });



    //BACK HISTORY

// Bind to StateChange Event
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function(e) {
            $.pageslide.close();
            return false;

        });
    }
    ;

//    History.Adapter.bind(window, 'popstate', function() {
//        $.pageslide.close();
//        return false;
//
//    });

//    if (window.history && window.history.pushState) {
//        $(window).on('popstate', function() {
//            console.log('popstate!');
//            $.pageslide.close();
//            return false;
//        });
//
//    }
})(jQuery);