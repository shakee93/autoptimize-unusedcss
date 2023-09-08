import React, {useRef, useEffect, ReactNode} from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from "react-dom/client";

interface ShadowDomProps {
    children: ReactNode
    styles: string
}

const ShadowRoot = ({ children, styles }: ShadowDomProps) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const shadowRootRef = useRef<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current) {
            shadowRootRef.current = hostRef.current?.attachShadow({ mode: 'open' });

            // If styles are provided, attach them to the shadow root
            if (styles) {
                const originalStyles = document.getElementById('rapidload_page_optimizer-css') as HTMLLinkElement
                const styleLink = document.createElement('link');
                styleLink.setAttribute('rel', 'stylesheet');
                styleLink.setAttribute('href', originalStyles?.href ? originalStyles.href : styles);
                shadowRootRef.current.appendChild(styleLink);
            }

            // ReactDOM will attach the children to a child div inside the shadow root
            const reactRoot = document.createElement('div');
            shadowRootRef.current.appendChild(reactRoot);

            const root = createRoot(reactRoot)
            root.render(children)
        }
    }, [children, styles]);

    return <div ref={hostRef}></div>;
};

export default ShadowRoot;