<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {

    use UnusedCSS_Utils;

	public $deps_available = false;

	public $uucss_ao_base;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {

	    new UnusedCSS_Feedback();

        add_filter('plugin_row_meta',[$this, 'add_plugin_row_meta_links'],10,4);

        $this->add_update_message();

	    parent::enqueueGlobalScript();

	    $this->provider = 'autoptimize';

	    UnusedCSS_DB::check_db_updates();

	    register_deactivation_hook( UUCSS_PLUGIN_FILE, [ $this, 'vanish' ] );

	    /**
	     * initialize on-boarding functions
	     */
	    new UnusedCSS_Autoptimize_Onboard( $this );

	    if ( ! $this->check_dependencies() ) {
		    return;
	    }

        $this->uucss_ao_base = new autoptimizeStyles(null);
        $this->uucss_ao_base->cdn_url = autoptimizeOptionWrapper::get_option( 'autoptimize_cdn_url' );

	    $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

	    add_action( 'autoptimize_action_cachepurged', function (){
	        $args['soft'] = true;
	        $this->clear_cache(null, $args);
        });

	    add_filter('uucss/cache-file-base-dir', function ($value){
            return trailingslashit(defined('AUTOPTIMIZE_CACHE_CHILD_DIR') ? AUTOPTIMIZE_CACHE_CHILD_DIR : '/cache/autoptimize/');
        });

	    add_filter('uucss/autoptimize-cdn-url', function ($link){
	        return $this->uucss_ao_base->url_replace_cdn($link);
        },10,1);

	    add_filter('uucss/ao-handled', function ($handled , $link ){
	        return count($this->ao_handled($link)) > 0;
        },10,2);

	    add_filter('uucss/cache-file-path', function ($uucss_file){
	        return $this->get_cached_file($uucss_file, $this->uucss_ao_base->cdn_url);
        },10,1);

	    add_action('uucss/inject/inline-sheet', function ($sheet, $link){
	        $this->inline_sheet($sheet, $link);
        },10,2);

	    add_filter('uucss/inline-css-enabled', function ($value){
	        return autoptimizeOptionWrapper::get_option( 'autoptimize_css_include_inline' ) != 'on';
        },10,1);

	    add_filter('uucss/settings-options', function ($value){
	        return UnusedCSS_Autoptimize_Admin::fetch_options();
        }, 10, 1);

	    add_action( 'uucss/content_updated', [ $this, 'refresh' ], 10, 1 );
	    add_action( 'uucss/cached', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_cleared', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_file_created', [ $this, 'create_server_compressed_files' ], 10, 2 );

	    parent::__construct();

	    /**
	     * Initialize admin area functions
	     */
	    new UnusedCSS_Autoptimize_Admin( $this );

	    new UnusedCSS_Queue();
    }

    function add_update_message(){

        global $pagenow;

        if ( 'plugins.php' === $pagenow )
        {
            $file   = basename( UUCSS_PLUGIN_FILE );
            $folder = basename( dirname( UUCSS_PLUGIN_FILE ) );
            $hook = "in_plugin_update_message-{$folder}/{$file}";
            add_action( $hook, [$this, 'render_update_message'], 20, 2 );
        }

    }

    function render_update_message($plugin_data, $r ){

        $data = file_get_contents( 'https://raw.githubusercontent.com/shakee93/autoptimize-unusedcss/master/readme.txt?format=txt' );

        $changelog  = stristr( $data, '== Changelog ==' );

        $changelog = preg_split("/\=(.*?)\=/", str_replace('== Changelog ==','',$changelog));

        if(isset($changelog[1])){

            $changelog = explode('*', $changelog[1]);

            array_shift($changelog);

            echo '<div style="margin-bottom: 1em"><strong style="padding-left: 25px;">What\'s New ?</strong><ol style="list-style-type: disc;margin: 5px 50px">';

            foreach ($changelog as $index => $log){
                if($index == 3){
                    break;
                }
                echo '<li style="margin-bottom: 0">' . preg_replace("/\r|\n/","",$log) . '</li>';
            }

            echo '</ol></div><p style="display: none" class="empty">';

        }
    }

    function add_plugin_row_meta_links($plugin_meta, $plugin_file, $plugin_data, $status)
    {
        if(isset($plugin_data['TextDomain']) && $plugin_data['TextDomain'] == 'autoptimize-unusedcss'){
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us" target="_blank">Documentation</a>';
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Submit Ticket</a>';
        }
        return $plugin_meta;
    }

    public function is_url_allowed($url = null, $args = null)
    {
	    if ( ! $url ) {
		    $url = $this->url;
	    }

	    if ( ! parent::is_url_allowed( $url, $args ) ) {
		    return false;
	    }

	    if ( isset( $this->options['uucss_excluded_links'] ) && ! empty( $this->options['uucss_excluded_links'] ) ) {
		    $exploded = explode( ',', $this->options['uucss_excluded_links'] );

		    foreach ( $exploded as $pattern ) {

			    if ( filter_var( $pattern, FILTER_VALIDATE_URL ) ) {

                    $pattern = parse_url( $pattern );

				    $path = $pattern['path'];
				    $query = isset($pattern['query']) ? '?' . $pattern['query'] : '';

				    $pattern = $path . $query;

			    }

			    if(self::str_contains( $pattern, '*' ) && $this->is_path_glob_matched(urldecode($url), $pattern)){
                    $this->log( 'skipped : ' . $url );
                    return false;
                }else if ( self::str_contains( urldecode($url), $pattern ) ) {
				    $this->log( 'skipped : ' . $url );
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
            $notice = [
	            'action'  => 'on-board',
	            'title'   => 'RapidLoad Power Up',
	            'message' => 'Complete on-boarding steps, it only takes 2 minutes.',

	            'main_action' => [
		            'key'   => 'Get Started',
		            'value' => admin_url( 'options-general.php?page=uucss-onboarding' )
	            ],
	            'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            UnusedCSS_Autoptimize_Onboard::display_get_start_link();
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

	    add_action( 'autoptimize_html_after_minify', function ( $html ) {
            return apply_filters('uucss/enqueue/content', $html);
	    }, 99 );
    }

	public static function is_css( $el ) {
		return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
	}


	public function inject_css( $html, $data ) {

        return apply_filters('uucss/enqueue/content',$html, $data);
	}

	public function ao_handled($link){
        $ao_base = $this->uucss_ao_base;
        return array_filter( $this->css, function ( $item ) use ( $link, $ao_base ) {
            return $this->str_contains( $ao_base->url_replace_cdn($item), preg_replace('/\?.*/', '', $link) );
        } );
    }

	protected function inline_sheet( $sheet, $link ) {

		$inline = $this->get_inline_content( $link );

		if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/inline-css-limit', 5 * 1000 ) ) {
			return;
		}

		$sheet->outertext = '<style inlined-uucss="' . basename( $link ) . '">' . $inline['content'] . '</style>';

	}


	public function flush_page_cache( $args ) {
		$url = null;

		//autoptimizeCache::flushPageCache();

		if ( isset( $args['url'] ) ) {
			$url = $this->transform_url( $args['url'] );
		}

		$this->flush_lw_varnish( $url );

	}

    public function flush_lw_varnish($url = null)
    {
        if (!class_exists('LW_Varnish_Cache_Purger')) {
            return;
        }

	    if ( $url ) {
		    LW_Varnish_Cache_Purger::get_instance()->purge_url( $url );
		    LW_Varnish_Cache_Purger::get_instance()->do_purge();

		    return;
	    }

	    LW_Varnish_Cache_Purger::get_instance()->do_purge_all();
    }


	public function is_autoptimize_installed() {
		$file = ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php';

		return file_exists( $file );
	}


	public function create_server_compressed_files( $file_location, $css ) {

		if ( apply_filters( 'autoptimize_filter_cache_create_static_gzip', false ) ) {

			// Create an additional cached gzip file.
			file_put_contents( $file_location . '.gz', gzencode( $css, 9, FORCE_GZIP ) );

			// If PHP Brotli extension is installed, create an additional cached Brotli file.
			if ( function_exists( 'brotli_compress' ) ) {
				file_put_contents( $file_location . '.br', brotli_compress( $css, 11, BROTLI_GENERIC ) );
			}

		}

	}

}


