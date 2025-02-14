<?php

class RapidLoad_Link_Preload_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;
    private $settings;
    private $strategy;

    private $aggregated_css = "";

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 30);
    }

    public function update_content($state){

        self::debug_log('doing preload links');

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

        $body = $this->dom->find('body', 0);
        $filePath = RAPIDLOAD_PLUGIN_DIR . '/assets/js/rapidload.preload-links.js';
        $jsCode = file_get_contents($filePath);
        $node = $this->dom->createElement('script', $jsCode);
        $node->setAttribute('id', 'rapidload-preload-links');
        $node->setAttribute('type', 'text/javascript');
        $node->setAttribute('norapidload',true);
        $body->appendChild($node);

        return [
            'dom' => $this->dom,
            'inject' => $this->inject,
            'options' => $this->options,
            'strategy' => $this->strategy
        ];
    }
}