<?php


class CriticalCSS_RapidLoad_Admin extends \RapidLoad\Service\CriticalCSS_Admin{

    public function __construct(){

        parent::__construct();

        add_action('uucss/after_option_table', [$this, 'render_form']);
    }

    public function render_form(){

        include( 'parts/options-page.html.php' );
    }
}