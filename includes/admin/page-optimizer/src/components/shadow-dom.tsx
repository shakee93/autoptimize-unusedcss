import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useRootContext } from '../context/root';

interface ShadowDomProps {
    children: React.ReactNode;
    styles: string;
}

const ShadowRoot: React.FC<ShadowDomProps> = ({ children, styles }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const { theme } = useRootContext();
    const darkModeClass = 'rapidload-dark';


    useEffect(() => {
        if (hostRef.current) {
            const shadowRoot = hostRef.current.attachShadow({ mode: 'open' });


            if (styles) {
                const originalStyles = document.getElementById('rapidload_page_optimizer-css') as HTMLLinkElement;
                const styleLink = document.createElement('link');
                styleLink.setAttribute('rel', 'stylesheet');
                styleLink.setAttribute('href', originalStyles?.href ? originalStyles.href : styles);
                shadowRoot.appendChild(styleLink);
            }

            // This div will act as the container for the portal
            const portalDiv = document.createElement('div');
            shadowRoot.appendChild(portalDiv);

            setPortalContainer(portalDiv);
        }
    }, [styles]);

    useEffect(() => {
        if (portalContainer) {
            if (theme === 'dark') {
                portalContainer.classList.add(darkModeClass);
            } else if (theme === 'light') {
                portalContainer.classList.remove(darkModeClass);
            } else if (theme === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    portalContainer.classList.add(darkModeClass);
                } else {
                    portalContainer.classList.remove(darkModeClass);
                }
            }
        }
    }, [theme, portalContainer]);

    let portal =  portalContainer && ReactDOM.createPortal(children, portalContainer) ;
    
    return (
        <>
            {portal}
            <div ref={hostRef}></div>
        </>
    )
};

export default ShadowRoot;
