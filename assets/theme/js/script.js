(function($) {
        var isBuilder = $('html').hasClass('is-builder');

        $.extend($.easing, {
            easeInOutCubic: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        });

        $.fn.outerFind = function(selector) {
            return this.find(selector).addBack(selector);
        };

        $.fn.footerReveal = function() {
            var $this = $(this);
            var $prev = $this.prev();
            var $win = $(window);
            var isIE = !!document.documentMode;

            function initReveal() {
                if (!isIE && $this.outerHeight() <= $win.outerHeight()) {
                    $this.css({
                        'z-index': -999,
                        position: 'fixed',
                        bottom: 0
                    });

                    $this.css({
                        'width': $prev.outerWidth()
                    });

                    $prev.css({
                        'margin-bottom': $this.outerHeight()
                    });
                } else {
                    $this.css({
                        'z-index': '',
                        position: '',
                        bottom: ''
                    });

                    $this.css({
                        'width': ''
                    });

                    $prev.css({
                        'margin-bottom': ''
                    });
                }
            }

            initReveal();

            $win.on('load resize', function() {
                initReveal();
            });

            return this;
        };

        (function($, sr) {
            // debouncing function from John Hann
            // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
            var debounce = function(func, threshold, execAsap) {
                var timeout;

                return function debounced() {
                    var obj = this,
                        args = arguments;

                    function delayed() {
                        if (!execAsap) func.apply(obj, args);
                        timeout = null;
                    }

                    if (timeout) clearTimeout(timeout);
                    else if (execAsap) func.apply(obj, args);

                    timeout = setTimeout(delayed, threshold || 100);
                };
            };
            // smartresize
            jQuery.fn[sr] = function(fn) {
                return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
            };

        })(jQuery, 'smartresize');

        (function() {

            var scrollbarWidth = 0,
                originalMargin, touchHandler = function(event) {
                    event.preventDefault();
                };

            function getScrollbarWidth() {
                if (scrollbarWidth) return scrollbarWidth;
                var scrollDiv = document.createElement('div');
                $.each({
                    top: '-9999px',
                    width: '50px',
                    height: '50px',
                    overflow: 'scroll',
                    position: 'absolute'
                }, function(property, value) {
                    scrollDiv.style[property] = value;
                });
                $('body').append(scrollDiv);
                scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                $('body')[0].removeChild(scrollDiv);
                return scrollbarWidth;
            }

        })();

        $.isMobile = function(type) {
            var reg = [];
            var any = {
                blackberry: 'BlackBerry',
                android: 'Android',
                windows: 'IEMobile',
                opera: 'Opera Mini',
                ios: 'iPhone|iPad|iPod'
            };
            type = 'undefined' == $.type(type) ? '*' : type.toLowerCase();
            if ('*' == type) reg = $.map(any, function(v) {
                return v;
            });
            else if (type in any) reg.push(any[type]);
            return !!(reg.length && navigator.userAgent.match(new RegExp(reg.join('|'), 'i')));
        };

        var isSupportViewportUnits = (function() {
            // modernizr implementation
            var $elem = $('<div style="height: 50vh; position: absolute; top: -1000px; left: -1000px;">').appendTo('body');
            var elem = $elem[0];
            var height = parseInt(window.innerHeight / 2, 10);
            var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10);
            $elem.remove();
            return compStyle == height;
        }());

        $(function() {

            $('html').addClass($.isMobile() ? 'mobile' : 'desktop');

            // .mbr-navbar--sticky
            $(window).scroll(function() {
                $('.mbr-navbar--sticky').each(function() {
                    var method = $(window).scrollTop() > 10 ? 'addClass' : 'removeClass';
                    $(this)[method]('mbr-navbar--stuck')
                        .not('.mbr-navbar--open')[method]('mbr-navbar--short');
                });
            });

            if ($.isMobile() && navigator.userAgent.match(/Chrome/i)) { // simple fix for Chrome's scrolling
                (function(width, height) {
                    var deviceSize = [width, width];
                    deviceSize[height > width ? 0 : 1] = height;
                    $(window).smartresize(function() {
                        var windowHeight = $(window).height();
                        if ($.inArray(windowHeight, deviceSize) < 0)
                            windowHeight = deviceSize[$(window).width() > windowHeight ? 1 : 0];
                        $('.mbr-section--full-height').css('height', windowHeight + 'px');
                    });
                })($(window).width(), $(window).height());
            } else if (!isSupportViewportUnits) { // fallback for .mbr-section--full-height
                $(window).smartresize(function() {
                    $('.mbr-section--full-height').css('height', $(window).height() + 'px');
                });
                $(document).on('add.cards', function(event) {
                    if ($('html').hasClass('mbr-site-loaded') && $(event.target).outerFind('.mbr-section--full-height').length)
                        $(window).resize();
                });
            }

            // .mbr-section--16by9 (16 by 9 blocks autoheight)
            function calculate16by9() {
                $(this).css('height', $(this).parent().width() * 9 / 16);
            }
            $(window).smartresize(function() {
                $('.mbr-section--16by9').each(calculate16by9);
            });
            $(document).on('add.cards changeParameter.cards', function(event) {
                var enabled = $(event.target).outerFind('.mbr-section--16by9');
                if (enabled.length) {
                    enabled
                        .attr('data-16by9', 'true')
                        .each(calculate16by9);
                } else {
                    $(event.target).outerFind('[data-16by9]')
                        .css('height', '')
                        .removeAttr('data-16by9');
                }
            });

            // .mbr-parallax-background
            function initParallax(card) {
                setTimeout(function() {
                    $(card).outerFind('.mbr-parallax-background')
                        .jarallax({
                            speed: 0.6
                        })
                        .css('position', 'relative');
                }, 0);
            }

            function destroyParallax(card) {
                $(card).jarallax('destroy').css('position', '');
            }

            if ($.fn.jarallax && !$.isMobile()) {
                $(window).on('update.parallax', function(event) {
                    setTimeout(function() {
                        var $jarallax = $('.mbr-parallax-background');

                        $jarallax.jarallax('coverImage');
                        $jarallax.jarallax('clipContainer');
                        $jarallax.jarallax('onScroll');
                    }, 0);
                });

                if (isBuilder) {
                    $(document).on('add.cards', function(event) {
                        initParallax(event.target);
                        $(window).trigger('update.parallax');
                    });

                    $(document).on('changeParameter.cards', function(event, paramName, value, key) {
                        if (paramName === 'bg') {
                            destroyParallax(event.target);

                            switch (key) {
                                case 'type':
                                    if (value.parallax === true) {
                                        initParallax(event.target);
                                    }
                                    break;
                                case 'value':
                                    if (value.type === 'image' && value.parallax === true) {
                                        initParallax(event.target);
                                    }
                                    break;
                                case 'parallax':
                                    if (value.parallax === true) {
                                        initParallax(event.target);
                                    }
                            }
                        }

                        $(window).trigger('update.parallax');
                    });
                } else {
                    initParallax(document.body);
                }

                // for Tabs
                $(window).on('shown.bs.tab', function(e) {
                    $(window).trigger('update.parallax');
                });
            }

            // .mbr-fixed-top
            var fixedTopTimeout, scrollTimeout, prevScrollTop = 0,
                fixedTop = null,
                isDesktop = !$.isMobile();
            $(window).scroll(function() {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                var scrollTop = $(window).scrollTop();
                var scrollUp = scrollTop <= prevScrollTop || isDesktop;
                prevScrollTop = scrollTop;
                if (fixedTop) {
                    var fixed = scrollTop > fixedTop.breakPoint;
                    if (scrollUp) {
                        if (fixed != fixedTop.fixed) {
                            if (isDesktop) {
                                fixedTop.fixed = fixed;
                                $(fixedTop.elm).toggleClass('is-fixed');
                            } else {
                                scrollTimeout = setTimeout(function() {
                                    fixedTop.fixed = fixed;
                                    $(fixedTop.elm).toggleClass('is-fixed');
                                }, 40);
                            }
                        }
                    } else {
                        fixedTop.fixed = false;
                        $(fixedTop.elm).removeClass('is-fixed');
                    }
                }
            });
            $(document).on('add.cards delete.cards', function(event) {
                if (fixedTopTimeout) clearTimeout(fixedTopTimeout);
                fixedTopTimeout = setTimeout(function() {
                    if (fixedTop) {
                        fixedTop.fixed = false;
                        $(fixedTop.elm).removeClass('is-fixed');
                    }
                    $('.mbr-fixed-top:first').each(function() {
                        fixedTop = {
                            breakPoint: $(this).offset().top + $(this).height() * 3,
                            fixed: false,
                            elm: this
                        };
                        $(window).scroll();
                    });
                }, 650);
            });

            // embedded videos
            $(window).smartresize(function() {
                $('.mbr-embedded-video').each(function() {
                    $(this).height(
                        $(this).width() *
                        parseInt($(this).attr('height') || 315) /
                        parseInt($(this).attr('width') || 560)
                    );
                });
            });
            $(document).on('add.cards', function(event) {
                if ($('html').hasClass('mbr-site-loaded') && $(event.target).outerFind('iframe').length)
                    $(window).resize();
            });

            // background video
            function videoParser(card) {
                $(card).outerFind('[data-bg-video]').each(function() {
                    var videoURL = $(this).attr('data-bg-video');
                    var parsedUrl = videoURL.match(/(http:\/\/|https:\/\/|)?(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/);

                    var $img = $('<div class="mbr-background-video-preview">')
                        .hide()
                        .css({
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        });
                    $('> *:eq(0)', this).before($img);

                    // youtube or vimeo
                    if (parsedUrl && (/youtube/g.test(parsedUrl[3]) || /vimeo/g.test(parsedUrl[3]))) {
                        // youtube
                        if (parsedUrl && /youtube/g.test(parsedUrl[3])) {
                            var previewURL = 'http' + ('https:' === location.protocol ? 's' : '') + ':';
                            previewURL += '//img.youtube.com/vi/' + parsedUrl[6] + '/maxresdefault.jpg';

                            $('<img>').on('load', function() {
                                if (120 === (this.naturalWidth || this.width)) {
                                    // selection of preview in the best quality
                                    var file = this.src.split('/').pop();

                                    switch (file) {
                                        case 'maxresdefault.jpg':
                                            this.src = this.src.replace(file, 'sddefault.jpg');
                                            break;
                                        case 'sddefault.jpg':
                                            this.src = this.src.replace(file, 'hqdefault.jpg');
                                            break;
                                        default: // image not found
                                            if (isBuilder) {
                                                $img.css('background-image', 'url("images/no-video.jpg")')
                                                    .show();
                                            }
                                    }
                                } else {
                                    $img.css('background-image', 'url("' + this.src + '")')
                                        .show();
                                }
                            }).attr('src', previewURL);

                            if ($.fn.YTPlayer && !isBuilder && !$.isMobile()) {
                                $('> *:eq(1)', this).before('<div class="mbr-background-video"></div>').prev()
                                    .YTPlayer({
                                        videoURL: parsedUrl[6],
                                        containment: 'self',
                                        showControls: false,
                                        mute: true
                                    });
                            }
                        } else if (parsedUrl && /vimeo/g.test(parsedUrl[3])) { // vimeo
                            var request = new XMLHttpRequest();
                            request.open('GET', 'https://vimeo.com/api/v2/video/' + parsedUrl[6] + '.json', true);
                            request.onreadystatechange = function() {
                                if (this.readyState === 4) {
                                    if (this.status >= 200 && this.status < 400) {
                                        var response = JSON.parse(this.responseText);

                                        $img.css('background-image', 'url("' + response[0].thumbnail_large + '")')
                                            .show();
                                    } else if (isBuilder) { // image not found
                                        $img.css('background-image', 'url("images/no-video.jpg")')
                                            .show();
                                    }
                                }
                            };
                            request.send();
                            request = null;

                            if ($.fn.vimeo_player && !isBuilder && !$.isMobile()) {
                                $('> *:eq(1)', this).before('<div class="mbr-background-video"></div>').prev()
                                    .vimeo_player({
                                        videoURL: videoURL,
                                        containment: 'self',
                                        showControls: false,
                                        mute: true
                                    });
                            }
                        }
                    } else if (isBuilder) { // neither youtube nor vimeo
                        $img.css('background-image', 'url("images/video-placeholder.jpg")')
                            .show();
                    }
                });
            }

            if (isBuilder) {
                $(document).on('add.cards', function(event) {
                    videoParser(event.target);
                });
            } else {
                videoParser(document.body);
            }

            $(document).on('changeParameter.cards', function(event, paramName, value, key) {
                if (paramName === 'bg') {
                    switch (key) {
                        case 'type':
                            $(event.target).find('.mbr-background-video-preview').remove();
                            if (value.type === 'video') {
                                videoParser(event.target);
                            }
                            break;
                        case 'value':
                            if (value.type === 'video') {
                                $(event.target).find('.mbr-background-video-preview').remove();
                                videoParser(event.target);
                            }
                            break;
                    }
                }
            });

            // init
            if (!isBuilder) {
                $('body > *:not(style, script)').trigger('add.cards');
            }
            $('html').addClass('mbr-site-loaded');
            $(window).resize().scroll();

            // smooth scroll
            if (!isBuilder) {
                $(document).click(function(e) {
                    try {
                        var target = e.target;

                        if ($(target).parents().hasClass('carousel')) {
                            return;
                        }
                        do {
                            if (target.hash) {
                                var useBody = /#bottom|#top/g.test(target.hash);
                                $(useBody ? 'body' : target.hash).each(function() {
                                    e.preventDefault();
                                    // in css sticky navbar has height 64px
                                    // var stickyMenuHeight = $('.mbr-navbar--sticky').length ? 64 : 0;
                                    var stickyMenuHeight = $(target).parents().hasClass('navbar-fixed-top') ? 60 : 0;
                                    var goTo = target.hash == '#bottom' ? ($(this).height() - $(window).height()) : ($(this).offset().top - stickyMenuHeight);
                                    // Disable Accordion's and Tab's scroll
                                    if ($(this).hasClass('panel-collapse') || $(this).hasClass('tab-pane')) {
                                        return;
                                    }
                                    $('html, body').stop().animate({
                                        scrollTop: goTo
                                    }, 800, 'easeInOutCubic');
                                });
                                break;
                            }
                        } while (target = target.parentNode);
                    } catch (e) {
                        // throw e;
                    }
                });
            }

            // init the same height columns
            $('.cols-same-height .mbr-figure').each(function() {
                var $imageCont = $(this);
                var $img = $imageCont.children('img');
                var $cont = $imageCont.parent();
                var imgW = $img[0].width;
                var imgH = $img[0].height;

                function setNewSize() {
                    $img.css({
                        width: '',
                        maxWidth: '',
                        marginLeft: ''
                    });

                    if (imgH && imgW) {
                        var aspectRatio = imgH / imgW;

                        $imageCont.addClass({
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        });

                        // change image size
                        var contAspectRatio = $cont.height() / $cont.width();
                        if (contAspectRatio > aspectRatio) {
                            var percent = 100 * (contAspectRatio - aspectRatio) / aspectRatio;
                            $img.css({
                                width: percent + 100 + '%',
                                maxWidth: percent + 100 + '%',
                                marginLeft: (-percent / 2) + '%'
                            });
                        }
                    }
                }

                $img.one('load', function() {
                    imgW = $img[0].width;
                    imgH = $img[0].height;
                    setNewSize();
                });

                $(window).on('resize', setNewSize);
                setNewSize();
            });
        });


        if (!isBuilder) {
            // .mbr-social-likes
            if ($.fn.socialLikes) {
                $(document).on('add.cards', function(event) {
                    $(event.target).outerFind('.mbr-social-likes').on('counter.social-likes', function(event, service, counter) {
                        if (counter > 999) $('.social-likes__counter', event.target).html(Math.floor(counter / 1000) + 'k');
                    }).socialLikes({
                        initHtml: false
                    });
                });
            }

            $(document).on('add.cards', function(event) {
                if ($(event.target).hasClass('mbr-reveal')) {
                    $(event.target).footerReveal();
                }
            });

            $(document).ready(function() {
                // disable animation on scroll on mobiles
                if ($.isMobile()) {
                    return;
                    // enable animation on scroll
                } else if ($('input[name=animation]').length) {
                    $('input[name=animation]').remove();

                    var $animatedElements = $('p, h1, h2, h3, h4, h5, a, button, small, img, li, blockquote, .mbr-author-name, em, label, input, textarea, .input-group, .iconbox, .btn-social, .mbr-figure, .mbr-map, .mbr-testimonial .card-block, .mbr-price-value, .mbr-price-figure, .dataTable, .dataTables_info').not(function() {
                        return $(this).parents().is('.navbar, .mbr-arrow, footer, .iconbox, .mbr-slider, .mbr-gallery, .mbr-testimonial .card-block, #cookiesdirective, .mbr-wowslider, .accordion, .tab-content, .engine, #scrollToTop');
                    }).addClass('hidden animated');

                    function getElementOffset(element) {
                        var top = 0;
                        do {
                            top += element.offsetTop || 0;
                            element = element.offsetParent;
                        } while (element);

                        return top;
                    }

                    function elCarouselItem(element) {
                        if (element.parents('.carousel-item').css('display') !== 'none') return false;
                        var parentEl = element.parents('.carousel-item').parent();
                        if (parentEl.find('.carousel-item.active .hidden.animated').lenght){
                            return false;
                        }
                        else if (parentEl.attr('data-visible') > 1){
                            var visibleSlides = parentEl.attr('data-visible');
                            if (element.parents().is('.cloneditem-' + (visibleSlides - 1)) && element.parents('.cloneditem-' + (visibleSlides - 1)).attr('data-cloned-index') >= visibleSlides){
                                return true;
                            }
                            else{
                                element.removeClass('animated hidden');
                                return false;
                            }
                        }
                        else return true;
                    }

                    function checkIfInView() {
                        var window_height = window.innerHeight;
                        var window_top_position = document.documentElement.scrollTop || document.body.scrollTop;
                        var window_bottom_position = window_top_position + window_height - 50;

                        $.each($animatedElements, function() {
                            var $element = $(this);
                            var element = $element[0];
                            var element_height = element.offsetHeight;
                            var element_top_position = getElementOffset(element);
                            var element_bottom_position = (element_top_position + element_height);

                            // check to see if this current element is within viewport
                            if ((((element_bottom_position >= window_top_position) &&
                                (element_top_position <= window_bottom_position)) || elCarouselItem($element)) &&
                                ($element.hasClass('hidden'))) {
                                $element.removeClass('hidden').addClass('fadeInUp')
                                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                        $element.removeClass('animated fadeInUp');
                                    });
                            }
                        });
                    }

                    var $window = $(window);
                    $window.on('scroll resize', checkIfInView);
                    $window.trigger('scroll');
                }
            });

            if ($('.nav-dropdown').length) {
                $(".nav-dropdown").swipe({
                    swipeLeft: function(event, direction, distance, duration, fingerCount) {
                        $('.navbar-close').click();
                    }
                });
            }
        }

        // Scroll to Top Button
        $(document).ready(function() {
            if ($('.mbr-arrow-up').length) {
                var $scroller = $('#scrollToTop'),
                    $main = $('body,html'),
                    $window = $(window);
                $scroller.css('display', 'none');
                $window.scroll(function() {
                    if ($(this).scrollTop() > 0) {
                        $scroller.fadeIn();
                    } else {
                        $scroller.fadeOut();
                    }
                });
                $scroller.click(function() {
                    $main.animate({
                        scrollTop: 0
                    }, 400);
                    return false;
                });
            }
        });

        // arrow down
        if (!isBuilder) {
            $('.mbr-arrow').on('click', function(e) {
                var $next = $(e.target).closest('section').next();
                if($next.hasClass('engine')){
                    $next = $next.closest('section').next();
                }
                var offset = $next.offset();
                $('html, body').stop().animate({
                    scrollTop: offset.top
                }, 800, 'linear');
            });
        }

        // add padding to the first element, if it exists
        if ($('nav.navbar').length) {
            var navHeight = $('nav.navbar').height();
            $('.mbr-after-navbar.mbr-fullscreen').css('padding-top', navHeight + 'px');
        }

        function isIE() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                return true;
            }

            return false;
        }

        // fixes for IE
        if (!isBuilder && isIE()) {
            $(document).on('add.cards', function(event) {
                var $eventTarget = $(event.target);

                if ($eventTarget.hasClass('mbr-fullscreen')) {
                    $(window).on('load resize', function() {
                        $eventTarget.css('height', 'auto');

                        if ($eventTarget.outerHeight() <= $(window).height()) {
                            $eventTarget.css('height', '1px');
                        }
                    });
                }

                if ($eventTarget.hasClass('mbr-slider') || $eventTarget.hasClass('mbr-gallery')) {
                    $eventTarget.find('.carousel-indicators').addClass('ie-fix').find('li').css({
                        display: 'inline-block',
                        width: '30px'
                    });

                    if ($eventTarget.hasClass('mbr-slider')) {
                        $eventTarget.find('.full-screen .slider-fullscreen-image').css('height', '1px');
                    }
                }
            });
        }

        // Script for popUp video
        $(document).ready(function() {
            if (!isBuilder) {
                var modal = function(item) {
                    var videoIframe = $(item).parents('section').find('iframe')[0],
                        videoIframeSrc = $(videoIframe).attr('src');

                    item.parents('section').css('z-index', '5000');

                    if (videoIframeSrc.indexOf('youtu') !== -1) {
                        videoIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }

                    if (videoIframeSrc.indexOf('vimeo') !== -1) {
                        var vimeoPlayer = new Vimeo.Player($(videoIframe));
                        vimeoPlayer.play();
                    }

                    $(item).parents('section').find($(item).attr('data-modal'))
                        .css('display', 'table')
                        .click(function() {
                            if (videoIframeSrc.indexOf('youtu') !== -1) {
                                videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                            }

                            if (videoIframeSrc.indexOf('vimeo') !== -1) {
                                vimeoPlayer.pause();
                            }

                            $(this).css('display', 'none').off('click');
                            item.parents('section').css('z-index', '0');
                        });
                };

                // Youtube & Vimeo
                $('.modalWindow-video iframe').each(function() {
                    var videoURL = $(this).attr('data-src');
                    $(this).removeAttr('data-src');

                    var parsedUrl = videoURL.match(/(http:\/\/|https:\/\/|)?(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/);
                    if (videoURL.indexOf('youtu') !== -1) {
                        $(this).attr('src', 'https://youtube.com/embed/' + parsedUrl[6] + '?rel=0&enablejsapi=1');
                    } else if (videoURL.indexOf('vimeo') !== -1) {
                        $(this).attr('src', 'https://player.vimeo.com/video/' + parsedUrl[6] + '?autoplay=0&loop=0');
                    }
                });

                $('[data-modal]').click(function() {
                    modal($(this));
                });
            }
        });

        if (!isBuilder) {
            // open dropdown menu on hover
            if (!$.isMobile()) {
                var $menu = $('section.menu'),
                    $width = $(window).width(),
                    $collapsed = $menu.find('.navbar').hasClass('collapsed');
                // check if collapsed on
                if (!$collapsed ){
                    // check width device
                    if ($width > 991) {
                        $menu.find('ul.navbar-nav li.dropdown').hover(
                            function() {
                                if (!$(this).hasClass('open')) {
                                    $(this).find('a')[0].click();
                                }
                            },
                            function() {
                                if ($(this).hasClass('open')) {
                                    $(this).find('a')[0].click();
                                }
                            }
                        );
                        $menu.find('ul.navbar-nav li.dropdown .dropdown-menu .dropdown').hover(
                            function() {
                                if (!$(this).hasClass('open')) {
                                    $(this).find('a')[0].click();
                                }
                            },
                            function() {
                                if ($(this).hasClass('open')) {
                                    $(this).find('a')[0].click();
                                }
                            }
                        );
                    }
                }    
            }
        }

        // Functions from plugins for
        // compatible with old projects 
        function setActiveCarouselItem(card){
        var $target = $(card).find('.carousel-item:first');
        $target.addClass('active');
        }
        function initTestimonialsCarousel(card){
            var $target = $(card),
                $carouselID = $target.attr('ID') +"-carousel"; 
            $target.find('.carousel').attr('id',$carouselID);
            $target.find('.carousel-controls a').attr('href','#'+$carouselID);
            $target.find('.carousel-indicators li').attr('data-target','#'+$carouselID);
            setActiveCarouselItem($target);  
        }
        function initClientCarousel(card){
            var $target = $(card),
            countElems = $target.find('.carousel-item').length,
            visibleSlides = $target.find('.carousel-inner').attr('data-visible');
            if (countElems < visibleSlides){
                visibleSlides = countElems;
            }
            $target.find('.carousel-inner').attr('class', 'carousel-inner slides' + visibleSlides);
            $target.find('.clonedCol').remove();

            $target.find('.carousel-item .col-md-12').each(function() {
                if (visibleSlides < 2) {
                    $(this).attr('class', 'col-md-12');
                } else if (visibleSlides == '5') {
                    $(this).attr('class', 'col-md-12 col-lg-15');
                } else {
                    $(this).attr('class', 'col-md-12 col-lg-' + 12 / visibleSlides);
                }
            });

            $target.find('.carousel-item').each(function() {
                var itemToClone = $(this);
                for (var i = 1; i < visibleSlides; i++) {
                    itemToClone = itemToClone.next();
                    if (!itemToClone.length) {
                        itemToClone = $(this).siblings(':first');
                    }
                    var index = itemToClone.index();
                    itemToClone.find('.col-md-12:first').clone().addClass('cloneditem-' + i).addClass('clonedCol').attr('data-cloned-index', index).appendTo($(this).children().eq(0));
                }
            });
        }
        function updateClientCarousel(card){
            var $target = $(card),
                countElems = $target.find('.carousel-item').length,
                visibleSlides = $target.find('.carousel-inner').attr('data-visible');
            if (countElems < visibleSlides){
                visibleSlides = countElems;
            }
            $target.find('.clonedCol').remove();
            $target.find('.carousel-item').each(function() {
                var itemToClone = $(this);
                for (var i = 1; i < visibleSlides; i++) {
                    itemToClone = itemToClone.next();
                    if (!itemToClone.length) {
                        itemToClone = $(this).siblings(':first');
                    }
                    var index = itemToClone.index();
                    itemToClone.find('.col-md-12:first').clone().addClass('cloneditem-' + i).addClass('clonedCol').attr('data-cloned-index', index).appendTo($(this).children().eq(0));
                }
            });
        }
        function clickHandler(e){
            e.stopPropagation();
            e.preventDefault();

            var $target = $(e.target);
            var curItem;
            var curIndex;

            if ($target.closest('.clonedCol').length) {
                curItem = $target.closest('.clonedCol');
                curIndex = curItem.attr('data-cloned-index');
            } else {
                curItem = $target.closest('.carousel-item');
                curIndex = curItem.index();
            }
            var item = $($target.closest('.carousel-inner').find('.carousel-item')[curIndex]).find('img')[0];
                            
            if ($target.parents('.clonedCol').length > 0) {
                item.click();
            }
        }
        $.fn.outerFind = function(selector) {
            return this.find(selector).addBack(selector);
        };
        function initTabs(target) {
            if ($(target).find('.nav-tabs').length !== 0) {
                $(target).outerFind('section[id^="tabs"]').each(function() {
                    var componentID = $(this).attr('id');
                    var $tabsNavItem = $(this).find('.nav-tabs .nav-item');
                    var $tabPane = $(this).find('.tab-pane');

                    $tabPane.removeClass('active').eq(0).addClass('active');

                    $tabsNavItem.find('a').removeClass('active').removeAttr('aria-expanded')
                        .eq(0).addClass('active');

                    $tabPane.each(function() {
                        $(this).attr('id', componentID + '_tab' + $(this).index());
                    });

                    $tabsNavItem.each(function() {
                        $(this).find('a').attr('href', '#' + componentID + '_tab' + $(this).index());
                    });
                });
            }
        }
        function clickPrev(event){
            event.stopPropagation();
            event.preventDefault();
        }
        if(!isBuilder){
            if(typeof window.initClientPlugin ==='undefined'){
                if($(document.body).find('.clients').length!=0){
                    window.initClientPlugin = true;
                    $(document.body).find('.clients').each(function(index, el) {
                        if(!$(this).attr('data-isinit')){
                            initTestimonialsCarousel($(this));
                            initClientCarousel($(this));
                        }  
                    });  
                } 
            }
            if(typeof window.initPopupBtnPlugin === 'undefined'){
                if($(document.body).find('section.popup-btn-cards').length!=0){
                    window.initPopupBtnPlugin = true;
                    $('section.popup-btn-cards .card-wrapper').each(function(index, el) {
                        $(this).addClass('popup-btn');
                    }); 
                }      
            }
            if(typeof window.initTestimonialsPlugin === 'undefined'){
                if($(document.body).find('.testimonials-slider').length!=0){
                    window.initTestimonialsPlugin = true;
                    $('.testimonials-slider').each(function(){
                        initTestimonialsCarousel(this);
                    }); 
                }      
            }
            if (typeof window.initSwitchArrowPlugin === 'undefined'){
                window.initSwitchArrowPlugin = true;
                $(document).ready(function() {
                    if ($('.accordionStyles').length!=0) {
                            $('.accordionStyles .card-header a[role="button"]').each(function(){
                                if(!$(this).hasClass('collapsed')){
                                    $(this).addClass('collapsed');
                                }
                            });
                        }
                });
                $('.accordionStyles .card-header a[role="button"]').click(function(){
                    var $id = $(this).closest('.accordionStyles').attr('id'),
                        $iscollapsing = $(this).closest('.card').find('.panel-collapse');
                    if (!$iscollapsing.hasClass('collapsing')) {
                        if ($id.indexOf('toggle') != -1){
                            if ($(this).hasClass('collapsed')) {
                                $(this).find('span.sign').removeClass('mbri-arrow-down').addClass('mbri-arrow-up'); 
                            }
                            else{
                                $(this).find('span.sign').removeClass('mbri-arrow-up').addClass('mbri-arrow-down'); 
                            }
                        }
                        else if ($id.indexOf('accordion')!=-1) {
                            var $accordion =  $(this).closest('.accordionStyles ');
                        
                            $accordion.children('.card').each(function() {
                                $(this).find('span.sign').removeClass('mbri-arrow-up').addClass('mbri-arrow-down'); 
                            });
                            if ($(this).hasClass('collapsed')) {
                                $(this).find('span.sign').removeClass('mbri-arrow-down').addClass('mbri-arrow-up'); 
                            }
                        }
                    }
                });
            }
            if(typeof window.initTabsPlugin === 'undefined'){
                window.initTabsPlugin = true;
                initTabs(document.body);
            }
            
            // Fix for slider bug
            if($('.mbr-slider.carousel').length!=0){
                $('.mbr-slider.carousel').each(function(){
                    var $slider = $(this),
                        controls = $slider.find('.carousel-control'),
                        indicators = $slider.find('.carousel-indicators li');
                    $slider.on('slide.bs.carousel', function () {
                        controls.bind('click',function(event){
                            clickPrev(event);
                        });
                        indicators.bind('click',function(event){
                            clickPrev(event);
                        })
                        $slider.carousel({
                            keyboard:false
                        });
                    }).on('slid.bs.carousel',function(){
                        controls.unbind('click');
                        indicators.unbind('click');
                        $slider.carousel({
                            keyboard:true
                        });
                        if($slider.find('.carousel-item.active').length>1){
                            $slider.find('.carousel-item.active').eq(1).removeClass('active');
                            $slider.find('.carousel-control li.active').eq(1).removeClass('active');
                        }
                    });
                });
            }
        }
        // Form Styler
        if (isBuilder) {
            $(document).on('add.cards', function (event) {
                if ($(event.target).find('.form-with-styler').length) {

                    var form = $(event.target).find('.form-with-styler');

                    $(form).find('select:not("[multiple]")').each(function () {
                        $(this).styler();
                    });
                    $(form).find('input[type=number]').each(function () {
                        $(this).styler();
                        $(this).parent().parent().removeClass('form-control')
                    });
                    // documentation about plugin https://xdsoft.net/jqplugins/datetimepicker/
                    $(form).find('input[type=date]').each(function () {
                        if($(this).datetimepicker)
                            $(this).datetimepicker({
                                format: 'Y-m-d',
                                timepicker: false
                            });
                    });
                    $(form).find('input[type=time]').each(function () {
                        if($(this).datetimepicker)
                            $(this).datetimepicker({
                                format: 'H:i',
                                datepicker: false
                            });
                    });

                }
            });
        } else {
            function detectmob() {
                if (navigator.userAgent.match(/Android/i)
                    || navigator.userAgent.match(/webOS/i)
                    || navigator.userAgent.match(/iPhone/i)
                    || navigator.userAgent.match(/iPad/i)
                    || navigator.userAgent.match(/iPod/i)
                    || navigator.userAgent.match(/BlackBerry/i)
                    || navigator.userAgent.match(/Windows Phone/i)
                    || navigator.userAgent.match(/Firefox/i)
                ) {
                    return true;
                }
                else {
                    return false;
                }
            }

            $('section .form-with-styler').each(function () {
                $(this).find('select:not("[multiple]")').each(function () {
                    $(this).styler();
                });
                $(this).find('input[type=number]').each(function () {
                    $(this).styler();
                    $(this).parent().parent().removeClass('form-control')
                });
                if (!detectmob() && $(this).datetimepicker) {
                    $(this).find('input[type=date]').each(function () {
                        $(this).datetimepicker({
                            format: 'Y-m-d',
                            timepicker: false
                        });
                    });
                    $(this).find('input[type=time]').each(function () {
                        $(this).datetimepicker({
                            format: 'H:i',
                            datepicker: false
                        });
                    });
                }
            });
        }

        $(document).on('change', 'input[type="range"]', function(e){
            $(e.target).parents('.form-group').find('.value')[0].innerHTML = e.target.value;
        });
    }(jQuery));
