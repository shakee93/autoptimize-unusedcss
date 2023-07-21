/// <reference path="./type.d.ts" />
import apiFetch from '@wordpress/api-fetch';

export default class PageOptimizerData {

    public loading: boolean
    public data

    constructor() {
        // No need to load anything in the constructor
        this.loading = false
        this.data = null
    }

    async analyze(url: string): Promise<any> {
        try {
            // Try to load data from localStorage for the specific URL
            const cachedData = localStorage.getItem(this.getCacheKey(url));

            if (cachedData) {
                // If data is already in cache for this URL, return it
                return JSON.parse(cachedData);
            }

            this.loading = true

            // If data is not in cache, make the API call to fetch it
            let _url = window.rapidload.ajax_url + '?action=fetch_page_speed&url=' + encodeURI(url);
            let res = await apiFetch({ path: _url });
            this.data = JSON.stringify(res)
            // Store the fetched data in localStorage with the specific URL as the key
            localStorage.setItem(this.getCacheKey(url), this.data);

            this.loading = false

            return res;
        } catch (error) {
            console.error('Error analyzing page:', error);

            this.loading = false

            return {
                error: error,
            };
        }
    }

    // Helper function to generate a unique cache key for each URL
    private getCacheKey(url: string): string {
        return `pageOptimizerData_${url}`;
    }
}

window.PageOptimizerData = new PageOptimizerData()