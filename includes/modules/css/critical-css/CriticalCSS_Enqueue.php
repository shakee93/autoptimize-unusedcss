<?php


class CriticalCSS_Enqueue
{
    use RapidLoad_Utils;

    private $file_system;

    private $dom;
    private $inject;
    private $options;

    private $job_data;
    private $data;
    private $warnings;
    private $is_mobile;

    public function __construct($job_data)
    {
        $this->file_system = new RapidLoad_FileSystem();

        $this->job_data = $job_data;

        $this->data = $job_data->data;
        $this->warnings = $this->job_data->get_warnings();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 40);
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

        if(!isset($this->job_data->id) || $this->job_data->status != 'success'){
            //$this->inject->rapidload = false;
            //$this->inject->successfully_injected = false;
            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }

        $this->is_mobile = $this->is_mobile() && isset($this->options) && isset($this->options['uucss_enable_cpcss_mobile']);

        if($this->is_mobile){
            $this->data = str_replace(".css","-mobile.css", $this->data);
            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-mobile'
            ]);
        }else{
            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-desktop'
            ]);
        }

        $file_exist = $this->file_system->exists(CriticalCSS::$base_dir . '/' . $this->data);

        if(!$file_exist){
            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-failed-file-not-exist'
            ]);
        }

        if(!$file_exist &&
            ($this->job_data->attempts <=2 || (time() - strtotime($this->job_data->created_at)) > 86400)) {
            $this->job_data->requeue();
            $this->job_data->save();
            //$this->inject->successfully_injected = false;
            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-failed'
            ]);
            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }

        if($file_exist && $this->dom && $this->inject){

            $this->enqueue_cpcss();

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ];
        }else{

            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-file_not_exist'
            ]);

        }

        return $state;

    }

    function update_noscript(){

        foreach ( $this->dom->find( 'link' ) as $key => $sheet ) {

            $parent = $sheet->parent();

            if(isset($parent) && $parent->tag == 'noscript' || !self::is_css($sheet)){
                continue;
            }

            if($sheet->tag != 'link'){
                continue;
            }

            if(is_numeric(strpos($sheet->outertext,'<style'))){
                continue;
            }

            if(isset($sheet->href) && apply_filters('rapidload/cpcss/noscript/disable', false, $sheet->href)){
                continue;
            }

            $data_norapidload = "data-norapidload";

            if(isset($sheet->$data_norapidload)){
                continue;
            }

            if(isset($sheet->id) && $this->str_contains($sheet->id, 'rapidload-google-font')){
                continue;
            }

            $sheet->onload = "this.onload=null;this.rel='stylesheet'";
            $sheet->rel = "preload";
            $sheet->as = "style";

        }
    }

    function enqueue_cpcss(){

        $critical_css_content = '';

        if($this->file_system->exists(CriticalCSS::$base_dir . '/' . $this->data)){
            $critical_css_content = $this->file_system->get_contents(CriticalCSS::$base_dir . '/' . $this->data );
        }

        if(isset($this->options['uucss_additional_css']) && !empty($this->options['uucss_additional_css'])){

            $critical_css_content .= $this->options['uucss_additional_css'];

        }

        if(empty($critical_css_content)){

            self::log([
                'type' => 'injection',
                'url' => $this->job_data->job->url,
                'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-content_empty'
            ]);

            return;
        }

        $critical_css_content = apply_filters('rapidload/cpcss/minify', $critical_css_content);

        $critical_css_content = '<style id="rapidload-critical-css" data-mode="'. ($this->is_mobile ? 'mobile' : 'desktop') .'">' . $critical_css_content . '</style>';

        if(isset($this->dom->find( 'title' )[0])){

            $title_content = $this->dom->find( 'title' )[0]->outertext;

            $this->dom->find( 'title' )[0]->__set('outertext', $title_content . $critical_css_content);

            $this->update_noscript();

        }

        $this->job_data->mark_as_successful_hit();
        $this->job_data->save();

        if(isset($this->options['remove_cpcss_on_user_interaction']) && $this->options['remove_cpcss_on_user_interaction'] == "1"){

            $body = $this->dom->find('body', 0);
            $node = $this->dom->createElement('script',
                "['mousemove', 'touchstart', 'keydown'].forEach(function (event) { var listener = function () { setTimeout(function (){ let element = document.getElementById('rapidload-critical-css'); if(element){ element.remove();} }, 5000); removeEventListener(event, listener) }; addEventListener(event, listener);});");

            $node->setAttribute('type', 'text/javascript');
            $body->appendChild($node);

        }

        self::log([
            'type' => 'injection',
            'url' => $this->job_data->job->url,
            'log' =>  'CriticalCSS_Enqueue->enqueue_cpcss-success'
        ]);

    }

    private static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }
}