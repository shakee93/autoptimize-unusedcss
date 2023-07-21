import domReady from '@wordpress/dom-ready';
import PageOptimizerData from "./data";

domReady( async function () {
    //do something after DOM loads.
    console.log('Hello from page Optimizer!', window.rapidload.ajax_url);

    const pageOptimizer = new PageOptimizerData()

    const data = await pageOptimizer.analyze("https://rapidload.io")

    console.log(data);
} );