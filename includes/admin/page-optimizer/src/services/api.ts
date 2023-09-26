import {isDev} from "lib/utils";

class ApiService {
    public baseURL: URL;

    constructor(options: WordPressOptions, query?: string, action?: string) {
        let base = options?.ajax_url
            ? options.ajax_url
            : "http://rapidload.local/wp-admin/admin-ajax.php";

        const queryParams = new URLSearchParams(query);

        if (action) queryParams.append("action", action);

        if (options.nonce && !queryParams.has('nonce')) queryParams.append("nonce", options.nonce);

        this.baseURL = new URL(base + "?" + queryParams.toString());

    }

    async throwIfError(response: Response) {

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        let data = await response.json();

        if (!data.success) {
            throw new Error("Problem Retrieving Data: Our Apologies. For Assistance, Please Reach Out to Customer Support.");
        }

        return data
    }

    async fetchPageSpeed(url: string, activeReport: string, reload: boolean) {


        try {
            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'fetch_page_speed')
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)
            this.baseURL.searchParams.append('new', reload as unknown as string)
            this.baseURL.searchParams.append('is_dev', isDev as unknown as string)

            const response = await fetch(this.baseURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            return this.throwIfError(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateSettings(url: string, activeReport: string, reload: boolean, data: any, global: boolean, analyze: boolean) {
        try {

            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'optimizer_update_settings')

            if(global) this.baseURL.searchParams.append('global', 'true')
            if(analyze) this.baseURL.searchParams.append('analyze', 'true')

            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)

            const response = await fetch(this.baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data,
                }),
            });



            return this.throwIfError(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async post() {

        try {
            const response = await fetch(this.baseURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            return this.throwIfError(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ApiService;
