(function (){

    let diagnose_data = {};

    function is_rapidload_preview() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = [];
        urlParams.forEach((value, key) => {
            params.push(key)
        });
        return params.includes("rapidload_preview");
    }

    document.addEventListener('DOMContentLoaded', function (){
        if (is_rapidload_preview()) {
            // check cache served
            const rapidload_cache_status_div_content = document.querySelector('#rapidload-cache-status');

            if (rapidload_cache_status_div_content) {
                console.log('Page Cache working')
                diagnose_data.cache = true;
            }

            const rapidload_cpcss_style_content = document.querySelector('#rapidload-critical-css');

            if(rapidload_cpcss_style_content){
                console.log('Critical CSS working')
                diagnose_data.cpcss = true;
            }

            const allStylesheets = document.querySelectorAll('link[type="text/css"]');
            const nonOptimizedStylesheets = Array.from(allStylesheets).filter(sheet => !sheet.hasAttribute('data-rpd-uucss'));

            if(nonOptimizedStylesheets.length > 0) {
                console.log('Found ' + nonOptimizedStylesheets.length + ' non-optimized stylesheets:');
                diagnose_data.non_optimized_css = nonOptimizedStylesheets.map(sheet => sheet.href);
            }

            const nonMinifiedStylesheets = Array.from(allStylesheets).filter(sheet => {
                const href = sheet.href || '';
                return !sheet.hasAttribute('data-rpd-minify') && !href.toString().includes('.min.css');
            });

            if(nonMinifiedStylesheets.length > 0) {
                console.log('Found ' + nonMinifiedStylesheets.length + ' non-minified stylesheets:');
                diagnose_data.non_minified_css = nonMinifiedStylesheets.map(sheet => sheet.href);
            }

            if(window.rapidload_preview_stats.uucss){
                
                let found_optimized_css = window.rapidload_preview_stats.uucss.filter(a => a.new_href).length
                console.log(window.rapidload_preview_stats.uucss.length + ' css files found')
                console.log(found_optimized_css + ' css files optimized')
                let not_optimized_css = window.rapidload_preview_stats.uucss.filter(a => !a.new_href).length
                console.log(not_optimized_css + ' css files not optimized')
                
            }

            if(window.rapidload_preview_stats.minify_css){
                const minify_css_stat_value = document.querySelector('#rapidload-optimizer-stat-container #rapidload-minify-css-stat');

                if(minify_css_stat_value){
                    minify_css_stat_value.innerHTML = 'total ' + window.rapidload_preview_stats.uucss.length + " css found and " +  window.rapidload_preview_stats.uucss.filter(a => a.new_href).length + " minified"
                }

            }

            const preconnectLink = document.querySelector('link[rel="preconnect"][crossorigin][href*=".rapidload-cdn.io"]');
                if(preconnectLink) {
                    console.log('CDN working');
                    diagnose_data.cdn = true;
                }

            if(window.rapidload_preview_stats.font && window.rapidload_preview_stats.font.google_fonts){

                console.log(window.rapidload_preview_stats.font.google_fonts.length + ' google font ' + (window.rapidload_preview_stats.font.google_fonts.length === 1 ? 'file' : 'files') + ' inlined')

            }

            if(window.rapidload_preview_stats.js){

                if(window.rapidload_preview_stats.js['defer']){

                    console.log(window.rapidload_preview_stats.js['defer'].length + ' files defered')

                }

                if(window.rapidload_preview_stats.js['delay']){

                    console.log(window.rapidload_preview_stats.js['delay'].length + ' files delayed')

                }

                if(window.rapidload_preview_stats.js['minify']){

                    console.log(window.rapidload_preview_stats.js['minify'].length + ' files minified')

                }

            }

        }


        setTimeout(() => {
            window.parent.postMessage(
                {
                    type: "RAPIDLOAD_CHECK_RESULTS",
                    data: window.rapidload_preview_stats,
                },
                "*" 
            );
        }, 5000);
    })

})()