(function () {

    var RapidLoad = function () {

        var fired = false
        var fired_inline = false

        var load_css = function (uucss) {
            var files = document.querySelectorAll('link[data-href]')

            if (!files.length || fired) {
                return;
            }

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                var original = uucss.find(function (i) {
                    return file.getAttribute('data-href').includes(i.uucss)
                })

                if (!original) {
                    return;
                }

                let link = file.cloneNode()
                link.href = original.original
                link.removeAttribute('data-href')
                if(window.rapidload && window.rapidload.frontend_debug === "1"){
                    link.removeAttribute('uucss')
                    link.setAttribute('uucss-reverted', '')
                }
                link.prev = file
                link.addEventListener('load',function (e) {
                    if (this.prev) this.prev.remove();
                });
                file.parentNode.insertBefore(link, file.nextSibling);
                fired = true
            }

        }

        var load_inline_css = function (uucss){
            var inlined_styles = document.querySelectorAll('style[data-href]')

            if (!inlined_styles.length || fired_inline) {
                return;
            }

            for (var i = 0; i < inlined_styles.length; i++){

                var inlines_style = inlined_styles[i];

                var original = uucss.find(function (x) {
                    return inlines_style.getAttribute('data-href').includes(x.uucss)
                })

                if (!original) {
                    return;
                }

                var link  = document.createElement('link');
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = original.original;
                link.media = inlines_style.getAttribute('data-media');
                link.prev = inlines_style

                link.addEventListener('load',function (e) {
                    if (this.prev) this.prev.remove()
                });

                inlines_style.parentNode.insertBefore(link, inlines_style.nextSibling);

                fired_inline = true;
            }
        }

        this.add_events = function () {

            if (!window.rapidload || !window.rapidload.files || !window.rapidload.files.length) {
                return;
            }

            ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
                var listener = function () {
                    load_css(window.rapidload.files)
                    load_inline_css(window.rapidload.files)
                    removeEventListener(event, listener);
                }
                addEventListener(event, listener);

            });

        }

        this.add_events()
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        new RapidLoad();
    });

}());