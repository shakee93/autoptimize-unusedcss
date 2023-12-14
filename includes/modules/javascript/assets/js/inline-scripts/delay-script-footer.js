//!injected by RapidLoad \n
(function () {
    var totalScripts = prepareScripts();
    const events = ['click', 'mousemove', 'touchstart', 'keydown'];
    let listenerTriggered = false;

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
            rpDebug('info', 'fired: RapidLoad:DelayedScriptsLoaded')
            rpDebug('table', totalScripts)
            console.warn('RapidLoad Warning: If you intend to debug JavaScript files, kindly disable the [RapidLoad delay js] feature.');

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
        var scriptElement = script.scriptElement;
        scriptElement.addEventListener('load', () => onScriptLoad(script));
        scriptElement.addEventListener('error', () => onScriptLoad(script, false)); // Handle script load errors

        if (script.src) {
            scriptElement.setAttribute('src', script.src);
            scriptElement.removeAttribute('data-rapidload-src');
        }
    }

    async function preloadScripts(totalScripts) {
        const preloadPromises = [];

        totalScripts.forEach((script) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.fetchpriority = 'high';
            link.href = script.src;

            const promise = new Promise((resolve, reject) => {
                link.onload = () => {
                    link.parentNode.removeChild(link);
                    resolve(script);
                };
                link.onerror = (error) => {
                    resolve(script);
                };
            });

            preloadPromises.push(promise);

            // Append the <link> element to the <head> to trigger preloading
            document.head.appendChild(link);
        });

        await Promise.all(preloadPromises);
    }

    async function loadScriptsInDependencyOrder() {

        await preloadScripts(totalScripts)

        for (const script of totalScripts) {
            loadScript(script);
        }
    }


    var listener = async function () {
        if (!listenerTriggered) {
            listenerTriggered = true;
            removeEventListeners(); // Remove all event listeners once triggered
            await loadScriptsInDependencyOrder();

            // Check if there are no scripts to load
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
        addEventListener(event, listener);
    });

    function removeEventListeners() {
        events.forEach(function (event) {
            removeEventListener(event, listener);
        });
    }
})();
