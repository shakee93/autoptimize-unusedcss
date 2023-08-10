<?php

class JavaScript
{

    use RapidLoad_Utils;

    public $base;
    public $file_system;
    public $options = [];

    public static $key_post_meta = 'rapidload_post_meta';

    public static $base_dir;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('uucss/options/js', [$this, 'render_options']);

        if(!isset($this->options['uucss_enable_javascript']) || $this->options['uucss_enable_javascript'] == ""){
            return;
        }

        $this->file_system = new RapidLoad_FileSystem();

        if( ! $this->initFileSystem() ){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_javascript'], 30, 2);

        //add_action( 'admin_bar_menu', [$this, 'add_admin_bar_items' ], 90 );

        add_filter('uucss/enqueue/js-minified-url', function ($js_file){
            return $this->get_cached_file($js_file, apply_filters('uucss/enqueue/cache-file-url/cdn', null));
        },10,1);

        $this->enqueue_admin_scripts();

        add_action('rapidload/vanish', [ $this, 'vanish' ]);
    }

    public function vanish() {

        if ( $this->file_system->exists( self::$base_dir ) ){
            $this->file_system->delete( self::$base_dir, true );
        }

    }

    public function initFileSystem() {

        // Todo cache base setup
        /*$cache_base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR);

        $cache_base_option = RapidLoad_Base::get_option('rapidload_cache_base', null);

        if(!isset($cache_base_option)){

            $cache_base_option = $cache_base;
            RapidLoad_Base::update_option('rapidload_cache_base', $cache_base_option);
        }

        $this->base = RapidLoad_ThirdParty::plugin_exists('autoptimize') ? $cache_base_option . 'cpcss' : $cache_base . 'cpcss';*/

        $this->base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR) . 'js';

        if ( ! $this->file_system ) {
            return false;
        }

        if ( ! $this->init_base_dir() ) {
            return false;
        }

        return true;
    }

    public function init_base_dir() {

        self::$base_dir = self::get_wp_content_dir() . $this->base;

        if ( $this->file_system->exists( self::$base_dir ) ) {
            return true;
        }

        // make dir if not exists
        $created = $this->file_system->mkdir( self::$base_dir );

        if (!$created || ! $this->file_system->is_writable( self::$base_dir ) || ! $this->file_system->is_readable( self::$base_dir ) ) {
            return false;
        }

        return true;
    }

    public function enqueue_admin_scripts(){
        if(is_user_logged_in()){

            add_action('wp', function (){

                global $post;

                if(isset($post->ID)){

                    wp_enqueue_style( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.css' );
                    wp_enqueue_style('rapidload-optimizer', UUCSS_PLUGIN_URL . 'includes/modules/javascript/assets/css/style.css', UUCSS_VERSION);

                    wp_enqueue_script( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.js' , array( 'jquery' ) );
                    wp_register_script( 'rapidload-js-optimizer', UUCSS_PLUGIN_URL . 'includes/modules/javascript/assets/js/js-core.js', array(
                        'jquery',
                    ) , UUCSS_VERSION);

                    wp_localize_script( 'rapidload-js-optimizer', 'rapidload_js_optimizer', [
                        'post_id' => $post->ID,
                        'current_url' => $this->transform_url(get_permalink($post->ID)),
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'settings' => get_post_meta($post->ID, 'rapidload_js_settings')
                    ] );

                    wp_enqueue_script('rapidload-js-optimizer');
                }

            });

        }
    }

    public function add_admin_bar_items($wp_admin_bar){

        global $post;

        if(isset($post->ID)){

            $wp_admin_bar->add_menu(
                array(
                    'id'     => 'rapidload_psa',
                    'parent' => 'top-secondary',
                    'title'  => '<span class="ab-item">RapidLoad Optimizer</span>',
                    'meta'   => array( 'title' => 'RapidLoad Optimizer' ),
                )
            );

        }


    }

    public function render_options($args){
        $options = $args;
        include_once 'parts/options.html.php';

    }

    public function optimize_javascript($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_rapidload_js'] )){
            return false;
        }

        new Javascript_Enqueue($job);

    }

    public function get_cached_file( $file_url, $cdn = null ) {

        if ( ! $cdn || empty( $cdn ) ) {
            $cdn = self::get_wp_content_url();
        } else {

            $url_parts = parse_url( self::get_wp_content_url() );

            $cdn = rtrim( $cdn, '/' ) . (isset($url_parts['path']) ? rtrim( $url_parts['path'], '/' ) : '/wp-content');

        }

        return implode( '/', [
            $cdn,
            trim($this->base, "/"),
            $file_url
        ] );
    }
}