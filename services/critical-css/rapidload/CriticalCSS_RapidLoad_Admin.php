<?php


class CriticalCSS_RapidLoad_Admin extends \RapidLoad\Service\CriticalCSS_Admin{

    public function __construct(){

        parent::__construct();

        add_action('uucss/after_option_table', [$this, 'render_form']);
    }

    public function render_form(){

        if(RapidLoad_DB::$current_version < 1.3){
            return;
        }

        $options = RapidLoad_Base::fetch_options();
        include( 'parts/options-page.html.php' );
    }
}