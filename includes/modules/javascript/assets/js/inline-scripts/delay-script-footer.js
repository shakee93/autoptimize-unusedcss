//!injected by RapidLoad \n
(function () {
    function rpDebug(method = 'log', ...args) {
        if (window.location.search.includes('rapidload_debug_js_scripts')) {
            console[method](...args);
        }
    }

    var totalScripts = []
    var loadedScripts = 0;
    var loadedScriptsWithNoDependant = 0;

    function onScriptLoad(script, success = true) {

        totalScripts = totalScripts.map(s => s.id === script.id ? {
            ...script,
            loaded: true,
            success: success
        } : s)

        if (script.dependencies.length === 0) {
            loadedScriptsWithNoDependant++;
        } else {
            loadedScripts++;
        }

        if (script.dependencies.length === 0 &&
            loadedScriptsWithNoDependant === totalScripts.filter(s => s.dependencies.length === 0).length) {
            // All scripts are loaded, fire the custom event
            var allScriptsLoadedNoDepEvent = document.createEvent('Event');
            allScriptsLoadedNoDepEvent.initEvent('RapidLoad:DelayedScriptNoDepsLoaded', true, true);
            document.dispatchEvent(allScriptsLoadedNoDepEvent);
            rpDebug('log', 'fired: RapidLoad:DelayedScriptNoDepsLoaded')
        }

        if (totalScripts.filter(s => s.loaded).length === totalScripts.length) {
            // All scripts are loaded, fire the custom event
            var allScriptsLoadedEvent = document.createEvent('Event');
            allScriptsLoadedEvent.initEvent('RapidLoad:DelayedScriptsLoaded', true, true);
            document.dispatchEvent(allScriptsLoadedEvent);
            rpDebug('log', 'fired: RapidLoad:DelayedScriptsLoaded')

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


        rpDebug('log', totalScripts)

        totalScripts.filter(s => s.dependencies.length === 0).forEach(function (script) {
            var scriptElement = script.scriptElement;
            scriptElement.addEventListener('load', () => onScriptLoad(script));
            scriptElement.addEventListener('error', () => onScriptLoad(script, false)); // Handle script load errors
            scriptElement.setAttribute('src', scriptElement.getAttribute('data-rapidload-src'));
            scriptElement.removeAttribute('data-rapidload-src');
        });

        document.addEventListener('RapidLoad:DelayedScriptNoDepsLoaded', () => {
            totalScripts.filter(s => s.dependencies.length > 0).forEach(function (script) {
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
