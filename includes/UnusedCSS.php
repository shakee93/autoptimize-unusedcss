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


        });

        add_action('autoptimize_setup_done', function () {

            if (!$this->is_enabled()) {
                return;
            }

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

    public function get_unusedCSS()
    {
        $url = UnusedCSS_Utils::get_current_url();

        //error_log($url);
        return (new UnusedCSS_Api())->get($url);
    }

}