<?php


class RapidLoad_Onboard{
    use RapidLoad_Utils;

    private $uucss;

    public static $onboard_steps;
    public static $current_step;

    public function __construct() {

        self::$onboard_steps = $this->get_on_board_steps();
        self::$current_step = $this->get_on_board_step();

        add_action( 'current_screen', function () {

            if ( get_current_screen() && get_current_screen()->base == 'settings_page_rapidload-onboarding' ) {
                add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
            }
        } );

        add_action( 'admin_menu', [ $this, 'register_on_board_page' ] );
        add_action( 'admin_init', [ $this, 'redirect' ] );
        add_action( "wp_ajax_rapidload_configured", [ $this, 'rapidload_configured' ] );
        add_action( "wp_ajax_run_first_job", [ $this, 'run_first_job' ] );
        add_action( 'admin_head', [ $this, 'remove_notices' ] );
        add_filter('uucss/on-board/complete', function ($value){
            return self::on_board_completed();
        }, 10, 1);

    }

    function run_first_job(){

        if(!RapidLoad_Base::is_api_key_verified()){
            wp_send_json_error(false);
        }

        $site_url = $this->transform_url(get_site_url());

        $job = new RapidLoad_Job([
            'url' => $site_url
        ]);
        $job->save(true);

        $job_data = new RapidLoad_Job_Data($job, 'uucss');

        if(!isset($job_data->id)){
            $job_data->save();
        }

        global $uucss;

        $uucss->init_async_store($job_data, [ 'immediate' => true ]);

        $this->rapidload_configured();

    }

    function rapidload_configured(){
        $status = [];
        $status['rapidload_connected'] = RapidLoad_Base::is_api_key_verified();
        $status['uucss_first_job_done'] = (bool)RapidLoad_DB::get_first_link();
        $status['uucss_first_job'] = RapidLoad_DB::get_first_link();

        if(wp_doing_ajax()){
            wp_send_json_success($status);
        }else{
            return $status;
        }
    }

