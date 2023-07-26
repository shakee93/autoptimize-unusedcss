import React from "react";
import "./index.css";
import App from "app/app";
import domReady from '@wordpress/dom-ready';

import {createRoot} from 'react-dom/client';
import {OptimizerProvider} from "./context/root";
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip'
import {Provider} from "react-redux";
import store from "./store";

domReady(function () {
    // page optimizer container
    const container = document.getElementById('rapidload-page-optimizer') as HTMLDivElement;

    // see if admin bar node is there
    const admin_bar = document.getElementById('rl-node-wrapper') as HTMLDivElement;

    const is_popup = !!admin_bar;

    const optimizer = createRoot(container);
    optimizer.render(
        <Provider store={store}>
            <OptimizerProvider>
                <TooltipProvider delayDuration={100}>
                    <App is_popup={is_popup}/>
                </TooltipProvider>
            </OptimizerProvider>
        </Provider>
    );
});