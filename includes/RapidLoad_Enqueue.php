<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Enqueue {

    use RapidLoad_Utils;

    private $options;

    public static $frontend_debug = false;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(isset($_COOKIE['rapidload_debug']) && $_COOKIE['rapidload_debug'] == "1"){
            self::$frontend_debug = true;
        }

        add_filter('uucss/enqueue/content', [$this, 'the_content'], 10, 2);

        add_action('wp_enqueue_scripts', function (){

            $url = $this->get_current_url();

            $url = $this->transform_url($url);

            if($this->enabled($url)){

                self::log([
                    'log' => 'RapidLoad_Enqueue->enabled',
                    'type' => 'injection' ,
                    'url' => $url
                ]);

                $args = [];

                if(RapidLoad_Base::get()->rules_enabled()){

                    $rule_names = RapidLoad_DB::get_rule_names();

                    self::log([
                        'log' => 'RapidLoad_Enqueue->rules_enabled-' . json_encode($rule_names),
                        'type' => 'injection' ,
                        'url' => $url
                    ]);

                    $args = $this->get_current_rule(RapidLoad_DB::get_rule_names());

                    self::log([
                        'log' => 'RapidLoad_Enqueue->get_current_rule-' . json_encode($args),
                        'type' => 'injection' ,
                        'url' => $url
                    ]);

                }

                $this->handle_job($url, $args);

            }else{

                self::log([
                    'log' => 'RapidLoad_Enqueue->enabled:failed',
                    'type' => 'injection' ,
                    'url' => $url
                ]);

            }

        });
    }

    public function replace_css($url)
    {
        $buffer = apply_filters('uucss/enqueue/buffer','rapidload_buffer');
        self::log([
            'log' => 'RapidLoad_Enqueue->replace_css:'. $buffer,
            'type' => 'injection' ,
            'url' => $url
        ]);
        add_filter( $buffer, function ( $html ) use($url){
            self::log([
                'log' => 'RapidLoad_Enqueue->replace_css:apply_filter-uucss/enqueue/content',
                'type' => 'injection' ,
                'url' => $url
            ]);
            return apply_filters('uucss/enqueue/content', $html, $url);
        }, 10 );
    }

    public function the_content($html, $url){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log([
                'log' => 'RapidLoad_Enqueue->the_content:dom_parser_not_found',
                'type' => 'injection' ,
                'url' => $url
            ]);
            return $html;
        }

        $dom = new \simplehtmldom\HtmlDocument(
            null,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        $dom->load(
            $html,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        if ( $dom ) {

            self::log([
                'log' => 'RapidLoad_Enqueue->the_content:dom_parsed',
                'type' => 'injection' ,
                'url' => $url
            ]);

            $inject = (object) [
                "parsed_html"           => false,
                "found_sheets"          => false,
                "found_css_files"       => [],
                "found_css_cache_files" => [],
                "ao_optimized_css" => [],
                "injected_css_files"    => [],
                "successfully_injected"    => true,
            ];

            $inject->parsed_html = true;

            self::log([
                'log' => 'RapidLoad_Enqueue->the_content:apply_filter-uucss/enqueue/content/update',
                'type' => 'injection' ,
                'url' => $url
            ]);

            $state = apply_filters('uucss/enqueue/content/update',[
                'dom' => $dom,
                'inject' => $inject,
                'options' => $this->options
            ]) ;

            if(isset($state['dom'])){
                $dom = $state['dom'];
            }

            if(isset($state['inject'])){
                $inject = $state['inject'];
            }

            if(isset($state['options'])){
                $this->options = $state['options'];
            }

            if(self::$frontend_debug){
                header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $inject->found_css_files ) . count( $inject->found_css_cache_files ) . count( $inject->injected_css_files ) . ']' );
            }

            self::log([
                'log' => 'RapidLoad_Enqueue->the_content:return_buffer',
                'type' => 'injection' ,
                'url' => $url
            ]);

            return $dom;
        }

        return $html;
    }

    public function is_url_allowed($url = null, $args = null)
    {

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
        $_post = $post;

        if ( !$_post && isset( $args['post_id'] ) ) {
            $_post = get_post( $args['post_id'] );
        }

        if ( $_post ) {
            $page_options = RapidLoad_Base::get_page_options( $_post->ID );
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

    public function enabled($url) {

        if ( $this->is_doing_api_fetch() ) {
            return false;
        }

        // fix for uucss fallback css files being purged as url's
        if ( $this->is_uucss_file() ) {
            return false;
        }

        if ( ! $this->is_url_allowed($url) ) {
            return false;
        }

        if ( is_admin() ) {
            return false;
        }

        if ( wp_doing_ajax() ) {
            return false;
        }

        if ( is_404() ) {
            return false;
        }

        if ( is_preview() ) {
            return false;
        }

        if ( $this->is_cli() ) {
            return false;
        }

        if ( is_search() ) {
            return false;
        }

        if ( defined( 'DOING_CRON' ) ) {
            return false;
        }

        if( RapidLoad_DB::$current_version < 1.3){
            return false;
        }

        return apply_filters('uucss/enabled', true);

    }

    public function handle_job($url, $args){

        global $rapidload;

        if(!isset($args['post_id'])){
            $args['post_id'] = url_to_postid($url);
        }

        $applicable_rule = $rapidload->get_applicable_rule($url, $args);

        $job = new RapidLoad_Job([
            'url' => $url
        ]);

        if(!isset($job->rule_id) && $applicable_rule) {

            $rule = new RapidLoad_Job([
                'url' => $url,
                'rule' => $applicable_rule->rule,
                'regex' => $applicable_rule->regex,
            ]);

            $job->rule_id = $rule->id;
            $job->status = 'rule-based';
            $job->parent = $rule;
            $job->save();

            self::log([
                'log' => 'RapidLoad_Enqueue->handle_job:added_url_for_rule-' . $applicable_rule->rule,
                'type' => 'injection' ,
                'url' => $url
            ]);

        }else{

            self::log([
                'log' => 'RapidLoad_Enqueue->handle_job:url_exist',
                'type' => 'injection' ,
                'url' => $url
            ]);

        }

        if ( !isset( $this->options['uucss_disable_add_to_queue'] ) ||
                isset( $this->options['uucss_disable_add_to_queue'] ) &&
                $this->options['uucss_disable_add_to_queue'] != "1" || $applicable_rule)
        {
            if(!isset($job->id)){
                $job->save();
                self::log([
                    'log' => 'RapidLoad_Enqueue->handle_job:added_url',
                    'type' => 'injection' ,
                    'url' => $url
                ]);
            }
        }

        do_action('rapidload/job/handle', $job, $args);

        if(isset($job->id) && $this->enabled_frontend() && !isset( $_REQUEST['no_uucss'] )){
            $this->replace_css($url);
        }

    }

    function enabled_frontend() {

        if ( is_user_logged_in() ) {
            return false;
        }

        if ( is_admin() ) {
            return false;
        }

        return apply_filters('uucss/frontend/enabled', true);
    }

}