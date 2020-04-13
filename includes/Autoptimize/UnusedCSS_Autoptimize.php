<?php


/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {

    use UnusedCSS_Utils;

	public $deps_available = false;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        $this->provider = 'autoptimize';

	    register_deactivation_hook(UUCSS_PLUGIN_FILE, [$this, 'vanish']);

	    if ( ! $this->check_dependencies() ) {
		    return;
	    }

	    $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

	    add_action( 'autoptimize_action_cachepurged', [$this, 'clear_cache'] );

	    add_action('uucss_cache_completed', [$this, 'flushCacheProviders'], 10, 2);
	    add_action('uucss_cache_cleared', [$this, 'flushCacheProviders'], 10, 2);


	    parent::__construct();

    }

    public function is_url_allowed($url = null, $args = null)
    {
        if (!$url) {
            $url = $this->url;
        }

        if(!parent::is_url_allowed($url, $args)){
            return false;
        }

        $options = UnusedCSS_Autoptimize_Admin::fetch_options();

        if (isset($options['uucss_excluded_links']) && !empty($options['uucss_excluded_links'])) {
            $exploded = explode(',', $options['uucss_excluded_links']);

            // TODO : improve this
            foreach ($exploded as $pattern) {

	            if (filter_var($pattern, FILTER_VALIDATE_URL)) {
		            $pattern = parse_url($pattern)['path'];
	            }

            	// check using string contains instead of regex
                if (self::str_contains( $url, $pattern )) {
                    $this->log('skipped : ' . $url);
                    return false;
                }

            }
        }

        return true;
    }


	public function check_dependencies() {

		if(function_exists('autoptimize')) {
			$this->deps_available = true;
		}else {
			self::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed");
		}

		return $this->deps_available;
	}


    public function enabled() {

        if (!parent::enabled()) {
            return false;
        }

        if (!UnusedCSS_Autoptimize_Admin::enabled()) {
            return false;
        }

        return true;
    }


    public function get_css(){


        add_action('autoptimize_filter_cache_getname', function($ao_css){
            $this->css[] = $ao_css;
        });


    }


    public function replace_css(){

        if (!$this->cache_page_dir_exists()) {
            return;
        }

        add_action('autoptimize_html_after_minify', function($html) {

            $html = $this->parsAllCSS($html);

            return $html;
        });

    }

    public function parsAllCSS($html)
    {
        $dom = HungCP\PhpSimpleHtmlDom\HtmlDomParser::str_get_html($html);

        $sheets = $dom->find('link');

        foreach ($sheets as $sheet) {
            $link = $sheet->href;

            if(strpos($link, '.css') !== false){

                if ($this->cache_file_exists($link)) {
                    $newLink = $this->get_cached_file($link);

	                if (in_array($link, $this->css) ) {
		                $sheet->uucss = true;
		                $sheet->href = $newLink;
	                }else if ( isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {
		                $sheet->uucss = true;
		                $sheet->href = $newLink;
	                }
                }
            }

        }

        return $dom;
    }

    public function getCSSviaAutoptimize($html)
    {
        $hash = $this->encode($this->url);

        foreach ($this->css as  $css) {

            $_css = str_replace('/autoptimize/css', "/uucss/$this->provider/$hash", $css);
            $html = str_replace($css, $_css, $html);

        }

        return $html;
    }

    public function flushCacheProviders($args)
    {
        $url = null;

        //autoptimizeCache::flushPageCache();

        if(isset($args['url'])) {
            $url = $args['url'];
        }

        if(class_exists('Cache_Enabler')) {

            if ($url) {
                Cache_Enabler::clear_page_cache_by_url($url);
            } else {
                Cache_Enabler::clear_total_cache();
            }

        }

        $this->flush_lw_varnish($url);

    }

    public function flush_lw_varnish($url = null)
    {
        if (!class_exists('LW_Varnish_Cache_Purger')) {
            return;
        }

        if ($url) {
            LW_Varnish_Cache_Purger::get_instance()->purge_url($url);
            LW_Varnish_Cache_Purger::get_instance()->do_purge();
            return;
        }

        LW_Varnish_Cache_Purger::get_instance()->do_purge_all();
    }
}
