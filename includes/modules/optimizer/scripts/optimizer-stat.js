(function (){

    let avif_count = 0;

    function is_rapidload_preview() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = [];
        urlParams.forEach((value, key) => {
            params.push(key)
        });
        return params.includes("rapidload_preview");
    }

    async function monitorNetworkImagesWithMIMECheck() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
    
            // Filter for image resources
            const imageEntries = entries.filter((entry) => entry.initiatorType === 'img');
            
            // Track unique image URLs and avoid duplicates
            const processedUrls = new Set();
            
            // Process each unique image entry
            imageEntries.forEach(async (entry) => {
                if (!processedUrls.has(entry.name)) {
                    processedUrls.add(entry.name);
                    
                    try {
                        const response = await fetch(entry.name, { method: 'HEAD' });
                        const contentType = response.headers.get('content-type');
                        
                        if (contentType === 'image/avif') {
                            avif_count++;
                        }
                        
                        if (processedUrls.size === imageEntries.length) {
                            console.log(`Number of AVIF images: ${avif_count} out of ${processedUrls.size} total images`);
                        }
                        
                    } catch (error) {
                        console.error(`Failed to fetch headers for: ${entry.name}`, error);
                    }
                }
            });
        });
    
        observer.observe({ type: 'resource', buffered: true });
    }
    // Call the function
    monitorNetworkImagesWithMIMECheck();
    

    document.addEventListener('DOMContentLoaded', function (){
        if (is_rapidload_preview()) {
            // check cache served
            const rapidload_cache_status_div_content = document.querySelector('#rapidload-cache-status');

            if (rapidload_cache_status_div_content) {
                console.log('Page Cache working')
            }

            const rapidload_cpcss_style_content = document.querySelector('#rapidload-critical-css');

            if(rapidload_cpcss_style_content){
                console.log('Critical CSS working')
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

            if(window.rapidload_preview_stats.cdn === 'enabled'){

                console.log('CDN working')

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