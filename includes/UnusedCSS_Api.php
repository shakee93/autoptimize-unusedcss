<?php


class UnusedCSS_Api
{

    public $client;

    /**
     * UnusedCSS_Api constructor.
     */
    public function __construct()
    {
        $this->client = new GuzzleHttp\Client();
    }
}