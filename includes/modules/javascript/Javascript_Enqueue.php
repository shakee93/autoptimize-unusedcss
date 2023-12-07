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
            $content = "
           //!injected by RapidLoad \n
!(function(){var supportedEvents=['DOMContentLoaded','readystatechanges','load'];var supportedTargets=[window,document];var originalDispatchEvent=EventTarget.prototype.dispatchEvent;var originalAddEventListener=EventTarget.prototype.addEventListener;var originalRemoveEventListener=EventTarget.prototype.removeEventListener;var capturedEvents=[];var dispatchedEvents=[];window.RaipdLoadJSDebug={capturedEvents:capturedEvents,dispatchedEvents:dispatchedEvents};EventTarget.prototype.addEventListener=function(type,listener,...options){if(!type.includes(':norapidload')&&supportedEvents.includes(type)&&supportedTargets.includes(this)&&typeof listener==='function'){if(this===document&&document.readyState!=='loading'||this===window&&document.readyState!=='loading'){setTimeout(()=>{console.log(type);listener.call(this,new Event(type))},100)}else{capturedEvents.push({target:this,type:type,listener:listener,options:options})}}if(type.includes(':norapidload')){type=type.replace(':norapidload','')}originalAddEventListener.call(this,type,listener,...options)};EventTarget.prototype.removeEventListener=function(type,listener,...options){if(supportedEvents.includes(type)&&supportedTargets.includes(this)){capturedEvents=capturedEvents.filter(e=>!(e.type===type&&e.listener===listener&&e.target===this))}originalRemoveEventListener.call(this,type,listener,...options)};EventTarget.prototype.dispatchEvent=function(event){dispatchedEvents.push(event);if(supportedEvents.includes(event.type)&&supportedTargets.includes(this)){capturedEvents=capturedEvents.filter(e=>{if(e.type===event.type&&e.target===this){e.target.removeEventListener(e.type,e.listener,...e.options);return false}return true})}return originalDispatchEvent.call(this,event)};supportedEvents.forEach(function(eventType){supportedTargets.forEach(function(target){target.addEventListener(eventType,function(){})})})})();; 
            ";

            $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-head.js';

            if (file_exists($filePath)) {
                $content = file_get_contents($filePath);
            }

            $node_header = '<script type="text/javascript" >' . $content . '</script>';

            $title_content = $title->outertext;

            $title->__set('outertext', $title_content . $node_header);


            // Inject footer delay script
            $body = $this->dom->find('body', 0);

            // get the file content from ./assets/js/inline-scripts/delay-script-footer.min.js
            $content = "//!injected by RapidLoad \n!(function(){var totalScripts=prepareScripts();function rpDebug(method='log',...args){if(window.location.search.includes('rapidload_debug_js_scripts')){console[method](...args)}}if(window.RAPIDLOAD_EXPERIMENT__DELAY_PREFETCH){document.addEventListener('DOMContentLoaded:norapidload',()=>{totalScripts.forEach((script,index)=>{setTimeout(()=>{fetch(script.scriptElement.getAttribute('data-rapidload-src')).then(()=>{script.asyncLoaded=true;script.success=true;totalScripts[index]=script}).catch(()=>{script.asyncLoaded=true;script.success=falsej;totalScripts[index]=script}).finally(()=>{onScriptAsyncLoad(script)})},10)})})}function createBatches(scripts){const scriptMap=new Map(scripts.map(script=>[script.id,{...script,batch:null}]));function assignBatch(scriptId,stackSet=new Set){let script=scriptMap.get(scriptId);if(script.batch!==null)return script.batch;if(stackSet.has(scriptId)){throw new Error('RapidLoad: Circular dependency detected at script: '+scriptId)}stackSet.add(scriptId);let maxBatch=0;script.dependencies.forEach(depId=>{const depBatch=assignBatch(depId,stackSet);maxBatch=Math.max(maxBatch,depBatch)});script.batch=maxBatch+1;stackSet.delete(scriptId);return script}return scripts.map(script=>assignBatch(script.id))}function onScriptLoad(script,success=true){totalScripts=totalScripts.map(s=>s.id===script.id&&script.loaded===null?{...script,loaded:true,success:success}:s);if(totalScripts.filter(s=>s.batch===script.batch).length===totalScripts.filter(s=>s.batch===script.batch&&s.loaded).length){var batchLoadedEvent=new CustomEvent('RapidLoad:DelayedScriptBatchLoaded',{detail:{batch:script.batch},bubbles:true,cancelable:true});document.dispatchEvent(batchLoadedEvent);rpDebug('info','fired: RapidLoad:DelayedScriptBatchLoaded : '+script.batch);rpDebug('table',totalScripts.filter(s=>s.batch===script.batch))}if(totalScripts.filter(s=>s.loaded).length===totalScripts.length){var allScriptsLoadedEvent=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:true,cancelable:true});document.dispatchEvent(allScriptsLoadedEvent);rpDebug('info','fired: RapidLoad:DelayedScriptsLoaded');rpDebug('table',totalScripts)}}function prepareScripts(){var scripts=Array.from(document.querySelectorAll('[data-rapidload-src]'));mappedScripts=scripts.map(function(script,index){var scriptId=script.getAttribute('id');var depsAttribute=script.getAttribute('data-js-deps');return{id:scriptId||index,scriptElement:script,dependencies:parseDependencies(depsAttribute,scripts,scriptId),loaded:null,asyncLoaded:null,success:false}});return createBatches(mappedScripts)}function loadScript(script){var scriptElement=script.scriptElement;scriptElement.addEventListener('load',()=>onScriptLoad(script));scriptElement.addEventListener('error',()=>onScriptLoad(script,false));let rapidLoadSrc=scriptElement.getAttribute('data-rapidload-src');if(rapidLoadSrc){scriptElement.setAttribute('src',scriptElement.getAttribute('data-rapidload-src'));scriptElement.removeAttribute('data-rapidload-src')}}function loadScriptsInDependencyOrder(){totalScripts.filter(s=>s.batch===1).forEach(function(script){loadScript(script)});document.addEventListener('RapidLoad:DelayedScriptBatchLoaded',event=>{var batch=Number(event.detail.batch)+1;if(batch>totalScripts.filter(s=>s.batch).length){return}totalScripts.filter(s=>s.batch===batch).forEach(function(script){loadScript(script)})})}function parseDependencies(depsAttribute,scriptMap,scriptId){let deps=[];let depAttributes=depsAttribute?depsAttribute.split(', '):[];deps=depAttributes.map(function(dep){var matchingScript=scriptMap.find(function(script){return script.id===dep+'-js'||dep==='jquery'&&script.id==='jquery-core-js'||dep.startsWith('jquery-ui-')&&script.id==='jquery-ui-core-js'});if(matchingScript){return matchingScript.id}else{console.warn('Dependency not found for:',dep);return null}}).filter(Boolean);if(scriptId!=='jquery-core-js'&&scriptId&&scriptId.includes('jquery-')){deps.push('jquery-core-js')}return deps}['mousemove','touchstart','keydown'].forEach(function(event){var listener=function(){removeEventListener(event,listener);loadScriptsInDependencyOrder();if(totalScripts===0){var allScriptsLoadedEvent=new CustomEvent('RapidLoad:DelayedScriptsLoaded',{bubbles:true,cancelable:true});document.dispatchEvent(allScriptsLoadedEvent)}};addEventListener(event,listener)})})();";

            $filePath = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/javascript/assets/js/inline-scripts/delay-script-footer.js';

            if (file_exists($filePath)) {
                $content = file_get_contents($filePath);
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

    public function load_scripts_on_user_interaction($link){

        if(self::is_js($link)){

            if(isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction'])){
                if(!self::is_file_excluded($link->src) && self::is_load_on_user_interaction($link->src)){

                    $data_attr = "data-rapidload-src";
                    $link->{$data_attr} = $link->src;
                    unset($link->src);

                }
            }else{

                if($this->str_contains($link->src,"rapidload.frontend.min.js")){
                    return;
                }

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

            if(($js_to_be_delay && !self::is_file_excluded($link->innertext(), 'uucss_exclude_files_from_delay_js')) || ($js_to_be_defer && !self::is_file_excluded($link->innertext(), 'uucss_excluded_js_files_from_defer'))){

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

            if (count(array_filter($rootStatements, function ($statement) {
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

        if (!$id) {
            return [$node->render(new Compact())];
        }

        $renderedFunction = $node->render(new Compact());

        $updatedAst = Peast::latest( $defineWindow . $renderedFunction)->parse();
        //return $updatedAst->getBody()[0] ? $updatedAst->getBody()[0] : null;
        return array_merge([$updatedAst->render(new Compact())], $additionalSnippets);
    }

    function modify_script_tag( $tag, $handle, $src ) {

        if(is_admin()) {
            return $tag;
        }

        global $wp_scripts;

        if (isset($wp_scripts->registered[$handle])) {
            $script = $wp_scripts->registered[$handle];
            $attributes = [];
            $dependencies = $script->deps; // Array of script dependencies

            $dependencies = apply_filters('rapidload/js/script-dependencies', $dependencies, $handle);
            $after = apply_filters('rapidload/js/script-append-after', null, $script);

            if (!empty($dependencies)) {
                // Convert dependencies array to a comma-separated string
                $deps_string = implode(', ', $dependencies);

                $attributes['data-js-deps'] = esc_attr($deps_string);

                if ($after) {
                    $attributes['data-js-after'] = $after;
                }


                $attributeString = '';
                foreach ($attributes as $key => $value) {
                    $attributeString .= $key . '="' . htmlspecialchars($value, ENT_QUOTES) . '" ';
                }


                // Insert the data-js-deps attribute into the script tag
                $tag = preg_replace('/<script(.*?)>/', '<script$1 ' . trim($attributeString) . '>', $tag);
            }
        }

        return $tag;
    }
}