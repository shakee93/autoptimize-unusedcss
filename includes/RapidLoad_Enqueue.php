<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Enqueue {

    use RapidLoad_Utils;

    private $options;
    private $url;
    private $rule;
    private $group;
    public static $job;

    public static $frontend_debug = false;

    public function __construct()
    {
        $this->options = RapidLoad_Base::get_merged_options();

        if(isset($_COOKIE['rapidload_debug']) && $_COOKIE['rapidload_debug'] == "1" || apply_filters('rapidload/enable/frontend_rapidload_debug', false)){
            self::$frontend_debug = true;
        }

        add_filter('uucss/enqueue/content', [$this, 'the_content'], 10, 2);

        add_action('wp_enqueue_scripts', function (){

            $this->url = $this->get_current_url();

            $this->url = $this->transform_url($this->url);

            if($this->enabled($this->url)){

                $this->group = $this->get_current_group();

                error_log(json_encode($this->group, JSON_PRETTY_PRINT));

                if(RapidLoad_Base::get()->rules_enabled()){

                    $this->rule = $this->get_current_rule();

                }

                $this->handle_job($this->url, []);

            }

        });
    }

    public function replace_css($job)
    {
        $buffer = apply_filters('uucss/enqueue/buffer','rapidload_buffer');
        add_filter( $buffer, function ( $html ) use($job){
            return apply_filters('uucss/enqueue/content', $html, $job);
        }, 10 );
    }

    public function the_content($html, $job){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
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

            $strategy = $this->is_mobile() ? 'mobile' : 'desktop';

            $state = apply_filters('uucss/enqueue/content/update',[
                'dom' => $dom,
                'inject' => $inject,
                'options' => $this->options,
                'job' => $job,
                'strategy' => $strategy,
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

            $pattern = '/(?:href|src)=["\']?([^"\'>\s]+)/';

            $_html = "";

            if(isset($dom)){

                if(gettype($dom) == "string"){
                    $_html = $dom;
                }else{
                    $_html = $dom->__toString();
                }

            }

            $_html = preg_match_all('/(?:href|src)=["\']?([^"\'>\s]+)/', $_html, $matches);

            $domains = [];

            foreach ($matches[1] as $url) {
                if(filter_var($url, FILTER_VALIDATE_URL)){
                    if(isset($url) && !empty($url)){
                        $_parsed_url = parse_url($url);
                        if(isset($_parsed_url['host'])){
                            array_push($domains, $_parsed_url['host']);
                        }
                    }
                }
            }

            $domains = array_unique($domains);

            if(gettype($dom) != "string"){
                foreach ($domains as $domain){
                    if(!$this->str_contains(site_url(), $domain)){
                        $head = $dom->find('head', 0);
                        $preconnect = '<link href="//' . $domain . '" rel="dns-prefetch" crossorigin>';
                        $first_child = $head->first_child();
                        $first_child->__set('outertext', $preconnect . $first_child->outertext);
                    }
                }
            }


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
                    $this->log( 'skipped glob pattern match : ' . $url );
                    return false;
                }else if ( self::str_contains( urldecode($url), $pattern ) ) {
                    $this->log( 'skipped string contains : ' . $url );
                    return false;
                }

            }
        }

        $url_parts = parse_url( $url );

        if(isset($url_parts['query']) && $this->str_contains($url_parts['query'], 'customize_changeset_uuid')){
            $this->log( 'skipped query contains: ' . $url );
            return false;
        }

        if(!apply_filters('uucss/url/exclude', $url)){
            $this->log( 'skipped url exclude : ' . $url );
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

        /*if(RapidLoad_Base::get()->rules_enabled() && !$this->rule){

            $this->rule = $this->get_current_rule();

        }*/

        if(!isset(RapidLoad_Enqueue::$job)){
            RapidLoad_Enqueue::$job = new RapidLoad_Job([
                'url' => $url
            ]);
        }

        if(!isset(RapidLoad_Enqueue::$job->rule_id) && $this->rule && RapidLoad_Enqueue::$job->rule_note != "detached") {

            $rule = new RapidLoad_Job([
                'url' => $url,
                'rule' => $this->rule->rule,
                'regex' => $this->rule->regex,
            ]);

            RapidLoad_Enqueue::$job->rule_id = $rule->id;
            RapidLoad_Enqueue::$job->status = 'rule-based';
            RapidLoad_Enqueue::$job->parent = $rule;
            RapidLoad_Enqueue::$job->save();

        }

        $front_end_enabled = [];
        $front_end_enabled['add_queue_enabled'] = !isset( $this->options['uucss_disable_add_to_queue'] ) ||
            isset( $this->options['uucss_disable_add_to_queue'] ) && $this->options['uucss_disable_add_to_queue'] != "1";


        if(!isset(RapidLoad_Enqueue::$job->id)){

            RapidLoad_Enqueue::$job->save();

        }

        do_action('rapidload/job/handle', RapidLoad_Enqueue::$job, $args);

        $front_end_enabled['job_id_set'] = isset(RapidLoad_Enqueue::$job->id);
        $front_end_enabled['enabled'] = $this->enabled_frontend();
        $front_end_enabled['no_uucss'] = !isset( $_REQUEST['no_uucss'] );

        if($front_end_enabled['job_id_set'] && $front_end_enabled['enabled'] && $front_end_enabled['no_uucss']){
            $this->replace_css(RapidLoad_Enqueue::$job);
        }

    }

    function get_current_rule(){

        $rules = RapidLoad_Base::get()->get_pre_defined_rules();
        $user_defined_rules = RapidLoad_DB::get_rule_names();

        $related_rule = false;

        foreach ($user_defined_rules as $rule){

            $key = array_search($rule, array_column($rules, 'rule'));

            if(is_numeric($key) && isset($rules[$key]) && isset($rules[$key]['callback']) && is_callable($rules[$key]['callback']) && $rules[$key]['callback']()){

                $related_rule = RapidLoad_Base::get()->get_applicable_rule($this->url, $rules[$key]);

                if($related_rule){
                    break;
                }

            }

        }

        return $related_rule;
    }

    function get_current_group(){

        $current_page_type = $this->get_current_page_type();
        $current_page_content_type = $this->get_current_content_type();
        $current_page_id = get_queried_object_id();
        if($current_page_id == "0"){
            $current_page_id = null;
        }

        $possible_groups = [
            "25" => untrailingslashit($current_page_type . "/" . $current_page_content_type . "/" . $current_page_id),
            "50" => $current_page_type . "/" . $current_page_content_type . "/all",
            "75" => $current_page_type . "/all",
            "100" => 'all',
        ];

        if($current_page_type == "archive"){
            if(is_category()){
                $category = get_term($current_page_id, 'category');
                if(isset($category) && $category->parent != 0 ){
                    $possible_groups["30"] = untrailingslashit($current_page_type . "/direct_child_category_of/" . $category->parent);
                    $root_category = $this->get_root_parent_category($current_page_id);
                    if($root_category){
                        $possible_groups["40"] = untrailingslashit($current_page_type . "/any_child_category_of/" . $root_category);
                    }
                }

            }
        }
        elseif ($current_page_type == "singular"){
            $category_ids = wp_get_post_categories($current_page_id);
            foreach ($category_ids as $key => $category_id){
                $possible_groups["40." . $key] = untrailingslashit($current_page_type . "/in_category_of/" . $category_id);
            }
            $tags = wp_get_post_tags($current_page_id);
            foreach ($tags as $key => $tag){
                $possible_groups["41." . $key] = untrailingslashit($current_page_type . "/in_tag/" . $tag->term_id);
            }

            $author_id = get_post_field('post_author', $current_page_id);
            $possible_groups["42"] = untrailingslashit($current_page_type . "/by_author/" . $author_id);
        }
        elseif ($current_page_type == "woocommerce"){

            if (is_shop() || is_product_category() || is_product_tag()) {
                $possible_groups["40"] = $current_page_type . "/product_archives";
            }
            if($current_page_content_type == "product"){
                $category_ids = wp_get_post_terms($current_page_id, 'product_cat', array('fields' => 'ids'));
                foreach ($category_ids as $key => $category_id){
                    $possible_groups["41." . $key] = untrailingslashit($current_page_type . "/in_product_category/" . $category_id);
                    $root_category = $this->get_root_product_category_id($category_id);
                    if($root_category){
                        $possible_groups["42." . $key] = untrailingslashit($current_page_type . "/in_child_product_category/" . $root_category);
                    }
                }
                $product_tags = wp_get_post_terms($current_page_id, 'product_tag');
                foreach ($product_tags as $key => $tag) {
                    $possible_groups["43." . $key] = untrailingslashit($current_page_type . "/in_product_tag/" . $tag->term_id);
                }
                $author_id = get_post_field('post_author', $current_page_id);
                $possible_groups["44"] = untrailingslashit($current_page_type . "/by_author/" . $author_id);
            }

        }

        ksort($possible_groups);

        return apply_filters('rapidload/group-by/possible/conditions', array_values($possible_groups), $current_page_type, $current_page_content_type, $current_page_id);
    }

    function get_root_product_category_id($category_id) {
        $root_category_id = $category_id;

        while ($category_id) {
            $category = get_term($category_id, 'product_cat');

            if (is_wp_error($category)) {
                break;
            }

            $parent_id = isset($category->parent) ? $category->parent : 0;

            if ($parent_id == 0) {
                $root_category_id = $category_id;
                break;
            }

            $category_id = $parent_id;
        }

        return $root_category_id;
    }

    function get_root_parent_category($category_id) {
        $category = get_term($category_id, 'category');

        if (is_wp_error($category)) {
            return null;
        }

        while ($category->parent != 0) {
            $category = get_term($category->parent, 'category');
            if (is_wp_error($category)) {
                return false;
            }
        }

        return $category->term_id;
    }


    function get_current_page_type() {
        if (is_singular()) {
            if (class_exists('WooCommerce') && is_woocommerce()) {
                return 'woocommerce';
            }
            return 'singular';
        } elseif (is_archive() || is_home() || is_front_page() || is_category() || is_tag() || is_tax()) {
            if (class_exists('WooCommerce') && is_woocommerce()) {
                return 'woocommerce';
            }
            return 'archive';
        }
        return 'general';
    }

    function get_current_content_type() {
        if (is_front_page()) {
            return 'front_page';
        } elseif (is_page()) {
            if (function_exists('is_account_page') && is_account_page()) {
                return 'account';
            }
            return 'pages';
        } elseif (is_single()) {
            if (function_exists('is_product') && is_product()) {
                return 'product';
            }
            $post_type = get_post_type();
            if ($post_type) {
                return $post_type;
            } else {
                return 'posts';
            }
        } elseif (is_category()) {
            /*$category_name = single_cat_title('', false);
            if ($category_name) {
                return preg_replace('/\s+/', '_', strtolower($category_name));
            }*/
            return 'categories';
        } elseif (is_tag()) {
            /*$tag_name = single_tag_title('', false);
            if ($tag_name) {
                return preg_replace('/\s+/', '_', strtolower($tag_name));
            }*/
            return 'tags';
        } elseif (is_tax()) {
            if (function_exists('is_product_category') && is_product_category()) {
                return 'product_category';
            }elseif (function_exists('is_product_tag') && is_product_tag()) {
                return 'product_tag';
            }
            /*$tax_name = single_term_title('', false);
            if ($tax_name) {
                return preg_replace('/\s+/', '_', strtolower($tax_name));
            }*/
            return 'taxonomies';
        }elseif (is_post_type_archive()) {
            if (function_exists('is_shop') && is_shop()) {
                return 'shop';
            }
            $post_type = get_post_type();
            if ($post_type) {
                return $post_type;
            }
            return 'archive';
        }elseif (is_archive()) {
            if(is_author()){
                return 'author';
            }else if(is_date()){
                return 'date';
            }
            return 'archive';
        }elseif (is_home()){
            return 'posts';
        }else{
            return 'general';
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