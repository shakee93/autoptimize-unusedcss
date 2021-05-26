<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base{

    public static function init(){

        global $uucss;
        $uucss = new UnusedCSS_Autoptimize();

        global $rccss;
        $rccss = new CriticalCSS_RapidLoad();

        RapidLoad_ThirdParty::initialize();

    }
}