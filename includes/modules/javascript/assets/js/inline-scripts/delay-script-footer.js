//!injected by RapidLoad \n
(function () {

    function groupScripts(scripts) {
        // Create a map for easy access to scripts by id
        const scriptMap = new Map(scripts.map(script => [script.id, script]));

        // Helper function to determine the maximum batch number among dependencies
        const maxBatchNumberOfDependencies = script => {
            return Math.max(0, ...script.dependencies.map(dep => scriptMap.get(dep).batch || 0));
        };

        // Sort scripts to ensure zero-dependency scripts come first
        scripts.sort((a, b) => a.dependencies.length - b.dependencies.length);

        // Assign batch numbers based on dependencies
        scripts.forEach(script => {
            script.batch = maxBatchNumberOfDependencies(script) + 1;
        });

        // Group scripts by their batch number
        const batchMap = new Map();
        scripts.forEach(script => {
            if (!batchMap.has(script.batch)) {
                batchMap.set(script.batch, []);
            }
            batchMap.get(script.batch).push(script);
        });

        // Convert the map to a sorted array of batches
        return Array.from(batchMap.values());
    } 
    
    function rpDebug(method = 'log', ...args) {
        if (window.location.search.includes('rapidload_debug_js_scripts')) {
            console[method](...args);
        }
    }

    var totalScripts = []
    var groupedScripts = [];
    var loadedScripts = 0;
    var loadedScriptsWithNoDependant = 0;

    function onScriptLoad(script, success = true) {

        totalScripts = totalScripts.map(s => s.id === script.id ? {
            ...script,
            loaded: true,
            success: success
        } : s)

        if(totalScripts.filter(s => s.batch === script.batch).length ===
            totalScripts.filter(s => s.batch === script.batch && s.loaded ).length) {
            var batchLoadedEvent = new CustomEvent('RapidLoad:DelayedScriptBatchLoaded', {
                detail: { batch: script.batch },
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(batchLoadedEvent);
            rpDebug('log', 'fired: RapidLoad:DelayedScriptBatchLoaded', script.batch)
        }

        if (totalScripts.filter(s => s.loaded).length === totalScripts.length) {

            var allScriptsLoadedEvent = new CustomEvent('RapidLoad:DelayedScriptsLoaded', {
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(allScriptsLoadedEvent);
            rpDebug('log', 'fired: RapidLoad:DelayedScriptsLoaded')
            rpDebug('table', totalScripts)
        }
    }


    function loadScriptsInDependencyOrder(scripts) {
        // Create a map to store scripts and their dependencies

        // Parse and store script dependencies
        scripts.forEach(function (script) {
            var scriptId = script.getAttribute('id');
            var depsAttribute = script.getAttribute('data-js-deps');

            totalScripts.push({
                id: scriptId,
                scriptElement: script, dependencies: parseDependencies(depsAttribute, totalScripts, scriptId),
                loaded: null
            })
        });

        groupedScripts = groupScripts(totalScripts);
        rpDebug('table', totalScripts)

        totalScripts.filter(s => s.batch === 1).forEach(function (script) {
            var scriptElement = script.scriptElement;
            scriptElement.addEventListener('load', () => onScriptLoad(script));
            scriptElement.addEventListener('error', () => onScriptLoad(script, false)); // Handle script load errors
            scriptElement.setAttribute('src', scriptElement.getAttribute('data-rapidload-src'));
            scriptElement.removeAttribute('data-rapidload-src');
        });

        document.addEventListener('RapidLoad:DelayedScriptBatchLoaded', (event) => {

            var batch = Number(event.detail.batch) + 1;

            if (batch > totalScripts.filter(s => s.batch).length) {
                return;
            }

            totalScripts.filter(s => s.batch === batch).forEach(function (script) {
                var scriptElement = script.scriptElement;
                scriptElement.addEventListener('load', () => onScriptLoad(script));
                scriptElement.addEventListener('error', () => onScriptLoad(script, false)); // Handle script load errors
                scriptElement.setAttribute('src', scriptElement.getAttribute('data-rapidload-src'));
                scriptElement.removeAttribute('data-rapidload-src');
            });
        })
    }

    function parseDependencies(depsAttribute, scriptMap, scriptId) {
        let deps = []

        let depAttributes = depsAttribute ? depsAttribute.split(', ') : [];

        deps = depAttributes.map(function (dep) {
            // Check if the dependency matches a script ID without '-js' suffix
            var matchingScript = scriptMap.find(function (script) {
                return script.id === dep + '-js'
                    || (dep.includes('jquery') && script.id === 'jquery-core-js')
                    || (dep.startsWith('jquery-ui-') && script.id === 'jquery-ui-core-js');
            });

            if (matchingScript) {
                return matchingScript.id;
            } else {
                console.warn('Dependency not found for:', dep);
                return null;
            }
        }).filter(Boolean); // Remove null values

        // try to find any jquery dep through its file id
        if (scriptId !== 'jquery-core-js' && scriptId && scriptId.includes('jquery-')) {
            deps.push('jquery-core-js')
        }

        return deps;
    }


    ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
        var listener = function () {
            removeEventListener(event, listener);
            var scripts = Array.from(document.querySelectorAll('[data-rapidload-src]'));
            loadScriptsInDependencyOrder(scripts);

            // Check if there are no scripts to load
            if (totalScripts === 0) {
                var allScriptsLoadedEvent = document.createEvent('Event');
                allScriptsLoadedEvent.initEvent('RapidLoad:DelayedScriptsLoaded', true, true);
                document.dispatchEvent(allScriptsLoadedEvent);
            }
        };
        addEventListener(event, listener);
    });
})();
