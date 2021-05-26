<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base
{
    public static function init(){

        global $uucss;
        $uucss = new UnusedCSS_Autoptimize();

        RapidLoad_ThirdParty::initialize();

    }
}