<?php

use MatthiasMullie\Minify;
use Peast\Peast;
use Peast\Query;
use Peast\Traverser;
use Peast\Renderer;
use Peast\Formatter\PrettyPrint;
use Peast\Formatter\Compact;

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

            $original_src = self::is_js($link) ? $link->src : null;

            if(isset($this->options['minify_js']) && $this->options['minify_js'] == "1"){
                $this->minify_js($link);
            }

            $this->optimize_js_delivery($link);

            if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){

                if(!apply_filters('rapidload/js/delay-excluded', false, $link, $this->job, $this->strategy, $this->options)){
                    $this->load_scripts_on_user_interaction($link, $original_src);
                }

            }

            do_action('rapidload/enqueue/optimize-js', $link, $this->job, $this->strategy, $this->options);

        }

        if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1" || apply_filters('rapidload/delay-script/enable', false)){

            // Inject header delay script
            $title = $this->dom->find('title')[0];

            // get the file content from ./assets/js/inline-scripts/delay-script-header.min.js
            $content = "//!injected by RapidLoad \n
!function(){var d=['DOMContentLoaded','readystatechanges','load'],a=[window,document],t=EventTarget.prototype.dispatchEvent,s=EventTarget.prototype.addEventListener,i=EventTarget.prototype.removeEventListener,r=[],c=[];window.RaipdLoadJSDebug={capturedEvents:r,dispatchedEvents:c},EventTarget.prototype.addEventListener=function(e,t,...n){var i=!e.includes('RapidLoad:')&&!!c.find(t=>t.type===e)&&a.includes(this),o=!e.includes('RapidLoad:')&&!e.includes(':norapidload')&&d.includes(e)&&a.includes(this)&&'function'==typeof t;(o||o!==i&&i)&&(this===document&&'loading'!==document.readyState||this===window&&'loading'!==document.readyState?setTimeout(()=>{t.call(this,new Event(e))},10):r.push({target:this,type:e,listener:t,options:n})),e.includes(':norapidload')&&(e=e.replace(':norapidload','')),s.call(this,e,t,...n)},EventTarget.prototype.removeEventListener=function(e,n,...t){d.includes(e)&&a.includes(this)&&(r=r.filter(t=>!(t.type===e&&t.listener===n&&t.target===this))),i.call(this,e,n,...t)},EventTarget.prototype.dispatchEvent=function(e){return c.push(e),d.includes(e.type)&&a.includes(this)&&(r=r.filter(t=>t.type!==e.type||t.target!==this||(t.target.removeEventListener(t.type,t.listener,...t.options),!1))),t.call(this,e)},d.forEach(function(e){a.forEach(function(t){t.addEventListener(e,function(){})})})}();";

            if (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG === true || defined('RAPIDLOAD_DEV_MODE') && RAPIDLOAD_DEV_MODE === true) {
                $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-head.js';

                if (file_exists($filePath)) {
                    $content = file_get_contents($filePath);
                }
            }

            $node_header = '<script type="text/javascript" >' . $content . '</script>';

            $title_content = $title->outertext;

            $title->__set('outertext', $title_content . $node_header);


            // Inject footer delay script
            $body = $this->dom->find('body', 0);

            // get the file content from ./assets/js/inline-scripts/delay-script-footer.min.js
            $content = "//!injected by RapidLoad \n
