<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {


    protected $options = [];

    /**
     * UnusedCSS constructor. 
     */
    public function __construct()
    {
        $this->provider = 'autoptimize';

        add_action( 'autoptimize_action_cachepurged', [$this, 'clear_cache'] );

        add_action('uucss_cache_completed', [$this, 'flushCacheProviders']);

        parent::__construct();

    }


    public function enabled() {

        if (!UnusedCSS_Autoptimize_Admin::enabled()) {
            return false;
        }

        if(is_multisite()) {

            UnusedCSS_Utils::add_admin_notice("UnusedCSS not supported for multisite");

            return false;
        }

        if(!function_exists('autoptimize') || autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "") {

            UnusedCSS_Utils::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled");
            
            return false;
        }

        return true;
    }

    public function get_css(){


        add_action('autoptimize_filter_cache_getname', function($ao_css){
            $this->css[] = $ao_css;
        });
           
        
    }


    public function replace_css(){

        if (!$this->cache_source_dir_exists()) {
            return;
        }

        add_action('autoptimize_html_after_minify', function($html) {

//          $html = $this->getCSSviaAutoptimize($html);

            return $this->parsAllCSS($html);
        });

        
    }

    public function parsAllCSS($html)
    {

        $dom = HungCP\PhpSimpleHtmlDom\HtmlDomParser::str_get_html($html);

        $sheets = $dom->find('link');

        foreach ($sheets as $sheet) {
            $link = $sheet->href;

//            TODO : when duplicate CSS file name comes this breaks. we need to save the file with URL hash and retrieve it with it
            if(strpos($link, '.css') !== false){
                $newLink = $this->cache_file_location($link, WP_CONTENT_URL . "/cache/uucss");
                $sheet->href = $newLink ;
            }

        }

        return $dom;
    }

    public function getCSSviaAutoptimize($html)
    {
        $hash = $this->encode($this->url);

        foreach ($this->css as  $css) {

            $_css = str_replace('/autoptimize/css', "/uucss/$this->provider/$hash", $css);
            $html = str_replace($css, $_css, $html);

        }

        return $html;
    }

    public function flushCacheProviders()
    {
        autoptimizeCache::flushPageCache();

        if(class_exists('Cache_Enabler')) {
            Cache_Enabler::clear_total_cache();
        }

    }
}
