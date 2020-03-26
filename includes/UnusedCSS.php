<?php

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

    public $base = 'cache/uucss';
    public $provider = null;

    public $url = null;
    public $css = [];
    public $purged_files = [];

    
    /**
     * UnusedCSS constructor. 
     */
    public function __construct()
    {
        // load wp filesystem related files;
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        WP_Filesystem();

        
        add_action('init', function () {

            $this->url = UnusedCSS_Utils::get_current_url();

            if($this->enabled()) {
                $this->purge_css();
                $this->get_css();
                $this->replace_css();
            }
            
        });

    }

    public function enabled() {

        return true;

    }
    
    protected function purge_css(){

        if(is_admin()) {
            return;
        }

        if(is_user_logged_in()) {
            return;
        }

        if(wp_doing_ajax()) {
            return;
        }

        if(is_404()) {
            return;
        }

        if(UnusedCSS_Utils::is_cli()){
            return;
        }

        if ( defined( 'DOING_CRON' ) )
        {
            return;
        }

        if($this->is_doing_api_fetch()) {
            return;
        }

        new UnusedCSS_Store($this->provider, $this->url);
        
    }

    protected function is_doing_api_fetch(){
        return isset($_GET['doing_unused_fetch']);
    }

    public function get_base_dir($url = false){
        global $wp_filesystem;
        
        $root = ($url) ? $url : $wp_filesystem->wp_content_dir()  . $this->base;
        $root_with_provider = $root . '/' . $this->provider;

        if(!$wp_filesystem->exists($root)) {
            $wp_filesystem->mkdir($root);
        }

        if(!$wp_filesystem->exists($root_with_provider)) {
            $wp_filesystem->mkdir($root_with_provider);
        }

        return $root_with_provider;
    }

    protected function cache_source_dir_exists(){
        global $wp_filesystem;

        $hash = $this->encode($this->url);

        $source_dir = $this->get_base_dir(false) . '/' . $hash;

        if(!$wp_filesystem->exists($source_dir)) {
            return false;
        }

        return true;

    }

    protected function encode($data)
    {
        return rtrim(md5($data));
    }

    public function clear_cache(){

        global $wp_filesystem;
        uucss_log($this->get_base_dir());
        $wp_filesystem->delete($this->get_base_dir(), true);
        
    }


    abstract public function get_css();

    abstract public function replace_css();

}