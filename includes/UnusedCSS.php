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

    }

    public function show_notice()
    {

        add_action('admin_notices', function () {

            echo '<div class="notice notice-error is-dismissible">
                    <p>Autoptimize UnusedCSS Plugin only works when autoptimize is installed and activated</p>
                 </div>';

        });

    }

}