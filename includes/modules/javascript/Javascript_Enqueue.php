<?php

use MatthiasMullie\Minify;
use Peast\Peast;
use Peast\Query;
use Peast\Traverser;
use Peast\Renderer;
use Peast\Formatter\PrettyPrint;
class Javascript_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $global_scripts;
    private $inject;
    private $options;
    private $strategy;
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
        add_filter( 'script_loader_tag', [$this, 'modify_script_tag'], 10, 3 );
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
            $this->default_js_exclusion_pattern .= str_replace( '#', '\#', $exclusion ) . '|';
        }

        $this->default_js_exclusion_pattern = rtrim( $this->default_js_exclusion_pattern, '|' );

    }

    public function update_content($state){

        global $wp_scripts;

        $this->global_scripts = $wp_scripts;

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

            if(isset($this->options['minify_js']) && $this->options['minify_js'] == "1"){
                $this->minify_js($link);
            }

            $this->optimize_js_delivery($link);

            if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){

                if(!apply_filters('rapidload/js/delay-excluded', false, $link, $this->job, $this->strategy, $this->options)){
                    $this->load_scripts_on_user_interaction($link);
                }

            }

            do_action('rapidload/enqueue/optimize-js', $link, $this->job, $this->strategy, $this->options);

        }

        if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1" || apply_filters('rapidload/delay-script/enable', false)){

            // Inject header delay script
            $title = $this->dom->find('title')[0];

            // get the file content from ./assets/js/inline-scripts/delay-script-header.min.js
            $content = "//!injected by RapidLoad \n!function(){var i=['DOMContentLoaded','readystatechanges','load'],o=[window,document],t=EventTarget.prototype.dispatchEvent,r=EventTarget.prototype.addEventListener,a=EventTarget.prototype.removeEventListener,s=[];EventTarget.prototype.addEventListener=function(t,e,...n){!t.includes(':norapidload')&&i.includes(t)&&o.includes(this)&&(this===document&&'loading'!==document.readyState||this===window&&'loading'!==document.readyState?setTimeout(()=>{e.call(this,new Event(t))},100):s.push({target:this,type:t,listener:e,options:n})),t.includes(':norapidload')&&(t=t.replace(':norapidload','')),r.call(this,t,e,...n)},EventTarget.prototype.removeEventListener=function(e,n,...t){i.includes(e)&&o.includes(this)&&(s=s.filter(t=>!(t.type===e&&t.listener===n&&t.target===this))),a.call(this,e,n,...t)},EventTarget.prototype.dispatchEvent=function(e){return i.includes(e.type)&&o.includes(this)&&(s=s.filter(t=>t.type!==e.type||t.target!==this||(t.target.removeEventListener(t.type,t.listener,...t.options),!1))),t.call(this,e)},i.forEach(function(e){o.forEach(function(t){t.addEventListener(e,function(){})})})}();";

//            $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-head.js';
//
//            if (file_exists($filePath)) {
//                $content = file_get_contents($filePath);
//            }

            $node_header = '<script type="text/javascript" >' . $content . '</script>';

            $title_content = $title->outertext;

            $title->__set('outertext', $title_content . $node_header);


            // Inject footer delay script
            $body = $this->dom->find('body', 0);

            // get the file content from ./assets/js/inline-scripts/delay-script-footer.min.js
            $content = "//!injected by RapidLoad \n!function(){d=Array.from(document.querySelectorAll('[data-rapidload-src]'));var d,n=function(e){const r=new Map(e.map(e=>[e.id,{...e,batch:null}]));return e.map(e=>function t(e,a=new Set){var d=r.get(e);if(null!==d.batch)return d.batch;if(a.has(e))throw new Error('RapidLoad: Circular dependency detected at script: '+e);a.add(e);let n=0;return d.dependencies.forEach(e=>{e=t(e,a),n=Math.max(n,e)}),d.batch=n+1,a.delete(e),d}(e.id))}(mappedScripts=d.map(function(e){var t=e.getAttribute('id'),a=e.getAttribute('data-js-deps');return{id:t,scriptElement:e,dependencies:function(e,a,t){var d=[],e=e?e.split(', '):[];d=e.map(function(t){var e=a.find(function(e){return e.id===t+'-js'||'jquery'===t&&'jquery-core-js'===e.id||t.startsWith('jquery-ui-')&&'jquery-ui-core-js'===e.id});return e?e.id:(console.warn('Dependency not found for:',t),null)}).filter(Boolean),'jquery-core-js'!==t&&t&&t.includes('jquery-')&&d.push('jquery-core-js');return d}(a,d,t),loaded:null,asyncLoaded:null,success:!1}}));function r(e='log',...t){window.location.search.includes('rapidload_debug_js_scripts')&&console[e](...t)}function a(t,a=!0){var e;(n=n.map(e=>e.id===t.id&&null===t.loaded?{...t,loaded:!0,success:a}:e)).filter(e=>e.batch===t.batch).length===n.filter(e=>e.batch===t.batch&&e.loaded).length&&(e=new CustomEvent('RapidLoad:DelayedScriptBatchLoaded',{detail:{batch:t.batch},bubbles:!0,cancelable:!0}),document.dispatchEvent(e),r('info','fired: RapidLoad:DelayedScriptBatchLoaded : '+t.batch),r('table',n.filter(e=>e.batch===t.batch))),n.filter(e=>e.loaded).length===n.length&&(e=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:!0,cancelable:!0}),document.dispatchEvent(e),r('info','fired: RapidLoad:DelayedScriptsLoaded'),r('table',n))}function c(e){var t=e.scriptElement;t.addEventListener('load',()=>a(e)),t.addEventListener('error',()=>a(e,!1)),t.setAttribute('src',t.getAttribute('data-rapidload-src')),t.removeAttribute('data-rapidload-src')}window.RAPIDLOAD_EXPERIMENT__DELAY_PREFETCH&&document.addEventListener('DOMContentLoaded:norapidload',()=>{n.forEach((e,t)=>{setTimeout(()=>{fetch(e.scriptElement.getAttribute('data-rapidload-src')).then(()=>{e.asyncLoaded=!0,e.success=!0,n[t]=e}).catch(()=>{e.asyncLoaded=!0,e.success=falsej,n[t]=e}).finally(()=>{onScriptAsyncLoad(e)})},10)})}),['mousemove','touchstart','keydown'].forEach(function(t){function a(){var e;removeEventListener(t,a),n.filter(e=>1===e.batch).forEach(function(e){c(e)}),document.addEventListener('RapidLoad:DelayedScriptBatchLoaded',e=>{var t=Number(e.detail.batch)+1;t>n.filter(e=>e.batch).length||n.filter(e=>e.batch===t).forEach(function(e){c(e)})}),0===n&&(e=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:!0,cancelable:!0}),document.dispatchEvent(e))}addEventListener(t,a)})}();";

