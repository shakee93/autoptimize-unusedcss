<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Api
{
    use UnusedCSS_Utils;

    public static $apiUrl = 'https://app.rapidload.io/api/v1';

    public $apiKey = null;


    /**
     * UnusedCSS_Api constructor.
     */
	public function __construct() {
		if ( defined( 'UUCSS_API_URL' ) ) {
			self::$apiUrl = UUCSS_API_URL;
		}

		$key          = isset( UnusedCSS_Autoptimize_Admin::fetch_options()['uucss_api_key'] ) ? UnusedCSS_Autoptimize_Admin::fetch_options()['uucss_api_key'] : null;
		$this->apiKey = $key;
	}

	static function get_key() {
		new self();

		return self::$apiUrl;
	}

	function get( $endpoint, $data = [] ) {

		$url = self::$apiUrl . '/' . $endpoint . '?' . http_build_query( $data );

		$response = wp_remote_get( $url, [
			'timeout' => 40,
			'headers' => [
				'Authorization' => 'Bearer ' . $this->apiKey
			]
		] );

		return $this->handle_response( $response );
	}

	function post( $endpoint, $data = [] ) {

		$url = self::$apiUrl . '/' . $endpoint;

		$response = wp_remote_post( $url, [
			'timeout' => 40,
			'headers' => [
				'Authorization' => 'Bearer ' . $this->apiKey
			],
			'body'    => $data
		] );

		return $this->handle_response( $response , $data);
	}


	/**
	 * @param $response array|WP_Error
	 *
	 * @return mixed|null
	 */
	public function handle_response( $response , $data = null) {

		if ( is_array( $response ) && ! is_wp_error( $response ) ) {

			if ( $response['response']['code'] == 200 ) {
				$body = $response['body'];

				return json_decode( $body );
			}
            $this->log($data);
			$this->log( $response['body'] );

			return json_decode( $response['body'] );
		} else {
			$this->log( $data );
			$this->log( $response->get_error_message() );

			return $response->get_error_message();
		}

	}

	public function is_error( $result ) {
		return ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false );
	}


}