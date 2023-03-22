<?php


class RapidLoad_Module
{
    public $modules = [];
    public $modules_instances = [];

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

        $this->modules['minify-css'] = [
            'id' => 'minify-css',
            'title' => 'Minify CSS',
            'description' => 'Minify CSS',
            'group' => 'css',
            'status' => 'on',
            'class' => MinifyCSS::class,
            'global' => 'mincss'
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

        $this->modules['image-delivery'] = [
            'id' => 'image-delivery',
            'title' => 'Image Optimization',
            'description' => 'Image Optimization',
            'group' => 'image-optimization',
            'status' => 'on',
            'class' => RapidLoad_Image::class,
            'global' => 'image-optimization'
        ];

        $this->modules['cdn'] = [
            'id' => 'cdn',
            'title' => 'CDN',
            'description' => 'CDN',
            'group' => 'cdn',
            'status' => 'on',
            'class' => RapidLoad_CDN::class,
            'global' => 'cdn'
        ];

        $this->modules['font'] = [
            'id' => 'font',
            'title' => 'Font',
            'description' => 'Font',
            'group' => 'font',
            'status' => 'on',
            'class' => RapidLoad_Font::class,
            'global' => 'font'
        ];

    }

    function get_module_instance($id){
        return isset($this->modules_instances[$id]) ? $this->modules_instances[$id] : false;
    }

    function load_modules(){

        global $uucss;

        foreach ($this->modules as $module){

            $class_object = $module['class'];

            if(class_exists($class_object) && $module['status'] == 'on'){
                if($module['global'] == 'uucss'){
                    $uucss = new $class_object();
                    $this->modules_instances[$module['id']] = $uucss;
                }else{
                    $this->modules_instances[$module['id']] = new $class_object();
                }
            }

        }

        new RapidLoad_HTML_Minifier();

    }

    function is_active($module){

        return isset($this->modules) && isset($this->modules[$module]) &&
            isset($this->modules[$module]['status']) && $this->modules[$module]['status'] == "on";

    }

