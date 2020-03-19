<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {


    /**
     * UnusedCSS constructor. 
     */
    public function __construct()
    {
        $this->provider = 'autoptimize';

        parent::__construct();
    }


    public function enabled() {

        return function_exists('autoptimize') && autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "on";

    }


    public function show_notice()
    {

        add_action('admin_notices', function () {

            echo '<div class="notice notice-error is-dismissible">
                    <p>Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled</p>
                 </div>';

        });

    }


    public function get_css(){


        add_action('autoptimize_filter_cache_getname', function($ao_css){
            $this->css[] = $ao_css;
        });
           
        
    }


    public function replace_css(){


        add_action('autoptimize_html_after_minify', function($html){

            if(isset($_GET['doing_unused_fetch'])) {
                return $html;
            }
    
            if(is_user_logged_in()) {
                return $html;
            }
    
            $hash = $this->encode($this->url);
    
            foreach ($this->css as  $css) {
                
                $_css = str_replace('/autoptimize/css', "/uucss/$this->provider/$hash", $css);
                $html = str_replace($css, $_css, $html);
                
            }
    
            return $html;
            
        });

        
    }

}
