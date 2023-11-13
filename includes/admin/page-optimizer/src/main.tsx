import React, {ReactNode, Suspense} from "react";
import "./index.css";
import stylesUrl from './index.css?url';
import App from "app/app";
import domReady from '@wordpress/dom-ready';
import {LazyMotion, domAnimation} from "framer-motion"
import 'react-circular-progressbar/dist/styles.css';

import "@fontsource-variable/inter";

import {createRoot} from 'react-dom/client';
import {AppProvider, useAppContext} from "./context/app";
import {Provider} from "react-redux";
import store from "./store";
import {TooltipProvider} from "components/ui/tooltip";
import ShadowDom from "components/shadow-dom";
import RootProvider from "./context/root";
import ShadowRoot from "components/shadow-dom";
import SpeedPopover from "app/speed-popover";
import {ErrorBoundary} from "react-error-boundary";
import {isDev} from "lib/utils";

interface initRapidLoadOptimizerProps {
    container: HTMLDivElement
    showOptimizer?: boolean
    popup?: HTMLElement | null
    mode?: RapidLoadOptimizerModes,
    modeData?: RapidLoadOptimizerModeData
    global?: boolean
}

const logError = (error: Error, info: { componentStack: string }) => {
    // Do something with the error, e.g. log to an external API
    console.error(error, info);
};

const ApplicationCrashed = () => {

    const containerStyles = {
        background: 'white',
        bottom: 0,
        position: 'absolute' as 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '1px solid #F44336',
        boxShadow: '0 10px 15px -3px #F44336, 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        fontSize: '14px'
    };

    const errorStyle = {
        background: 'red',
        padding: '5px 15px',
        fontSize: '12px',
        borderRadius: '5px',
        color: 'white',
        marginLeft: '10px'
    };

    return (
        <div className='rpo-app-crashed' style={containerStyles}>
            <div className='rpo-error'>
                RapidLoad Titan Optimizer crashed :( <button style={errorStyle}
                                                             onClick={e => window.location.reload()}>Reload</button>
            </div>
        </div>
    )
}

interface ApplicationErrorBoundaryProps {
    fallback: ReactNode
    onError: any
    children: ReactNode
}

const ApplicationErrorBoundary = ({fallback, onError, children}: ApplicationErrorBoundaryProps) => {

    if (isDev) {
        return <div>{children}</div>
    }

    return <ErrorBoundary fallback={<ApplicationCrashed/>} onError={logError}>{children}</ErrorBoundary>
}

export class RapidLoadOptimizer {
    constructor({
                    mode = 'normal',
                    container,
                    showOptimizer = false,
                    popup = null,
                    modeData,
                    global = false
                }: initRapidLoadOptimizerProps) {
        const optimizer = createRoot(container);
        optimizer.render(
               <ApplicationErrorBoundary fallback={<ApplicationCrashed/>} onError={logError}>
                   <Provider store={store}>
                       <RootProvider>
                               <AppProvider global={global} initShowOptimizerValue={showOptimizer} mode={mode}
                                            modeData={modeData}>
                                   <TooltipProvider>
                                       <LazyMotion features={domAnimation}>
                                           {popup && (
                                               <ShadowRoot node={popup} styles={stylesUrl}>
                                                   <SpeedPopover/>
                                               </ShadowRoot>
                                           )}

                                           <ShadowRoot styles={stylesUrl}>
                                               <App _showOptimizer={showOptimizer} popup={popup}/>
                                           </ShadowRoot>
                                       </LazyMotion>
                                   </TooltipProvider>
                               </AppProvider>
                       </RootProvider>
                   </Provider>
               </ApplicationErrorBoundary>
        );
    }

    static showOptimizer(value: boolean) {

        const event =
            new CustomEvent('rapidLoad:set-optimizer', {
                detail: {
                    status: value
                }
            });

        window.dispatchEvent(event);
    }

}

// @ts-ignore
window.RapidLoadOptimizer = RapidLoadOptimizer

document.addEventListener('DOMContentLoaded', () => {

    if (window?.rapidload_optimizer?.load_optimizer) {

        // page optimizer container
        const container = document.getElementById('rapidload-page-optimizer') as HTMLDivElement;

        // see if admin bar node is there get popup container
        let popup = replaceParentWithDiv(document.getElementById('rl-node-wrapper') as HTMLDivElement)


        new RapidLoadOptimizer({
            container,
            popup,
            mode: 'normal'
        });
    }

});


function replaceParentWithDiv(childElement: HTMLElement) {

    if (!childElement) return;

    const parentElement = childElement.parentNode as HTMLElement;

    const newDiv = document.createElement('div');
    newDiv.innerHTML = parentElement?.innerHTML;

    for (let i = 0; i < parentElement.attributes.length; i++) {
        const attr = parentElement.attributes[i];

        if (attr.name === 'href') continue;

        newDiv.setAttribute(attr.name, attr.value);
    }

    parentElement.parentNode?.replaceChild(newDiv, parentElement);

    return newDiv
}