!function(){var o=Array.from(document.querySelectorAll('[data-rapidload-src]')).map(function(e,t){var a=e.getAttribute('id'),o=e.getAttribute('data-rapidload-src');return{id:a||t,scriptElement:e,loaded:null,success:!1,src:o}});const t=['click','mousemove','touchstart','keydown'];let a=!1;function r(e='log',...t){window.location.search.includes('rapidload_debug_js')&&console[e](...t)}function n(t,a=!0){var e;(o=o.map(e=>e.id===t.id&&null===t.loaded?{...t,loaded:!0,success:a}:e)).filter(e=>e.loaded).length===o.length&&(window.rapidloadScripts=o,e=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:!0,cancelable:!0}),document.dispatchEvent(e),r('table',o),r('info','fired: RapidLoad:DelayedScriptsLoaded'))}async function d(){{var e;const t=[];o.forEach(a=>{const o=document.createElement('link');o.rel='preload',o.as='script',o.fetchpriority='high',o.href=a.src;let e=null;try{e=new Promise((t,e)=>{o.onload=()=>{o.parentNode.removeChild(o),t(a)},o.onerror=e=>{o.parentNode.removeChild(o),t(a)}})}catch(e){console.log(e)}e&&t.push(e),document.head.appendChild(o)}),await Promise.all(t)}await 0;for(const a of o)!function(o){new Promise((e,t)=>{var a=o.scriptElement;a.addEventListener('load',()=>n(o)),a.addEventListener('error',()=>n(o,!1)),setTimeout(()=>{o.src&&(a.setAttribute('src',o.src),a.removeAttribute('data-rapidload-src')),e()},0)})}(a)}r('info','totalScripts'),r('table',o);var c=async function(){var e;a||(a=!0,t.forEach(function(e){removeEventListener(e,c)}),await d(),0===o&&(e=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:!0,cancelable:!0}),document.dispatchEvent(e)))};t.forEach(function(e){addEventListener(e,c)})}();";

            if (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG === true || defined('RAPIDLOAD_DEV_MODE') && RAPIDLOAD_DEV_MODE === true) {
                $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-footer.js';

                if (file_exists($filePath)) {
                    $content = file_get_contents($filePath);
                }
            }

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

    public function load_scripts_on_user_interaction($link, $original_src = null){

        if(self::is_js($link)){

            if(isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction'])){
                if(!self::is_file_excluded($link->src) && self::is_load_on_user_interaction($link->src)){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;
                    unset($link->src);

                }
                if(!self::is_file_excluded($original_src) && self::is_load_on_user_interaction($original_src)){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;
                    unset($link->src);

                }
            }else{

                if($this->str_contains($link->src,"rapidload.frontend.min.js") || ($original_src && $this->str_contains($original_src,"rapidload.frontend.min.js"))){
                    return;
                }

                if( !self::is_file_excluded($link->src) && !self::is_file_excluded($link->src,'uucss_exclude_files_from_delay_js') ||
                    $original_src && !self::is_file_excluded($original_src) && !self::is_file_excluded($original_src,'uucss_exclude_files_from_delay_js')
                ){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;

                    $head = $this->dom->find('head', 0);
                    $node = $this->dom->createElement('link');
                    $node->setAttribute('rel', 'preload');
                    $node->setAttribute('href', $link->src);
                    $node->setAttribute('as', 'script');
                    $head->appendChild($node);

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

        if(defined('SCRIPT_DEBUG') && boolval(SCRIPT_DEBUG) == true){
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

            if(($js_to_be_delay || $js_to_be_defer) && (!self::is_file_excluded($link->innertext(), 'uucss_exclude_files_from_delay_js') && !self::is_file_excluded($link->innertext(), 'uucss_excluded_js_files_from_defer'))){

                $this->defer_inline_js($link);

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

            $manipulated_snippet = $this->analyzeJavaScriptCode($inner_text, $link);

            if (!$manipulated_snippet) {
                return;
            }

            $link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="text/javascript">' . $manipulated_snippet . '</script>');
        }


    }

    public static function is_js( $el ) {
        if (isset($el->src) && preg_match("#" . preg_quote("googletagmanager.com/gtag/js", "#") . "#", $el->src)) {
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


    public function analyzeJavaScriptCode($jsSnippet, $script)
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

                $rootStatements[] = (object) [
                    'type' => $type,
                    'node' => $currentNode,
                ];

                return Traverser::DONT_TRAVERSE_CHILD_NODES;

            })->traverse($parsedAst)->render(new PrettyPrint());

            if (count(array_filter($rootStatements, function ($statement) {
                    return $statement->type == 'VariableDeclaration';
                })) === count($rootStatements)) {
                return $updatedSnippet;
            }

            $snippets = '';

            // To be checked

            $should_not_wrap = false;

            /*if (count(array_filter($rootStatements, function ($statement) {
                    return $statement->type == 'ExpressionStatement';
                })) === count($rootStatements)) {

                foreach ($rootStatements as $rootStatement){

                    $inner_content = $rootStatement->node->render(new Compact()) . ";";

                    $pattern = "/document\.addEventListener\((?:'|\")DOMContentLoaded(?:'|\")|window\.addEventListener/";

                    if(preg_match($pattern, $inner_content)){
                        $should_not_wrap = true;
                        break;
                    }

                }

                if($should_not_wrap){
                    return $updatedSnippet;
                }
            }*/

            if (count(array_filter($rootStatements, function ($statement) {
                    return $statement->type == 'ExpressionStatement';
                })) === count($rootStatements)) {

                foreach ($rootStatements as $rootStatement){

                    $inner_content = $rootStatement->node->render(new Compact()) . ";";

                    $pattern = "/document\.addEventListener\((?:'|\")DOMContentLoaded(?:'|\")|window\.addEventListener/";

                    if(preg_match($pattern, $inner_content)){

                        $snippets .= $inner_content . "\n";

                    }else{

                        $snippets .= $this->wrapWithJavaScriptEvent($eventToBind, $inner_content) . "\n";

                    }

                }

                return $snippets;
            }


            foreach ($rootStatements as $rootStatement){
                if($rootStatement->type == "FunctionDeclaration" || $rootStatement->type == "VariableDeclaration"){
                    $statements = $this->assignWindow($rootStatement->node);
                    foreach ($statements as $statement){
                        $snippets .= $statement . "\n";
                    }
                }elseif($rootStatement->type == "ExpressionStatement") {
                    $snippets .= $rootStatement->node->render(new Compact()) . ";";
                }else{
                    $snippets .= $rootStatement->node->render(new Compact()) . "\n";
                }
            }

            $snippets = apply_filters('uucss/enqueue/before/wrap-inline-js', $snippets);
            // Return the original JavaScript snippet
            return $this->wrapWithJavaScriptEvent($eventToBind, $snippets);
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
        $additionalSnippets = [];

        if ($type === 'FunctionDeclaration') {
            $id = $node->getId()->getRawName();
            $defineWindow = $id ? "window." . $id . "=" : "";
        }

        if ($type === 'VariableDeclaration' && count($node->getDeclarations()) === 1) {
            $id = $node->getDeclarations()[0]->getId()->getRawName();
            $additionalSnippets[] = "window." . $id . " = " . $id . ";";
        }

        if ($type === 'VariableDeclaration' && count($node->getDeclarations()) > 1) {

            foreach($node->getDeclarations() as $declaration){
                $id = $declaration->getId()->getRawName();
                $additionalSnippets[] = "window." . $id . " = " . $id . ";";
            }

        }


        if (!$id) {
            return [$node->render(new Compact())];
        }

        $renderedFunction = $node->render(new Compact());

        $updatedAst = Peast::latest( $defineWindow . $renderedFunction)->parse();
        //return $updatedAst->getBody()[0] ? $updatedAst->getBody()[0] : null;
        return array_merge([$updatedAst->render(new Compact())], $additionalSnippets);
    }


}