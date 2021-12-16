<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Enqueue {

    use RapidLoad_Utils;

    private $file_system;

    private $dom;
    private $inject;
    private $options;

    private $data;
    private $files;
    private $warnings;
    private $link;

    function __construct($data, $url = '', $link = null)
    {

        $this->file_system = new RapidLoad_FileSystem();

        $this->link = $link;

        $this->data = $data;

        $this->log_action('UnusedCSS_Enqueue->__construct');

        if(isset($this->data)){

            $this->files = $this->data->get_files();
            $this->warnings = $this->data->get_warnings();

        }

        add_filter('uucss/enqueue/content/update', [$this, 'the_content'], 10);

        $this->log_action('UnusedCSS_Enqueue->__construct:add_filter-uucss/enqueue/content/update');
    }

    public function replace_inline_css(){

        $inline_styles = $this->dom->find('style');

        if(isset($this->options['uucss_include_inline_css']) &&
            $this->options['uucss_include_inline_css'] == '1' &&
            apply_filters('uucss/inline-css-enabled', true) &&
            isset($this->files) && !empty($this->files)){

            $inline_style_content = '';

            foreach ($inline_styles as $style){

                $parent = $style->parent();

                if(isset($parent) && $parent->tag == 'noscript'){
                    continue;
                }

                if(isset($style->uucss)){
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

                }else {

                    $this->inject->successfully_injected = false;

                    if(!in_array($search, array_column($this->warnings, 'file'))){

                        $warning = [
                            "file" => $search,
                            "message" => "RapidLoad optimized version for the inline style missing."
                        ];

                        if($this->data->is_type('Rule') && $this->link){

                            $this->link->add_warning($warning);

                        }else{

                            $this->warnings[] = $warning;

                        }

                    }

                }
            }

            if(!empty($inline_style_content)){

                $file_name = 'id="uucss-inline-' . md5($this->data->url) . '"';
                $uucss_tag = RapidLoad_Enqueue::$frontend_debug ? 'uucss' : '';
                $inline_style_content = sprintf('<style %s %s>%s</style>', $file_name, $uucss_tag, $inline_style_content);

                $title_content = $this->dom->find( 'title' )[0]->outertext;

                $this->dom->find( 'title' )[0]->outertext = $title_content . $inline_style_content;

            }

        }

        return $this->dom;
    }

    public function enqueue_completed(){

        global $uucss;

        $time_diff = 0;

        if(isset($this->data->created_at)){
            $time_diff = time() - strtotime($this->data->created_at);
        }

        if($this->inject->successfully_injected){

            $this->data->mark_as_successful_hit();
            if($this->data->is_type('Rule') && $this->link){

                $this->link->mark_as_successful_hit();
            }
            if(RapidLoad_Enqueue::$frontend_debug){
                $this->dom->find( 'body' )[0]->uucss = true;
            }

            $this->log_action(' 🟢 UnusedCSS_Enqueue->enqueue_completed:successfully_injected');

        }else if(
            !isset($this->options['uucss_disable_add_to_re_queue']) &&
            !$this->inject->successfully_injected &&
            ($this->data->attempts <= 2 || ($time_diff > 86400)) &&
            apply_filters('uucss/enqueue/re-queue-on-fail', true)){

            $this->data->requeue();

            $this->log_action('UnusedCSS_Enqueue->enqueue_completed:requeue');

        }else{

            $this->data->set_warnings($this->warnings);
            $this->data->reset_success_hits();

            $this->log_action('UnusedCSS_Enqueue->enqueue_completed:set_warnings');

        }

        $this->data->save();
        if($this->data->is_type('Rule') && $this->link){

            $this->link->save();
        }

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

                        $search_link = apply_filters('uucss/enqueue/path-based-search/link', $url_parts['path']);

                        $result = preg_grep('~' . $search_link . '~', array_column( $this->files, 'original' ));

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

                        if(RapidLoad_Enqueue::$frontend_debug){
                            $sheet->uucss = true;
                        }

                        $sheet->href  = apply_filters('uucss/enqueue/new/link', $newLink);

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

                            $warning = [
                                "file" => $link,
                                "message" => "RapidLoad optimized version for the file missing."
                            ];

                            if($this->data->is_type('Rule') && $this->link){

                                $this->link->add_warning($warning);

                            }else{

                                $this->warnings[] = $warning;

                            }

                        }

                    }

                }
            }

        }
    }

    public function the_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        if(!$this->data || !isset($this->data) || isset($this->data) && $this->data->status != 'success'){
            $this->inject->successfully_injected = false;
            $this->inject->rapidload = false;

            $this->log_action('UnusedCSS_Enqueue->the_content:inject-failed');

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }

        if($this->dom && $this->inject){

            if(RapidLoad_Enqueue::$frontend_debug){
                $this->dom->find( 'html' )[0]->uucss = true;
            }

            $this->log_action('UnusedCSS_Enqueue->the_content:before_replace_stylesheets');

            $this->replace_stylesheets();

            $this->log_action('UnusedCSS_Enqueue->the_content:after_replace_stylesheets');

            $this->log_action('UnusedCSS_Enqueue->the_content:before_replace_inline_css');

            $this->replace_inline_css();

            $this->log_action('UnusedCSS_Enqueue->the_content:after_replace_inline_css');

            $this->log_action('UnusedCSS_Enqueue->the_content:before_enqueue_completed');

            $this->enqueue_completed();

            $this->log_action('UnusedCSS_Enqueue->the_content:after_enqueue_completed');

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }

        return $state;
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
            'url' => $this->data->is_type('Rule') && $this->link ? $this->link->url : $this->data->url,
            'type' => 'injection'
        ]);
    }

    private function inline_sheet( $sheet, $link ) {

        $inline = $this->get_inline_content( $link );

        if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/enqueue/inline-css-limit', 5 * 1000 ) ) {
            return;
        }

        $file_name = 'id="' . basename( $link ) . '"';
        $tag_name = RapidLoad_Enqueue::$frontend_debug ? 'uucss': '';

        $sheet->outertext = sprintf('<style %s %s>%s</style>', $file_name, $tag_name, $inline['content']);

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
