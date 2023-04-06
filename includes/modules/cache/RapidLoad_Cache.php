<?php

class RapidLoad_Cache
{
    public function __construct()
    {

    }

    public static function setup_cache($status){

        if($status == "1"){

            RapidLoad_Cache_Store::create_advanced_cache_file();
            RapidLoad_Cache_Store::set_wp_cache_constant();

        }else{

            RapidLoad_Cache_Store::clean();

        }

    }

    public static function start(){

    }

    public static function deliver_cache(){

    }
}