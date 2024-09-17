//!injected by RapidLoad \n

// Function to detect browser idle using Performance Observer
function detectBrowserIdle() {
    const startTime = performance.now();
    let idleStart = null;
    let isCPUIdle = false;
    let isNetworkIdle = false;
    const idleThreshold = 3000; // 3 seconds delay
    let pendingNetworkRequests = 0;

    function logWithTime(message) {
        const elapsedSeconds = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`[${elapsedSeconds}s] ${message}`);
    }

    function fireEvent(eventName) {
        logWithTime(`Firing event: ${eventName}`);
        document.dispatchEvent(new CustomEvent(eventName));
    }

    // Create a PerformanceObserver to monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') {
                if (isCPUIdle) {
                    isCPUIdle = false;
                    logWithTime('CPU is no longer idle');
                    fireEvent('rapidload:cpu-active');
                }
                idleStart = null;
            }
        }
    });

    // Start observing long task entries
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Create a PerformanceObserver to monitor network requests
    const networkObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
                pendingNetworkRequests++;
                entry.responseEnd = entry.responseEnd || Date.now();
                setTimeout(() => {
                    pendingNetworkRequests--;
                    checkNetworkIdle();
                }, entry.responseEnd - entry.startTime);
            }
        }
    });

    // Start observing network request entries
    networkObserver.observe({ entryTypes: ['resource'] });

    // Function to check if the network is idle
    function checkNetworkIdle() {
        if (pendingNetworkRequests === 0 && !isNetworkIdle) {
            isNetworkIdle = true;
            logWithTime('Network is idle');
            fireEvent('rapidload:network-idle');
        } else if (pendingNetworkRequests > 0 && isNetworkIdle) {
            isNetworkIdle = false;
            logWithTime('Network is no longer idle');
            fireEvent('rapidload:network-active');
        }
    }

    // Function to check if the browser has been idle
    function checkIdle() {
        const now = performance.now();
        if (!idleStart) {
            idleStart = now;
        } else if (now - idleStart >= idleThreshold) {
            if (!isCPUIdle) {
                isCPUIdle = true;
                logWithTime('CPU is idle');
                fireEvent('rapidload:cpu-idle');
            }
        }
        requestAnimationFrame(checkIdle);
    }

    // Start checking for idle state
    requestAnimationFrame(checkIdle);
}

(function () {
 detectBrowserIdle();
    var totalScripts = prepareScripts();
    // const events = ['click', 'mousemove', 'touchstart', 'keydown'];
    const events = ['rapidload:cpu-idle'];
    let userInteracted = false;

    function rpDebug(method = 'log', ...args) {
        if (
            window.location.search.includes('rapidload_debug_js')) {
            console[method](...args);
        }
    }

    rpDebug('info', 'totalScripts');
    rpDebug('table', totalScripts);

    function onScriptLoad(script, success = true) {

        totalScripts = totalScripts.map(s => s.id === script.id && script.loaded === null ? {
            ...script,
            loaded: true,
            success: success
        } : s)

        if (totalScripts.filter(s => s.loaded).length === totalScripts.length) {

            window.rapidloadScripts = totalScripts
            var allScriptsLoadedEvent = new CustomEvent('RapidLoad:DelayedScriptsLoaded', {
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(allScriptsLoadedEvent);
            rpDebug('table', totalScripts)
            rpDebug('info', 'fired: RapidLoad:DelayedScriptsLoaded')
        }
    }

    function prepareScripts() {
        var scripts = Array.from(document.querySelectorAll('[data-rapidload-src]'));

        return scripts.map(function (script, index) {
            var scriptId = script.getAttribute('id');
            var src = script.getAttribute('data-rapidload-src');

            return {
                id: scriptId || index,
                scriptElement: script,
                loaded: null,
                success: false,
                src: src
            }
        });;
    }

    function loadScript(script) {
        return new Promise((resolve, reject)=>{
            var scriptElement = script.scriptElement;
            scriptElement.addEventListener('load', () => onScriptLoad(script));
            scriptElement.addEventListener('error', () => onScriptLoad(script, false));

            setTimeout(() => {
                if (script.src) {
                    scriptElement.setAttribute('src', script.src);
                    scriptElement.removeAttribute('data-rapidload-src');
                }
                resolve(); // Resolve the promise after setting the src attribute
            }, 0); // 1000 milliseconds = 1 second

        })
    }

    async function preloadScripts(totalScripts) {
        const preloadPromises = [];

        totalScripts.forEach((script) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.fetchpriority = 'high';
            link.href = script.src;
            let promise = null

            try {
                promise = new Promise((resolve, reject) => {
                    link.onload = () => {
                        link.parentNode.removeChild(link);
                        resolve(script);
                    };
                    link.onerror = (error) => {
                        link.parentNode.removeChild(link);
                        resolve(script);
                    };
                });
            }catch (e){
                console.log(e)
            }

            if(promise){
                preloadPromises.push(promise);
            }

            document.head.appendChild(link);
        });

        await Promise.all(preloadPromises);
    }

    async function loadScriptsInDependencyOrder() {

        await preloadScripts(totalScripts)

        load_inline_delayed();

        for (const script of totalScripts) {
            loadScript(script);
        }
    }


    var listener = async function () {
        console.log('heee');
        if (!userInteracted) {
            console.log('hereeee');
            userInteracted = true;
            removeEventListeners();
            await loadScriptsInDependencyOrder();

            if (totalScripts === 0) {
                var allScriptsLoadedEvent = new CustomEvent('RapidLoad:DelayedScriptsLoaded', {
                    bubbles: true,
                    cancelable: true
                });

                document.dispatchEvent(allScriptsLoadedEvent);
            }
        }
    };

    events.forEach(function (event) {
        console.log(event);
        document.addEventListener(event, listener);
    });

    function removeEventListeners() {
        events.forEach(function (event) {
            document.removeEventListener(event, listener);
        });
    }

    function load_inline_delayed(){
        Array.from(document.getElementsByTagName('noscript')).forEach(function(e){
            var tag = e.getAttribute('data-rapidload-delayed');
            if(tag !== null && tag !== undefined) {
                var newScript = document.createElement('script');
                var inlineScript = document.createTextNode(e.innerHTML);
                newScript.appendChild(inlineScript);
                e.parentNode.insertBefore(newScript, e);
            }}
        );
    }





// Call the function to start detecting browser idle
   
    
})();
