<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base{

    use RapidLoad_Utils;

    public $url;
    public $rule;
    public $options;

    public static $page_options = [
        'safelist',
        'exclude',
        'blocklist'
    ];

    public function __construct()
    {
        $this->init();
    }

    public function init(){

        $this->options = self::fetch_options();

        add_action('wp_enqueue_scripts', function (){

            $this->url = $this->transform_url($this->get_current_url());
            $this->rule = $this->get_current_rule(RapidLoad_DB::get_rule_names());

            $this->rule['post_id'] = url_to_postid($this->url);

            if ( ! $this->is_url_allowed( $this->url, $this->rule ) ) {
                return;
            }

            $applicable_rule = false;

            if(isset($this->rule['rule']) && $this->rules_enabled()){

                $applicable_rule = RapidLoad_DB::get_applied_rule($this->rule['rule'], $this->url);

                if(!$applicable_rule){

                    $applicable_rule = RapidLoad_DB::get_applied_rule('is_path', $this->url);

                }
            }

            $job = new RapidLoad_Job([
                'url' => $this->url
            ]);

            if($applicable_rule && RapidLoad_DB::rule_exists_with_error($applicable_rule->rule, $applicable_rule->regex)) {

                $rule = new RapidLoad_Job([
                    'url' => $this->url,
                    'rule' => $applicable_rule->rule,
                    'regex' => $applicable_rule->regex,
                ]);

                $job->rule_id = $rule->id;
                $job->status = 'rule-based';
                $job->parent = $rule;
            }

            $job->save();

            do_action('rapidload/job/handle', $job, $this->rule);

        }, 99);

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

    public static function update_option($name, $default)
    {
        if(is_multisite()){

            return update_blog_option(get_current_blog_id(), $name, $default);

        }
        return update_site_option( $name, $default );
    }

    public static function rapidload_activate() {

        $default_options = self::get_option('autoptimize_uucss_settings',[
            'uucss_load_original' => "1"
        ]);

        if(!isset($default_options['uucss_api_key'])){
            self::update_option('autoptimize_uucss_settings', $default_options);
        }

        add_option( 'uucss_do_activation_redirect', true );
    }

    public static function critical_css_enabled(){
        $options = self::fetch_options();
        return isset($options['cpcss_enable_critical_css']) &&
            $options['cpcss_enable_critical_css'] == "1";
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

    public function is_url_allowed($url = null, $args = null)
    {

        if ( ! $url ) {
            $url = $this->url;
        }

        if(!$this->is_valid_url($url)){
            return false;
        }

        // remove .css .js files from being analyzed
        if ( preg_match( '/cache\/autoptimize/', $url ) ) {
            return false;
        }

        if ( preg_match( '/cache\/rapidload/', $url ) ) {
            return false;
        }

        global $post;

        if ( isset( $args['post_id'] ) ) {
            $post = get_post( $args['post_id'] );
        }

        if ( $post ) {
            $page_options = self::get_page_options( $post->ID );
            if ( isset( $page_options['exclude'] ) && $page_options['exclude'] == "on" ) {
                return false;
            }

        }

        if ( isset( $this->options['uucss_excluded_links'] ) && ! empty( $this->options['uucss_excluded_links'] ) ) {
            $exploded = explode( ',', $this->options['uucss_excluded_links'] );

            foreach ( $exploded as $pattern ) {

                if ( filter_var( $pattern, FILTER_VALIDATE_URL ) ) {

                    $pattern = parse_url( $pattern );

                    $path = $pattern['path'];
                    $query = isset($pattern['query']) ? '?' . $pattern['query'] : '';

                    $pattern = $path . $query;

                }

                if(self::str_contains( $pattern, '*' ) && self::is_path_glob_matched(urldecode($url), $pattern)){
                    $this->log( 'skipped : ' . $url );
                    return false;
                }else if ( self::str_contains( urldecode($url), $pattern ) ) {
                    $this->log( 'skipped : ' . $url );
                    return false;
                }

            }
        }

        $url_parts = parse_url( $url );

        if(isset($url_parts['query']) && $this->str_contains($url_parts['query'], 'customize_changeset_uuid')){
            $this->log( 'skipped : ' . $url );
            return false;
        }

        if(!apply_filters('uucss/url/exclude', $url)){
            $this->log( 'skipped : ' . $url );
            return false;
        }

        return true;
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

    public function rules_enabled(){
        return
            isset($this->options['uucss_enable_rules']) &&
            $this->options['uucss_enable_rules'] == "1" &&
            RapidLoad_DB::$current_version > 1.1 &&
            apply_filters('uucss/rules/enable', true);
    }
}