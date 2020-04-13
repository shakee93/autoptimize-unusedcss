<?php


class UnusedCSS_Api
{
    use UnusedCSS_Utils;

    public $apiUrl = 'https://unusedcss.herokuapp.com/api';

    public $options = [];
    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        if (defined('UUCSS_API_URL')) {
            $this->apiUrl = UUCSS_API_URL;
        }
    }

    public function get($url) {

        $args = [
            'url' => urlencode($url),
            'options' => $this->options
        ];

        $url = $this->apiUrl . '?' . http_build_query($args);

        $response = wp_remote_get($url, [
        	'timeout' => 20
        ]);

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