<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base
{
    use RapidLoad_Utils;

    public static $options;

    public $url = null;
    public $rule = null;

    public $applicable_rule = false;
    public $defined_rules = false;

    private static $base_instance = null;

    public static function get(){
        if(!self::$base_instance){
            self::$base_instance = new RapidLoad_Base();
        }
        return self::$base_instance;
    }

    private $container = [];

    public static $page_options = [
        'safelist',
        'exclude',
        'blocklist'
    ];

    public function __construct()
    {
        self::fetch_options();

        add_action('init', function (){

            if(!wp_doing_ajax() && !wp_doing_cron()){
                self::log([
                    'log' => 'rapidload base init',
                    'url' => null,
                    'type' => 'purging'
                ]);
            }

            RapidLoad_ThirdParty::initialize();

            register_deactivation_hook( UUCSS_PLUGIN_FILE, [ $this, 'vanish' ] );

            add_filter('plugin_row_meta',[$this, 'add_plugin_row_meta_links'],10,4);

            $this->add_plugin_update_message();

            RapidLoad_DB::update_db_version();

            if(is_admin()){
                RapidLoad_DB::check_db_updates();
            }

            self::enqueueGlobalScript();

            $this->container['modules'] = new RapidLoad_Module();
            $this->container['queue'] = new RapidLoad_Queue();
            if(RapidLoad_DB::$current_version > 1.2){
                $this->container['admin'] = new RapidLoad_Admin();
            }

        });

        add_action( 'admin_init', array( 'PAnD', 'init' ) );

        add_action('plugins_loaded', function (){

            $this->container['feedback'] = new RapidLoad_Feedback();
            $this->container['buffer'] = new RapidLoad_Buffer();
            $this->container['enqueue'] = new RapidLoad_Enqueue();

        });
    }

    public function modules(){
        return isset($this->container['modules']) ? $this->container['modules'] : null;
    }

    public static function enqueueGlobalScript() {
        add_action( 'admin_enqueue_scripts', function () {

            $deregister_scripts = apply_filters('uucss/scripts/global/deregister', ['popper']);

            if(isset($deregister_scripts) && is_array($deregister_scripts)){
                foreach ($deregister_scripts as $deregister_script){
                    wp_dequeue_script($deregister_script);
                    wp_deregister_script($deregister_script);
                }
            }

            wp_enqueue_script( 'popper', UUCSS_PLUGIN_URL . 'assets/libs/tippy/popper.min.js', array( 'jquery' ) );
            wp_enqueue_script( 'noty', UUCSS_PLUGIN_URL . 'assets/libs/noty/noty.js', array( 'jquery' ) );
            wp_enqueue_script( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy-bundle.umd.min.js', array( 'jquery' ) );
            wp_enqueue_style( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy.css' );
            wp_enqueue_style( 'noty', UUCSS_PLUGIN_URL . 'assets/libs/noty/noty.css' );
            wp_enqueue_style( 'noty-animate', UUCSS_PLUGIN_URL . 'assets/libs/noty/animate.css' );
            wp_enqueue_style( 'noty-theme', UUCSS_PLUGIN_URL . 'assets/libs/noty/themes/mint.css' );
            wp_enqueue_style( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.css' );
            wp_enqueue_script( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.js' , array( 'jquery' ) );

            wp_register_script( 'uucss_global_admin_script', UUCSS_PLUGIN_URL . 'assets/js/uucss_global.js', [ 'jquery' ], UUCSS_VERSION );
            $data = array(
                'ajax_url'          => admin_url( 'admin-ajax.php' ),
                'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
                'on_board_complete' => apply_filters('uucss/on-board/complete', false),
                'home_url' => home_url(),
                'api_url' => RapidLoad_Api::get_key(),
                'nonce' => wp_create_nonce( 'uucss_nonce' ),
            );
            wp_localize_script( 'uucss_global_admin_script', 'uucss', $data );
            wp_enqueue_script( 'uucss_global_admin_script' );
            wp_enqueue_style( 'uucss_global_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_global.css', [], UUCSS_VERSION );

        });

        add_action('admin_bar_menu', function (){

            global $post;

            $data = array(
                'post_id'         => ($post) ? $post->ID : null,
                'post_link'       => ($post) ? get_permalink($post) : null,
            );

            wp_register_script( 'uucss_admin_bar_script', UUCSS_PLUGIN_URL . 'assets/js/admin_bar.js', [ 'jquery' ], UUCSS_VERSION );
            wp_localize_script( 'uucss_admin_bar_script', 'uucss_admin_bar', $data );
            wp_enqueue_script( 'uucss_admin_bar_script' );
        });
    }

    function add_plugin_update_message(){

        global $pagenow;

        if ( 'plugins.php' === $pagenow )
        {
            $file   = basename( UUCSS_PLUGIN_FILE );
            $folder = basename( dirname( UUCSS_PLUGIN_FILE ) );
            $hook = "in_plugin_update_message-{$folder}/{$file}";
            add_action( $hook, [$this, 'render_update_message'], 20, 2 );
        }

    }

    function render_update_message($plugin_data, $r ){

        $data = file_get_contents( 'https://raw.githubusercontent.com/shakee93/autoptimize-unusedcss/master/readme.txt?format=txt' );

        $changelog  = stristr( $data, '== Changelog ==' );

        $changelog = preg_split("/\=(.*?)\=/", str_replace('== Changelog ==','',$changelog));

        if(isset($changelog[1])){

            $changelog = explode('*', $changelog[1]);

            array_shift($changelog);

            echo '<div style="margin-bottom: 1em"><strong style="padding-left: 25px;">What\'s New ?</strong><ol style="list-style-type: disc;margin: 5px 50px">';

            foreach ($changelog as $index => $log){
                if($index == 3){
                    break;
                }
                echo '<li style="margin-bottom: 0">' . preg_replace("/\r|\n/","",$log) . '</li>';
            }

            echo '</ol></div><p style="display: none" class="empty">';

        }
    }

    function add_plugin_row_meta_links($plugin_meta, $plugin_file, $plugin_data, $status)
    {
        if(isset($plugin_data['TextDomain']) && $plugin_data['TextDomain'] == 'autoptimize-unusedcss'){
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us" target="_blank">Documentation</a>';
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Submit Ticket</a>';
        }
        return $plugin_meta;
    }

    public function vanish(){

        do_action('rapidload/vanish');

        $this->clear_jobs();

    }

    public function clear_jobs(){

        RapidLoad_DB::clear_jobs();

    }

    public static function fetch_options($cache = true)
    {

        if(isset(self::$options) && $cache){
            return self::$options;
        }

        if(is_multisite()){

            self::$options = get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);

        }else{

            self::$options = get_site_option( 'autoptimize_uucss_settings', false );
        }

        return self::$options;
    }

    public static function get_option($name, $default)
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), $name, $default);

        }
        return get_site_option( $name, $default );
    }

    public static function get_page_options($post_id)
    {
        $options = [];

        if($post_id){

            foreach (self::$page_options as $option) {
                $options[$option] = get_post_meta( $post_id, '_uucss_' . $option, true );
            }

        }

        return $options;
    }

    public static function update_option($name, $default)
    {
        if(is_multisite()){

            return update_blog_option(get_current_blog_id(), $name, $default);

        }
        return update_site_option( $name, $default );
    }

    public static function delete_option($name, $default)
    {
        if(is_multisite()){

            return delete_blog_option(get_current_blog_id(), $name);

        }
        return delete_site_option( $name );
    }

    public static function uucss_activate() {

        $default_options = self::get_option('autoptimize_uucss_settings',[
            'uucss_load_original' => "1",
        ]);

        if(!isset($default_options['uucss_api_key'])){
            self::update_option('autoptimize_uucss_settings', $default_options);
        }

        add_option( 'rapidload_do_activation_redirect', true );
    }

    public static function activate() {

        if ( ! isset( $_REQUEST['token'] ) || empty( $_REQUEST['token'] ) ) {
            return;
        }

        if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
            self::add_admin_notice( 'RapidLoad : Request verification failed for Activation. Contact support if the problem persists.', 'error' );

            return;
        }

        $token = sanitize_text_field( $_REQUEST['token'] );

        if ( strlen( $token ) !== 32 ) {
            self::add_admin_notice( 'RapidLoad : Invalid Api Token Received from the Activation. Contact support if the problem persists.', 'error' );

            return;
        }

        $options = self::get_option( 'autoptimize_uucss_settings' , []);

        if ( ! isset( $options ) || empty( $options ) || ! $options ) {
            $options = [];
        }

        // Hey 👋 you stalker ! you can set this key to true, but its no use ☹️ api_key will be verified on each server request
        $options['uucss_api_key_verified'] = 1;
        $options['uucss_api_key']          = $token;

        self::update_option( 'autoptimize_uucss_settings', $options );

        $data        = UnusedCSS_Admin::suggest_whitelist_packs();
        $white_packs = isset($data->data) ? $data->data : [];

        $options['whitelist_packs'] = array();
        foreach ( $white_packs as $white_pack ) {
            $options['whitelist_packs'][] = $white_pack->id . ':' . $white_pack->name;
        }

        self::update_option( 'autoptimize_uucss_settings', $options );

        self::$options = self::fetch_options(false);

        self::add_admin_notice( 'RapidLoad : 🙏 Thank you for using our plugin. if you have any questions feel free to contact us.', 'success' );
    }

    public function rules_enabled(){
        return
            isset(self::$options['uucss_enable_rules']) &&
            self::$options['uucss_enable_rules'] == "1" &&
            RapidLoad_DB::$current_version > 1.1 &&
            apply_filters('uucss/rules/enable', true);
    }

    public function critical_css_enabled(){
        return
            isset(self::$options['uucss_enable_cpcss']) &&
            self::$options['uucss_enable_cpcss'] == "1" &&
            RapidLoad_DB::$current_version > 1.2;
    }

    public function get_applicable_rule($url, $args = []){

        if(!$this->applicable_rule){

            if(isset($args['rule']) && self::get()->rules_enabled()){

                $this->applicable_rule = RapidLoad_DB::get_applied_rule($args['rule'], $url);

                if(!$this->applicable_rule){

                    $this->applicable_rule = RapidLoad_DB::get_applied_rule('is_path', $url);

                }

            }

        }

        return $this->applicable_rule;
    }

    public function get_pre_defined_rules($with_permalink = false){

        if(!$this->defined_rules){

            $this->defined_rules = self::get_defined_rules($with_permalink);
        }

        return $this->defined_rules;
    }
}