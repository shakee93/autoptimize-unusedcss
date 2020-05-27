<?php


class UnusedCSS_Api
{
    use UnusedCSS_Utils;

    public $apiUrl = 'https://unusedcss.herokuapp.com/api';

    public $apiKey = null;


    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        if (defined('UUCSS_API_URL')) {
            $this->apiUrl = UUCSS_API_URL;
        }

	    $key = isset( UnusedCSS_Autoptimize_Admin::fetch_options()['uucss_api_key'] ) ? UnusedCSS_Autoptimize_Admin::fetch_options()['uucss_api_key'] : null;
	    $this->apiKey = $key;
    }


	function get($endpoint, $data = []) {

		$url = $this->apiUrl . '/' . $endpoint . '?' . http_build_query($data);

		$response = wp_remote_get($url, [
			'timeout' => 20,
			'headers' => [
				'Authorization' => 'Bearer ' . $this->apiKey
			]
		]);

		return $this->handle_response($response);
	}


	/**
	 * @param $response array|WP_Error
	 *
	 * @return mixed|null
	 */
	public function handle_response($response) {

		if ( is_array( $response ) && ! is_wp_error( $response ) ) {

			if($response['response']['code'] == 200) {
				$body    = $response['body'];
				return json_decode($body);
			}

			$this->log($response['response']);
			return null;
		}
		else {
			$this->log($response->get_error_message());
			return null;
		}

	}


}