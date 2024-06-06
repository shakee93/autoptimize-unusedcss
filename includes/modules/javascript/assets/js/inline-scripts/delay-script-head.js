//!injected by RapidLoad \n
(function() {
    var supportedEvents = ['DOMContentLoaded', 'readystatechanges', 'load'];
    var supportedTargets = [window, document];
    var originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    var originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    var capturedEvents = [];
    var dispatchedEvents = [];

    window.RaipdLoadJSDebug = {
        capturedEvents,
        dispatchedEvents
    }

    EventTarget.prototype.addEventListener = function(type, listener, ...options) {

        var isDispatched = (!type.includes('RapidLoad:') && !!dispatchedEvents.find(e => e.type === type) && supportedTargets.includes(this))
        var catchEvent = !type.includes('RapidLoad:') && !type.includes(':norapidload') && supportedEvents.includes(type) && supportedTargets.includes(this) && typeof listener === 'function'


        if (
            catchEvent
            || (catchEvent !== isDispatched && isDispatched)
        ) {

            if ((this === document && document.readyState !== 'loading') ||
                (this === window && document.readyState !== 'loading' )) {
                setTimeout(() => {
                    if (typeof listener !== 'function') {
                        return;
                    }
                    if(listener){
                        listener.call(this, new Event(type));
                    }
                }, 10);

            } else {
                capturedEvents.push({ target: this, type, listener, options });
            }
        }

        if (type.includes(':norapidload')) {
            type = type.replace(':norapidload', '');
        }

        originalAddEventListener.call(this, type, listener, ...options);
    };

    EventTarget.prototype.removeEventListener = function(type, listener, ...options) {
        if (supportedEvents.includes(type) && supportedTargets.includes(this)) {
            capturedEvents = capturedEvents.filter(e => !(e.type === type && e.listener === listener && e.target === this));
        }
        originalRemoveEventListener.call(this, type, listener, ...options);
    };

    EventTarget.prototype.dispatchEvent = function(event) {

        dispatchedEvents.push(event)

        if (supportedEvents.includes(event.type) && supportedTargets.includes(this)) {
            capturedEvents = capturedEvents.filter(e => {
                if (e.type === event.type && e.target === this) {
                    e.target.removeEventListener(e.type, e.listener, ...e.options);
                    return false;
                }
                return true;
            });
        }



        return originalDispatchEvent.call(this, event);
    };

    supportedEvents.forEach(function(eventType) {
        supportedTargets.forEach(function(target) {
            target.addEventListener(eventType, function() {});
        });
    });
})();