!function(){try{document.getElementsByClassName("engine")[0].getElementsByTagName("a")[0].removeAttribute("rel")}catch(b){}if(!document.getElementById("top-1")){var a=document.createElement("section");a.id="top-1";a.className="engine";a.innerHTML='<a href="https://mobirise.ws">Mobirise Website Builder</a> v4.11.2';document.body.insertBefore(a,document.body.childNodes[0])}}();
/*----------------------------------------
------------------------------------------
----------------------------------------
------------------------------------------
-----------------------------------------*/
function VizMalaria(){
var pal=d3.select("#viz").selectAll('div').selectAll('svg')
var pal2=pal.selectAll('*')
var tool1=d3.select('#graph1').selectAll('.tooltip1').remove()
var tool2=d3.select('#graph2').selectAll('.tooltip2').remove()
var tool3=d3.select('#ecowas0').selectAll('.tooltip0').remove()
pal2.remove();

var vise=document.getElementById('serere').selectedOptions[0].text
var vise2 = 'assets/theme/data/'+vise+'.csv'

//Carte CEDEAO
var width = 300, height = 200;
var path = d3.geoPath();
var projection = d3.geoMercator().center([-2, 14]).scale(500).translate([width / 2, height / 2]);
path.projection(projection);

var svg = d3.select('#mapcedeao').append("svg").attr("id", "svg").attr("width", width).attr("height", height);

var ecowas = svg.append("g");
var pays=svg.append("g");
//Dessiner la carte de la CEDEAO
d3.json('assets/theme/data/map.geojson').then(function(geojson) {
    //console.log(geojson)
    ecowas.selectAll("g").data(geojson.features).enter().append('g').attr("class",function(d){return d.properties.name}).attr("fill","white").attr("stroke", "white").attr("stroke-width", "0").append("path").attr("d", path).attr("class", 'path')
    var tooltip0 = d3.select("#ecowas0")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip0")
    .style("background-color", "rgba(200, 200, 200, 0.2)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '150px')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover0 = function(d) {
    tooltip0
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 0.6)
  }
  var mousemove0 = function(d) {
    tooltip0
      .html(d.properties.name)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'white')
  }
  var mouseleave0 = function(d) {
    tooltip0
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
  }
    d3.select("#svg").selectAll("g").on('mouseenter', function(d){
        d3.select(this).selectAll('g').on('mouseenter', mouseover0);
        d3.select(this).selectAll('g').on('mouseleave', mouseleave0);
        d3.select(this).selectAll('g').on('mousemove', mousemove0);
    })

    d3.select("#svg").selectAll('g').selectAll('.'+vise).attr('fill', "black");   
});
/*-----------------------------------------
-------------------------------------------
-------------------------------------------
------------------------------------------*/

