<?php


class UnusedCSS_Api
{

    public $apiUrl = 'https://unusedcss.herokuapp.com/api';
    public $apiUrl_debug = 'http://localhost:8080/api';

    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {

    }

    public function get($url) {

        $appender = '?';
        if (strpos($url, '?') !== false) {
            $appender = '&';
        }

        $url = $this->apiUrl . '?url=' . urlencode($url . $appender . 'doing_unused_fetch=true');

        $response = wp_remote_get($url);

        if ( is_array( $response ) && ! is_wp_error( $response ) ) {

            if($response['response']['code'] == 200) {
                $body    = $response['body'];
                return json_decode($body);
            }

            uucss_log($response['response']);
            return null;
        }
        else {
            return null;
        }

    }


}