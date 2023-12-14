//!injected by RapidLoad \n
(function() {
    var supportedEvents = ['DOMContentLoaded', 'readystatechanges', 'load']; // Add more event types if needed
    var supportedTargets = [window, document]; // Define supported targets
    var originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    var originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    var capturedEvents = [];
    var dispatchedEvents = [];

    window.RaipdLoadJSDebug = {
        capturedEvents,
        dispatchedEvents
    }

    // Override addEventListener to capture future supported event listeners
    EventTarget.prototype.addEventListener = function(type, listener, ...options) {

        var isDispatched = (!type.includes('RapidLoad:') && !!dispatchedEvents.find(e => e.type === type) && supportedTargets.includes(this))
        var catchEvent = !type.includes('RapidLoad:') && !type.includes(':norapidload') && supportedEvents.includes(type) && supportedTargets.includes(this) && typeof listener === 'function'


        if (
            catchEvent
            // TODO: check if elementor/init like events are being already fired if fired execute those immediately
            || (catchEvent !== isDispatched && isDispatched)
        ) {

            if (this === document || this === window) {
                //console.log('listener added: ', type);
            }

            if ((this === document && document.readyState !== 'loading') ||
                (this === window && document.readyState !== 'loading' )) {
                // If the event has already fired, immediately invoke the listener
                setTimeout(() => {

                    listener.call(this, new Event(type));
                }, 10);

            } else {
                // Store the listener for later use
                capturedEvents.push({ target: this, type, listener, options });
            }
        }

        if (type.includes(':norapidload')) {
            type = type.replace(':norapidload', '');
        }

        originalAddEventListener.call(this, type, listener, ...options);
    };

    // Override removeEventListener to manage the removal of captured events
    EventTarget.prototype.removeEventListener = function(type, listener, ...options) {
        if (supportedEvents.includes(type) && supportedTargets.includes(this)) {
            capturedEvents = capturedEvents.filter(e => !(e.type === type && e.listener === listener && e.target === this));
        }
        originalRemoveEventListener.call(this, type, listener, ...options);
    };

    // Override dispatchEvent to detect when supported events are fired
    EventTarget.prototype.dispatchEvent = function(event) {

        dispatchedEvents.push(event)
       // console.log('dispatched: ' + event.type);

        if (supportedEvents.includes(event.type) && supportedTargets.includes(this)) {
            // Remove all listeners for this event type that were added after the event fired
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

    // Listen to supported events on supported targets
    supportedEvents.forEach(function(eventType) {
        supportedTargets.forEach(function(target) {
            target.addEventListener(eventType, function() {});
        });
    });
})();
