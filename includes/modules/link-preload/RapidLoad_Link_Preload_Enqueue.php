<?php

class RapidLoad_Link_Preload_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;
    private $settings;
    private $strategy;

    private $aggregated_css = "";

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 30);
    }

    public function update_content($state){

        self::debug_log('doing preload links');

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

        $body = $this->dom->find('body', 0);
        $jsCode = <<<EOD
            (function(){class LinkHandler{constructor(){this.prefetchSet=new Set;this.prerenderSet=new Set}cleanURL(url){const parsedURL=new URL(url,window.location.origin);return parsedURL.origin+parsedURL.pathname+parsedURL.search}isFileURL(url){return/\.(jpeg|jpg|png|gif|svg|webp|bmp|pdf|doc|docx|xls)$/.test(url)}isExcludedURL(url){const excludedPatterns=["/refer/","/go/","/recommend/","/recommends/"];return excludedPatterns.some(pattern=>url.includes(pattern))}shouldPrefetch(url){url=this.cleanURL(url);return!this.prefetchSet.has(url)&&!url.includes("?")&&!this.isFileURL(url)&&!this.isExcludedURL(url)&&window.location.href!==url&&url.startsWith(window.location.origin)}shouldPrerender(url){url=this.cleanURL(url);return!this.prerenderSet.has(url)&&!this.isFileURL(url)&&!this.isExcludedURL(url)&&window.location.href!==url&&url.startsWith(window.location.origin)}createLinkElement(rel,href){const link=document.createElement("link");link.rel=rel;link.href=href;document.head.appendChild(link)}prefetchResource(url){if(this.shouldPrefetch(url)){this.createLinkElement("prefetch",url);this.prefetchSet.add(url)}}prerenderResource(anchorElement){const href=anchorElement.href;const prerenderTimeout=setTimeout(()=>{if(this.shouldPrerender(href)){this.createLinkElement("prerender",href);this.prerenderSet.add(href)}},200);anchorElement.addEventListener("mouseleave",()=>clearTimeout(prerenderTimeout),{once:true})}}class DesktopLinkObserver{constructor(linkHandler){this.linkHandler=linkHandler;this.lastMousePos={x:null,y:null};this.animationFrame=null}handleMouseMove(event){cancelAnimationFrame(this.animationFrame);this.animationFrame=requestAnimationFrame(()=>{const{clientX,clientY}=event;if(this.lastMousePos.x!==null&&this.lastMousePos.y!==null&&Math.hypot(clientX-this.lastMousePos.x,clientY-this.lastMousePos.y)<100){return}this.lastMousePos={x:clientX,y:clientY};document.querySelectorAll("a[href]").forEach(anchorElement=>{const boundingBox=anchorElement.getBoundingClientRect();const distanceToLeft=Math.min(Math.abs(clientX-boundingBox.left),Math.abs(clientX-boundingBox.right));const distanceToTop=Math.min(Math.abs(clientY-boundingBox.top),Math.abs(clientY-boundingBox.bottom));if(Math.hypot(distanceToLeft,distanceToTop)<200){this.linkHandler.prefetchResource(anchorElement.href)}anchorElement.addEventListener("mouseenter",()=>{this.linkHandler.prerenderResource(anchorElement)},{once:true})})})}observe(){document.addEventListener("mousemove",event=>this.handleMouseMove(event),{capture:true,passive:true})}}class MobileLinkObserver{constructor(linkHandler){this.linkHandler=linkHandler;this.observer=new IntersectionObserver(this.handleIntersection.bind(this),{rootMargin:"50px 20px",threshold:.5})}handleIntersection(entries){entries.forEach(entry=>{if(entry.isIntersecting){this.linkHandler.prefetchResource(entry.target.href);this.observer.unobserve(entry.target)}})}observe(){document.querySelectorAll("a[href]").forEach(anchorElement=>{this.observer.observe(anchorElement);anchorElement.addEventListener("touchstart",()=>{this.linkHandler.prerenderResource(anchorElement)},{passive:true})})}}function init(){if(isSaveDataEnabled()||!supportsPrefetch())return;const linkHandler=new LinkHandler;if(isMobileDevice()){const mobileObserver=new MobileLinkObserver(linkHandler);mobileObserver.observe()}else{const desktopObserver=new DesktopLinkObserver(linkHandler);desktopObserver.observe()}}function isSaveDataEnabled(){const connection=navigator.connection;return connection?.saveData||connection?.effectiveType==="2g"}function supportsPrefetch(){const link=document.createElement("link");return link.relList?.supports("prefetch")}function isMobileDevice(){return/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)}init()})();
            EOD;
        if (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG === true || defined('RAPIDLOAD_DEV_MODE') && RAPIDLOAD_DEV_MODE === true) {
            $filePath = RAPIDLOAD_PLUGIN_DIR . '/assets/js/rapidload.preload-links.js';
            if(file_exists($filePath)){
                $jsCode = file_get_contents($filePath);
            }
        }
        $node = $this->dom->createElement('script', $jsCode);
        $node->setAttribute('id', 'rapidload-preload-links');
        $node->setAttribute('type', 'text/javascript');
        $node->setAttribute('norapidload',true);
        $body->appendChild($node);

        return [
            'dom' => $this->dom,
            'inject' => $this->inject,
            'options' => $this->options,
            'strategy' => $this->strategy
        ];
    }
}