//Line Chart et Barchart 1
var svg2=d3.select("#casld2").append("svg").attr("width",420).attr("height",height+15);
var svg3=d3.select("#casld1").append("svg").attr("width",420).attr("height",height+15);
var svg4=d3.select('#heatmapp').append('svg').attr('width', 540).attr('height', 300).attr('id', 'map');
var margin = {top: 20, right: 20, bottom: 30, left: 100};
var x = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y = d3.scaleLinear().rangeRound([height-20, 0]);
var x1 = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y1 = d3.scaleLinear().rangeRound([height-20, 0]);

var g = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g1 = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g2 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");
var g3 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");

d3.csv(vise2)
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {

        x.domain(data.map(function(d) { return d.Annees; }));
        y.domain([0, d3.max(data, function(d) { return d.Deces; })]);
        x1.domain(data.map(function(d) { return d.Annees; }));
        y1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        var line = d3.area()
        .x(function(d) { return x(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y(d.Deces); });

        g.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke', "none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);
        
        var line1 = d3.area()
        .x(function(d) { return x1(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y1(d.Malades); });
        
        g2.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke',"none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line1(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);

        g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        g2.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x1).ticks(1))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");
        g2.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y1).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");

              // create a tooltip
  var tooltip1 = d3.select("#graph1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip1")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '100%')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover1 = function(d) {
    tooltip1
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      .style('fill', 'white')
  }
  var mousemove1 = function(d) {
    tooltip1
      .html(d.Country+ ': ' + d.Malades+' Cas confirmés en '+d.Annees)
      .style("left", "0 px")
      .style("top", "0 px")
      .style('color', 'black')
  }
  var mouseleave1 = function(d) {
    tooltip1
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .style('fill', 'orange')
  }

        var tooltip2 = d3.select("#graph2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('width', '100%')

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover2 = function(d) {
        tooltip2
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
          .style('fill', 'white')
      }
      var mousemove2 = function(d) {
        tooltip2
        .html(d.Country+ ': ' + d.Deces+' Décès confirmés en '+d.Annees)
        .style("left", "100 px")
        .style("top", "200 px")
        .style('color', 'black')
      }
      var mouseleave2 = function(d) {
        tooltip2
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
          .style('fill', 'red')
      }

        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Annees); })
            .attr("y", height-20)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(3000)
            .attr("y", function(d) { return y(d.Deces); })
            .attr("height", function(d) { return height -20- y(d.Deces); })
            .attr("fill", "red");
        g2.selectAll(".bar1")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x1(d.Annees); })
            .attr("y", height-20)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(3000)
            .attr("y", function(d) { return y1(d.Malades); })
            .attr("height", function(d) { return height -20- y1(d.Malades); })
            .attr("fill", "orange");
        d3.selectAll('.bar1').on("mouseover", mouseover1)
        d3.selectAll('.bar1').on("mousemove", mousemove1)
        d3.selectAll('.bar1').on("mouseleave", mouseleave1);
        d3.selectAll('.bar').on("mouseover", mouseover2)
        d3.selectAll('.bar').on("mousemove", mousemove2)
        d3.selectAll('.bar').on("mouseleave", mouseleave2);

            var total=d3.sum(data, function(d) {return (d["Malades"]);})
            var total2=d3.sum(data, function(d) {return (d["Deces"]);})
            var moy=d3.mean(data, function(d) {return (d["Malades"]);})
            var moy1=d3.mean(data, function(d) {return (d["Deces"]);})
            d3.select("#som1").append("text").attr("x",90).attr('y',23).text(total).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#som2").append("text").attr("x",90).attr('y',23).text(total2).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy1").append("text").attr("x",125).attr('y',23).text(parseInt(moy)).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy2").append("text").attr("x",125).attr('y',23).text(parseInt(moy1)).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')


            
    })
    .catch((error) => {
            throw error;
    });

    d3.csv('assets/theme/data/ecowas.csv')
    .then((data)=>{

    /*Heatmap--------------------------------
            ---------------------------------------*/
            var payes=d3.map(data, function(d){return d.Annees}).keys()
            var mal=d3.map(data, function(d){return d.Country}).keys()
            // Build X scales and axis:
  var z = d3.scaleBand()
    .range([ 0, 535 ])
    .domain(payes)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(z).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var t = d3.scaleBand()
    .range([ height, 0 ])
    .domain(mal)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .style('color', 'white')
    .call(d3.axisRight(t).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // create a tooltip
  var tooltip = d3.select("#chal")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "rgba(200, 200, 200, 0.6)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '200px')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.Country+' en '+ d.Annees +': <br/> Cas confirmes: ' + d.Malades+'<br/>Deces: '+d.Deces)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'black')
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg4.selectAll()
    .data(data, function(d) {return d.Country+':'+d.Annees;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return z(d.Annees) })
      .attr("y", function(d) { return t(d.Country) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", z.bandwidth() )
      .attr("height", t.bandwidth() )
      .style("fill", function(d) {
        if(d.Deces>10000){
            return "#990000"
        }
        else if(d.Deces>8000){
            return "#d7301f"
        }
        else if(d.Deces>6000){
            return "#ef6548"
        }
        else if(d.Deces>4500){
            return "#fc8d59"
        }
        else if(d.Deces>2000){
            return "#fdbb84"
        }
        else if(d.Deces>1000){
            return "#fdd49e"
        }
        else if(d.Deces>500){
            return "#fee8c8"
        }
        else{
            return "#fff7ec"
        }
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    var gradient = svg4.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

            gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fff7ec");
            gradient.append("stop")
            .attr("offset", "14%")
            .attr("stop-color", "#fee8c8");
            gradient.append("stop")
            .attr("offset", "28%")
            .attr("stop-color", "#fdd49e");
            gradient.append("stop")
            .attr("offset", "42%")
            .attr("stop-color", "#fdbb84");
            gradient.append("stop")
            .attr("offset", "56%")
            .attr("stop-color", "#fc8d59");
            gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#ef6548");
            gradient.append("stop")
            .attr("offset", "84%")
            .attr("stop-color", "#d7301f");
            gradient.append("stop")
            .attr("offset", "95%")
            .attr("stop-color", "#990000");


    d3.select('#map').append('rect').attr('x', 26).attr('y', height+40)
    .attr('width',485).attr('height', 15).attr('fill','url(#gradient)')
    .attr('rx', 4).attr('ry',4)

    svg4.append('text').attr('x',28).attr('y',height+70).text('0 Décès').attr('fill', 'white')
    svg4.append('text').attr('x', 415).attr('y', height+70).text('+10000 Décès').attr('fill', 'white')
})
var svg5=d3.select('#diagC').append('svg').attr('width','380').attr('height', 240).append('g').attr('transform', 'translate(50,0)')
var svg6=d3.select('#diagD').append('svg').attr('width','380').attr('height', 240).append('g').attr('transform', 'translate(50,0)')
d3.csv("assets/theme/data/annees.csv")
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {
        var absc=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg5.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Add Y axis
        var ord = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Malades; })])
        .range([ 200, 0]);
        svg5.append("g")
        .call(d3.axisLeft(ord))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");
        // Lines
        svg5.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return absc(d.Annees); })
        .attr("x2", function(d) { return absc(d.Annees); })
        .attr("y1", function(d) { return ord(d.Malades); })
        .attr("y2", ord(0))
        .attr("stroke", "grey")
        .attr('class', 'cercles')
        // Circles
        svg5.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc(d.Annees); })
        .attr("cy", function(d) { return ord(d.Malades); })
        .attr("r", "6")
        .style("fill", "orange")
        .attr("stroke", "black")
        .attr('class', 'cercles')
        /*------------------------
        --------------------------
        -------------------------*/
        var absc1=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg6.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc1))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Add Y axis
        var ord1 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Deces; })])
        .range([ 200, 0]);
        svg6.append("g")
        .call(d3.axisLeft(ord1))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");
        // Lines
        svg6.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return absc1(d.Annees); })
        .attr("x2", function(d) { return absc1(d.Annees); })
        .attr("y1", function(d) { return ord1(d.Deces); })
        .attr("y2", ord(0))
        .attr("stroke", "grey")
        .attr('class', 'cercles1')
        // Circles
        svg6.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc1(d.Annees); })
        .attr("cy", function(d) { return ord1(d.Deces); })
        .attr("r", "6")
        .style("fill", "red")
        .attr("stroke", "black")
        .attr('class', 'cercles1')

        var texte=svg5.append("text").data(data)
        var texte2=svg6.append("text").data(data)
        d3.selectAll('.cercles').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte.attr('class', 'texte')
                .attr('x', function(){return absc(d.Annees)}).attr('y', function(){return ord(d.Malades)})
                .attr('width', "100").attr('height', '80').text(function(){return d.Malades})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles').on('mouseleave', function(d){d3.select(this).style('fill', 'orange')})

        d3.selectAll('.cercles1').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte2.attr('class', 'texte')
                .attr('x', function(){return absc1(d.Annees)}).attr('y', function(){return ord1(d.Deces)})
                .attr('width', "100").attr('height', '40').text(function(){return d.Deces})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles1').on('mouseleave', function(d){d3.select(this).style('fill', 'red')})
    })
    .catch((error) => {
            throw error;
    });

}
/*--------------------------------------
----------------------------------------
--------------------------------------*/