//            $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-footer.js';
//
//            if (file_exists($filePath)) {
//                $content = file_get_contents($filePath);
//            }

            $node = $this->dom->createElement('script', "" . $content . "");

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

            if(isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction'])){
                if(!self::is_file_excluded($link->src) && self::is_load_on_user_interaction($link->src)){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;
                    unset($link->src);

                }
            }else{
                if(!self::is_file_excluded($link->src) && !self::is_file_excluded($link->src,'uucss_exclude_files_from_delay_js')){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;
                    unset($link->src);
                    unset($link->defer);

                }
            }


        }else if(self::is_inline_script($link)){
            if(isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction'])){
                if(!self::is_file_excluded($link->innertext()) && self::is_load_on_user_interaction($link->innertext())){

                    $link->__set('outertext',"<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");

                }else if(isset($link->{"data-rapidload-delayed"})) {

                    unset($link->{"data-rapidload-delayed"});
                    $link->__set('outertext', "<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");

                }
            }else{
                if(isset($link->{"data-rapidload-delayed"})) {

                    unset($link->{"data-rapidload-delayed"});
                    $link->__set('outertext', "<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");

                }
            }
        }

    }

    public function minify_js($link){

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

        $js_to_be_defer = isset($this->options['uucss_load_js_method']) &&
            ($this->options['uucss_load_js_method'] == "defer" || $this->options['uucss_load_js_method'] == "1");

        $js_to_be_delay = isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1";

        if(self::is_js($link)){

            if($js_to_be_defer){

                if(!self::is_file_excluded($link->src) && !self::is_file_excluded($link->src, 'uucss_excluded_js_files_from_defer')){

                    if(isset($link->defer) && isset($link->async)){
                        return;
                    }

                    if(preg_match( '#(' . $this->default_js_exclusion_pattern . ')#i', $link->src )){
                        return;
                    }

                    $link->defer = true;
                    unset($link->async);
                }

            }

        }elseif (self::is_inline_script($link)){

            if($js_to_be_delay || $js_to_be_defer){

                if(!self::is_file_excluded($link->innertext(), 'uucss_excluded_js_files_from_defer')){

                    $this->defer_inline_js($link);

                }

            }

        }

    }

    public function defer_inline_js($link){

        $inner_text = $link->innertext();

        if(!empty($inner_text)){

            if ( isset($link->type) && preg_match( '/(application\/ld\+json)/i', $link->type ) ) {
                return;
            }

            if ($link->norapidload) {
                return;
            }

            if(!empty($this->default_inline_js_exclusion_pattern) && preg_match( "/({$this->default_inline_js_exclusion_pattern})/msi", $inner_text )){
                return;
            }

            $manipulated_snippet = $this->analyzeJavaScriptCode($inner_text);

            if (!$manipulated_snippet) {
                return;
            }

            $link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="text/javascript">' . $manipulated_snippet . '</script>');
        }


    }

    public static function is_js( $el ) {
        if (preg_match("#" . preg_quote("googletagmanager.com/gtag/js", "#") . "#", $el->src)) {
            return true;
        }
        return !empty($el->src) && strpos($el->src,".js");
    }

    public static function is_inline_script( $el ) {
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
            //"DOMContentLoaded",
            "document.write",
            /*"window.lazyLoadOptions",
            "N.N2_",
            "rev_slider_wrapper",
            "FB3D_CLIENT_LOCALE",
            "ewww_webp_supported",
            "anr_captcha_field_div",
            "renderInvisibleReCaptcha",
            "bookingInProgress",
            "do_not_load_original_css"*/
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
            "player.vdocipher.com",
            "\/assets\/js\/preloaded-elements-handlers(.min)?.js" // popup not working
        ];

        return apply_filters('rapidload/defer/exclusions/js', $list);
    }


    public function analyzeJavaScriptCode($jsSnippet)
    {
        try {
            // Determine the global event based on the 'delay_javascript' option
            $eventToBind = isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"
                ? 'RapidLoad:DelayedScriptsLoaded'
                : 'DOMContentLoaded';

            // Skip processing for specific cases
            if (preg_match('/window\._wpemojiSettings|data-rapidload-delayed/', $jsSnippet)) {
                return false;
            }

            // Parse the JavaScript snippet into an AST (Abstract Syntax Tree)
            $parsedAst = Peast::latest($jsSnippet)->parse();

            // Configure the AST traverser
            $astTraverser = new Traverser([
                'passParentNode' => true,
                'skipStartingNode' => true,
            ]);

            // Define a renderer for pretty printing the AST
            $astRenderer = new Renderer();
            $astRenderer->setFormatter(new PrettyPrint());
            $rootStatements = [];

            // Traverse and modify the AST
            $updatedSnippet = $astTraverser->addFunction(function ($currentNode) use ($eventToBind, $astRenderer, &$rootStatements) {

                $type = $currentNode->getType();

                if ($type !== 'EmptyStatement') {
                    $rootStatements[] = (object) [
                        'type' => $type
                    ];
                }

                if ($type === 'FunctionDeclaration') {
                    $updatedNode = $this->assignWindow($currentNode);
                    return array($updatedNode, Traverser::DONT_TRAVERSE_CHILD_NODES);
                }

                if ($type === 'VariableDeclaration') {
                    $updatedNode = $this->assignWindow($currentNode);
                    return array($updatedNode, Traverser::DONT_TRAVERSE_CHILD_NODES);
                }

                return Traverser::DONT_TRAVERSE_CHILD_NODES;

            })->traverse($parsedAst)->render(new PrettyPrint());

            if (count(array_filter($rootStatements, function ($statement) {
                    return $statement->type == 'VariableDeclaration';
                })) === count($rootStatements)) {
                return $updatedSnippet;
            }

            // Return the original JavaScript snippet
            return $this->wrapWithJavaScriptEvent($eventToBind, $updatedSnippet);
        } catch (Exception $exception) {
            // Log any exceptions that occur
            error_log('RapidLoad:Error in JS Optimization: ' . $exception->getMessage());
            return $this->wrapWithJavaScriptEvent($eventToBind, $jsSnippet);

        }
    }

    public function wrapWithJavaScriptEvent($event, $codeSnippet)
    {
        // Wrap the given code snippet in a JavaScript event listener
        return "document.addEventListener('$event', function(){ " . $codeSnippet . "});";
    }

    public function assignWindow($node)
    {
        $id = null;
        $type = $node->getType();
        $defineWindow = '';


        if ($type === 'FunctionDeclaration') {
            $id = $node->getId()->getRawName();
            $defineWindow = $id ? "window." . $id . "=" : "";
        }

        if ($type === 'VariableDeclaration' && count($node->getDeclarations()) === 1) {
            $id = $node->getDeclarations()[0]->getId()->getRawName();
            $node->getDeclarations()[0]->getId()->setRawName('window.' . $id);
            $node->setKind('');
        }

        if (!$id) {
            return $node;
        }

        $renderedFunction = $node->render(new PrettyPrint());

        $updatedAst = Peast::latest( $defineWindow . $renderedFunction)->parse();
        return $updatedAst->getBody()[0] ? $updatedAst->getBody()[0] : null;
    }

    function modify_script_tag( $tag, $handle, $src ) {

        if(is_admin()) {
            return $tag;
        }

        global $wp_scripts;

        if (isset($wp_scripts->registered[$handle])) {
            $script = $wp_scripts->registered[$handle];
            $dependencies = $script->deps; // Array of script dependencies

            $dependencies = apply_filters('rapidload/js/script-dependencies', $dependencies, $handle);

            if (!empty($dependencies)) {
                // Convert dependencies array to a comma-separated string
                $deps_string = implode(', ', $dependencies);

                // Insert the data-js-deps attribute into the script tag
                $tag = preg_replace('/<script(.*?)>/', '<script$1 data-js-deps="' . esc_attr($deps_string) . '">', $tag);
            }
        }

        return $tag;
    }
}