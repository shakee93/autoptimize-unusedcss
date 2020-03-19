<?php

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

    public $base = 'cache/uucss';
    public $provider = null;

    public $url = null;
    public $css = [];

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
            }
            else {
                $this->show_notice();
            }
            
        });

    }

    public function enabled() {

        return true;

    }


    abstract public function show_notice();

    
    protected function purge_css(){

        if(is_admin()) {
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

        if(isset($_GET['doing_unused_fetch'])) {
            return;
        }

        $uucss_api = new UnusedCSS_Api();
        $files = $uucss_api->get($this->url);

        if($files && count($files) > 0) {
           
            $this->cache_files($files);    
           
            $this->get_css();
           
            $this->replace_css();
            
        }
        
    }

    protected function get_base_dir(){
        global $wp_filesystem;
        
        $root = $wp_filesystem->wp_content_dir()  . $this->base;
        $root_with_provider = $root . '/' . $this->provider;

        if(!$wp_filesystem->exists($root)) {
            $wp_filesystem->mkdir($root);

            if(!$wp_filesystem->exists($root_with_provider)) {
                $wp_filesystem->mkdir($root_with_provider);
            }
            
        }

        return $root_with_provider;
    }

    protected function get_cache_source_dir()
    {
        global $wp_filesystem;
        
        $hash = $this->encode($this->url);

        $source_dir = $this->get_base_dir() . '/' . $hash;

        if(!$wp_filesystem->exists($source_dir)) {
            $wp_filesystem->mkdir($source_dir);
        }

        return $source_dir;
    }


    protected function encode($data)
    {
        return rtrim(md5($data));
    }


    protected function cache_files($files) {
        global $wp_filesystem;

        foreach( $files as $file) {
            
            $file_location = $this->cache_file_location($file->file);
            
            if(!$wp_filesystem->exists($file_location)) {
                $wp_filesystem->put_contents($file_location, $file->css, FS_CHMOD_FILE);
            }
        }
        
    }

    public function cache_file_location($file){
        $url = explode("?", basename($file));
        return $this->get_cache_source_dir() . '/' . $url[0];
    }


    abstract public function get_css();

    abstract public function replace_css();

}