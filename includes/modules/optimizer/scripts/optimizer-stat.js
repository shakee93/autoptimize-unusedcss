(function (){

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get(param))
        return urlParams.get(param);
    }

    window.addEventListener('load', function (){
        if (getQueryParam('rapidload_preview')) {
            const rapidload_cache_status_div_content = document.querySelector('#rapidload-cache-status');

            if (rapidload_cache_status_div_content) {
                rapidload_cache_status_div_content.style.display = "block";
            }

            if(window.rapidload_preview_stats.cpcss){
                const cpcss_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-cpcss-stat');

                if(cpcss_stat_value){
                    cpcss_stat_value.innerHTML = 'enabled ' + window.rapidload_preview_stats.cpcss["data-mode"] + " mode with " +  window.rapidload_preview_stats.cpcss["cpcss-file"]
                }
            }

            if(window.rapidload_preview_stats.uucss){
                const uucss_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-uucss-stat');

                if(uucss_stat_value){
                    uucss_stat_value.innerHTML = 'total ' + window.rapidload_preview_stats.uucss.length + " css found and " +  window.rapidload_preview_stats.uucss.filter(a => a.new_href).length + " optimized"
                }

            }

            if(window.rapidload_preview_stats.minify_css){
                const minify_css_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-minify-css-stat');

                if(minify_css_stat_value){
                    minify_css_stat_value.innerHTML = 'total ' + window.rapidload_preview_stats.uucss.length + " css found and " +  window.rapidload_preview_stats.uucss.filter(a => a.new_href).length + " minified"
                }

            }

            if(window.rapidload_preview_stats.cdn){
                const cdn_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-cdn-stat');

                if(cdn_stat_value){
                    cdn_stat_value.innerHTML = 'enabled'
                }else{
                    cdn_stat_value.innerHTML = 'not enabled'
                }

            }

            if(window.rapidload_preview_stats.font && window.rapidload_preview_stats.google_font){
                const font_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-font-stat');

                if(font_stat_value){
                    font_stat_value.innerHTML = 'total ' + window.rapidload_preview_stats.google_font.length + " css found and " +  window.rapidload_preview_stats.google_font.filter(a => a.new_href).length + " minified"
                }else{
                    font_stat_value.innerHTML = 'not found'
                }

            }

            if(window.rapidload_preview_stats.js){
                const js_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-js-stat');

                var list = [];

                console.log('running')

                if(window.rapidload_preview_stats.js['defer']){

                    list.push(window.rapidload_preview_stats.js['defer'].length + ' files defered')

                }

                if(window.rapidload_preview_stats.js['delay']){

                    list.push(window.rapidload_preview_stats.js['delay'].length + ' files delayed')

                }

                if(window.rapidload_preview_stats.js['minify']){

                    list.push(window.rapidload_preview_stats.js['minify'].length + ' files minified')

                }

                if(js_stat_value){
                    js_stat_value.innerHTML = list.join(", ")
                }

            }

            const rapidload_optimizer_stat_container_div_content = document.querySelector('#rapidload-optimizer-stat-container');

            if (rapidload_optimizer_stat_container_div_content) {
                rapidload_optimizer_stat_container_div_content.style.display = "block";
            }

        }
    })

})()