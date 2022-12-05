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

        $this->add_display_swap_to_internal_styles();

        $this->add_display_swap_to_google_fonts();

        return $state;
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

    public function add_display_swap_to_internal_styles(){

        $stlyes = $this->dom->find('style');
        foreach ($stlyes as $style){
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
}