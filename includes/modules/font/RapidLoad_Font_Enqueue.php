<?php

class RapidLoad_Font_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 80);
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

        $this->add_display_swap_to_inline_styles();

        $this->add_display_swap_to_google_fonts();

        $this->optimize_google_fonts();

        $this->preload_fonts();

        return $state;
    }

    public function preload_fonts()
    {

        $font_urls = isset($this->options['uucss_preload_font_urls']) ?
            explode(",", $this->options['uucss_preload_font_urls']) :
            [];

        foreach ($font_urls as $url) {
            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
            $preload_font = '<link rel="preload" href="'. $url .'" as="font" fetchpriority="high" type="font/'. $extension .'"> ';
            $title_content = $this->dom->find( 'title' )[0]->outertext;
            $this->dom->find( 'title' )[0]->__set('outertext', $title_content . $preload_font);
        }

    }

    public function add_display_swap_to_google_fonts(){

        $google_fonts = $this->dom->find('link[href*=fonts.googleapis.com/css]');
        foreach ($google_fonts as $google_font) {
            $url = parse_url($google_font->href);
            parse_str($url['query'], $q);
            $q['display'] = 'swap';
            $new_url = $url['scheme'] . '://' . $url['host'] . $url['path'] . '?' . http_build_query($q);
            $google_font->href = $new_url;
        }

    }

    public function add_display_swap_to_inline_styles(){

        $styles = $this->dom->find('style');
        foreach ($styles as $style){
            $inner_text = $style->innertext;
            $inner_text = preg_replace(
                '/font-display:\s?(auto|block|fallback|optional)/',
                'font-display:swap',
                $inner_text
            );
            $inner_text = preg_replace('/@font-face\s*{/', '@font-face{font-display:swap;', $inner_text);
            $style->__set('innertext', $inner_text);
        }
    }

    public function optimize_google_fonts(){

        $preconnects = $this->dom->find(
            'link[rel*=pre][href*=fonts.gstatic.com], link[rel*=rel][href*=fonts.googleapis.com]'
        );
        foreach ($preconnects as $preconnect) {
            $preconnect->remove();
        }

        $google_fonts = $this->dom->find('link[href*=fonts.googleapis.com]');

        foreach ($google_fonts as $google_font) {
            $hash = substr(md5($google_font->href), 0, 12);
            $filename = "$hash.google-font.css";

            $file_path = RapidLoad_Font::$base_dir . '/' . $filename;
            $file_url = apply_filters('uucss/enqueue/font-url', $filename);

            if (!is_file($file_path)) {
                RapidLoad_Font::self_host_style_sheet($google_font->href, $file_path);
            }

            if (is_file($file_path)) {
                $google_font->href = $file_url;
            }
        }
    }
}