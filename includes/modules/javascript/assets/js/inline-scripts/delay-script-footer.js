//!injected by RapidLoad \n
document.addEventListener('DOMContentLoaded', function(event) {
    var totalScripts = 0;

    var loadedScripts = 0;

    function onScriptLoad() {
        loadedScripts++;
        if (loadedScripts === totalScripts) {
            // All scripts are loaded, fire the custom eventa
            var allScriptsLoadedEvent = new Event('RapidLoad:DelayedScriptsLoaded');
            document.dispatchEvent(allScriptsLoadedEvent);
        }
    }

    ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
        var listener = function () {
            removeEventListener(event, listener);
            var scripts = document.querySelectorAll('[data-rapidload-src]');
            totalScripts = scripts.length;

            scripts.forEach(function(script) {
                script.addEventListener('load', onScriptLoad);
                script.setAttribute('src', script.getAttribute('data-rapidload-src'));
                script.removeAttribute('data-rapidload-src');
            });

            // Check if there are no scripts to load
            if (totalScripts === 0) {
                document.dispatchEvent(new Event('RapidLoad:DelayedScriptsLoaded'));
            }
        };
        addEventListener(event, listener);
    });
});
