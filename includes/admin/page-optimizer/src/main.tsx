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
}

export class RapidLoadOptimizer {
    constructor({ container, showOptimizer = false, popup = null} : initRapidLoadOptimizerProps) {
        const optimizer = createRoot(container);
        optimizer.render(
            <Provider store={store}>
                <OptimizerProvider>
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
        const popup = document.getElementById('rl-node-wrapper') as HTMLDivElement;

        new RapidLoadOptimizer({
            container,
            popup
        });
    }

});