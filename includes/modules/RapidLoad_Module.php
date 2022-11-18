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
            'general' => [
                'id' => 'general',
                'options' => [
                    'uucss_excluded_links' => isset($options['uucss_excluded_links']) ? $options['uucss_excluded_links'] : null,
                    'uucss_query_string' => isset($options['uucss_query_string']) && $options['uucss_query_string'] == "1" ? true : false,
                    'uucss_enable_debug' => isset($options['uucss_enable_debug']) && $options['uucss_enable_debug'] == "1" ? true : false,
                    'uucss_jobs_per_queue' => isset($options['uucss_jobs_per_queue']) ? $options['uucss_jobs_per_queue'] : 1,
                    'uucss_queue_interval' => isset($options['uucss_queue_interval']) ? $options['uucss_queue_interval'] : 600,
                    'uucss_disable_add_to_queue' => isset($options['uucss_disable_add_to_queue']) && $options['uucss_disable_add_to_queue'] == "1" ? true : false,
                    'uucss_disable_add_to_re_queue' => isset($options['uucss_disable_add_to_re_queue']) && $options['uucss_disable_add_to_re_queue'] == "1" ? true : false,
                ]
            ],
            'css' => [
                'id' => 'css',
                'options' => [
                    'uucss_minify' => isset($options['defer_inline_js']) && $options['defer_inline_js'] == "1" ? true : false,
                    'critical_css' => [
                        'status' => isset($options['uucss_enable_cpcss']) && $options['uucss_enable_cpcss'] == "1" ? "on" : "off",
                        'options' => [
                            'uucss_enable_cpcss_mobile' =>  isset($options['uucss_enable_cpcss_mobile']) && $options['uucss_enable_cpcss_mobile'] == "1" ? true : false,
                            'uucss_additional_css' => isset($options['uucss_additional_css']) ? $options['uucss_additional_css'] : null,
                        ]
                    ],
                    'unused_css' => [
                        'status' => isset($options['uucss_enable_uucss']) && $options['uucss_enable_uucss'] == "1" ? "on" : "off",
                        'options' => [
                            'uucss_variables' => isset($options['uucss_load_original']) && $options['uucss_load_original'] == "1" ? true : false,
                            'uucss_keyframes' => isset($options['uucss_keyframes']) && $options['uucss_keyframes'] == "1" ? true : false,
                            'uucss_fontface' => isset($options['uucss_keyframes']) && $options['uucss_fontface'] == "1" ? true : false,
                            'uucss_include_inline_css' => isset($options['uucss_include_inline_css']) && $options['uucss_include_inline_css'] == "1" ? true : false,
                            'uucss_cache_busting_v2' => isset($options['uucss_include_inline_css']) && $options['uucss_cache_busting_v2'] == "1" ? true : false,
                            'uucss_excluded_files' => isset($options['uucss_excluded_files']) ? $options['uucss_excluded_files'] : null,
                            'uucss_safelist' => isset($options['uucss_safelist']) ? $options['uucss_safelist'] : null,
                            'uucss_blocklist' => isset($options['uucss_blocklist']) ? $options['uucss_blocklist'] : null,
                            'whitelist_packs' => isset($options['whitelist_packs']) ? $options['whitelist_packs'] : [],
                            'uucss_inline_css' => isset($options['uucss_inline_css']) && $options['uucss_inline_css'] == "1" ? true : false,
                        ]
                    ],
                    'uucss_load_original' =>  isset($options['uucss_load_original']) && $options['uucss_load_original'] == "1" ? true : false,
                    'uucss_enable_rules' => isset($options['uucss_enable_rules']) && $options['uucss_enable_rules'] == "1" ? true : false,
                ],
                'status' => isset($options['uucss_enable_css']) && $options['uucss_enable_css'] == "1" ? "on" : "off"
            ],
            'javascript' => [
                'id' => 'javascript',
                'status' => isset($options['uucss_enable_javascript']) && $options['uucss_enable_javascript'] == "1" ? "on" : "off",
                'options' => [
                    'uucss_load_js_method' => isset($options['uucss_load_js_method']) ? $options['uucss_load_js_method'] : 'none',
                    'defer_inline_js' => isset($options['defer_inline_js']) && $options['defer_inline_js'] == "1" ? true : false,
                    'minify_js' => isset($options['minify_js']) && $options['minify_js'] == "1" ? true : false,
                    'uucss_excluded_js_files' => isset($options['uucss_excluded_js_files']) ? $options['uucss_excluded_js_files'] : null,
                ]
            ],
        ];
    }

}