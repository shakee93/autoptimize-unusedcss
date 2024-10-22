(function () {

    var RapidLoadCPCSS = function () {
        var fired = false;
        var load_css = function () {
            var files = document.querySelectorAll('link[data-href]');
            var loaded_files_count = 0;
            if (!files.length || fired) return;

            files.forEach(function (file) {
                var link = file.cloneNode();
                link.href = file.dataset.href;
                link.rel = 'stylesheet';
                link.as = 'style';
                link.removeAttribute('data-href');
                link.removeAttribute('data-media');
                link.addEventListener('load', function () {
                    file.remove();
                    loaded_files_count++;
                    if(loaded_files_count === files.length){
                        window.dispatchEvent(new Event('resize'));
                    }
                });
                link.addEventListener('error', function () {
                    loaded_files_count++
                    if(loaded_files_count === files.length){
                        window.dispatchEvent(new Event('resize'));
                    }
                });
                file.parentNode.insertBefore(link, file.nextSibling);
            });

            fired = true;
        };

        this.add_events = function () {
            ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
                var listener = function () {
                    load_css();
                    removeEventListener(event, listener);
                };
                addEventListener(event, listener);
            });
            setTimeout(function (){
                const scrollTop = document.documentElement.scrollTop;
                if(scrollTop > 100){
                    console.log('loading css for scroll top - ' + scrollTop );
                    load_css();
                }
            }, 800);
        };

        this.add_events();
    };

    document.addEventListener("DOMContentLoaded", function () {
        new RapidLoadCPCSS();
    });

}());
