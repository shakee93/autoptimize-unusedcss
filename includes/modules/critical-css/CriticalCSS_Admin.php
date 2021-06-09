<?php

namespace RapidLoad\Service;

abstract class CriticalCSS_Admin{

    use \RapidLoad_Utils;

    public function __construct()
    {
        if(is_admin()){

            add_action('admin_menu', [$this, 'add_critical_css_page']);
            add_action('wp_ajax_cpcss_regenerate_critical_css', [$this, 'regenerate_critical_css']);
        }
    }

    public function add_critical_css_page(){

        rapidload()->admin()->add_submenu_page(
            'rapidload-main',
            'Critical CSS',
            'Critical CSS',
            'manage_options',
            'cpcss',
            function (){
                echo 'Critical Path CSS';
            },
            3
        );

    }

    public function regenerate_critical_css(){

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'path';
        $url_list = isset($_REQUEST['url_list']) ? $_REQUEST['url_list'] : \UnusedCSS_DB::get_uucss_urls(" WHERE status = 'success' ");

        if($type == 'path'){

            foreach ($url_list as $link){

                if(is_array($link)){
                    $link = (object) $link;
                }

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