<?php


class RapidLoad_Module
{
    public $modules = [];

    public function __construct()
    {
        $this->init();
        $this->load_modules();
    }

    function init(){

        $this->modules['unused-css'] = [
            'id' => 'unused-css',
            'title' => 'Unused CSS',
            'description' => 'Removing unused css and increase your page scores, you can boost your site with this option',
            'status' => 'off',
            'class' => UnusedCSS::class,
            'global' => 'uucss'
        ];

        $this->modules['critical-css'] = [
            'id' => 'critical-css',
            'title' => 'Critical CSS',
            'description' => 'Removing render blocking and increase your page scores, you can boost your site with this option',
            'status' => 'off',
            'class' => CriticalCSS::class,
            'global' => 'cpcss'
        ];

        $this->modules['javascript'] = [
            'id' => 'javascript',
            'title' => 'Javascript',
            'description' => 'Optimize Javascript',
            'status' => 'off',
            'class' => JavaScript::class,
            'global' => 'javascript'
        ];

        $stored_modules = [];
        $stored_modules = get_option( 'rapidload_modules', $stored_modules );

        foreach ($stored_modules as $key => $value){
            $this->modules[$key]['status'] = $value;
        }
    }

    function load_modules(){

        global $uucss;

        foreach ($this->modules as $module){

            $class_object = $module['class'];

            if(class_exists($class_object) && $module['status'] == 'on'){
                if($module['global'] == 'uucss'){
                    $uucss = new $class_object();
                }else{
                    new $class_object();
                }
            }

        }

    }

    function is_active($module){

        return isset($this->modules) && isset($this->modules[$module]) &&
            isset($this->modules[$module]['status']) && $this->modules[$module]['status'] == "on";

    }

    function activate_module(){

        $module = isset($_REQUEST['module']) ? $_REQUEST['module'] : false;
        $active = isset($_REQUEST['active']) ? $_REQUEST['active'] : 'off';

        if(!$module){
            wp_send_json_error('Rapidload module required');
        }

        $stored = get_option( 'rapidload_modules', [] );

        $stored[$module] = $active;

        update_option( 'rapidload_modules', $stored );

        wp_send_json_success();
    }

    public function active_modules(){
        return array_filter($this->modules, function ($value){
            return isset($value['status']) && $value['status'] == "on";
        });
    }

}