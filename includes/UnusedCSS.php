<?php


/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

    use UnusedCSS_Utils;

    public $base = 'cache/uucss';
    public $provider = null;

    public $url = null;
    public $css = [];
    public $purged_files = [];
    public $store = null;

    /**
     * @var WP_Filesystem_Direct
     */
    public $file_system;


    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {

        // load wp filesystem related files;
        if (!class_exists('WP_Filesystem_Base')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            WP_Filesystem();
        }

        global $wp_filesystem;
        $this->file_system = $wp_filesystem;

        add_action('uucss_async_queue', [$this, 'init_async_store'], 2, 3);

        add_action('init', function () {

            $this->url = $this->get_current_url();

            if($this->enabled()) {
                $this->purge_css();
            }

        });

    }

    public function init_async_store($provider, $url, $args)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args);
    }

    public function enabled() {

        if(is_admin()) {
            return false;
        }

        if($this->is_doing_api_fetch()) {
            return false;
        }

        if(is_user_logged_in()) {
            return false;
        }

        if(wp_doing_ajax()) {
            return false;
        }

        if(is_404()) {
            return false;
        }

        if($this->is_cli()){
            return false;
        }

        if ( defined( 'DOING_CRON' ) )
        {
            return false;
        }

        return true;

    }

    protected function purge_css(){

        if (!$this->cache_source_dir_exists()) {
            global $post;
            $args = [];

            if ($post) {
                $args = [
                    'post_id' => $post->ID
                ];
            }

            $this->cache($this->url, $args);
        }

        $this->get_css();
        $this->replace_css();
    }

    public function cache($url = null, $args = []) {

        wp_schedule_single_event( time(), 'uucss_async_queue' , [
            'provider' => $this->provider,
            'url' => $url,
            'args' => $args
        ]);
        spawn_cron();

    }

    protected function is_doing_api_fetch(){
        return isset($_GET['doing_unused_fetch']);
    }

    public function get_base_dir($url = false){

        $root = ($url) ? $url : $this->file_system->wp_content_dir()  . $this->base;
        $root_with_provider = $root . '/' . $this->provider;

        if(!$this->file_system->exists($root)) {
            $this->file_system->mkdir($root);
        }

        if(!$this->file_system->exists($root_with_provider)) {
            $this->file_system->mkdir($root_with_provider);
        }

        return $root_with_provider;
    }

    protected function cache_source_dir_exists($url = null){

        if (!$url) {
            $url = $this->url;
        }

        $hash = $this->encode($url);

        $source_dir = $this->get_base_dir(false) . '/' . $hash;

        if(!$this->file_system->exists($source_dir)) {
            return false;
        }

        return true;

    }


    public function clear_cache($url = null, $args = []){

        if ($url && $this->cache_source_dir_exists($url)) {

            $results = $this->file_system->delete($this->get_cache_source_dir(false, $url), true);
            do_action('uucss_cache_cleared', $args);
            return !is_wp_error($results);

        }

        $results = $this->file_system->delete($this->get_base_dir(), true);
        do_action('uucss_cache_cleared', $args);
        return !is_wp_error($results);
    }

    public function size()
    {
        $size = $this->dirSize($this->get_base_dir());
        return $this->human_filesize($size);
    }

    function dirSize($directory) {
        $size = 0;
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file){
            $size+=$file->getSize();
        }
        return $size;
    }

    function human_filesize($bytes, $decimals = 2) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }

    protected function cache_file_location($file, $link = false){
        return $this->get_cache_source_dir($link) . '/' . $this->get_file_name($file);
    }

    protected function get_file_name($file){
        return explode("?", basename($file))[0];
    }

    protected function cache_file_exists($file){
        return $this->file_system->exists($this->get_cache_source_dir() . '/' . $this->get_file_name($file));
    }

    protected function get_cache_source_dir($url = false, $link = null)
    {

        if (!$link) {
            $link = $this->url;
        }

        $hash = $this->encode($link);

        $source_dir = $this->get_base_dir($url) . '/' . $hash;

        if(!$this->file_system->exists($source_dir)) {
            $this->file_system->mkdir($source_dir);
        }

        return $source_dir;
    }

    public function vanish()
    {
        $this->file_system->delete($this->file_system->wp_content_dir()  . $this->base, true);
    }

    abstract public function get_css();

    abstract public function replace_css();

}