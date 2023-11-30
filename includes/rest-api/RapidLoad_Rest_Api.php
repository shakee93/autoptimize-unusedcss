<?php

class RapidLoadRestApi {

    public static $namespace = 'rapidload/v1';

    public function __construct()
    {

        add_action( 'rest_api_init', function () {

            register_rest_route( $this::$namespace, '/ping', array(
                'methods' => 'GET',
                'callback' => [$this, 'ping'],
                'permission_callback' => '__return_true'
            ));

        });

    }


    function ping( WP_REST_Request $request ) {
        // Retrieve the 'url' query parameter from the request.
        $url = $request->get_param( 'url' );
        $agent = $request->get_param( 'user_agent' );

        // Check if the URL is not empty and is a valid URL.
        if ( empty( $url ) || !filter_var( $url, FILTER_VALIDATE_URL ) ) {
            return new WP_Error( 'invalid_url', 'A valid URL is required.', array( 'status' => 400 ) );
        }

        // Use wp_remote_get to ping the URL.
        $response = wp_remote_get( $url, array( 'timeout' => 30, 'headers' => [
            'User-Agent' => $agent ? $agent : null
        ] ) );

        // Check for error in the response.
        if ( is_wp_error( $response ) ) {
            return new WP_Error( 'request_failed', $response->get_error_message(), array( 'status' => 500 ) );
        }

        // If there is no error, return a success message and the response code.
        $response_code = wp_remote_retrieve_response_code( $response );
        $response_headers = wp_remote_retrieve_headers($response);

        $result = array(
            'success' => true,
            'data' => "Ping to {$url} successful.",
            'response_code' => $response_code,
            'headers' => $response_headers->getAll()
        );

        return new WP_REST_Response( $result, 200 );
    }


    public static function rest_url()
    {
        return rest_url(self::$namespace);
    }
}
