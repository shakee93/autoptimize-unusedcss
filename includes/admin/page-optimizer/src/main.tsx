import React from "react";
import "./index.css";
import stylesUrl from './index.css?url';
import App from "app/app";
import domReady from '@wordpress/dom-ready';
import { LazyMotion, domAnimation } from "framer-motion"


import {createRoot} from 'react-dom/client';
import {AppProvider, useAppContext} from "./context/app";
import {Provider} from "react-redux";
import store from "./store";
import {TooltipProvider} from "components/ui/tooltip";
import ShadowDom from "components/shadow-dom";
import RootProvider from "./context/root";
import ShadowRoot from "components/shadow-dom";
import SpeedPopover from "app/speed-popover";

interface initRapidLoadOptimizerProps {
    container: HTMLDivElement
    showOptimizer?: boolean
    popup?: HTMLElement | null
    mode?: RapidLoadOptimizerModes,
    modeData ?:RapidLoadOptimizerModeData
}

export class RapidLoadOptimizer {
    constructor({ mode = 'normal', container, showOptimizer = false, popup = null, modeData} : initRapidLoadOptimizerProps) {
        const optimizer = createRoot(container);
        optimizer.render(
           <RootProvider>
               <ShadowRoot styles={stylesUrl}>
                   <Provider store={store}>
                       <AppProvider initShowOptimizerValue={showOptimizer} mode={mode} modeData={modeData}>
                           <TooltipProvider delayDuration={100}>
                               <LazyMotion features={domAnimation}>
                                   <ShadowRoot styles={stylesUrl}>
                                       <SpeedPopover/>
                                   </ShadowRoot>
                                   <App _showOptimizer={showOptimizer} popup={popup} />
                               </LazyMotion>
                           </TooltipProvider>
                       </AppProvider>
                   </Provider>
               </ShadowRoot>
           </RootProvider>
        );
    }
}

// @ts-ignore
window.RapidLoadOptimizer = RapidLoadOptimizer

domReady(function () {


    if (window?.rapidload_optimizer?.load_optimizer) {

        // page optimizer container
        const container = document.getElementById('rapidload-page-optimizer') as HTMLDivElement;

        // see if admin bar node is there get popup container
        let popup =  replaceParentWithDiv(document.getElementById('rl-node-wrapper') as HTMLDivElement)


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

    for(let i = 0; i < parentElement.attributes.length; i++) {
        const attr = parentElement.attributes[i];

        if(attr.name === 'href') continue;

        newDiv.setAttribute(attr.name, attr.value);
    }

    parentElement.parentNode?.replaceChild(newDiv, parentElement);

    return newDiv
}

