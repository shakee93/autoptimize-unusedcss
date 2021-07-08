<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base
{
    use RapidLoad_Utils;

    public $options = [];

    public $url = null;
    public $rule = null;

    public static $page_options = [
        'safelist',
        'exclude',
        'blocklist'
    ];

    public function __construct()
    {

        $this->options = self::fetch_options();

        add_action('init', function (){

            RapidLoad_ThirdParty::initialize();

            new RapidLoad_Module();

        });

        add_action('plugins_loaded', function (){

            new RapidLoad_Buffer();
            new RapidLoad_Queue();
            new RapidLoad_Enqueue();

        });
    }

    public static function fetch_options()
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);

        }
        return get_site_option( 'autoptimize_uucss_settings', false );
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
        $white_packs = $data->data;

        $options['whitelist_packs'] = array();
        foreach ( $white_packs as $white_pack ) {
            $options['whitelist_packs'][] = $white_pack->id . ':' . $white_pack->name;
        }

        self::update_option( 'autoptimize_uucss_settings', $options );

        self::add_admin_notice( 'RapidLoad : 🙏 Thank you for using our plugin. if you have any questions feel free to contact us.', 'success' );
    }

}