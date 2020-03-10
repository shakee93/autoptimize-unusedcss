<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS {


    /**
     * UnusedCSS constructor. 
     */
    public function __construct()
    {

        add_action('init', function () {


            if (!function_exists('autoptimize')) {
                $this->show_notice();
            }


           // $this->processCss();

        });

        

        add_action('autoptimize_setup_done', function () {

           




        });
    }

    public function show_notice()
    {

        add_action('admin_notices', function () {

            echo '<div class="notice notice-error is-dismissible">
                    <p>Autoptimize UnusedCSS Plugin only works when autoptimize is installed and activated</p>
                 </div>';

        });

    }


    public function is_enabled()
    {
        if (is_user_logged_in()) {
            return true;
        }

        return true;
    }

    public function get_unusedCSS($url = null)
    {

        $url = UnusedCSS_Utils::get_current_url();

        $css = (new UnusedCSS_Api())->get($url);

        error_log(json_encode($css, JSON_PRETTY_PRINT));
    }


    public function processCss(){

        if (!$this->is_enabled()) {
            return;
        }

        if(is_admin()) {
            return;
        }

        if(wp_doing_ajax()) {
            return;
        }


        if(UnusedCSS_Utils::is_cli()){
            return;
        }


        if ( defined( 'DOING_CRON' ) )
        {
            // Do something
            return;
        }

        $url = UnusedCSS_Utils::get_current_url();
        error_log($url);

       $this->get_unusedCSS();



        // $uucss_queue = new UnusedCSS_Queue();

        // $url = UnusedCSS_Utils::get_current_url();

        // error_log('Before Queue : ' . $url);

        // $$url = $url;
        // $uucss_queue->push_to_queue('cool yo' . $$url);
        // $uucss_queue->save()->dispatch();



    }



}