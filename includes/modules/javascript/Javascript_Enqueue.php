<?php

use MatthiasMullie\Minify;

class Javascript_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;
    private $settings;
    private $default_inline_js_exclusion_pattern;
    private $default_js_exclusion_pattern;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();
        $this->init();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 60);
    }

    public function init(){

        $this->default_inline_js_exclusion_pattern = "";
        $this->default_js_exclusion_pattern = "";
        $default_inline_js_exclusion_list = $this->get_default_inline_js_exclusions();
        $default_js_exclusion_list = $this->get_default_js_exclusions();

        foreach ($default_inline_js_exclusion_list as $exclusion){
            $this->default_inline_js_exclusion_pattern .= preg_quote( (string) $exclusion, '#' ) . '|';
        }

        $this->default_inline_js_exclusion_pattern = rtrim( $this->default_inline_js_exclusion_pattern, '|' );

        foreach ($default_js_exclusion_list as $exclusion){
            $this->default_js_exclusion_pattern .= preg_quote( (string) $exclusion, '#' ) . '|';
        }

        $this->default_js_exclusion_pattern = rtrim( $this->default_js_exclusion_pattern, '|' );

    }

    public function update_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        if(isset($state['strategy'])){
            $this->strategy = $state['strategy'];
        }

        $links = $this->dom->find( 'script' );

        foreach ( $links as $link ) {

            $this->minify_js($link);

            $this->optimize_js_delivery($link);

            if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){
                $this->load_scripts_on_user_interaction($link);
            }

            do_action('rapidload/enqueue/optimize-js', $link, $this->job, $this->strategy);

        }

        /*if(isset($this->options['defer_inline_js']) && $this->options['defer_inline_js'] == "1"){
            $body = $this->dom->find('body', 0);
            $node = $this->dom->createElement('script', "document.addEventListener('DOMContentLoaded',function(event){
                ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
                    var listener = function () {
                        const scriptElements = document.getElementsByTagName('script');
                        for (let i = 0; i < scriptElements.length; i++) {
                          const script = scriptElements[i];
                            if (script.type === 'rapidload/lazyscript') {
                            const newScript = document.createElement('script');
                            newScript.type = 'text/javascript';
                            if (script.id) {
                              newScript.src = script.id;
                            }
                            if (script.src) {
                              newScript.src = script.src;
                            } else {
                              const inlineScript = document.createTextNode(script.textContent || script.innerText);
                              newScript.appendChild(inlineScript);
                            }
                            script.parentNode.replaceChild(newScript, script);
                          }
                        }
                    };
                    addEventListener(event, listener);
                });
            });");

            $node->setAttribute('type', 'text/javascript');
            $body->appendChild($node);
        }*/

        if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){
            $body = $this->dom->find('body', 0);
            $node = $this->dom->createElement('script', "document.addEventListener('DOMContentLoaded',function(event){
                ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
                    var listener = function () {
                        removeEventListener(event, listener);
                        document.querySelectorAll('[data-rapidload-src]').forEach(function(el){ el.setAttribute('src', el.getAttribute('data-rapidload-src')) });
                        Array.from(document.getElementsByTagName('noscript')).forEach(function(e){
                            var tag = e.getAttribute('data-rapidload-delayed');
                            if(tag !== null && tag !== undefined) {
                                var newScript = document.createElement('script');
                                var inlineScript = document.createTextNode(e.innerHTML);
                                newScript.appendChild(inlineScript);
                                e.parentNode.insertBefore(newScript, e);
                            }}
                        );
                    };
                    addEventListener(event, listener);
                });
            });");

            $node->setAttribute('type', 'text/javascript');
            $body->appendChild($node);
        }

        if(isset($this->options['preload_internal_links']) && $this->options['preload_internal_links'] == "1"){
            $body = $this->dom->find('body', 0);
            $node = $this->dom->createElement('script', "(function(){const link=document.createElement('link'),connection=navigator?.connection?.saveData||'2g'==navigator?.connection?.effectiveType,support_prefetch=link?.relList?.supports('prefetch');if(connection||!support_prefetch){return}const loaded_links=new Set;const load_link=link=>{if(!loaded_links.has(link)&&!link.includes('?')&&link.startsWith(window.location.origin)&&window.location.href!=link){const new_link=document.createElement('link');new_link.rel='prefetch';new_link.href=link;document.head.appendChild(new_link);loaded_links.add(link)}};let timeout;const preload_link=event=>{const anchor=event.target.closest('a');anchor&&anchor.href&&clearTimeout(timeout)},params={capture:!0,passive:!0};document.addEventListener('mouseover',event=>{const anchor=event.target.closest('a');anchor&&anchor.href&&(timeout=setTimeout(()=>load_link(anchor.href),50))},params);document.addEventListener('touchstart',event=>{const anchor=event.target.closest('a');anchor&&anchor.href&&load_link(anchor.href)},params);document.addEventListener('mouseout',preload_link,params)})();");
            $node->id = "rapidload-preload-links";
            $node->setAttribute('type', 'text/javascript');
            $body->appendChild($node);
        }

        return [
            'dom' => $this->dom,
            'inject' => $this->inject,
            'options' => $this->options,
            'strategy' => $this->strategy
        ];
    }

    public function load_scripts_on_user_interaction($link){

        if(self::is_js($link)){

            if(!self::is_file_excluded($link->src) && self::is_load_on_user_interaction($link->src)){

                $data_attr = "data-rapidload-src";
                $link->{$data_attr} = $link->src;
                unset($link->src);

            }

        }else if(self::is_inline_script($link)){

            if(!self::is_file_excluded($link->innertext()) && self::is_load_on_user_interaction($link->innertext())){

                $link->__set('outertext',"<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");

            }else if(isset($link->{"data-rapidload-delayed"})) {

                unset($link->{"data-rapidload-delayed"});
                $link->__set('outertext', "<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");

            }

        }

    }

    public function minify_js($link){

        if(!isset($this->options['minify_js'])){
            return;
        }

        if(!self::is_js($link) || self::is_file_excluded($link->src)){
            return;
        }

        $file_path = self::get_file_path_from_url(apply_filters('uucss/enqueue/js-url', $link->src));

        if(!file_exists($file_path)){
            return;
        }

        $version = "";

        if(is_file($file_path)){
            $version = substr(hash_file('md5', $file_path), 0, 12);
        }

        if(!$file_path){
            return;
        }

        $filename = basename(preg_replace('/\?.*/', '', apply_filters('uucss/enqueue/js-url', $link->src)));

        if(!$filename){
            return;
        }

        if(preg_match('/\.min\.js/', $filename)){
            return;
        }

        if($this->str_contains($filename, ".min.js")){
            $filename = str_replace(".min.js","-{$version}.min.js", $filename);
        }else if($this->str_contains($filename, ".js" )){
            $filename = str_replace(".js","-{$version}.min.js", $filename);
        }

        $minified_file = JavaScript::$base_dir . '/' . $filename;
        $minified_url = apply_filters('uucss/enqueue/js-minified-url', $filename);

        $file_exist = $this->file_system->exists($minified_file);

        if(!$file_exist){

            $minifier = new \MatthiasMullie\Minify\JS($file_path);
            $minifier->minify($minified_file);

        }

        $link->setAttribute('src', $minified_url);

    }

    public function optimize_js_delivery($link){

        if(!isset($link->type)){
            $link->type = 'text/javascript';
        }

        if(apply_filters('rapidload/webfont/handle', false, $link)){
            return;
        }

        if(isset($this->options['uucss_load_js_method']) && ($this->options['uucss_load_js_method'] == "defer" || $this->options['uucss_load_js_method'] == "1")){

            if(self::is_js($link)){

                if(!self::is_file_excluded($link->src) && !self::is_file_excluded($link->src, 'uucss_excluded_js_files_from_defer') && !preg_match( "/({$this->default_js_exclusion_pattern})/msi", $link->src )){

                    $link->defer = true;
                    unset($link->async);

                }

            }else if(isset($this->options['defer_inline_js']) && $this->options['defer_inline_js'] == "1" && self::is_inline_script($link)){

                if(!self::is_file_excluded($link->innertext(), 'uucss_excluded_js_files_from_defer')){

                    $this->defer_inline_js($link);

                }

            }

        }
    }

    public function defer_inline_js($link){
        $inner_text = $link->innertext();
        if(!empty($inner_text)){

            $jquery_patterns = apply_filters( 'rapidload/patterns/jquery', 'jQuery|\$\.\(|\$\(' );

            if ( isset($link->type) && preg_match( '/(application\/ld\+json)/i', $link->type ) ) {
                return;
            }

            if ( ! empty( $jquery_patterns ) && ! preg_match( "/({$jquery_patterns})/msi", $inner_text ) ) {
                return;
            }

            if(!empty($this->default_inline_js_exclusion_pattern) && preg_match( "/({$this->default_inline_js_exclusion_pattern})/msi", $inner_text )){
                return;
            }

            //$link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="' . ( isset($link->type) && $link->type == "text/javascript" && !isset($link->{'data-no-lazy'}) ? "rapidload/lazyscript" : 'text/javascript' ) .'" src="data:text/javascript;base64,' . base64_encode($inner_text) . '" defer></script>');
            //$link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="text/javascript" src="data:text/javascript;base64,' . base64_encode($inner_text) . '" defer></script>');
            $link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="text/javascript"> window.addEventListener("DOMContentLoaded", function() { ' . $inner_text . ' }); </script>');
        }


    }

    private static function is_js( $el ) {
        return !empty($el->src) && strpos($el->src,".js");
    }

    private static function is_inline_script( $el ) {
        return !empty($el->type) && $el->type == "text/javascript" && !isset($el->src);
    }

    private function is_file_excluded($file, $option_name = 'uucss_excluded_js_files'){

        $exclude_files = isset($this->options[$option_name]) && !empty($this->options[$option_name]) ? explode("\n", $this->options[$option_name]) : [];

        $excluded = false;

        foreach ($exclude_files as $exclude_file){

            $exclude_file = str_replace("\r", "", $exclude_file);

            if(self::is_regex_expression($exclude_file)){

                $excluded = preg_match($exclude_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $exclude_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }

    private function is_load_on_user_interaction($file){

        $files = isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction']) ? explode("\n", $this->options['uucss_load_scripts_on_user_interaction']) : [];

        $excluded = false;

        foreach ($files as $_file){

            $_file = str_replace("\r", "", $_file);

            if(self::is_regex_expression($_file)){

                $excluded = preg_match($_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }

    public function get_default_inline_js_exclusions(){
        $list = [
            "DOMContentLoaded",
            "document.write",
            "window.lazyLoadOptions",
            "N.N2_",
            "rev_slider_wrapper",
            "FB3D_CLIENT_LOCALE",
            "ewww_webp_supported",
            "anr_captcha_field_div",
            "renderInvisibleReCaptcha",
            "bookingInProgress"
        ];
        return apply_filters('rapidload/defer/exclusions/inline_js', $list);
    }

    public function get_default_js_exclusions(){
        $list = [
            "gist.github.com",
            "content.jwplatform.com",
            "js.hsforms.net",
            "www.uplaunch.com",
            "google.com\/recaptcha",
            "widget.reviews.co.uk",
            "verify.authorize.net\/anetseal",
            "lib\/admin\/assets\/lib\/webfont\/webfont.min.js",
            "app.mailerlite.com",
            "widget.reviews.io",
            "simplybook.(.*)\/v2\/widget\/widget.js",
            "\/wp-includes\/js\/dist\/i18n.min.js",
            "\/wp-content\/plugins\/wpfront-notification-bar\/js\/wpfront-notification-bar(.*).js",
            "\/wp-content\/plugins\/oxygen\/component-framework\/vendor\/aos\/aos.js",
            "\/wp-content\/plugins\/ewww-image-optimizer\/includes\/check-webp(.min)?.js",
            "static.mailerlite.com\/data\/(.*).js",
            "cdn.voxpow.com\/static\/libs\/v1\/(.*).js",
            "cdn.voxpow.com\/media\/trackers\/js\/(.*).js",
            "use.typekit.net",
            "www.idxhome.com",
            "\/wp-includes\/js\/dist\/vendor\/lodash(.min)?.js",
            "\/wp-includes\/js\/dist\/api-fetch(.min)?.js",
            "\/wp-includes\/js\/dist\/i18n(.min)?.js",
            "\/wp-includes\/js\/dist\/vendor\/wp-polyfill(.min)?.js",
            "\/wp-includes\/js\/dist\/url(.min)?.js",
            "\/wp-includes\/js\/dist\/hooks(.min)?.js",
            "www.paypal.com\/sdk\/js",
            "js-eu1.hsforms.net",
            "yanovis.Voucher.js",
            "\/carousel-upsells-and-related-product-for-woocommerce\/assets\/js\/glide.min.js",
            "use.typekit.com",
            "\/artale\/modules\/kirki\/assets\/webfont.js",
            "\/api\/scripts\/lb_cs.js",
            "js.hscta.net\/cta\/current.js",
            "widget.refari.co",
            "player.vdocipher.com"
        ];

        return apply_filters('rapidload/defer/exclusions/js', $list);
    }
}