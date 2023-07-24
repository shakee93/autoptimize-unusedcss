/// <reference path="./type.d.ts" />
import apiFetch from '@wordpress/api-fetch';

export default class PageOptimizerData {

    public loading: boolean
    public data
    private loadingChangeCallback

    constructor() {
        // No need to load anything in the constructor
        this.loading = false
        this.data = null

        this.clearLocalStorageCache()
    }

    async analyze(url: string): Promise<any> {
        try {
            // Try to load data from localStorage for the specific URL
            const cachedData = localStorage.getItem(this.getCacheKey(url));

            if (cachedData) {
                // If data is already in cache for this URL, return it
                this.setLoading(false)
                return JSON.parse(cachedData);
            }

            this.setLoading(true)

            // If data is not in cache, make the API call to fetch it
            let _url = window.rapidload.ajax_url + '?action=fetch_page_speed&url=' + encodeURI(url);
            let res = await apiFetch({ path: _url });
            this.data = res
            // Store the fetched data in localStorage with the specific URL as the key
            localStorage.setItem(this.getCacheKey(url), JSON.stringify(this.data));

            this.setLoading(false)

            return res;
        } catch (error) {
            console.error('Error analyzing page:', error);

            this.setLoading(false)

            return {
                error: error,
            };
        }
    }

    // Helper function to generate a unique cache key for each URL
    private getCacheKey(url: string): string {
        return `pageOptimizerData_${url}`;
    }

    private setLoading(value) {
        this.loading = value;

        if (this.loadingChangeCallback) {
            this.loadingChangeCallback(value);
        }
    }

    public onLoadingChange(callback) {
        this.loadingChangeCallback = callback
    }

    public clearLocalStorageCache(): void {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);

                if (key && key.startsWith('pageOptimizerData_')) {
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            console.error('Error clearing localStorage cache:', error);
        }
    }
}

window.PageOptimizerData = new PageOptimizerData()