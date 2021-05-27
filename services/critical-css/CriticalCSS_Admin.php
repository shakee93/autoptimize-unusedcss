<?php

namespace RapidLoad\Service;

abstract class CriticalCSS_Admin{

    use \RapidLoad_Utils;

    public function __construct()
    {
        if(is_admin()){

            add_action('wp_ajax_rccss_regenerate_critical_css', [$this, 'regenerate_critical_css']);
        }
    }

    public function regenerate_critical_css(){

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'path';
        $url_list = isset($_REQUEST['url_list']) ? $_REQUEST['url_list'] : \UnusedCSS_DB::get_uucss_urls(" WHERE status = 'success' ");

        if($type == 'path'){

            foreach ($url_list as $link){

                if(isset($link->url)){

                    $path = new CriticalCSS_Path([
                        'url' => $link->url,
                        'rule' => isset($link->rule) ? $link->rule : null,
                    ]);
                    if($path->status != 'queued'){
                        $path->requeue();
                    }
                    $path->save();
                }

            }

            wp_send_json_success();

        }else{



        }


    }
}