    function activate_module(){

        $options = RapidLoad_Base::fetch_options();

        $module = isset($_REQUEST['module']) ? $_REQUEST['module'] : false;
        $active = isset($_REQUEST['active']) ? $_REQUEST['active'] : 'off';
        $onboard = isset($_REQUEST['onboard']) ? $_REQUEST['onboard'] : false;

        if(!$module){
            wp_send_json_error('Rapidload module required');
        }

        switch ($module){
            case 'css' : {
                $options['uucss_enable_css'] = $active == "on" ? "1" : "";
                if($onboard){
                    $options['uucss_enable_uucss'] = "1";
                }
                break;
            }
            case 'javascript' : {
                $options['uucss_enable_javascript'] = $active == "on" ? "1" : "";
                break;
            }
            case 'image-delivery' : {
                $options['uucss_enable_image_delivery'] = $active == "on" ? "1" : "";
                $api = new RapidLoad_Api();
                if($options['uucss_enable_image_delivery'] == "1"){
                    $api->post('spai-associate-host',[
                        'url' => trailingslashit(site_url()),
                        'action' => 'add-domain'
                    ]);
                }else{
                    $api->post('spai-associate-host',[
                        'url' => trailingslashit(site_url()),
                        'action' => 'revoke-domain'
                    ]);
                }
                break;
            }
            case 'font' : {
                $options['uucss_enable_font_optimization'] = $active == "on" ? "1" : "";
                break;
            }
            case 'cdn' : {
                $options['uucss_enable_cdn'] = $active == "on" ? "1" : "";

                $api = new RapidLoad_Api();

                if($options['uucss_enable_cdn'] == "1" && !isset($options['uucss_cdn_url'])){
                    $response = $api->post('cdn',[
                        'url' => trailingslashit(site_url())
                    ]);
                    if(isset($response->zone_id) && isset($response->dns_id) && isset($response->cdn_url)){
                        $options['uucss_cdn_zone_id'] = $response->zone_id;
                        $options['uucss_cdn_dns_id'] = $response->dns_id;
                        $options['uucss_cdn_url'] = $response->cdn_url;
                    }else{
                        $options['uucss_enable_cdn'] = "";
                    }

                }else{

                    if(apply_filters('rapidload/cdn/clear-server-dns', false)){

                        if(isset($options['uucss_cdn_dns_id']) && !empty($options['uucss_cdn_dns_id']) && isset($options['uucss_cdn_zone_id']) && !empty($options['uucss_cdn_zone_id'])){
                            $api->post('delete-cdn',[
                                'dns_id' => $options['uucss_cdn_dns_id'],
                                'zone_id' => $options['uucss_cdn_zone_id']
                            ]);
                            unset($options['uucss_cdn_dns_id']);
                            unset($options['uucss_cdn_zone_id']);
                            unset($options['uucss_cdn_url']);
                        }

                    }

                }

                break;
            }
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', $options);

        wp_send_json_success($this->active_modules());
    }

    public function active_modules(){

        $options = RapidLoad_Base::fetch_options();

        return [
            'general' => [
                'id' => 'general',
                'options' => [
                    'uucss_excluded_links' => isset($options['uucss_excluded_links']) ? $options['uucss_excluded_links'] : null,
                    'rapidload_minify_html' => isset($options['rapidload_minify_html']) && $options['rapidload_minify_html'] == "1" ? true : false,
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
                    'uucss_minify' => isset($options['uucss_minify']) && $options['uucss_minify'] == "1" ? true : false,
                    'critical_css' => [
                        'status' => isset($options['uucss_enable_cpcss']) && $options['uucss_enable_cpcss'] == "1" ? "on" : "off",
                        'options' => [
                            'uucss_enable_cpcss_mobile' =>  isset($options['uucss_enable_cpcss_mobile']) && $options['uucss_enable_cpcss_mobile'] == "1" ? true : false,
                            'remove_cpcss_on_user_interaction' =>  isset($options['remove_cpcss_on_user_interaction']) && $options['remove_cpcss_on_user_interaction'] == "1" ? true : false,
                            'uucss_additional_css' => isset($options['uucss_additional_css']) ? $options['uucss_additional_css'] : null,
                        ]
                    ],
                    'unused_css' => [
                        'status' => isset($options['uucss_enable_uucss']) && $options['uucss_enable_uucss'] == "1" ? "on" : "off",
                        'options' => [
                            'uucss_variables' => isset($options['uucss_variables']) && $options['uucss_variables'] == "1" ? true : false,
                            'uucss_keyframes' => isset($options['uucss_keyframes']) && $options['uucss_keyframes'] == "1" ? true : false,
                            'uucss_fontface' => isset($options['uucss_fontface']) && $options['uucss_fontface'] == "1" ? true : false,
                            'uucss_include_inline_css' => isset($options['uucss_include_inline_css']) && $options['uucss_include_inline_css'] == "1" ? true : false,
                            'uucss_cache_busting_v2' => isset($options['uucss_cache_busting_v2']) && $options['uucss_cache_busting_v2'] == "1" ? true : false,
                            'uucss_excluded_files' => isset($options['uucss_excluded_files']) ? $options['uucss_excluded_files'] : null,
                            'uucss_safelist' => isset($options['uucss_safelist']) ? $options['uucss_safelist'] : null,
                            'uucss_blocklist' => isset($options['uucss_blocklist']) ? $options['uucss_blocklist'] : null,
                            'whitelist_packs' => isset($options['whitelist_packs']) ? $options['whitelist_packs'] : [],
                            'uucss_inline_css' => isset($options['uucss_inline_css']) && $options['uucss_inline_css'] == "1" ? true : false,
                        ]
                    ],
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
                    'preload_internal_links' => isset($options['preload_internal_links']) && $options['preload_internal_links'] == "1" ? true : false,
                    'delay_javascript' => isset($options['delay_javascript']) && $options['delay_javascript'] == "1" ? true : false,
                    'uucss_excluded_js_files' => isset($options['uucss_excluded_js_files']) ? $options['uucss_excluded_js_files'] : null,
                    'uucss_excluded_js_files_from_defer' => isset($options['uucss_excluded_js_files_from_defer']) ? $options['uucss_excluded_js_files_from_defer'] : null,
                    'uucss_load_scripts_on_user_interaction' => isset($options['uucss_load_scripts_on_user_interaction']) ? $options['uucss_load_scripts_on_user_interaction'] : null,
                ]
            ],
            'image-delivery' => [
                'id' => 'image-delivery',
                'status' => isset($options['uucss_enable_image_delivery']) && $options['uucss_enable_image_delivery'] == "1" ? "on" : "off",
                'options' => [
                    'uucss_image_optimize_level' => isset($options['uucss_image_optimize_level']) ? $options['uucss_image_optimize_level'] : null,
                    'uucss_exclude_above_the_fold_image_count' => isset($options['uucss_exclude_above_the_fold_image_count']) ? $options['uucss_exclude_above_the_fold_image_count'] : null,
                    'uucss_exclude_images' => isset($options['uucss_exclude_images']) ? $options['uucss_exclude_images'] : '',
                    'uucss_exclude_images_from_lazy_load' => isset($options['uucss_exclude_images_from_lazy_load']) ? $options['uucss_exclude_images_from_lazy_load'] : '',
                    'uucss_support_next_gen_formats' => isset($options['uucss_support_next_gen_formats']) && $options['uucss_support_next_gen_formats'] == "1" ? true : false,
                    'uucss_lazy_load_images' => isset($options['uucss_lazy_load_images']) && $options['uucss_lazy_load_images'] == "1" ? true : false,
                    'uucss_generate_blurry_place_holder' => isset($options['uucss_generate_blurry_place_holder']) && $options['uucss_generate_blurry_place_holder'] == "1" ? true : false,
                    'uucss_lazy_load_iframes' => isset($options['uucss_lazy_load_iframes']) && $options['uucss_lazy_load_iframes'] == "1" ? true : false,
                    'uucss_set_width_and_height' => isset($options['uucss_set_width_and_height']) && $options['uucss_set_width_and_height'] == "1" ? true : false,
                ]
            ],
            'cdn' => [
                'id' => 'cdn',
                'status' => isset($options['uucss_enable_cdn']) && $options['uucss_enable_cdn'] == "1" ? "on" : "off",
                'options' => [
                    'uucss_cdn_url' => isset($options['uucss_cdn_url']) ? $options['uucss_cdn_url'] : null,
                    'uucss_cdn_dns_id' => isset($options['uucss_cdn_dns_id']) ? $options['uucss_cdn_dns_id'] : null,
                    'uucss_cdn_zone_id' => isset($options['uucss_cdn_zone_id']) ? $options['uucss_cdn_zone_id'] : null,
                ]
            ],
            'font' => [
                'id' => 'font',
                'status' => isset($options['uucss_enable_font_optimization']) && $options['uucss_enable_font_optimization'] == "1" ? "on" : "off",
                'options' => [
                    'uucss_preload_font_urls' => isset($options['uucss_preload_font_urls']) ? $options['uucss_preload_font_urls'] : null,
                    'uucss_self_host_google_fonts' => isset($options['uucss_self_host_google_fonts']) && $options['uucss_self_host_google_fonts'] == "1" ? true : false,
                ]
            ],
        ];
    }

}