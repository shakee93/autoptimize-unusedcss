<?php


class RapidLoad_Admin
{
    public function __construct()
    {
        $this->hooks();
    }

    function hooks(){

        add_action( 'admin_menu', [ $this, 'rapidload_page' ] );

    }

    function rapidload_page(){

        add_menu_page(
            esc_html__( 'RapidLoad', 'rapidload' ),
            esc_html__( 'RapidLoad', 'rapidload' ),
            'manage_options',
            'rapidload',
            [ $this, 'render_dashboard' ],
            'dashicons-performance'
        );

        add_submenu_page(
            'rapidload',
            'Unused CSS',
            'Unused CSS',
            'manage_options',
            'uucss',
            [$this, 'render_dashboard'],
            1
        );
    }

    function render_dashboard(){
        echo 'done';
    }
}