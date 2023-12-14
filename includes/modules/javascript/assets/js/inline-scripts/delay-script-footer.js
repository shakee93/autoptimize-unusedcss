//!injected by RapidLoad \n
(function () {
    function mergeDuplicateObjects(array) {
        const mergedObjects = {};

        array.forEach(item => {
            if (!mergedObjects[item.id]) {
                mergedObjects[item.id] = { ...item };
            } else {
                Object.keys(item).forEach(key => {
                    if (item[key] !== null && item[key] !== undefined) {
                        if (mergedObjects[item.id][key] === null || mergedObjects[item.id][key] === undefined) {
                            mergedObjects[item.id][key] = item[key];
                        }
                    }
                });
            }
        });

        return Object.values(mergedObjects);
    }

    var totalScripts = prepareScripts();

    function rpDebug(method = 'log', ...args) {
        if (
            window.location.search.includes('rapidload_debug_js')) {
            console[method](...args);
        }
    }

    rpDebug('info', 'totalScripts');
    rpDebug('table', totalScripts);

    if (window.RAPIDLOAD_EXPERIMENT__DELAY_PREFETCH) {
        document.addEventListener('DOMContentLoaded:norapidload', () => {
            totalScripts.forEach((script, index) => {
                setTimeout(() => {
                    fetch(script.scriptElement.getAttribute('data-rapidload-src')).then(() => {
                        script.asyncLoaded = true
                        script.success = true
                        totalScripts[index] = script
                    }).catch(() => {
                        script.asyncLoaded = true
                        script.success = falsej
                        totalScripts[index] = script
                    }).finally(() => {
                        onScriptAsyncLoad(script)
                    });
                }, 10)
            })
        });
    }


    function createBatches(scripts) {

        // Create a map for easy access to scripts by id
        const scriptMap = new Map(scripts.map((script) => {
            return [script.id, { ...script, batch: null }];
        }));

        function assignBatch(firstScriptId, scriptId, stackSet = new Set()) {

            if(firstScriptId === null){
                firstScriptId = scriptId;
            }

            const script = scriptMap.get(scriptId);

            if (!script) {
                return -1; // Return an error code or handle this scenario appropriately
            }

            // If already visited, return the known batch
            if (script.batch !== null) {
                return script.batch
            }

            // Detect circular dependencies
            if (stackSet.has(scriptId)) {
                throw new Error('RapidLoad: Circular dependency detected at script: ' + scriptId);
            }

            stackSet.add(scriptId);

            // Recursively assign batch numbers based on dependencies
            let maxBatch = 0;
            for (const depId of script.dependencies) {
                const depBatch = assignBatch(firstScriptId, depId, stackSet);
                if (depBatch === -1) {
                    continue; // Skip this dependency or handle error
                }
                maxBatch = Math.max(maxBatch, depBatch);
            }

            // Assign the current script to the next batch after the highest dependency batch
            script.batch = maxBatch + 1;

            stackSet.delete(scriptId);
            return script.batch;
        }

        // Assign batches
        scripts = scripts.map(script => {
            const batchedScript = assignBatch(null, script.id);
            return scriptMap.get(script.id); // Return the script with updated batch number
        });

        scripts.forEach(script => {
            if (script.after) {
                const afterScript = scriptMap.get(script.after );
                if (afterScript) {
                    script.batch = afterScript.batch; // Assign the same batch as the after script
                }
            }
        });

        return scripts
    }


    function onScriptLoad(script, success = true) {

        totalScripts = totalScripts.map(s => s.id === script.id && script.loaded === null ? {
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
            rpDebug('info', 'fired: RapidLoad:DelayedScriptBatchLoaded : ' + script.batch )
            rpDebug('table', totalScripts.filter(s => s.batch === script.batch))
        }

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

        // Parse and store script dependencies
        var mappedScripts = scripts.map(function (script, index) {
            var scriptId = script.getAttribute('id');
            var depsAttribute = script.getAttribute('data-js-deps');
            var src = script.getAttribute('data-rapidload-src');
            var afterAttribute = script.getAttribute('data-js-after');

            return {
                id: scriptId || index,
                scriptElement: script, dependencies: parseDependencies(depsAttribute, scripts, scriptId),
                loaded: null,
                after: afterAttribute ? afterAttribute + '-js' : null,
                success: false,
                src: src
            }
        });

        mappedScripts = mergeDuplicateObjects(mappedScripts)

        return createBatches(mappedScripts);
    }

    function loadScript(script) {
        setTimeout(() => {
            var scriptElement = script.scriptElement;
            scriptElement.addEventListener('load', () => onScriptLoad(script));
            scriptElement.addEventListener('error', () => onScriptLoad(script, false)); // Handle script load errors

            if (script.src) {
                scriptElement.setAttribute('type', 'text/javascript')
                scriptElement.setAttribute('src', script.src);
            }
        }, 35)
    }

    async function fetchAllScripts() {
        return Promise.all(totalScripts.map(async s => {
            let response = await fetch(s.src)
            if (response.ok ) {
                let scriptContent = await response.text();
                // Create a new blob with the script content
                let blob = new Blob([scriptContent], { type: 'text/javascript' });
                s.src = URL.createObjectURL(blob);
            }
            return s;
        }))

    }
    async function loadScriptsInDependencyOrder() {

        totalScripts = await fetchAllScripts()

        totalScripts.filter(s => s.batch === 1).forEach(function (script) {
            loadScript(script)
        });

        document.addEventListener('RapidLoad:DelayedScriptBatchLoaded', (event) => {

            var batch = Number(event.detail.batch) + 1;

            if (batch > totalScripts.filter(s => s.batch).length) {
                return;
            }

            totalScripts.filter(s => s.batch === batch).forEach(function (script) {
                loadScript(script)
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
                    || (dep === 'jquery' && script.id === 'jquery-core-js')
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
        var listener = async function () {
            removeEventListener(event, listener);
            await loadScriptsInDependencyOrder();

            // Check if there are no scripts to load
            if (totalScripts === 0) {
                var allScriptsLoadedEvent = new CustomEvent('RapidLoad:DelayedScriptsLoaded', {
                    bubbles: true,
                    cancelable: true
                });

                document.dispatchEvent(allScriptsLoadedEvent);
            }
        };
        addEventListener(event, listener);
    });
})();
