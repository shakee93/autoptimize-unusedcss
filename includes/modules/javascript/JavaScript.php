<?php

class JavaScript
{

    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('uucss/options/js', [$this, 'render_options']);

        if(!isset($this->options['uucss_enable_javascript'])){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_javascript'], 30, 2);

        add_action( 'admin_bar_menu', [$this, 'add_admin_bar_items' ], 90 );
    }

    public function add_admin_bar_items($wp_admin_bar){
        $wp_admin_bar->add_menu(
            array(
                'id'     => 'rapidload_psa',
                'parent' => 'top-secondary',
                'title'  => '<span class="ab-item">RapidLoad Optimizer</span>',
                'meta'   => array( 'title' => 'RapidLoad Optimizer' ),
            )
        );
    }

    public function render_options($args){
        $options = $args;
        include_once 'parts/options.html.php';

    }

    public function optimize_javascript($job, $args){

        new Javascript_Enqueue($job);

    }
}