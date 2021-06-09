<?php


class CriticalCSS_Module
{
    public $cpcss;

    public function __construct()
    {
        $this->cpcss = new CriticalCSS_RapidLoad();
    }
}