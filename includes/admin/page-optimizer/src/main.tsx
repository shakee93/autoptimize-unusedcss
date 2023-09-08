import React from "react";
import "./index.css";
import App from "app/app";
import domReady from '@wordpress/dom-ready';
import { LazyMotion, domAnimation } from "framer-motion"


import {createRoot} from 'react-dom/client';
import {OptimizerProvider, useOptimizerContext} from "./context/root";
import {Provider} from "react-redux";
import store from "./store";
import {TooltipProvider} from "components/ui/tooltip";

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
            <Provider store={store}>
                <OptimizerProvider initShowOptimizerValue={showOptimizer} mode={mode} modeData={modeData}>
                    <TooltipProvider delayDuration={100}>
                        <LazyMotion features={domAnimation}>
                            <App _showOptimizer={showOptimizer} popup={popup} />
                        </LazyMotion>
                    </TooltipProvider>
                </OptimizerProvider>
            </Provider>
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

