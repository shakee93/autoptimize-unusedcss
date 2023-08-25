<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Enqueue
{
    use RapidLoad_Utils;

    private $file_system;

    private $dom;
    private $inject;
    private $options;

    private $job_data;
    private $files;
    private $warnings;
    private $is_mobile;
    private $strategy;

    public function __construct($job_data)
    {
        $this->options = RapidLoad_Base::get_merged_options();

        $this->file_system = new RapidLoad_FileSystem();

        $this->job_data = $job_data;

        $this->files = isset($job_data->data) ? unserialize($job_data->data) : [];

        $this->enqueue_frontend_scripts();

        $this->warnings = $this->job_data->get_warnings();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 20);
    }

    function enqueue_frontend_scripts(){

        if(isset($this->job_data->id) && $this->job_data->status == 'success' && !empty($this->files)){

            wp_register_script( 'rapidload', UUCSS_PLUGIN_URL . 'assets/js/rapidload.frontend.min.js?v=i', [ 'jquery' ], UUCSS_VERSION );
            wp_localize_script( 'rapidload', 'rapidload', [
                'files' => $this->files,
                'do_not_load_original_css' => apply_filters('rapidload/frontend/do-not-load/original-css', false),
                'options' => $this->options
            ] );
            wp_enqueue_script( 'rapidload' );

        }

    }

    function update_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        if(isset($state['strategy'])){
            $this->strategy = $state['strategy'];
        }

        if(!isset($this->job_data->id) || $this->job_data->status != 'success'){
            //$this->inject->rapidload = false;
            //$this->inject->successfully_injected = false;
            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options,
                'strategy' => $this->strategy
            ];
        }

        if($this->dom && $this->inject){

            if(RapidLoad_Enqueue::$frontend_debug){
                $this->dom->find( 'html' )[0]->uucss = true;
            }

            $this->replace_stylesheets();

            $this->replace_inline_css();

            $this->enqueue_completed();

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options,
                'strategy' => $this->strategy
            ];

        }

        return $state;

    }

    public function replace_stylesheets(){

        $sheets = $this->dom->find( 'link' );

        foreach ( $sheets as $sheet ) {

            do_action('rapidload/enqueue/before-optimize-css', $sheet, $this->job_data, $this->strategy);

            $parent = $sheet->parent();

            if(isset($parent) && $parent->tag == 'noscript'){
                continue;
            }

            $link = $sheet->href;

            $this->inject->found_sheets = true;

            if ( self::is_css( $sheet ) && !$this->is_file_excluded($this->options, $link)) {

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

                    if(RapidLoad_Enqueue::$frontend_debug){
                        $sheet->uucss = true;
                    }

                    $sheet->href  = apply_filters('uucss/enqueue/new/link', $newLink);

                    $sheet->{'data-href'} = $sheet->href;
                    $sheet->{'data-media'} = $sheet->media;

                    if ( isset( $this->options['uucss_inline_css'] ) ) {

                        $this->inline_sheet($sheet, $uucss_file);
                    }

                    array_push( $this->inject->injected_css_files, $newLink );

                    do_action('rapidload/enqueue/after-optimize-css', $sheet, $this->job_data, $this->strategy);

                }
                else {

                    if(!$sheet->uucss && !$this->is_file_excluded($this->options, $link)){

                        $this->inject->successfully_injected = false;

                        if(!$this->warnings){
                            $this->warnings = [];
                        }

                        if(!in_array($link, array_column($this->warnings, 'file'))){

                            $warning = [
                                "file" => $link,
                                "message" => "RapidLoad optimized version for the file missing."
                            ];

                            $this->warnings[] = $warning;

                        }

                    }

                }
            }

        }
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

                        $warning_exist = null;

                        if(is_array($this->warnings)){
                            $warning_exist = array_search($warning, $this->warnings);
                        }

                        if(!isset($warning_exist)){
                            $this->warnings[] = $warning;
                        }

                    }

                }
            }

            if(!empty($inline_style_content)){

                $file_name = 'id="uucss-inline-' . md5($this->job_data->job->url) . '"';
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

        if(isset($this->job_data->created_at)){
            $time_diff = time() - strtotime($this->job_data->created_at);
        }

        if($this->inject->successfully_injected){

            $this->job_data->mark_as_successful_hit();

            if(RapidLoad_Enqueue::$frontend_debug){
                $this->dom->find( 'body' )[0]->uucss = true;
            }

        }else if(
            !isset($this->options['uucss_disable_add_to_re_queue']) &&
            !$this->inject->successfully_injected &&
            ($this->job_data->attempts <= 2 || ($time_diff > 86400)) &&
            apply_filters('uucss/enqueue/re-queue-on-fail', true)){

            self::log([
                'log' =>  'requeue-> uucss requeue due to warnings',
                'url' => $this->job_data->job->url,
            ]);
            $this->job_data->requeue();

        }else{

            $this->job_data->set_warnings($this->warnings);

        }

        $this->job_data->save(['data', 'stats']);

    }

    private function inline_sheet( $sheet, $link ) {

        $inline = $this->get_inline_content( $link );

        if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/enqueue/inline-css-limit', 5 * 1000 ) ) {
            return;
        }

        $file_name = 'id="' . basename( $link ) . '"';
        $tag_name = RapidLoad_Enqueue::$frontend_debug ? 'uucss': '';

        $data_href = isset($sheet->{'data-href'}) ? ' data-href="'. $sheet->{'data-href'} . '" ' : ' ';
        $data_media = isset($sheet->{'data-media'}) ? ' data-media="'. $sheet->{'data-media'} . '" ' : ' ';

        $sheet->__set('outertext', '<style '. $file_name .' '. $tag_name . $data_href . $data_media .'>'. $inline['content'] .'</style>');

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

    private static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }

    private function log_action($message){
        self::log([
            'log' => $message,
            'url' => $this->job_data->job->url,
            'type' => 'injection'
        ]);
    }
}