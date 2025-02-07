import React, {ReactNode, Suspense} from "react";
import "./index.css";
import stylesUrl from './index.css?url';
import App from "app/app";
import 'react-circular-progressbar/dist/styles.css';

import "@fontsource-variable/inter";

import {createRoot} from 'react-dom/client';
import ShadowRoot from "components/shadow-dom";
import SpeedPopover from "app/speed-popover";
import {isDev, isAdminPage} from "lib/utils";
import {disableDebugReport} from "lib/utils";
import Providers from "./Providers";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact, {BugsnagPluginReactResult} from '@bugsnag/plugin-react'

if (!isDev && !disableDebugReport) {
    Bugsnag.start({
        appVersion: __OPTIMIZER_VERSION__,
        apiKey: '005f0d45718ad741e38cf9280457d034',
        plugins: [new BugsnagPluginReact()],
        onError: function (event) {
            event.addMetadata('titan', {
                ...window?.rapidload_optimizer
            })
        }
    })
}

const plugin = !isDev && !disableDebugReport ? Bugsnag.getPlugin("react") as BugsnagPluginReactResult : null;
export const ErrorBoundary = plugin ? plugin.createErrorBoundary(React) : null;

interface initRapidLoadOptimizerProps {
    container: HTMLDivElement
    showOptimizer?: boolean
    popup?: HTMLElement | null
    mode?: RapidLoadOptimizerModes,
    modeData?: RapidLoadOptimizerModeData
    global?: boolean
    shadowRoot?: boolean
}

const logError = (error: Error, info: { componentStack: string }) => {
    // Do something with the error, e.g. log to an external API
    console.error(error, info);
};

const ApplicationCrashed = () => {

    const containerStyles = {
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
                RapidLoad Optimizer crashed :( <button style={errorStyle}
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

    return ErrorBoundary ? <ErrorBoundary FallbackComponent={ApplicationCrashed} >{children}</ErrorBoundary> : children
}
export class RapidLoadOptimizer {
    constructor({
                    mode = 'normal',
                    container,
                    showOptimizer = false,
                    popup = null,
                    modeData,
                    global = false,
                    shadowRoot = true,
                }: initRapidLoadOptimizerProps) {
        const optimizer = createRoot(container);
        optimizer.render(
               <ApplicationErrorBoundary fallback={<ApplicationCrashed/>} onError={logError}>

                   <Providers
                       mode={mode}
                       modeData={modeData}
                       popup={popup}
                       global={global}
                       showOptimizer={showOptimizer} >
                       {popup && (
                           <ShadowRoot disabled={!shadowRoot} node={popup} styles={stylesUrl}>
                               <SpeedPopover/>
                           </ShadowRoot>

                       )}

                           <ShadowRoot disabled={!shadowRoot} styles={stylesUrl}>
                               <App _showOptimizer={showOptimizer} popup={popup}/>
                           </ShadowRoot>
                   </Providers>

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
        //let popup = null
        // if(!isAdminPage){
        //     popup = replaceParentWithDiv(document.getElementById('rl-node-wrapper') as HTMLDivElement)
        // }
        let popup = replaceParentWithDiv(document.getElementById('rl-node-wrapper') as HTMLDivElement)

        new RapidLoadOptimizer({
            container,
            popup,
            showOptimizer: true,
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

