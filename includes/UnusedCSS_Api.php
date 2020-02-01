<?php


class UnusedCSS_Api
{

    public $apiUrl = 'http://127.0.0.1:9300/';
    public $client;

    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        $this->client = new GuzzleHttp\Client();
    }

    public function get($url)
    {
        $response = $this->client->get($this->apiUrl . '?url=' . $url);

        if ($response->getStatusCode() == 200) {
            return $response;
        }

        return null;
    }


}