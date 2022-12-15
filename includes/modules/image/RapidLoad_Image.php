<?php

class RapidLoad_Image
{
    use RapidLoad_Utils;

    public $options = [];

    public static $image_indpoint;

    public static $instance;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_image_delivery']) || $this->options['uucss_enable_image_delivery'] == ""){
            return;
        }

        self::$image_indpoint = "https://images.rapidload-cdn.io/spai/";

        add_action('wp_head', [$this, 'enqueue_frontend_js']);

        add_filter('wp_calculate_image_srcset', function ($a, $b, $c, $d, $e){
            foreach ($a as $index => $src){
                $a[$index]['url'] = self::get_replaced_url($src['url'],self::$image_indpoint);
            }
        }, 10, 5);

        add_action('rapidload/job/handle', [$this, 'optimize_image'], 30, 2);

        self::$instance = $this;
    }

    public function enqueue_frontend_js(){

        ?>
        <script type="text/javascript">

            (function(w, d){
                w.rapidload_io_data = {
                    image_endpoint : "<?php echo RapidLoad_Image::$image_indpoint ?>",
                    optimize_level : "<?php echo ( isset($this->options['uucss_image_optimize_level']) ? $this->options['uucss_image_optimize_level'] : 'null' ) ?>" ,
                    support_next_gen_format : <?php echo ( isset($this->options['uucss_support_next_gen_formats']) && $this->options['uucss_support_next_gen_formats'] == "1" ? 'true' : 'false' ) ?>
                }
                var b = d.getElementsByTagName('head')[0];
                var s = d.createElement("script");
                s.async = true;
                s.src = "<?php echo UUCSS_PLUGIN_URL . 'assets/js/rapidload_io.min.js?v=17' . UUCSS_VERSION ?>"
                b.appendChild(s);
            }(window, document));

        </script>
        <?php

    }

    public function optimize_image($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_image'] )){
            return false;
        }

        new RapidLoad_Image_Enqueue($job);

    }

    public static function get_replaced_url($url, $cdn = null, $width = false, $height = false, $args = [])
    {
        if(!$cdn){
            $cdn = self::$image_indpoint;
        }

        $options = 'ret_img';

        if(isset($args['optimize_level'])){
            $options .= ',q_' . $args['optimize_level'];
        }else if(isset(self::$instance->options['uucss_image_optimize_level'])){
            $options .= ',q_' . self::$instance->options['uucss_image_optimize_level'];
        }

        if(isset(self::$instance->options['uucss_support_next_gen_formats']) && self::$instance->options['uucss_support_next_gen_formats'] == "1"){
            $options .= ',to_auto';
        }

        if($width && $height){

            $options .= ',w_' . $width . ',h_' . $height;
        }

        return $cdn . $options . '/' . $url;
    }

}