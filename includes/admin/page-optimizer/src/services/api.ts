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
            throw new Error("Oops! The request failed");
        }

        let data = await response.json();

        if (!data.success) {

            if (data.data.reload) {
                return data.data
            }

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

    async fetchPageSpeed(url: string, activeReport: string, reload: boolean): Promise<any>  {


        try {

            let data = null

            if (reload) {
                data = await this.analyzeViaAPI(url, activeReport);

                if(data?.errors) {
                    if (Array.isArray(data?.errors)) {
                        throw new Error(
                            `[Code:${data.errors[0].code}] ${data.errors[0].detail}`
                        );
                    }

                    throw new Error(
                        `Oops! Something went wrong :(`
                    );
                }
            }

            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'fetch_page_speed')
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)
            this.baseURL.searchParams.append('new', reload as unknown as string)
            this.baseURL.searchParams.append('is_dev', isDev as unknown as string)

            const response = await fetch(this.baseURL, {
                method: data ? "POST": "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                ...(
                    data ? {
                            body : JSON.stringify( {
                                page_speed: data
                            })
                    } : {}
                )
            });


            let responseData = await this.throwIfError(response);

            if (responseData?.reload) {
                return await this.fetchPageSpeed(url, activeReport, true);
            }

            return responseData

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async analyzeViaAPI(url: string, strategy: string) {

       try {
           const pageSpeedURL = new URL('http://localhost:3001/api/v1/page-speed');

           pageSpeedURL.searchParams.append('url', url)
           pageSpeedURL.searchParams.append('strategy', strategy)

           const pageSpeed = await fetch(pageSpeedURL, {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               }
           });

           return await pageSpeed.json()

       } catch (error) {
           console.error(error);
           throw error;
       }
    }

    async updateSettings(url: string, activeReport: string, data: any, global: boolean, analyze: boolean) {
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
