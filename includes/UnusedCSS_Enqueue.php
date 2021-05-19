<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Enqueue {

    use UnusedCSS_Utils;

    private $file_system;

    private $inject;
    private $dom;
    private $data;
    private $options;
    private $files;
    private $warnings;
    private $link;

    function __construct($data, $url = '')
    {
        $this->file_system = new UnusedCSS_FileSystem();

        $this->link = new UnusedCSS_Path([
            'url' => $url
        ]);

        $this->data = $data;
        $this->files = $this->data->get_files();
        $this->warnings = $this->data->get_warnings();

        $this->options = UnusedCSS_Admin::fetch_options();

        add_filter('uucss/enqueue/content', [$this, 'the_content'], 10, 1);
    }

    public function replace_inline_css(){

        $inline_styles = $this->dom->find('style');

        if(isset($this->options['uucss_include_inline_css']) &&
            $this->options['uucss_include_inline_css'] == '1' &&
            apply_filters('uucss/enqueue/inline-css-enabled', false) &&
            isset($this->files) && !empty($this->files)){

            $inline_style_content = '';

            foreach ($inline_styles as $style){

                $parent = $style->parent();

                if(isset($parent) && $parent->tag == 'noscript'){
                    continue;
                }

                $exclude_ids = apply_filters('uucss/enqueue/inline-exclude-id',[]);

                if(in_array($style->id, $exclude_ids)){
                    continue;
                }

                $search = '//inline-style@' . md5(self::remove_white_space($style->innertext));

                $file_key = array_search( $search, array_column( $this->files, 'original' ) );

                if(is_numeric( $file_key ) && $file_key){

                    $style->outertext = '';
                    $inline_style_content .= $this->files[$file_key]['uucss'];

                }else{

                    $this->inject->successfully_injected = false;

                    if(!in_array($search, array_column($this->warnings, 'file'))){

                        $this->warnings[] = [
                            "file" => $search,
                            "message" => "RapidLoad optimized version for the inline style missing."
                        ];
                    }

                }
            }

            if(!empty($inline_style_content)){

                $inline_style_content = '<style inlined-uucss="uucss-inline-' . md5($this->data->url) . '" uucss>' . $inline_style_content . '</style>';

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

        global $uucss;

        $time_diff = 0;

        if(isset($this->data->created_at)){
            $time_diff = time() - strtotime($this->data->created_at);
        }

        if($this->inject->successfully_injected){

            $this->dom->find( 'body' )[0]->uucss = true;
            $this->data->mark_as_successful_hit();
            if($this->data->is_type('Rule')){

                $this->link->mark_as_successful_hit();
            }

        }else if(
            !isset($this->options['uucss_disable_add_to_re_queue']) &&
            !$this->inject->successfully_injected &&
            ($this->data->attempts <= 2 || ($time_diff > 86400)) &&
            apply_filters('uucss/enqueue/re-queue-on-fail', true)){

            if($this->data->is_type('Rule')){

                $this->link->attach_rule();

            }else{

                $this->data->requeue();

            }


        }else{


            if($this->data->is_type('Rule')){

                $this->link->attach_rule();

            }else{

                $this->data->set_warnings($this->warnings);
                $this->data->reset_success_hits();

            }

        }

        $this->data->save();
        if($this->data->is_type('Rule')){

            $this->link->save();
        }
        $this->log_action(json_encode($this->inject));
    }

    public function replace_stylesheets(){

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

                if(apply_filters('uucss/enqueue/path-based-search', true) && self::endsWith(basename(preg_replace('/\?.*/', '', $link)),'.css')){

                    $url_parts = parse_url( $link );

                    if(isset($url_parts['path'])){

                        $result = preg_grep('~' . $url_parts['path'] . '~', array_column( $this->files, 'original' ));

                        $key = isset($result) && !empty($result) ? key($result) : null;
                    }

                }else{

                    $link = apply_filters('uucss/enqueue/cdn-url', $link);

                    $file = array_search( $link, array_column( $this->files, 'original' ) );

                    if ( ! $file ) {
                        // Retry to see if file can be found with CDN url
                        $file = array_search( apply_filters('uucss/enqueue/provider-cdn-url',$link), array_column( $this->files, 'original' ) );
                    }

                    $key = isset($this->files) ? $file : null;

                }

                // check if we found a script index and the file exists
                if ( is_numeric( $key ) && $this->file_system->exists( UnusedCSS::$base_dir . '/' . $this->files[ $key ]['uucss'] ) ) {
                    $uucss_file = $this->files[ $key ]['uucss'];

                    array_push( $this->inject->found_css_cache_files, $link );

                    $newLink = apply_filters('uucss/enqueue/cache-file-url', $uucss_file);

                    // check the file is processed via AO
                    $is_ao_css = apply_filters('uucss/enqueue/provider-handled-file', false, $link);

                    if($is_ao_css){

                        array_push($this->inject->ao_optimized_css, $link);

                    }

                    if ( $is_ao_css || isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {

                        $sheet->uucss = true;
                        $sheet->href  = $newLink;

                        $this->log_action('file replaced <a href="' . $sheet->href . '" target="_blank">'. $sheet->href .'</a><br><br>for <a href="' . $link . '" target="_blank">'. $link . '</a>');

                        if ( isset( $this->options['uucss_inline_css'] ) ) {

                            $this->inline_sheet($sheet, $uucss_file);
                        }

                        array_push( $this->inject->injected_css_files, $newLink );

                    }

                }
                else {

                    if(!$sheet->uucss && !$this->is_file_excluded($this->options, $link)){

                        $this->inject->successfully_injected = false;

                        if(!in_array($link, array_column($this->warnings, 'file'))){

                            $this->log_action('file not found warning added for <a href="' . $link . '" target="_blank">'. $link . '</a>');

                            $this->warnings[] = [
                                "file" => $link,
                                "message" => "RapidLoad optimized version for the file missing."
                            ];

                        }

                    }

                }
            }

        }
    }

    public function the_content($html){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log( 'Dom parser not loaded' );
            return $html;
        }

        $this->dom = new \simplehtmldom\HtmlDocument(
            null,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        $this->dom->load(
            $html,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        if ( $this->dom ) {

            $this->before_enqueue();

            $this->replace_stylesheets();

            $this->replace_inline_css();

            $this->enqueue_completed();

            header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $this->inject->found_css_files ) . count( $this->inject->found_css_cache_files ) . count( $this->inject->injected_css_files ) . ']' );

            return $this->dom;
        }

        return $html;
    }

    private static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }

    private static function endsWith( $haystack, $needle ) {
        $length = strlen( $needle );
        if( !$length ) {
            return true;
        }
        return substr( $haystack, -$length ) === $needle;
    }

    private function log_action($message){
        self::log([
            'log' => $message,
            'url' => $this->data->url,
            'type' => 'injection'
        ]);
    }

    private function inline_sheet( $sheet, $link ) {

        $inline = $this->get_inline_content( $link );

        if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/enqueue/inline-css-limit', 5 * 1000 ) ) {
            return;
        }

        $sheet->outertext = '<style inlined-uucss="' . basename( $link ) . '">' . $inline['content'] . '</style>';

    }

    private function get_inline_content( $file_name ) {

        $file = implode( '/', [
            UnusedCSS::$base_dir,
            $file_name
        ] );

        return [
            'size'    => $this->file_system->size( $file ),
            'content' => $this->file_system->get_contents( $file )
        ];
    }
}