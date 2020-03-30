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
        add_action('uucss_queue', [$this, 'store'], 10, 2);

        if(defined('DOING_CRON')) {
            return;
        }

        // load wp filesystem related files;
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        WP_Filesystem();

        $this->url = UnusedCSS_Utils::get_current_url();

        add_action('init', function () {

            if($this->enabled()) {
                $this->purge_css();
                $this->get_css();
                $this->replace_css();
            }

        });

    }

    public function store($provider, $url)
    {
        new UnusedCSS_Store($provider, $url);
    }

    public function enabled() {

        return true;

    }

    protected function purge_css(){

        if(is_admin()) {
            return;
        }

        if($this->is_doing_api_fetch()) {
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

        uucss_log('sent to server');
        wp_clear_scheduled_hook( 'uucss_queue' );
        wp_schedule_single_event( time() , 'uucss_queue', [
            $this->provider,
            $this->url
        ] );


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
        $wp_filesystem->delete($this->get_base_dir(), true);

    }

    protected function cache_file_location($file, $link = false){
        return $this->get_cache_source_dir($link) . '/' . $this->get_file_name($file);
    }

    protected function get_file_name($file){
        return explode("?", basename($file))[0];
    }

    protected function get_cache_source_dir($url = false)
    {
        global $wp_filesystem;

        $hash = $this->encode($this->url);

        $source_dir = $this->get_base_dir($url) . '/' . $hash;

        if(!$wp_filesystem->exists($source_dir)) {
            $wp_filesystem->mkdir($source_dir);
        }

        return $source_dir;
    }


    abstract public function get_css();

    abstract public function replace_css();

}