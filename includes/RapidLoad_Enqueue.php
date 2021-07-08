<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Enqueue {

    use RapidLoad_Utils;

    private $options;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_filter('uucss/enqueue/content', [$this, 'the_content'], 10, 1);

        add_action('wp_enqueue_scripts', function (){

            if($this->enabled()){
                $this->handle_job();
            }

        });

        add_action('uucss/rule/saved', [$this, 'handle_uucss_rule']);
    }

    public function the_content($html){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log( 'Dom parser not loaded' );
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

            $dom->find( 'html' )[0]->uucss = true;

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

            if($inject->successfully_injected){
                $dom->find( 'body' )[0]->uucss = true;
            }

            header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $inject->found_css_files ) . count( $inject->found_css_cache_files ) . count( $inject->injected_css_files ) . ']' );

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

        if ( isset( $args['post_id'] ) ) {
            $post = get_post( $args['post_id'] );
        }

        if ( $post ) {
            $page_options = RapidLoad_Base::get_page_options( $post->ID );
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

    public function rules_enabled(){
        return
            isset($this->options['uucss_enable_rules']) &&
            $this->options['uucss_enable_rules'] == "1" &&
            RapidLoad_DB::$current_version > 1.1 &&
            apply_filters('uucss/rules/enable', true);
    }

    public function handle_uucss_rule($args){

        $job = new RapidLoad_Job([
           'url' => $args->url,
           'rule' => $args->rule,
           'regex' => $args->regex,
        ]);
        $job->save();
    }

    public function enabled() {

        if ( $this->is_doing_api_fetch() ) {
            return false;
        }

        // fix for uucss fallback css files being purged as url's
        if ( $this->is_uucss_file() ) {
            return false;
        }

        if ( ! $this->is_url_allowed() ) {
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

        return apply_filters('uucss/enabled', true);

    }

    public function handle_job(){

        $url = $this->get_current_url();
        $args = $this->get_current_rule(UnusedCSS_DB::get_rule_names());

        $args['post_id'] = url_to_postid($url);

        if ( ! $this->is_url_allowed( $url, $args ) ) {
            return;
        }

        $applicable_rule = false;

        if(isset($args['rule']) && $this->rules_enabled()){

            $applicable_rule = UnusedCSS_DB::get_applied_rule($args['rule'], $url);

            if(!$applicable_rule){

                $applicable_rule = UnusedCSS_DB::get_applied_rule('is_path', $url);

            }
        }

        $job = new RapidLoad_Job([
            'url' => $url
        ]);

        if($applicable_rule && UnusedCSS_DB::rule_exists_with_error($applicable_rule->rule, $applicable_rule->regex)) {

            $rule = new RapidLoad_Job([
                'url' => $url,
                'rule' => $applicable_rule->rule,
                'regex' => $applicable_rule->regex,
            ]);

            $job->rule_id = $rule->id;
            $job->status = 'rule-based';
            $job->parent = $rule;
        }

        $job->save();

        do_action('rapidload/job/handle', $job, $args);

    }
}