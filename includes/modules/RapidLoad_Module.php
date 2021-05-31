<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Module{

    public $modules = [];

    public function __construct()
    {
        $this->init();
        $this->hooks();
        $this->load_modules();
    }

    function init(){

        $this->modules['unused-css'] = [
            'id' => 'unused-css',
            'title' => 'Unused CSS',
            'status' => 'off',
            'class' => 'UnusedCSS_Module',
            'global' => 'uucss'
        ];

        $stored_modules = get_option( 'rapidload_modules', [] );

        foreach ($stored_modules as $key => $value){
            $this->modules[$key]['status'] = $value;
        }

    }

    function hooks(){

        if(is_admin()){

            add_action( 'wp_ajax_rapidload_module_activation', [ $this, 'activate_module' ] );

        }

    }

    function load_modules(){

        foreach ($this->modules as $module){

            $class_object = $module['class'];

            if(class_exists($class_object) && $module['status'] == 'on'){
                rapidload()->get()->{$module['global']} = new $class_object();
            }

        }

    }

    function activate_module(){

        $module = isset($_REQUEST['module']) ? $_REQUEST['module'] : false;
        $active = isset($_REQUEST['activate']) ? $_REQUEST['activate'] : 'off';

        if(!$module){
            wp_send_json_error('Rapidload module required');
        }

        $stored = get_option( 'rapidload_modules', [] );

        $stored[$module] = $active;

        update_option( 'rapidload_modules', $stored );

        wp_send_json_success();
    }

}