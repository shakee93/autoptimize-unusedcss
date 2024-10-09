(function () {

    // Helper class for handling link prefetching and prerendering
    class LinkHandler {
        constructor() {
            this.prefetchSet = new Set();
            this.prerenderSet = new Set();
        }

        // Check if the URL is eligible for prefetching
        shouldPrefetch(url) {
            return !this.prefetchSet.has(url) &&
                !url.includes("?") &&
                window.location.href !== url &&
                url.startsWith(window.location.origin);
        }

        // Create a link element (for prefetch or prerender)
        createLinkElement(rel, href) {
            const link = document.createElement("link");
            link.rel = rel;
            link.href = href;
            document.head.appendChild(link);
        }

        // Prefetch the resource
        prefetchResource(url) {
            if (this.shouldPrefetch(url)) {
                this.createLinkElement("prefetch", url);
                this.prefetchSet.add(url);
            }
        }

        // Prerender the resource
        prerenderResource(anchorElement) {
            const href = anchorElement.href;
            const prerenderTimeout = setTimeout(() => {
                if (this.shouldPrefetch(href)) {
                    this.createLinkElement("prerender", href);
                    this.prerenderSet.add(href);
                }
            }, 200);

            // Cancel prerendering if the user moves the mouse away
            anchorElement.addEventListener("mouseleave", () => clearTimeout(prerenderTimeout), { once: true });
        }
    }

    // Class to handle mouse movement and link proximity on desktop devices
    class DesktopLinkObserver {
        constructor(linkHandler) {
            this.linkHandler = linkHandler;
            this.lastMousePos = { x: null, y: null };
            this.animationFrame = null;
        }

        handleMouseMove(event) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = requestAnimationFrame(() => {
                const { clientX, clientY } = event;

                // Ignore small mouse movements
                if (this.lastMousePos.x !== null && this.lastMousePos.y !== null &&
                    Math.hypot(clientX - this.lastMousePos.x, clientY - this.lastMousePos.y) < 100) {
                    return;
                }

                this.lastMousePos = { x: clientX, y: clientY };

                document.querySelectorAll("a[href]").forEach(anchorElement => {
                    const boundingBox = anchorElement.getBoundingClientRect();
                    const distanceToLeft = Math.min(Math.abs(clientX - boundingBox.left), Math.abs(clientX - boundingBox.right));
                    const distanceToTop = Math.min(Math.abs(clientY - boundingBox.top), Math.abs(clientY - boundingBox.bottom));

                    if (Math.hypot(distanceToLeft, distanceToTop) < 200) {
                        this.linkHandler.prefetchResource(anchorElement.href);
                    }

                    anchorElement.addEventListener("mouseenter", () => {
                        this.linkHandler.prerenderResource(anchorElement);
                    }, { once: true });
                });
            });
        }

        observe() {
            document.addEventListener("mousemove", event => this.handleMouseMove(event), {
                capture: true,
                passive: true
            });
        }
    }

    // Class to handle link visibility and user touch events on mobile devices
    class MobileLinkObserver {
        constructor(linkHandler) {
            this.linkHandler = linkHandler;
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                rootMargin: "50px 20px",
                threshold: 0.5
            });
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.linkHandler.prefetchResource(entry.target.href);
                    this.observer.unobserve(entry.target);
                }
            });
        }

        observe() {
            document.querySelectorAll("a[href]").forEach(anchorElement => {
                this.observer.observe(anchorElement);
                anchorElement.addEventListener("touchstart", () => {
                    this.linkHandler.prerenderResource(anchorElement);
                }, { passive: true });
            });
        }
    }

    // Main initialization function
    function init() {
        if (isSaveDataEnabled() || !supportsPrefetch()) return;

        const linkHandler = new LinkHandler();

        if (isMobileDevice()) {
            const mobileObserver = new MobileLinkObserver(linkHandler);
            mobileObserver.observe();
        } else {
            const desktopObserver = new DesktopLinkObserver(linkHandler);
            desktopObserver.observe();
        }
    }

    // Utility functions
    function isSaveDataEnabled() {
        const connection = navigator.connection;
        return connection?.saveData || connection?.effectiveType === "2g";
    }

    function supportsPrefetch() {
        const link = document.createElement("link");
        return link.relList?.supports("prefetch");
    }

    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }

    // Execute the main initialization
    init();

})();
