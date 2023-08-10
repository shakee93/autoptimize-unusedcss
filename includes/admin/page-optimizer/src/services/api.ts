import axios, {Axios} from "axios";


class ApiService {
    private axios: Axios
    constructor(options: WordPressOptions, action?: string) {

        let base =  options?.ajax_url ? options.ajax_url : 'http://rapidload.local/wp-admin/admin-ajax.php'

        const query = new URLSearchParams()

        if(action)
            query.append('action', action)

        if(options.nonce)
            query.append('nonce', options.nonce)

        this.axios = axios.create({
            baseURL: base,
            params: {
                nonce: options.nonce,
                action: action
            }
        });

    }


    async fetchPageSpeed(url: string, activeReport: string, reload: boolean) {

        try {
            const response = await this.axios
                .get( "", {
                    params: {
                        action: "fetch_page_speed",
                        url: url,
                        strategy: activeReport,
                        new: reload,
                    }
                });
            
            return response;
        } catch (error) {
            throw error;
        }


    }
     async updateSettings(url: string, activeReport: string, reload: boolean, data: string) {

        try {
            const response = await this.axios
                .post( "", {
                    data
                }, {
                    params: {
                        action: "optimizer_update_settings",
                        url: url,
                        strategy: activeReport,
                    }
                });

            return response.data;
        } catch (error) {
            throw error;
        }

    };

}

export default ApiService;
