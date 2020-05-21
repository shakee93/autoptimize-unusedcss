<?php


class UnusedCSS_Api
{
    use UnusedCSS_Utils;

    public $apiUrl = 'https://unusedcss.herokuapp.com/api';

    public $options = [];

    public $legacyApi = true;

    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        if (defined('UUCSS_API_URL')) {
            $this->apiUrl = UUCSS_API_URL;
        }

	    if (defined('UUCSS_NEXT')) {
		    $this->legacyApi = false;
	    }
    }

	public function get($url) {

	    $response = ($this->legacyApi) ? $this->legacyApi( $url ) : $this->api($url);

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

	function api($url) {
		$this->options['url'] = $url;
		$args = $this->options;

		$url = $this->apiUrl . '?' . http_build_query($args);

		return wp_remote_get($url, [
			'timeout' => 20,
			'headers' => [
				'Authorization' => 'Bearer b2729838c86b48be8d3b03da2cd1c531'
			]
		]);
	}

	function legacyApi($url) {
		$args = [
			'url' => urlencode($url),
			'options' => $this->options
		];

		$url = $this->apiUrl . '?' . http_build_query($args);

		return wp_remote_get($url, [
			'timeout' => 20
		]);
	}

}