<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Enqueue {

    use UnusedCSS_Utils;

    private $file_system;

    private $inject;
    private $dom;
    private $data;
    private $options;

    function __construct($data)
    {
        $this->file_system = new UnusedCSS_FileSystem();

        $this->data = $data;

        $this->options = apply_filters('uucss/settings-options', []);

        add_filter('uucss/enqueue/inject-css', [$this, 'inject_css'], 10, 1);
        add_action('uucss/enqueue/before-enqueue', [$this, 'before_enqueue']);
        add_action('uucss/enqueue/replace-inline-css', [$this, 'replace_inline_css']);
        add_action('uucss/enqueue/replace-style-sheets', [$this, 'replace_style_sheets']);
        add_action('uucss/enqueue/enqueue-completed', [$this, 'enqueue_completed']);
    }

    public function replace_inline_css(){

        $inline_styles = $this->dom->find('style');

        if(isset($this->options['uucss_include_inline_css']) &&
            $this->options['uucss_include_inline_css'] == '1' &&
            apply_filters('uucss/inline-css-enabled', false) &&
            isset($this->data['files']) && !empty($this->data['files'])){

            $inline_style_content = '';

            foreach ($inline_styles as $style){

                $parent = $style->parent();

                if(isset($parent) && $parent->tag == 'noscript'){
                    continue;
                }

                $exclude_ids = apply_filters('uucss/inline/exclude-id',[]);

                if(in_array($style->id, $exclude_ids)){
                    continue;
                }

                $search = '//inline-style@' . md5(self::remove_white_space($style->innertext));

                $file_key = array_search( $search, array_column( $this->data['files'], 'original' ) );

                if(is_numeric( $file_key ) && $file_key){

                    $style->outertext = '';
                    $inline_style_content .= $this->data['files'][$file_key]['uucss'];

                }else{

                    $this->inject->successfully_injected = false;

                    if(!in_array($search, array_column($this->data['meta']['warnings'], 'file'))){

                        $this->data['meta']['warnings'][] = [
                            "file" => $search,
                            "message" => "RapidLoad optimized version for the inline style missing."
                        ];
                    }

                }
            }

            if(!empty($inline_style_content)){

                $inline_style_content = '<style inlined-uucss="uucss-inline-' . md5($this->data['url']) . '" uucss>' . $inline_style_content . '</style>';

                $header_content = $this->dom->find( 'head' )[0]->outertext;
                $header_content = str_replace('</head>','', $header_content);

                $this->dom->find( 'head' )[0]->outertext = $header_content . $inline_style_content . '</head>';

            }

        }

        return $this->dom;
    }

    public function before_enqueue(){

        $this->inject = (object) [
            "parsed_html"           => false,
            "found_sheets"          => false,
            "found_css_files"       => [],
            "found_css_cache_files" => [],
            "ao_optimized_css" => [],
            "injected_css_files"    => [],
            "successfully_injected"    => true,
        ];

        $this->inject->parsed_html = true;

        $this->dom->find( 'html' )[0]->uucss = true;
    }

    public function enqueue_completed(){

        $time_diff = 0;

        if(isset($this->data['time'])){
            $time_diff = time() - $this->data['time'];
        }

        if($this->inject->successfully_injected){

            if($this->data['attempts'] > 0){

                UnusedCSS_DB::reset_attempts($this->data['url']);
            }

            $this->dom->find( 'body' )[0]->uucss = true;

            UnusedCSS_DB::update_success_count($this->data['url']);

        }else if(!$this->inject->successfully_injected && ($this->data['attempts'] <= 2 || ($time_diff > 86400))){

            UnusedCSS_DB::update_meta([
                'status' => 'queued',
                'attempts' => $this->data['attempts'] + 1,
                'created_at' => date( "Y-m-d H:m:s", time() )
            ], $this->data['url']);

        }else{

            UnusedCSS_DB::update_meta([
                'warnings' => $this->data['meta']['warnings']
            ], $this->data['url']);

        }
    }

    public function replace_style_sheets(){

        $sheets = $this->dom->find( 'link' );

        foreach ( $sheets as $sheet ) {

            $parent = $sheet->parent();

            if(isset($parent) && $parent->tag == 'noscript'){
                continue;
            }

            $link = $sheet->href;

            $this->inject->found_sheets = true;

            if ( self::is_css( $sheet ) ) {

                array_push( $this->inject->found_css_files, $link );

                $key = false;

                if(apply_filters('uucss/path-based-search', true) && self::endsWith(basename(preg_replace('/\?.*/', '', $link)),'.css')){

                    $url_parts = parse_url( $link );

                    if(isset($url_parts['path'])){

                        $result = preg_grep('~' . $url_parts['path'] . '~', array_column( $this->data['files'], 'original' ));

                        $key = isset($result) && !empty($result) ? key($result) : null;
                    }

                }else{

                    $link = apply_filters('uucss/cdn-url', $link);

                    $file = array_search( $link, array_column( $this->data['files'], 'original' ) );

                    if ( ! $file ) {
                        // Retry to see if file can be found with CDN url
                        $file = array_search( apply_filters('uucss/autoptimize-cdn-url',$link), array_column( $this->data['files'], 'original' ) );
                    }

                    $key = isset($this->data['files']) ? $file : null;

                }

                // check if we found a script index and the file exists
                if ( is_numeric( $key ) && $this->file_system->exists( UnusedCSS::$base_dir . '/' . $this->data['files'][ $key ]['uucss'] ) ) {
                    $uucss_file = $this->data['files'][ $key ]['uucss'];

                    array_push( $this->inject->found_css_cache_files, $link );

                    $newLink = apply_filters('uucss/cache-file-path', $uucss_file);

                    // check the file is processed via AO
                    $is_ao_css = apply_filters('uucss/ao-handled', false, $link);

                    if($is_ao_css){

                        array_push($this->inject->ao_optimized_css, $link);

                    }

                    if ( $is_ao_css || isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {

                        $sheet->uucss = true;
                        $sheet->href  = $newLink;

                        if ( isset( $this->options['uucss_inline_css'] ) ) {

                            do_action('uucss/inject/inline-sheet', $sheet, $uucss_file);
                        }

                        array_push( $this->inject->injected_css_files, $newLink );

                    }

                }
                else {

                    if(!$sheet->uucss && !$this->is_file_excluded($this->options, $link)){

                        $this->inject->successfully_injected = false;

                        if(!in_array($link, array_column($this->data['meta']['warnings'], 'file'))){

                            $this->data['meta']['warnings'][] = [
                                "file" => $link,
                                "message" => "RapidLoad optimized version for the file missing."
                            ];

                        }

                    }

                }
            }

        }
    }

    public function inject_css($html){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log( 'Dom parser not loaded' );
            return $html;
        }

        $this->dom = new \simplehtmldom\HtmlDocument(
            $html,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        if ( $this->dom ) {

            do_action('uucss/enqueue/before-enqueue');

            do_action('uucss/enqueue/replace-inline-css');

            do_action('uucss/enqueue/replace-style-sheets');

            do_action('uucss/enqueue/enqueue-completed');

            header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $this->inject->found_css_files ) . count( $this->inject->found_css_cache_files ) . count( $this->inject->injected_css_files ) . ']' );

            return $this->dom;
        }

        return $html;
    }

    public static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }

    public static function endsWith( $haystack, $needle ) {
        $length = strlen( $needle );
        if( !$length ) {
            return true;
        }
        return substr( $haystack, -$length ) === $needle;
    }
}