<?php


class UnusedCSS_Module
{
    public function __construct()
    {
        global $uucss;
        $uucss = new UnusedCSS_Autoptimize();
    }
}