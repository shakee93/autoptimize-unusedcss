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
        parent::enqueueGlobalScript();

        $this->provider = 'autoptimize';

	    register_deactivation_hook(UUCSS_PLUGIN_FILE, [$this, 'vanish']);

        $this->register_dependency_activation_hook();

	    if ( ! $this->check_dependencies() ) {
		    return;
	    }

	    $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

	    add_action( 'autoptimize_action_cachepurged', [$this, 'clear_cache'] );

	    add_action('uucss_cache_completed', [$this, 'flushCacheProviders'], 10, 2);
	    add_action('uucss_cache_cleared', [$this, 'flushCacheProviders'], 10, 2);


	    add_filter( 'query_vars', function ($vars) {

		    $vars[] = 'no_uucss';
		    return $vars;

	    });

	    parent::__construct();

    }

    public function register_dependency_activation_hook(){

        if(file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php')){

            require_once( ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php' );
            register_activation_hook(  ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php', function(){

                $fields = [
                    "autoptimize_css" => true,
                    "autoptimize_css_aggregate" => true,
                    "autoptimize_css_include_inline" => true,
                    "autoptimize_cache_nogzip" => true,
                    "autoptimize_minify_excluded" => true,
                    "autoptimize_cache_fallback" => true,
                    "autoptimize_optimize_logged" => true
                ];
                foreach ($fields as $key => $value){
                    autoptimizeOptionWrapper::update_option($key,$value);
                }

            });
        }
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
			//self::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed");
            self::add_advanced_admin_notice(
                "Autoptimize UnusedCSS Plugin only works when autoptimize is installed",
                "danger",
                "install",
                null,
                [
                    'key' => 'Install',
                    'value' =>  network_admin_url( 'plugin-install.php?tab=plugin-information&plugin=autoptimize' )
                ]
            );
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

	    $this->url = $this->transform_url( $this->url );

	    if ( ! UnusedCSS_Settings::link_exists( $this->url ) ) {
		    return;
	    }

	    if ( get_query_var( 'no_uucss' ) == 'true' ) {
		    return;
	    }

	    $data = UnusedCSS_Settings::get_link( $this->url );

	    if ( $data['status'] !== 'success' && ! $data['files'] ) {
		    return;
	    }

	    add_action( 'autoptimize_html_after_minify', function ( $html ) use ( $data ) {

		    $html = $this->parsAllCSS( $html, $data );

		    return $html;
	    }, 99 );

    }

	public static function isCSS( $el ) {
		return $el->rel === 'stylesheet' || $el->rel === 'preload' && $el->as === 'style';
	}


	public function parsAllCSS( $html, $data ) {
		$dom = HungCP\PhpSimpleHtmlDom\HtmlDomParser::str_get_html( $html );

		$inject = (object) [
			"parsed_html"           => false,
			"found_sheets"          => false,
			"found_css_files"       => [],
			"found_css_cache_files" => [],
			"injected_css_files"    => [],
		];

	    if ( $dom ) {
		    $inject->parsed_html = true;

		    $dom->find( 'html' )[0]->uucss = true;

		    $sheets = $dom->find( 'link' );

		    foreach ( $sheets as $sheet ) {
			    $link = $sheet->href;

			    $inject->found_sheets = true;

			    if ( self::isCSS( $sheet ) ) {

				    array_push( $inject->found_css_files, $link );

				    $key = array_search( $link, array_column( $data['files'], 'original' ) );

				    if ( $key && $this->cache_file_exists( $data['files'][ $key ]['uucss'] ) ) {
					    array_push( $inject->found_css_cache_files, $link );

					    $newLink = $this->get_cached_file( $data['files'][ $key ]['uucss'], autoptimizeOptionWrapper::get_option( 'autoptimize_cdn_url', '' ) );

					    array_push( $inject->injected_css_files, $newLink );

					    if ( in_array( $link, $this->css ) || isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {

						    $sheet->uucss = true;
						    $sheet->href  = $newLink;

						    if ( isset( $this->options['uucss_inline_css'] ) ) {
							    $this->inlineSheet( $sheet, $data['files'][ $key ]['uucss'] );
						    }

					    }

				    }
			    }

		    }

//		    self::log( $inject );

		    return $dom;

	    }

	    self::log( $inject );

	    return $html;
    }


	protected function inlineSheet( $sheet, $link ) {

		$inline = $this->get_inline_content( $link );

		if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/inline-css-limit', 15 * 1000 ) ) {
			return;
		}

		$sheet->outertext = '<style inlined-uucss="' . basename( $link ) . '">' . $inline['content'] . '</style>';

	}


	public function flushCacheProviders( $args ) {
		$url = null;

		//autoptimizeCache::flushPageCache();

		if ( isset( $args['url'] ) ) {
			$url = $args['url'];
		}

		if ( class_exists( 'Cache_Enabler' ) ) {

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
