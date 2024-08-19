import {isDev} from "lib/utils";
import store from "../store";

class ApiService {
    public baseURL: URL;
    private options: WordPressOptions;


    constructor(options?: WordPressOptions, query?: string, action?: string) {

        if (!options) {
            options = window.rapidload_optimizer
        }

        this.options = options

        let base = options?.ajax_url
            ? options.ajax_url
            : "http://rapidload.local/wp-admin/admin-ajax.php";

        const queryParams = new URLSearchParams(query);

        if (action) {
            queryParams.append("action", action);
        }

        if (options?.nonce && !queryParams.has('nonce')) {
            queryParams.append("nonce", options.nonce);
        }

        this.baseURL = new URL(base + "?" + queryParams.toString());

    }

    async throwIfError(response: Response, state: any = null) {

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
                    `[Code:${data.data[0].code}] ${data.data[0].detail ? data.data[0].detail : 'Internal error occurred on our end :('}`
                );
            }

            throw new Error(
                "Problem Retrieving Data: Our Apologies. For Assistance, Please Reach Out to Customer Support."
            );
        }

        return {
            ...data,
            state
        }
    }

    async fetchPageSpeed(url: string, activeReport: string, reload: boolean): Promise<any>  {

        try {
            let fresh = reload
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
            // this.baseURL.searchParams.append('settingsMode', settingsMode || '')

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


            let responseData = await this.throwIfError(response, {
                fresh: reload
            });

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
           const state = store.getState()
           const data = state.app[state.app.activeReport]

           const api_root = this.options?.api_root || 'https://api.rapidload.io/api/v1';
           const pageSpeedURL = new URL(`${api_root}/page-speed`);

           pageSpeedURL.searchParams.append('url', url)
           pageSpeedURL.searchParams.append('strategy', state.app.activeReport)
           pageSpeedURL.searchParams.append('plugin_version', this.options.rapidload_version)
           pageSpeedURL.searchParams.append('titan_version', __OPTIMIZER_VERSION__)

           if (this.options.license_key) {
               pageSpeedURL.searchParams.append('api_key', this.options.license_key);
           }

           const pageSpeed = await fetch(pageSpeedURL, {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify({
                   settings: data.settings?.
                   flatMap(t =>
                       t.inputs
                           .filter(({ value }) => value != null)
                           .map(({ key, value }) => ({ key, value, status: t.status  })))
                       || []
               })
           });

           return await pageSpeed.json()

       } catch (error) {
           console.error(error);
           throw error;
       }
    }

    async getCSSJobStatus(url: string, types: string[]): Promise<any> {
        try {
            this.baseURL.searchParams.append('action', 'rapidload_css_job_status');
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('types', types.join(','))

            const response = await fetch(this.baseURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return this.throwIfError(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTestMode(url: string, mode: string): Promise<any> {
        try {
            this.baseURL.searchParams.append('action', 'rapidload_switch_test_mode');
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('test_mode', mode)

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            return this.throwIfError(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateSettings(url: string, activeReport: string, data: any, global: boolean, analyze: boolean) {
        try {

            const query = new URLSearchParams();

            if (this.baseURL.searchParams.get('action')) {
                this.baseURL.searchParams.delete('action')
            }

            this.baseURL.searchParams.append('action', 'optimizer_update_settings');

            if(global) this.baseURL.searchParams.append('global', 'true')
            if(analyze) this.baseURL.searchParams.append('analyze', 'true')

            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)
            // this.baseURL.searchParams.append('settingsMode', settingsMode)

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

            if(action) {
                if (this.baseURL.searchParams.get('action')) {
                    this.baseURL.searchParams.delete('action')
                }
                this.baseURL.searchParams.append('action', action)
            }

            for (let key of Object.keys(queryParams)) {
                if (!this.baseURL.searchParams.has(key)) {
                    this.baseURL.searchParams.append(key, queryParams[key]);
                }
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

    async request(endpoint: string,
                  params:{[p: string] : string} = {},
                  type: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
    ) {

        let base = new URL(this.options.rest_url);

        try {


            for (let key of Object.keys(params)) {
                if (!base.searchParams.has(key)) {
                    base.searchParams.append(key, params[key]);
                }
            }

            base.pathname += endpoint;

            const response = await fetch(base, {
                method: type,
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
    rest() {
        return this
    }
}

export default ApiService;
