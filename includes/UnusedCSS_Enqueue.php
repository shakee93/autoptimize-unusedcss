<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Enqueue {

    use UnusedCSS_Utils;

    private $file_system;

    private $inject;

    function __construct()
    {
        $this->file_system = new UnusedCSS_FileSystem();

        add_filter('uucss/enqueue/before-enqueue', [$this, 'before_enqueue'], 10, 2);
        add_filter('uucss/enqueue/inject-css', [$this, 'inject_css'], 10, 3);
        add_filter('uucss/enqueue/replace-inline-css', [$this, 'replace_inline_css'], 10, 3);
        add_filter('uucss/enqueue/replace-style-sheets', [$this, 'replace_style_sheets'], 10, 3);
        add_filter('uucss/enqueue/enqueue-completed', [$this, 'enqueue_completed'], 10, 2);
    }

    public function replace_inline_css($dom , $data, $autoptimize){

        $inline_styles = $dom->find('style');

        if(isset($autoptimize->options['uucss_include_inline_css']) &&
            $autoptimize->options['uucss_include_inline_css'] == '1' &&
            autoptimizeOptionWrapper::get_option( 'autoptimize_css_include_inline' ) != 'on' &&
            isset($data['files']) && !empty($data['files'])){

            $inline_style_content = '';
            $warnings = [];

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

                $file_key = array_search( $search, array_column( $data['files'], 'original' ) );

                if(is_numeric( $file_key ) && $file_key){

                    $style->outertext = '';
                    $inline_style_content .= $data['files'][$file_key]['uucss'];

                }else{

                    $this->inject->successfully_injected = false;

                    if(!in_array($search, array_column($data['meta']['warnings'], 'file'))){

                        $warnings[] = [
                            "file" => $search,
                            "message" => "RapidLoad optimized version for the inline style missing."
                        ];

                    }

                }
            }

            if(!empty($inline_style_content)){

                $inline_style_content = '<style inlined-uucss="uucss-inline-' . md5($data['url']) . '" uucss>' . $inline_style_content . '</style>';

                $header_content = $dom->find( 'head' )[0]->outertext;
                $header_content = str_replace('</head>','', $header_content);

                $dom->find( 'head' )[0]->outertext = $header_content . $inline_style_content . '</head>';

            }

            if(!empty($warnings)){

                UnusedCSS_DB::update_meta([
                    'warnings' => array_merge($data['meta']['warnings'], $warnings)
                ], $data['url']);

                self::log([
                    'log' => 'inline style not found warnings added',
                    'url' => $data['url'],
                    'type' => 'injection'
                ]);
            }
        }

        return $dom;
    }

    public function before_enqueue($dom, $data){

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

        $dom->find( 'html' )[0]->uucss = true;

        self::log([
            'log' => 'header injection done',
            'url' => $data['url'],
            'type' => 'injection'
        ]);

        return $dom;
    }

    public function enqueue_completed($dom, $data){

        $time_diff = 0;

        if(isset($data['time'])){
            $time_diff = time() - $data['time'];
        }

        self::log([
            'log' => json_encode((array) $this->inject),
            'url' => $data['url'],
            'type' => 'injection'
        ]);


        if($this->inject->successfully_injected){

            if($data['attempts'] > 0){

                UnusedCSS_DB::reset_attempts($data['url']);
            }

            $dom->find( 'body' )[0]->uucss = true;

            UnusedCSS_DB::update_success_count($data['url']);

            self::log([
                'log' => 'injection success',
                'url' => $data['url'],
                'type' => 'injection'
            ]);

        }else if(!$this->inject->successfully_injected && ($data['attempts'] <= 2 || ($time_diff > 86400))){

            UnusedCSS_DB::update_meta([
                'status' => 'queued',
                'attempts' => $data['attempts'] + 1,
                'created_at' => date( "Y-m-d H:m:s", time() )
            ], $data['url']);

            self::log([
                'log' => 're-queued due to warnings',
                'url' => $data['url'],
                'type' => 'injection'
            ]);

        }else{

            UnusedCSS_DB::update_meta([
                'warnings' => $data['meta']['warnings']
            ], $data['url']);

            self::log([
                'log' => 'file not found warnings added',
                'url' => $data['url'],
                'type' => 'injection'
            ]);

        }

        return $dom;
    }

    public function replace_style_sheets($dom , $data, $autoptimize){

        $sheets = $dom->find( 'link' );

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

                        $result = preg_grep('~' . $url_parts['path'] . '~', array_column( $data['files'], 'original' ));

                        $key = isset($result) && !empty($result) ? key($result) : null;
                    }

                }else{

                    $link = apply_filters('uucss/cdn-url', $link);

                    $file = array_search( $link, array_column( $data['files'], 'original' ) );

                    if ( ! $file ) {
                        // Retry to see if file can be found with CDN url
                        $file = array_search( $autoptimize->uucss_ao_base->url_replace_cdn($link), array_column( $data['files'], 'original' ) );
                    }

                    $key = isset($data['files']) ? $file : null;

                }

                // check if we found a script index and the file exists
                if ( is_numeric( $key ) && $this->file_system->exists( UnusedCSS::$base_dir . '/' . $data['files'][ $key ]['uucss'] ) ) {
                    $uucss_file = $data['files'][ $key ]['uucss'];

                    array_push( $this->inject->found_css_cache_files, $link );

                    $newLink = $autoptimize->get_cached_file( $uucss_file, $autoptimize->uucss_ao_base->cdn_url );

                    // check the file is processed via AO
                    $is_ao_css = $autoptimize->ao_handled($link);

                    if($is_ao_css){

                        self::log([
                            'log' => 'ao handled',
                            'url' => $link,
                            'type' => 'injection'
                        ]);

                        array_push($this->inject->ao_optimized_css, $link);

                    }

                    if ( $is_ao_css || isset( $autoptimize->options['autoptimize_uucss_include_all_files'] ) ) {

                        $sheet->uucss = true;
                        $sheet->href  = $newLink;

                        if ( isset( $autoptimize->options['uucss_inline_css'] ) ) {
                            $autoptimize->inline_sheet( $sheet, $uucss_file );
                        }

                        array_push( $this->inject->injected_css_files, $newLink );

                    }

                }
                else {

                    $uucss_injected = $sheet->getAttribute('uucss');

                    if(!$uucss_injected && !$autoptimize->is_file_excluded($autoptimize->options, $link)){

                        $this->inject->successfully_injected = false;

                        if(!in_array($link, array_column($data['meta']['warnings'], 'file'))){

                            $data['meta']['warnings'][] = [
                                "file" => $link,
                                "message" => "RapidLoad optimized version for the file missing."
                            ];

                        }

                    }

                }
            }

        }

        return $dom;
    }

    public function inject_css($html, $data, $autoptimize){

        self::log([
            'log' => 'injection started',
            'url' => $data['url'],
            'type' => 'injection'
        ]);

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log( 'Dom parser not loaded' );
            return $html;
        }

        $dom = new \simplehtmldom\HtmlDocument(
            $html,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        if ( $dom ) {

            $dom = apply_filters('uucss/enqueue/before-enqueue', $dom, $data);

            $dom = apply_filters('uucss/enqueue/replace-inline-css', $dom, $data, $autoptimize);

            $dom = apply_filters('uucss/enqueue/replace-style-sheets', $dom, $data, $autoptimize);

            $dom = apply_filters('uucss/enqueue/enqueue-completed', $dom, $data);

            header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $this->inject->found_css_files ) . count( $this->inject->found_css_cache_files ) . count( $this->inject->injected_css_files ) . ']' );

            return $dom;
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