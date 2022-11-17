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
            'group' => 'css',
            'status' => 'on',
            'class' => UnusedCSS::class,
            'global' => 'uucss'
        ];

        $this->modules['critical-css'] = [
            'id' => 'critical-css',
            'title' => 'Critical CSS',
            'description' => 'Removing render blocking and increase your page scores, you can boost your site with this option',
            'group' => 'css',
            'status' => 'on',
            'class' => CriticalCSS::class,
            'global' => 'cpcss'
        ];

        $this->modules['javascript'] = [
            'id' => 'javascript',
            'title' => 'Javascript',
            'description' => 'Optimize Javascript',
            'group' => 'javascript',
            'status' => 'on',
            'class' => JavaScript::class,
            'global' => 'javascript'
        ];

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

        $options = RapidLoad_Base::fetch_options();

        $module = isset($_REQUEST['module']) ? $_REQUEST['module'] : false;
        $active = isset($_REQUEST['active']) ? $_REQUEST['active'] : 'off';

        if(!$module){
            wp_send_json_error('Rapidload module required');
        }

        switch ($module){
            case 'css' : {
                $options['uucss_enable_css'] = $active == "on" ? "1" : "";
                break;
            }
            case 'javascript' : {
                $options['uucss_enable_javascript'] = $active == "on" ? "1" : "";
                break;
            }
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', $options);

        wp_send_json_success(true);
    }

    public function active_modules(){

        $options = RapidLoad_Base::fetch_options();

        return [
            'css' => [
                'id' => 'css',
                'status' => isset($options['uucss_enable_css']) && $options['uucss_enable_css'] == "1" ? "on" : "off"
            ],
            'javascript' => [
                'id' => 'javascript',
                'status' => isset($options['uucss_enable_javascript']) && $options['uucss_enable_javascript'] == "1" ? "on" : "off"
            ],
        ];
    }

}