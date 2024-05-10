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
    private $strategy;

    private $frontend_data = [];

    public function __construct($job_data)
    {
        $this->file_system = new RapidLoad_FileSystem();

        $this->job_data = $job_data;

        $this->data = $job_data->data;
        $this->warnings = $this->job_data->get_warnings();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 20);
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

        $this->is_mobile = $this->is_mobile() && isset($this->options) && isset($this->options['uucss_enable_cpcss_mobile']) && $this->options['uucss_enable_cpcss_mobile'] == "1";

        if($this->is_mobile){
            $this->data = str_replace(".css","-mobile.css", $this->data);
        }

        $file_exist = $this->file_system->exists(CriticalCSS::$base_dir . '/' . $this->data);

        if(!$file_exist &&
            ($this->job_data->attempts <=2 || (time() - strtotime($this->job_data->created_at)) > 86400)) {
            self::log([
                'log' =>  'requeue-> critical css file not found and attempts less than two or last generated days more than one',
                'url' => $this->job_data->job->url,
            ]);
            $this->job_data->requeue();
            $this->job_data->save();
            //$this->inject->successfully_injected = false;
            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options,
                'strategy' => $this->strategy
            ];
        }

        if($file_exist && $this->dom && $this->inject){

            $this->enqueue_cpcss();

            return [
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options,
                'strategy' => $this->strategy
            ];
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

            if(!$this->is_mobile && apply_filters('rapidload/cpcss/set-preload-css', true)){
                $sheet->onload = "this.onload=null;this.rel='stylesheet'";
                $sheet->rel = "preload";
                $sheet->as = "style";
            }else{
                if(!apply_filters('rapidload/frontend/do-not-load/original-css', false) && isset($sheet->{'data-href'})){
                    unset($sheet->href);
                }
            }



        }
    }

    function enqueue_cpcss(){

        $critical_css_content = '';

        if($this->file_system->exists(CriticalCSS::$base_dir . '/' . $this->data)){
            $critical_css_content = $this->file_system->get_contents(CriticalCSS::$base_dir . '/' . $this->data );
        }

        if(isset($this->options['uucss_additional_css']) && !empty($this->options['uucss_additional_css'])){

            $critical_css_content .= stripslashes($this->options['uucss_additional_css']);

        }

        if(empty($critical_css_content)){

            return;
        }

        $critical_css_content = apply_filters('rapidload/cpcss/minify', $critical_css_content, ($this->is_mobile ? 'mobile' : 'desktop'));

        $critical_css_content = '<style id="rapidload-critical-css" data-mode="'. ($this->is_mobile ? 'mobile' : 'desktop') .'">' . $critical_css_content . '</style>';

        $_frontend_data['data-mode'] = ($this->is_mobile ? 'mobile' : 'desktop');
        $_frontend_data['cpcss-file'] = CriticalCSS::$base_dir . '/' . $this->data;

        if(!empty($_frontend_data)){
            $this->frontend_data['cpcss'] = $_frontend_data;
        }

        add_filter('rapidload/optimizer/frontend/data', function ($data){
            return array_merge($data,$this->frontend_data);
        });

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

        add_filter('uucss/enqueue/content/cpcss/handled', function (){
            return true;
        });

    }

    private static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }
}