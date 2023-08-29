import React from "react";
import "./index.css";
import App from "app/app";
import domReady from '@wordpress/dom-ready';
import { LazyMotion, domAnimation } from "framer-motion"


import {createRoot} from 'react-dom/client';
import {OptimizerProvider} from "./context/root";
import {Provider} from "react-redux";
import store from "./store";
import {TooltipProvider} from "components/ui/tooltip";


domReady(function () {

    // if (!window.rapidload_optimizer) {
    //     window.rapidload_optimizer = {
    //         "page_optimizer_package_base": "http://rapidload.local/wp-content/plugins/autoptimize-unusedcss/includes/admin/page-optimizer/dist",
    //         "page_optimizer_base": "http://rapidload.local/wp-content/plugins/autoptimize-unusedcss/includes/admin/page-optimizer/dist",
    //         "plugin_url": "http://rapidload.local/wp-content/plugins/autoptimize-unusedcss/",
    //         "ajax_url": "http://rapidload.local/wp-admin/admin-ajax.php",
    //         "optimizer_url": "http://rapidload.local/",
    //         "nonce": "576f0d1b49",
    //         "timezone": "",
    //         "actions": [
    //             {
    //                 "tooltip": "Clear Site Cache",
    //                 "href": "/hello-world/?_cache=rapidload-cache&amp;_action=clear&amp;_wpnonce=c2f8166334",
    //                 "icon": "clear_cache"
    //             },
    //             {
    //                 "tooltip": "Clear Page Cache",
    //                 "href": "/hello-world/?_cache=rapidload-cache&amp;_action=clear&amp;_url=http%3A%2F%2Frapidload.local%2F&amp;_wpnonce=c2f8166334",
    //                 "icon": "clear_page_cache"
    //             },
    //             {
    //                 "tooltip": "Clear CSS/JS/Font Optimizations",
    //                 "href": "/hello-world/?_action=rapidload_purge_all&amp;nonce=576f0d1b49",
    //                 "icon": "clear_optimization"
    //             }
    //         ]
    //     }
    // }

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
                    <LazyMotion features={domAnimation}>
                        <App is_popup={is_popup}/>
                    </LazyMotion>
                </TooltipProvider>
            </OptimizerProvider>
        </Provider>
    );
});