<?php


class UnusedCSS_Api
{
    use UnusedCSS_Utils;

    public $apiUrl = 'https://unusedcss.herokuapp.com/api';

    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        //$this->apiUrl = 'http://localhost:9300/api';
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

            $this->log($response['response']);
            return null;
        }
        else {
            $this->log($response->get_error_message());
            return null;
        }

    }


}