<?php


class UnusedCSS_Api
{

    public $apiUrl = 'https://unusedcss.herokuapp.com';

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

        // if (strpos($url, 'doing_unused_fetch=true') !== true) {
        //     $url = urlencode($url . $appender . 'doing_unused_fetch=true');
        // }

        uucss_log($url);
        
        $response = wp_remote_get($url);
 
        if ( is_array( $response ) && ! is_wp_error( $response ) ) {
            $headers = $response['headers'];
            $body    = $response['body'];

            return json_decode($body);
        }
        else {
            return null;
        }

    }


}