<?php

class RapidLoad_Image
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_image_delivery'])){
            //return;
        }

        add_action('wp_head', [$this, 'enqueue_frontend_js']);

        add_action('rapidload/job/handle', [$this, 'optimize_image'], 30, 2);

    }

    public function enqueue_frontend_js(){

        ?>
        <script type="text/javascript">

            (function(w, d){
                w.rapidload_io_data = {
                    options : true
                }
                var b = d.getElementsByTagName('head')[0];
                var s = d.createElement("script");
                s.async = true;
                s.src = "<?php echo UUCSS_PLUGIN_URL . 'assets/js/rapidload_io.min.js?v=' . UUCSS_VERSION ?>"
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

    public static function get_replaced_url($url, $cdn, $width = false, $height = false )
    {

        $options = 'q_lossy+to_auto+ret_img';

        if($width && $height){

            $options .= '+w_' . $width . '+h_' . $height;
        }

        return $cdn . $options . '/' . $url;
    }

}