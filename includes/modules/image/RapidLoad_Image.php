<?php

class RapidLoad_Image
{
    use RapidLoad_Utils;

    public $options = [];

    public static $image_indpoint;

    public static $instance;

    public function __construct()
    {
        $this->options = RapidLoad_Base::get_merged_options();

        if(!isset($this->options['uucss_enable_image_delivery']) || $this->options['uucss_enable_image_delivery'] == ""){
            return;
        }

        self::$image_indpoint = "https://images.rapidload-cdn.io/spai/";

        add_action('wp_footer', [$this, 'enqueue_frontend_js'], 90);

        /*add_filter('wp_calculate_image_srcset', function ($a, $b, $c, $d, $e){
            foreach ($a as $index => $src){
                if(isset($src['url']) && isset($src['value'])){
                    $a[$index]['url'] = self::get_replaced_url($src['url'],self::$image_indpoint, $src['value'], false, ['retina' => 'ret_img']);
                }
            }
            return $a;
        }, 10, 5);*/

        add_action('rapidload/job/handle', [$this, 'optimize_image'], 30, 2);

        if(isset($this->options['rapidload_disable_thumbnails']) && $this->options['rapidload_disable_thumbnails'] == "1"){
            add_filter('intermediate_image_sizes_advanced',function (){
                return [];
            }, 90);
        }

        add_filter('rapidload/cache_file_creating/css', [$this, 'optimize_css_file_images'], 10 , 1);

        self::$instance = $this;
    }

    public function optimize_css_file_images($css){

        $parser = new \Sabberworm\CSS\Parser($css);
        $cssDocument = $parser->parse();
        foreach ($cssDocument->getAllValues() as $value) {
            if( $value instanceof \Sabberworm\CSS\Value\URL){
                $url = $this->extractUrl($value->getURL()->getString());
                $urlExt = pathinfo($url, PATHINFO_EXTENSION);
                if (in_array($urlExt, ["jpg", "jpeg", "png", "webp"])) {
                    $replace_url = RapidLoad_Image::get_replaced_url($url,self::$image_indpoint);
                    $value->setURL(new \Sabberworm\CSS\Value\CSSString($replace_url));
                }
            }
        }

        return $cssDocument->render();
    }

    public function enqueue_frontend_js(){

        ?>
        <script type="text/javascript">

            (function(w, d){
                w.rapidload_io_data = {
                    nonce : "<?php echo wp_create_nonce('rapidload_image') ?>",
                    image_endpoint : "<?php echo RapidLoad_Image::$image_indpoint ?>",
                    optimize_level : "<?php echo ( isset($this->options['uucss_image_optimize_level']) ? $this->options['uucss_image_optimize_level'] : 'null' ) ?>" ,
                    support_next_gen_format : <?php echo ( isset($this->options['uucss_support_next_gen_formats']) && $this->options['uucss_support_next_gen_formats'] == "1" ? 'true' : 'false' ) ?>
                };
                var b = d.getElementsByTagName('head')[0];
                var s = d.createElement("script");
                s.defer = true;
                s.type = "text/javascript";
                s.src = "<?php echo self::get_relative_url(UUCSS_PLUGIN_URL . 'assets/js/rapidload_images.min.js?v=24' . UUCSS_VERSION) ?>";
                b.appendChild(s);
            }(window, document));

        </script>
        <?php

    }

    public function optimize_image($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_rapidload_image'] )){
            return false;
        }

        new RapidLoad_Image_Enqueue($job);

    }

    public static function get_replaced_url($url, $cdn = null, $width = false, $height = false, $args = [])
    {
        if(!$cdn){
            $cdn = self::$image_indpoint;
        }

        $options = 'ret_blank';

        if(isset($args['retina'])){
            $options = $args['retina'];
        }

        $enamble_blurry_place_holder = isset(self::$instance->options['uucss_generate_blurry_place_holder']) && self::$instance->options['uucss_generate_blurry_place_holder'] == "1";

        if($enamble_blurry_place_holder){
            $options = 'ret_img';
        }

        if(isset($args['optimize_level']) && $enamble_blurry_place_holder){
            $options .= ',q_' . $args['optimize_level'];
        }else if(isset(self::$instance->options['uucss_image_optimize_level'])){
            $options .= ',q_' . self::$instance->options['uucss_image_optimize_level'];
        }

        if(isset(self::$instance->options['uucss_support_next_gen_formats']) && self::$instance->options['uucss_support_next_gen_formats'] == "1"){
            $options .= ',to_avif';
        }

        if($width && $height){

            $options .= ',w_' . str_replace("px", "", $width) . ',h_' . str_replace("px", "", $height);
        }

        return $cdn . $options . '/' . $url;
    }

    public function extractUrl($url){

        if(!$this->isAbsolute($url)){
            $url = $this->makeURLAbsolute($url, site_url());
        }

        return $url;
    }

    function isAbsolute($url) {
        return isset(parse_url($url)['host']);
    }

    function makeURLAbsolute($relative_url, $base_url) {

        $parsed_base_url = parse_url($base_url);

        if (strpos($relative_url, '/') !== 0) {
            $relative_url = '/' . $relative_url;
        }

        $absolute_url = $parsed_base_url['scheme'] . '://';
        $absolute_url .= $parsed_base_url['host'];
        $absolute_url .= (isset($parsed_base_url['port'])) ? ':' . $parsed_base_url['port'] : '';
        $absolute_url .= $relative_url;

        return $absolute_url;
    }

}