import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useRootContext } from '../context/root';
import {isDev} from "lib/utils";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonRootState} from "../store/common/commonActions";

interface ShadowDomProps {
    children: React.ReactNode;
    styles: string;
    node?: HTMLElement | null
}

const ShadowRoot: React.FC<ShadowDomProps> = ({ children, node, styles }) => {
    const hostRef = useRef<HTMLDivElement>(node as HTMLDivElement);
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const { theme, setIsDark } = useRootContext();
    const darkModeClass = 'rapidload-dark';
    const { optimizerRoot, dispatch} = useCommonDispatch()
    const [forDev, setForDev] = useState(true)

    useEffect(() => {

        if (isDev && forDev) {
            setPortalContainer(document.body as HTMLDivElement)
        }

        if (portalContainer) {
            if (theme === 'dark') {
                portalContainer.classList.add(darkModeClass);
                setIsDark(true)
            } else if (theme === 'light') {
                portalContainer.classList.remove(darkModeClass);
                setIsDark(false)
            } else if (theme === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    portalContainer.classList.add(darkModeClass);
                    setIsDark(true)
                } else {
                    portalContainer.classList.remove(darkModeClass);
                    setIsDark(false)
                }
            }
        }


    }, [theme, portalContainer, node]);
    //
    if(isDev && forDev) {
        return <>{children}</>
    }

    useEffect(() => {
        if (hostRef.current) {
            const shadowRoot = hostRef.current.attachShadow({ mode: 'open' });


            if (styles) {
                // in here for backward compatibility
                const originalStyles = document.getElementById('rapidload_page_optimizer-css') as HTMLLinkElement;
                let styleSheetURL = window.rapidload_optimizer.titan_stylesheet_url;


                if (!styleSheetURL) {
                    styleSheetURL = originalStyles.href
                }

                const styleLink = document.createElement('link');
                styleLink.setAttribute('rel', 'stylesheet');
                styleLink.setAttribute('href', styleSheetURL ? styleSheetURL : styles);
                shadowRoot.appendChild(styleLink);
            }

            // This div will act as the container for the portal
            const portalDiv = document.createElement('div');
            // portalDiv.style.fontSize = '16px';
            shadowRoot.appendChild(portalDiv);

            setPortalContainer(portalDiv);
        }
    }, [styles]);

    let portal =  portalContainer ? ReactDOM.createPortal(children, portalContainer) : '' ;

    return (
        <>
            {portal}
            {!node && <div id='rapidload-optimizer-shadow-dom' ref={hostRef}></div>}
        </>
    )
};

export default ShadowRoot;
