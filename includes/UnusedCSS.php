<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS {

    public $base = 'cache/uucss';
    public $provider = 'autoptimize';

    public $ran = false;
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

            if (!function_exists('autoptimize') || autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "") {
                $this->show_notice();
                return;
            }


            if(!$this->ran) {
               $this->processCss();
            }


            $this->ran = true;
        });

    }

    public function show_notice()
    {

        add_action('admin_notices', function () {

            echo '<div class="notice notice-error is-dismissible">
                    <p>Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled</p>
                 </div>';

        });

    }


    public function is_enabled()
    {
        if (is_user_logged_in()) {
            return true;
        }

        return true;
    }

    
    public function processCss(){

        if (!$this->is_enabled()) {
            return;
        }

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


        $files = $this->get_unusedCSS();

        if($files && count($files) > 0) {
           $this->store_files($files);    
        
           add_action('autoptimize_filter_cache_getname', [$this, 'get_ao_css']);
           add_action('autoptimize_html_after_minify', [$this, 'replace_ao_css']);
        }
        
    }

    public function get_unusedCSS($url = null)
    {
        $css = (new UnusedCSS_Api())->get($this->url);

        return $css;
    }

    protected function store_files($files) {
        global $wp_filesystem;

        foreach( $files as $file) {
            
            $url = explode("?", basename($file->file));
            $_file = $this->get_cache_source_dir() . '/' . $url[0];
            
            if(!$wp_filesystem->exists($_file)) {
                $wp_filesystem->put_contents($_file, $file->css, FS_CHMOD_FILE);
            }
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


    function encode($data)
    {
        return rtrim(md5($data));
    }

    public function get_ao_css($ao_css){
        $this->css[] = $ao_css;
    }

    public function replace_ao_css($html){

        if(isset($_GET['doing_unused_fetch'])) {
            return $html;
        }

        if(is_user_logged_in()) {
            return $html;
        }

        $hash = $this->encode($this->url);

        uucss_log($this->css);
        foreach ($this->css as  $css) {
            
            $_css = str_replace('/autoptimize/css', "/uucss/$this->provider/$hash", $css);
            $html = str_replace($css, $_css, $html);
            
        }

        return $html;
    }
}