<?php

class JavaScript
{

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('uucss/options/css', [$this, 'render_options']);
    }

    public function render_options($args){
        $options = $args;
        include_once 'parts/options.html.php';

    }
}