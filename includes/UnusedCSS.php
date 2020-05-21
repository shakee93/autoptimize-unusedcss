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
    public $store = null;
    public $options = [];

    /**
     * @var WP_Filesystem_Direct
     */
    public $file_system;

    public $base_dir, $base_dir_with_provider;


    abstract public function get_css();


    abstract public function replace_css();


    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {

	    if ( ! $this->initFileSystem() ) {
		    return;
	    }

        add_action('uucss_async_queue', [$this, 'init_async_store'], 2, 3);

        add_action('wp_enqueue_scripts', function () {

            $this->url = $this->get_current_url();

            if($this->enabled()) {
                $this->purge_css();
            }

        });

    }

	public function initFileSystem() {

		// load wp filesystem related files;
		if (!class_exists('WP_Filesystem_Base')) {
			require_once(ABSPATH . 'wp-admin/includes/file.php');
		}

		WP_Filesystem();
		global $wp_filesystem;
		$this->file_system = $wp_filesystem;


		if (!$this->file_system->is_writable( WP_CONTENT_DIR ) || !$this->file_system->is_readable( WP_CONTENT_DIR )) {
			self::add_admin_notice("Autoptimize UnusedCSS don't have permission to write or read");
			return false;
		}

		$this->set_base_dir();
		return true;

	}


    public function enabled() {

        if($this->is_doing_api_fetch()) {
            return false;
        }

        if (!$this->is_url_allowed()) {
            return false;
        }

        if(is_admin()) {
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

	    if ( is_search() ) {
		    return false;
	    }

	    if ( defined( 'DOING_CRON' ) ) {
		    return false;
	    }

	    return true;

    }


    function enabled_frontend(){

        if(is_user_logged_in()) {
            return false;
        }

        return true;
    }


    public function init_async_store($provider, $url, $args)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args);
    }

    public function is_url_allowed($url = null, $args = null)
    {
        global $post;

        if (isset($args['post_id'])) {
            $post = get_post($args['post_id']);
        }

        if ($post) {
            $page_options = UnusedCSS_Admin::get_page_options($post->ID);
            if (isset($page_options['exclude']) && $page_options['exclude'] == "on") {
                return false;
            }

        }

        return true;
    }

    protected function purge_css(){

        if (!$this->cache_page_dir_exists()) {
            $this->cache($this->url);
        }

        // disabled exceptions only for frontend
        if (!$this->enabled_frontend()) {
            return;
        }

        $this->get_css();
        $this->replace_css();
    }

    public function cache($url = null, $args = []) {

        if (!$this->is_url_allowed($url, $args)) {
            return false;
        }

        global $post;

        if (!isset($args['post_id']) && $post) {
            $args['post_id'] = $post->ID;
        }

        $args['options'] = $this->api_options();

        wp_schedule_single_event( time(), 'uucss_async_queue' , [
            'provider' => $this->provider,
            'url' => $url,
            'args' => $args
        ]);
        spawn_cron();

        return true;
    }

    public function api_options($post_id = null)
    {
        global $post;

        if ($post) {
            $post_id = $post->ID;
        }

        $post_options = UnusedCSS_Admin::get_page_options($post_id);

        $whitelist = explode(',', $post_options['whitelist_classes']);
        $whitelist_global = [];

        if (isset($this->options['uucss_whitelist_classes'])) {
            $whitelist_global = explode(',', $this->options['uucss_whitelist_classes']);
        }

        return [
            "whitelist" => array_filter(array_merge($whitelist, $whitelist_global)),
            "keyframes" => !isset($this->options['uucss_keyframes']),
            "fontFace" => !isset($this->options['uucss_fontface']),
            "variables" => !isset($this->options['uucss_variables']),
            "minify" => !isset($this->options['uucss_minify']),
            "whitelistPacks" => ['wp']
        ];
    }

    protected function is_doing_api_fetch(){
        return strpos($_SERVER['HTTP_USER_AGENT'] , 'UnusedCSS_bot') !== false;
    }


    public function set_base_dir(){
        $this->base_dir = $this->file_system->wp_content_dir()  . $this->base;
        $this->base_dir_with_provider = "$this->base_dir/$this->provider";
    }


    protected function cache_file_exists($file){
        return $this->file_system->exists($this->get_cache_page_dir() . '/' . $this->file_name($file, $this->options));
    }


    public function cache_page_dir_exists($url = null){

        if (!$url) {
            $url = $this->url;
        }

        $hash = $this->encode($url);

        $source_dir = $this->base_dir_with_provider . '/' . $hash;

        if(!$this->file_system->exists($source_dir)) {
            return false;
        }

        return true;

    }


    public function clear_cache($url = null, $args = []){

	    $args['url'] = $url;

	    self::log( 'cleared : ' . $url );

	    if ($url && $this->cache_page_dir_exists($url)) {

            $results = $this->file_system->delete($this->get_cache_page_dir($url), true);
            do_action('uucss_cache_cleared', $args);
            return !is_wp_error($results);
        }

        $results = $this->file_system->delete($this->base_dir_with_provider, true);
        do_action('uucss_cache_cleared', $args);
        return !is_wp_error($results);
    }


    public function size()
    {

        if (!$this->file_system->exists($this->base_dir_with_provider)) {
            return "0 KB";
        }
        $size = $this->dirSize($this->base_dir_with_provider);
        return $this->human_file_size($size);
    }


    protected function get_cached_file($file_url){
        $hash = $this->encode($this->url);

        return implode('/', [
            WP_CONTENT_URL,
            $this->base,
            $this->provider,
            $hash,
            $this->file_name($file_url, $this->options)
        ]);
    }


    protected function get_cache_page_dir($url = null)
    {

        if (!$url) {
            $url = $this->url;
        }

        $hash = $this->encode($url);
        return $this->base_dir_with_provider . '/' . $hash;
    }


    public function vanish()
    {
        $delete = $this->file_system->wp_content_dir()  . $this->base;

        if (!$this->file_system->exists($delete)) {
            return;
        }

        $this->file_system->delete($delete, true);
    }

}