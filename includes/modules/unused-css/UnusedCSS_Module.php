<?php


class UnusedCSS_Module
{
    public function __construct()
    {
        global $uucss;

        $provider_class = apply_filters('uucss/provider/class', 'UnusedCSS_Autoptimize');

        $uucss = new $provider_class();
    }
}