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
        $this->imgExt = ["jpg", "jpeg", "png", "webp"];
        $this->cdn = RapidLoad_Image::$image_indpoint;

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 50);
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

        $this->lazy_load_iframes();

        $this->preload_images();

        $this->set_width_and_height();

        $this->lazy_load_images();

        // replacing urls

        $attributes = [
            [
                'tag' => 'img',
                'attr' => 'src'
            ],
            [
                'tag' => 'img',
                'attr' => 'data-src'
            ]
        ];

        foreach ($attributes as $attribute){

            $images = $this->dom->find( $attribute['tag'] . '[' . $attribute['attr'] . ']' );

            foreach ( $images as $img ) {

                if($this->str_contains($img->{$attribute['attr']}, RapidLoad_Image::$image_indpoint)){
                    continue;
                }

                if($this->is_file_excluded($img->{$attribute['attr']})){
                    continue;
                }

                $url = $this->extractUrl($img->{$attribute['attr']});

                $urlExt = pathinfo($url, PATHINFO_EXTENSION);

                if (in_array($urlExt, $this->imgExt)) {

                    $data_src = 'data-original-src';
                    $img->{$attribute['attr']} = RapidLoad_Image::get_replaced_url($url, null, $img->width, $img->height, [
                        'optimize_level' => 'lqip'
                    ]);
                    //$this->get_placeholder($img);

                    $img->$data_src = $url;
                    unset($img->{'srcset'});

                }

            }
        }

        $videos = $this->dom->find( 'video[poster]' );

        foreach ( $videos as $video ) {

            if($this->str_contains($video->{'poster'}, RapidLoad_Image::$image_indpoint)){
                continue;
            }

            if($this->is_file_excluded($video->{'poster'})){
                continue;
            }

            $url = $this->extractUrl($video->{'poster'});

            $urlExt = pathinfo($url, PATHINFO_EXTENSION);

            if (in_array($urlExt, $this->imgExt)) {

                $data_src = 'data-original-poster';
                $video->{'poster'} = RapidLoad_Image::get_replaced_url($url, null, $video->width, $video->height, [
                    'optimize_level' => 'lqip'
                ]);
                //$this->get_placeholder($img);

                $video->$data_src = $url;

            }

        }

        $data_attributes = apply_filters('rapidload/image/optimize/data_attributes', []);

        foreach ($data_attributes as $data_attribute){

            $_data_attribute = $this->dom->find( 'div[' . $data_attribute . ']' );

            if(!empty($_data_attribute) && isset($_data_attribute[0])){
                $_data_attribute = $_data_attribute[0];
                $_data_attribute->{$data_attribute} = RapidLoad_Image::get_replaced_url($_data_attribute->{$data_attribute}, null, null, null, ['retina' => 'ret_img']);
            }
        }

        $inline_styles = $this->dom->find( '[style]' );

        foreach ( $inline_styles as $inline_style ) {

            $style_lines = explode(";",$inline_style->style);
            $_style_lines = [];

            foreach ($style_lines as $style_line){

                if(!$this->str_contains($style_line, "background-image")){
                    $_style_lines[] = $style_line;
                }else{
                    preg_match_all('/background-image:[ ]?url[ ]?\([\'|"]?(.*?\.(?:png|jpg|jpeg|webp))/', $style_line, $matches, PREG_SET_ORDER);

                    if(!empty($matches)){

                        foreach ($matches as $match) {
                            $url = $this->extractUrl($match[1]);
                            $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                            if (in_array($urlExt, $this->imgExt)) {
                                $replace_url = RapidLoad_Image::get_replaced_url($url,$this->cdn);
                                $inline_style->{'data-rapidload-lazy-bg'} = $replace_url;
                                $inline_style->{'data-rapidload-lazy-method'} = 'viewport';
                                $inline_style->{'data-rapidload-lazy-attributes'} = 'bg';
                            }
                        }

                    }else{
                        $_style_lines[] = $style_line;
                    }
                }

            }

            $inline_style->style = implode(";",$_style_lines);

            /*preg_match_all('/background-image:[ ]?url[ ]?\([\'|"]?(.*?\.(?:png|jpg|jpeg|webp))/', $inline_style->style, $matches, PREG_SET_ORDER);

            if(!empty($matches)){

                foreach ($matches as $match) {
                    $url = $this->extractUrl($match[1]);
                    $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                    if (in_array($urlExt, $this->imgExt)) {
                        $replace_url = RapidLoad_Image::get_replaced_url($url,$this->cdn);
                        $inline_style->style = str_replace($match[1],$replace_url,$inline_style->style);
                    }
                }

                $inline_style->{'data-rapidload-lazy-style'} = $inline_style->style;
                $inline_style->{'data-rapidload-lazy-method'} = 'viewport';
                $inline_style->{'data-rapidload-lazy-attributes'} = 'style';
                unset($inline_style->style);
            }*/

        }

        $styles = $this->dom->find( "style" );

        foreach ( $styles as $style ) {

            $parser = new \Sabberworm\CSS\Parser($style->innertext);
            $cssDocument = $parser->parse();
            foreach ($cssDocument->getAllValues() as $value) {
                if( $value instanceof \Sabberworm\CSS\Value\URL){
                    $url = $this->extractUrl($value->getURL()->getString());
                    $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                    if (in_array($urlExt, $this->imgExt)) {
                        $replace_url = RapidLoad_Image::get_replaced_url($url,$this->cdn);
                        $value->setURL(new \Sabberworm\CSS\Value\CSSString($replace_url));
                    }
                }
            }
            //$style->__set('innertext', $cssDocument->render());
        }

        return [
            'dom' => $this->dom,
            'inject' => $this->inject,
            'options' => $this->options
        ];
    }

    public function preload_images(){

        $preloaded_files = isset($this->options['uucss_preload_lcp_image']) && !empty($this->options['uucss_preload_lcp_image']) ? explode("\n", $this->options['uucss_preload_lcp_image']) : [];

        foreach ($preloaded_files as $preloaded_file){

            $preloaded_file = str_replace("\r", "", $preloaded_file);
            if(filter_var($preloaded_file, FILTER_VALIDATE_URL)){
                $preload_image = '<link rel="preload" href="' . $preloaded_file .'" as="image" > ';
                $title_content = $this->dom->find( 'title' )[0]->outertext;
                $this->dom->find( 'title' )[0]->__set('outertext', $title_content . $preload_image);
            }

        }

    }

    public function lazy_load_iframes(){

        if(isset($this->options['uucss_lazy_load_iframes']) && $this->options['uucss_lazy_load_iframes'] == "1"){

            $iframes = $this->dom->find( 'iframe[src]' );

            foreach ( $iframes as $index => $iframe ) {

                if($this->is_file_excluded($iframe->src, 'uucss_exclude_images_from_lazy_load')){
                    continue;
                }

                if($this->is_file_excluded($iframe->srcdoc, 'uucss_exclude_images_from_lazy_load')){
                    continue;
                }

                if ($iframe->srcdoc) {
                    $iframe->{'data-rapidload-lazy-srcdoc'} = $iframe->srcdoc;
                    $iframe->{'data-rapidload-lazy-src'} = $iframe->src ? $iframe->src : $iframe->{'data-src'};
                    $iframe->{'data-rapidload-lazy-method'} = 'viewport';
                    $iframe->{'data-rapidload-lazy-attributes'} = 'srcdoc,src';
                    unset($iframe->{'data-src'});
                    unset($iframe->{'srcdoc'});
                    unset($iframe->{'src'});
                }else{
                    $iframe->{'data-rapidload-lazy-src'} = $iframe->src ? $iframe->src : $iframe->{'data-src'};
                    $iframe->{'data-rapidload-lazy-method'} = 'viewport';
                    $iframe->{'data-rapidload-lazy-attributes'} = 'src';
                    unset($iframe->{'data-src'});
                    unset($iframe->{'src'});
                }

                $iframe->loading = "lazy";
            }
        }
    }

    public function lazy_load_images(){

        if(isset($this->options['uucss_lazy_load_images']) && $this->options['uucss_lazy_load_images'] == "1"){
            $images = $this->dom->find( 'img[src]' );

            foreach ( $images as $index => $img ) {

                if($this->is_file_excluded($img->src) || $this->is_file_excluded($img->src, 'uucss_exclude_images_from_lazy_load')){
                    $img->loading = "eager";
                    $img->decoding = "sync";
                    $img->fetchpriority = "high";
                }else if(($index + 1) <= $this->options['uucss_exclude_above_the_fold_image_count']){
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
    }

    public function set_width_and_height(){

        $attributes = [
            [
                'tag' => 'img',
                'attr' => 'src'
            ],
            [
                'tag' => 'img',
                'attr' => 'data-src'
            ]
        ];

        if(isset($this->options['uucss_set_width_and_height']) && $this->options['uucss_set_width_and_height'] == "1"){

            foreach ($attributes as $attribute){

                $images = $this->dom->find( $attribute['tag'] . '[' . $attribute['attr'] . ']' );

                foreach ( $images as $img ) {

                    if($this->is_file_excluded($img->{$attribute['attr']})){
                        continue;
                    }

                    $url = $this->extractUrl($img->{$attribute['attr']});

                    $file_path = self::get_file_path_from_url($url);

                    $dimension = self::get_width_height($file_path);

                    if ($dimension && isset($dimension['width']) && $dimension['height']) {

                        if (!isset($img->width)) {
                            $img->width = $dimension['width'];
                        }

                        if (!isset($img->height) || $img->height == "auto") {
                            $img->height = $dimension['height'];
                        }

                    }
                }

            }

        }

    }

    public function extractUrl($url){

        $parsedUrl = parse_url($url);

        if (!isset($parsedUrl['scheme'])) {
            $url = "https:" . $url;
        }

        if(!$this->isAbsolute($url)){
            $url = untrailingslashit(site_url()) . $url;
        }

        if(strpos($url,"//", 0) === 0){
            $url = "https:" . $url;
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

}