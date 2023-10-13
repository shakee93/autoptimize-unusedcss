import {isDev} from "lib/utils";

class ApiService {
    public baseURL: URL;

    constructor(options?: WordPressOptions, query?: string, action?: string) {

        if (!options) {
            options = window.rapidload_optimizer
        }

        let base = options?.ajax_url
            ? options.ajax_url
            : "http://rapidload.local/wp-admin/admin-ajax.php";

        const queryParams = new URLSearchParams(query);

        if (action) {
            queryParams.append("action", action);
        }

        if (options.nonce && !queryParams.has('nonce')) {
            queryParams.append("nonce", options.nonce);
        }

        this.baseURL = new URL(base + "?" + queryParams.toString());

    }

    async throwIfError(response: Response) {

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        let data = await response.json();

        if (!data.success) {

            if (Array.isArray(data?.data)) {
                throw new Error(
                    `[Code:${data.data[0].code}] ${data.data[0].detail}`
                );
            }

            throw new Error(
                "Problem Retrieving Data: Our Apologies. For Assistance, Please Reach Out to Customer Support."
            );
        }

        return data
    }

    async fetchPageSpeed(url: string, activeReport: string, reload: boolean) {


        try {

            let data = null
            // if (reload) {
            //
            //     const pageSpeedURL = new URL('https://api.rapidload.io/api/v1/page-speed');
            //
            //     pageSpeedURL.searchParams.append('url', 'https://rapidload.io')
            //     pageSpeedURL.searchParams.append('strategy', activeReport)
            //
            //     const pageSpeed = await fetch(pageSpeedURL, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         }
            //     });
            //
            //     data = await pageSpeed.json()
            //
            // }

            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'fetch_page_speed')
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)
            this.baseURL.searchParams.append('new', reload as unknown as string)
            this.baseURL.searchParams.append('is_dev', isDev as unknown as string)

            const response = await fetch(this.baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // ...(
                //     data && {
                //             body : JSON.stringify( {
                //                 page_speed: data
                //             })
                //     }
                // )
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

    async post(action : string | null = null, queryParams: {[p: string] : string} = {}) {

        try {

            if(action) this.baseURL.searchParams.append('action', action)

            for (let key of Object.keys(queryParams)) {
                this.baseURL.searchParams.append(key, queryParams[key])
            }

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
