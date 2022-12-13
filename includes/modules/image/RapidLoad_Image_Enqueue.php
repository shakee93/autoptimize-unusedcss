<?php

class RapidLoad_Image_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;
    private $settings;
    private $imgExt;
    private $cdn;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();
        $this->imgExt = ["jpg", "jpeg", "png"];
        $this->cdn = RapidLoad_Image::$image_indpoint;

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 30);
    }

    public function update_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        if(!isset($this->options['uucss_exclude_above_the_fold_image_count'])){
            $this->options['uucss_exclude_above_the_fold_image_count'] = 3;
        }

        $this->set_width_and_height();

        $this->lazy_load_images();

        // replacing urls

        $images = $this->dom->find( 'img[src]' );

        foreach ( $images as $img ) {

            if($this->is_file_excluded($img->src)){
                continue;
            }

            if($this->is_file_preloaded($img->src)){

                $preload_image = '<link rel="preload" href="'. $img->src .'" as="image" > ';
                $title_content = $this->dom->find( 'title' )[0]->outertext;
                $this->dom->find( 'title' )[0]->__set('outertext', $title_content . $preload_image);

            }else{

                $url = $this->extractUrl($img->src);

                $urlExt = pathinfo($url, PATHINFO_EXTENSION);

                if (in_array($urlExt, $this->imgExt)) {

                    $data_src = 'data-original-src';

                    $img->src = $this->get_placeholder($img);

                    $img->$data_src = $url;

                }

            }



        }

        $inline_styles = $this->dom->find( '[style]' );

        foreach ( $inline_styles as $inline_style ) {

            preg_match_all('/background[-image]*:.*[\s]*url\(["|\']+(.*)["|\']+\)/', $inline_style->style, $matches, PREG_SET_ORDER);
            foreach ($matches as $match) {
                $url = $this->extractUrl($match[1]);
                $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                if (in_array($urlExt, $this->imgExt)) {
                    $replace_url = RapidLoad_Image::get_replaced_url($url,$this->cdn);
                    $inline_style->style = str_replace($match[1],$replace_url,$inline_style->style);
                }
            }

        }

        $styles = $this->dom->find( "style" );

        foreach ( $styles as $style ) {

            $parser = new \Sabberworm\CSS\Parser($style->innertext);
            $cssDocument = $parser->parse();
            foreach ($cssDocument->getAllValues() as $value) {
                if( $value instanceof \Sabberworm\CSS\Value\URL){
                    $url = $this->extractUrl($this->extractUrl($value->getURL()->getString()));
                    $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                    if (in_array($urlExt, $this->imgExt)) {
                        $replace_url = RapidLoad_Image::get_replaced_url($url,$this->cdn);
                        $value->setURL(new \Sabberworm\CSS\Value\CSSString($replace_url));
                    }
                }
            }
            $style->__set('innertext', $cssDocument->render());
        }

        return $state;
    }

    public function lazy_load_images(){

        $images = $this->dom->find( 'img[src]' );

        foreach ( $images as $index => $img ) {

            if($this->is_file_excluded($img->src)){
                continue;
            }

            if(($index + 1) <= $this->options['uucss_exclude_above_the_fold_image_count']){
                $img->loading = "eager";
                $img->decoding = "sync";
                $img->fetchpriority = "high";
            }else{
                $img->loading = "lazy";
                $img->decoding = "async";
                $img->fetchpriority = "low";
            }

        }
    }

    public function set_width_and_height(){

        $images = $this->dom->find( 'img[src]' );

        foreach ( $images as $img ) {

            if($this->is_file_excluded($img->src)){
                continue;
            }

            $url = $this->extractUrl($img->src);

            $file_path = self::get_file_path_from_url($url);

            $dimension = self::get_width_height($file_path);

            if ($dimension && isset($dimension['width']) && $dimension['height']) {

                if (!isset($img->width)) {
                    $img->width = $dimension['width'];
                }

                if (!isset($img->height)) {
                    $img->height = $dimension['height'];
                }

            }
        }
    }

    public function extractUrl($url){

        if(!$this->isAbsolute($url)){
            $url = untrailingslashit(site_url()) . $url;
        }

        return $url;
    }

    function isAbsolute($url) {
        return isset(parse_url($url)['host']);
    }

    function get_placeholder($image)
    {
        if ($image->width && $image->height) {
            return $image->src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 $image->width $image->height'%2F%3E";
        }
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw';
    }

    private function is_file_excluded($file, $option_name = 'uucss_exclude_images'){

        $exclude_files = isset($this->options[$option_name]) && !empty($this->options[$option_name]) ? explode("\n", $this->options[$option_name]) : [];

        $excluded = false;

        foreach ($exclude_files as $exclude_file){

            $exclude_file = str_replace("\r", "", $exclude_file);

            if(self::is_regex_expression($exclude_file)){

                $excluded = preg_match($exclude_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $exclude_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }

    private function is_file_preloaded($file, $option_name = 'uucss_preload_lcp_image'){

        $preloaded_files = isset($this->options[$option_name]) && !empty($this->options[$option_name]) ? explode("\n", $this->options[$option_name]) : [];

        $excluded = false;

        foreach ($preloaded_files as $preloaded_file){

            $preloaded_file = str_replace("\r", "", $preloaded_file);

            if(self::is_regex_expression($preloaded_file)){

                $excluded = preg_match($preloaded_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $preloaded_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }
}