/// <reference path="./type.d.ts" />
import apiFetch from '@wordpress/api-fetch';

export default class PageOptimizerData {
    public data: any | null;

    constructor() {
        this.data = null;
    }

    async analyze(url: string): Promise<any> {
        try {
            
            console.log();

            let _url = window.rapidload.ajax_url + '?action=fetch_page_speed&url=' + encodeURI(url)
            let res = apiFetch( { path:  _url } ).then(r => {
                console.log(r);
            })
            

            return this.data;
        } catch (error) {
            console.error('Error analyzing page:', error);

            return {
                error: error,
            };
        }
    }
}