    function enqueueScripts(){

        wp_enqueue_script( 'rapidload_onboard', plugin_dir_url(__FILE__) . 'assets/rapidload-on-board.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

    }

    function remove_notices(){

        if(!isset($_REQUEST['action'])){
            return;
        }
        if(!isset($_REQUEST['plugin'])){
            return;
        }

        if(get_current_screen() &&
            get_current_screen()->base == 'update' &&
            $_REQUEST['action'] = 'install-plugin' &&
                $_REQUEST['plugin'] == 'autoptimize'){
            echo '<style>div.notice{display: none !important;}</style>';
        }
    }

    static function on_board_completed(){
        return RapidLoad_Base::is_api_key_verified();
    }

    function redirect() {
        if ( strpos( home_url( $_SERVER['REQUEST_URI'] ), '/options-general.php?page=rapidload-onboarding' ) &&
            self::on_board_completed() ) {
            wp_redirect( admin_url( 'admin.php?page=rapidload' ) );
        } else if ( RapidLoad_Base::get_option( 'rapidload_do_activation_redirect' ) ) {
            RapidLoad_Base::delete_option( 'rapidload_do_activation_redirect' );
            wp_redirect( '/wp-admin/options-general.php?page=rapidload-onboarding' );
        }
    }

    function register_on_board_page() {

        global $submenu;

        add_options_page(
            'RapidLoad',
            'RapidLoad',
            'manage_options',
            'rapidload-onboarding',
            [$this, 'rapidload_on_boarding_page']
        );

        $key = null;

        if(!isset($submenu['options-general.php'])){
            return;
        }

        $key = array_search(["RapidLoad","manage_options","rapidload-onboarding","RapidLoad"], $submenu['options-general.php']);

        if(isset($submenu['options-general.php'][$key])){
            unset($submenu['options-general.php'][$key]);
        }
    }

    function rapidload_on_boarding_page(){
        wp_enqueue_script('post');
        ?>
        <div class="rapidload-on-board">
            <?php
            include 'assets/onboarding.html.php';
            ?>
        </div>
        <?php
    }

    function get_on_board_steps(){

        $steps = apply_filters('rapidload/on-board/steps', [
            [
                'id' => 'connect',
                'position' => 0,
                'dependency' => [],
                'class' => 'connect actions slide-content',
                'done_callback' => function(){
                    return RapidLoad_Base::is_api_key_verified();
                },
                'render' => function(){
                    ?>
                    <div class="connect actions slide-content <?php if (RapidLoad_Base::is_api_key_verified()) { echo 'done'; } ?>">
                        <div class="analyze card show">
                            <div class="analyze-form actions">
                                <h2>Analyze & Connect</h2>
                                <div class="action-content">
                                    <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/connect.svg' ?>"
                                         alt="">
                                    <p class="analyze-text">Analyze & Connect with <strong><em>RapidLoad.io</em></strong> engine to start
                                        automatic optimization of
                                        your website and
                                        watch your page speed and speed scores spike up.</p>
                                </div>
                            </div>
                        </div>
                        <div class="analyze-result">
                            <h2 class ="step-1-hd">Connect & Activate</h2>
                            <div class="action-content">
                                <div class="action-content-header">
                                    <span class="reduction"></span>
                                    <span class="reduction-text">CSS reduction by RapidLoad</span>
                                </div>
                                <div class="action-content-body">
                                    <div class="stats stats-figures">
                                        <div class="content">
                                            <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/arrow.svg' ?>"
                                                 alt="">
                                            <div class="stats-figure before stat red">
                                        <span class="title">
                                            CSS Before
                                        </span>
                                                <div class="details">
                                                    <span class="value">0</span>
                                                </div>
                                            </div>
                                            <div class="stats-figure after stat green">
                                        <span class="title">
                                           CSS After
                                        </span>
                                                <div class="details">
                                                    <span class="value">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="stats stats-files">
                                        <div class="content">
                                            <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/arrow.svg' ?>"
                                                 alt="">
                                            <div class="stats-file before stat red">
                                        <span class="title">
                                            Requests Before
                                        </span>
                                                <div class="details">
                                                    <span class="value">0</span>
                                                </div>
                                            </div>
                                            <div class="stats-file after stat green">
                                        <span class="title">
                                            Requests After
                                        </span>
                                                <div class="details">
                                                    <span class="value">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="action-content uucss-error">
                                <div class="error-result">
                                    <div>
                                        <img class="sad intro" style=""
                                             src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/result_error.svg' ?>"
                                             alt="">
                                    </div>
                                    <div>
                                        <p class="error">
                                            <strong>Apologies!</strong> we were unable to process your url for some
                                            reason. it would immensely help us, if you could report this to our support
                                            team.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="action-wrap">
                            <a class="skip-analyze js-uucss-connect"
                               href="<?php echo RapidLoad_Utils::activation_url( "authorize", 'options-general.php?page=rapidload-onboarding' ) ?>">Skip
                                & Connect</a>
                            <a class="act-button <?php echo RapidLoad_Base::is_api_key_verified() ? 'js-uucss-connect' : 'js-uucss-analyze-site' ?> "
                               data-activation_url="<?php echo RapidLoad_Utils::activation_url( "authorize", 'options-general.php?page=rapidload-onboarding' ) ?>"
                               href="#"
                               target="_blank">
                                <?php echo RapidLoad_Base::is_api_key_verified() ? 'Connect' : 'Analyze' ?>
                                <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                        </div>
                    </div>
                    <?php
                }
            ],
            [
                'id' => 'run_first_job',
                'position' => 1,
                'dependency' => [0],
                'class' => 'connect actions slide-content',
                'done_callback' => function(){
                    return RapidLoad_DB::get_first_link();
                },
                'render' => function(){
                    ?>
                    <div class="run-job actions slide-content <?php if (RapidLoad_DB::get_first_link()) { echo 'done'; } ?>">
                        <h2>Run First Job</h2>
                        <div class="action-content">
                            <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/run-first-job.svg' ?>"
                                 alt="">
                            <p>Run your first RapidLoad removal job and see how much weight it could remove from your
                                website. <strong>it could reduce css file size up to 98% on larger websites. </strong></p>
                        </div>
                        <div class="action-wrap">
                            <a class="act-button js-uucss-first-job" href="#" target="_blank">
                                Run First Job <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                        </div>
                    </div>
                    <?php
                }
            ]
        ]);

        array_multisort(array_column($steps, 'position'), SORT_ASC, $steps);

        return array_values($steps);
    }

    public function get_on_board_step(){

        $step_ = true;

        foreach (self::$onboard_steps as $key => $step){

            if(!$this->step_done($key)){

                $step_ = $key;
                break;

            }

        }

        return $step_;
    }

    function step_done($step){

        if(!isset(self::$onboard_steps[$step])){
            return false;
        }

        if(!isset(self::$onboard_steps[$step]['done_callback'])){
            return false;
        }

        $callback = self::$onboard_steps[$step]['done_callback'];

        return isset(self::$onboard_steps[$step]) &&
            isset(self::$onboard_steps[$step]['done_callback']) &&
            $callback() &&
            isset(self::$onboard_steps[$step]['dependency']) &&
            $this->dependency_done(self::$onboard_steps[$step]['dependency']);
    }

    function dependency_done($steps){
        if(empty($steps)){
            return true;
        }
        $done = true;
        foreach ($steps as $step){
            if(!$this->step_done($step)){
                $done = false;
                break;
            }
        }
        return $done;
    }

    public static function display_get_start_link() {
        add_filter( 'plugin_action_links_' . plugin_basename( UUCSS_PLUGIN_FILE ), function ( $links ) {
            $_links = array(
                '<a href="' . admin_url( 'options-general.php?page=rapidload-onboarding' ) . '">Get Started <span>⚡️</span> </a>',
            );

            return array_merge( $_links, $links );
        } );
    }
}