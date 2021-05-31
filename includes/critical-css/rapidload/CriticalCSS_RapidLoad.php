<?php


class CriticalCSS_RapidLoad extends \RapidLoad\Service\CriticalCSS{

    public function __construct(){

        parent::__construct();

        new CriticalCSS_RapidLoad_Admin();
    }
}