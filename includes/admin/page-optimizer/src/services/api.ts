class ApiService {
    private baseURL: URL;

    constructor(options: WordPressOptions, action?: string) {
        let base = options?.ajax_url
            ? options.ajax_url
            : "http://rapidload.local/wp-admin/admin-ajax.php";

        const query = new URLSearchParams();

        if (action) query.append("action", action);

        if (options.nonce) query.append("nonce", options.nonce);

        this.baseURL = new URL(base + "?" + query.toString());

    }

    async fetchPageSpeed(url: string, activeReport: string, reload: boolean) {


        try {
            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'fetch_page_speed')
            this.baseURL.searchParams.append('url', url)
            this.baseURL.searchParams.append('strategy', activeReport)
            this.baseURL.searchParams.append('new', reload as unknown as string)

            const response = await fetch(this.baseURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });


            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateSettings(url: string, activeReport: string, reload: boolean, data: string) {
        try {

            const query = new URLSearchParams();

            this.baseURL.searchParams.append('action', 'optimizer_update_settings')
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

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ApiService;
