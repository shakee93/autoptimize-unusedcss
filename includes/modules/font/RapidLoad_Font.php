<?php

class RapidLoad_Font
{
    use RapidLoad_Utils;

    public $options = [];
    public $base;
    public $file_system;
    public static $base_dir;
    public static $base_url;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_font_optimization']) || $this->options['uucss_enable_font_optimization'] == ""){
            return;
        }

        $this->file_system = new RapidLoad_FileSystem();

        if( ! $this->initFileSystem() ){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_font'], 30, 2);

        add_filter('rapidload/cpcss/minify', [$this, 'add_display_swap_to_inline_styles']);

        add_filter('uucss/css/excluded-files', [$this, 'exclude_google_font_uucss']);

        add_filter('rapidload/cache_file_creating/css', [$this, 'add_display_swap_to_inline_styles'], 10 , 1);

        add_action('rapidload/vanish', [ $this, 'vanish' ]);

        add_filter('rapidload/webfont/handle', [$this, 'handle_web_font_js'], 10, 2);
    }

    public function handle_web_font_js($handle, $link){

        $ids = isset($this->options['web_font_loader_ids']) ? explode(",", $this->options['web_font_loader_ids']) : [];

        return $this->array_search_partial($link->id, $ids);
    }

    public function array_search_partial($needle, $haystack){
        $results = array();
        foreach ($haystack as $value) {
            if (strpos($needle, $value) !== false) { $results[] = $value; }
        }
        if(!empty($results)){
            return true;
        }
        return false;
    }

    public function vanish() {

        if ( $this->file_system->exists( self::$base_dir ) ){
            $this->file_system->delete( self::$base_dir, true );
        }

    }

    public function self_host_gstatic_fonts($css){

        $font_urls = self::get_font_urls($css);

        self::download_urls_in_parallel($font_urls);

        foreach ($font_urls as $font_url) {
            $cached_font_url = self::$base_url . '/' . basename($font_url);
            $css = str_replace($font_url, $cached_font_url, $css);
        }

        return $css;
    }

    public function exclude_google_font_uucss($args){

        $args[] = 'fonts.googleapis.com';

        return $args;
    }

    public function add_display_swap_to_inline_styles($content){

        $content = preg_replace(
            '/font-display:\s?(auto|block|fallback|optional)/',
            'font-display:swap',
            $content
        );
        return preg_replace('/@font-face\s*{/', '@font-face{font-display:swap;', $content);
    }

    public function initFileSystem() {

        $this->base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR) . 'font';

        if ( ! $this->file_system ) {
            return false;
        }

        if ( ! $this->init_base_dir() ) {
            return false;
        }

        return true;
    }

    public function init_base_dir() {

        self::$base_dir = WP_CONTENT_DIR . $this->base;
        self::$base_url = apply_filters('uucss/enqueue/cdn',untrailingslashit(content_url($this->base)));

        if ( $this->file_system->exists( self::$base_dir ) ) {
            return true;
        }

        // make dir if not exists
        $created = $this->file_system->mkdir( self::$base_dir );

        if (!$created || ! $this->file_system->is_writable( self::$base_dir ) || ! $this->file_system->is_readable( self::$base_dir ) ) {
            return false;
        }

        return true;
    }

    public function optimize_font($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_font'] )){
            return false;
        }

        new RapidLoad_Font_Enqueue($job);

    }

    public static function self_host_style_sheet($url, $file_path)
    {

        if (substr($url, 0, 2) === '//') {
            $url = 'https:' . $url;
        }

        $css_file_response = wp_remote_get($url, [
            'user-agent' =>
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
        ]);

        if (
            is_wp_error($css_file_response) ||
            wp_remote_retrieve_response_code($css_file_response) !== 200
        ) {
            return false;
        }

        $css = $css_file_response['body'];

        $font_urls = self::get_font_urls($css);

        self::download_urls_in_parallel($font_urls);

        foreach ($font_urls as $font_url) {
            $cached_font_url = self::$base_url . '/' . basename($font_url);
            $css = str_replace($font_url, $cached_font_url, $css);
        }

        file_put_contents($file_path, $css);
    }

    private static function get_font_urls($css)
    {
        $regex = '/url\((https:\/\/fonts\.gstatic\.com\/.*?)\)/';
        preg_match_all($regex, $css, $matches);
        return array_unique($matches[1]);
    }

    public static function download_urls_in_parallel($urls)
    {
        $multi_handle = curl_multi_init();
        $file_pointers = [];
        $curl_handles = [];

        foreach ($urls as $key => $url) {
            $file = self::$base_dir . '/' . basename($url);
            $curl_handles[$key] = curl_init($url);
            $file_pointers[$key] = fopen($file, 'w');
            curl_setopt($curl_handles[$key], CURLOPT_FILE, $file_pointers[$key]);
            curl_setopt($curl_handles[$key], CURLOPT_HEADER, 0);
            curl_setopt($curl_handles[$key], CURLOPT_CONNECTTIMEOUT, 60);
            curl_multi_add_handle($multi_handle, $curl_handles[$key]);
        }

        do {
            curl_multi_exec($multi_handle, $running);
        } while ($running > 0);

        foreach ($urls as $key => $url) {
            curl_multi_remove_handle($multi_handle, $curl_handles[$key]);
            curl_close($curl_handles[$key]);
            fclose($file_pointers[$key]);
        }
        curl_multi_close($multi_handle);
    }
}