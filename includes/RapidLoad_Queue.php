<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Queue
{
    use RapidLoad_Utils;

    public static $interval = 600;
    public static $job_count = 4;
    public static $post_types = [];

    function __construct()
    {
        $this->init();
    }

    function init(){

        global $rapidload;

        $options = RapidLoad_Base::fetch_options();

        if(isset($options['uucss_queue_interval'])){
            self::$interval = (int) $options['uucss_queue_interval'];
        }else{
            self::$interval = 60;
        }

        if(isset($options['uucss_jobs_per_queue'])){
            self::$job_count = defined('RAPIDLOAD_JOB_COUNT_PER_QUEUE') ? RAPIDLOAD_JOB_COUNT_PER_QUEUE : (int) $options['uucss_jobs_per_queue'];

            if(self::$job_count > 8){
                self::$job_count = self::$job_count / count($rapidload->modules()->active_modules());
            }
        }else{
            self::$job_count = 1;
        }

        //add_action('uucss_cron_queue', [$this, 'cache'], 2 , 1);

        add_filter( 'cron_schedules', [$this, 'uucss_process_queue_schedule'] );

        $uucss_cron = $this->cron_exist();

        if ( ! wp_next_scheduled( 'cron_uucss_process_queue' ) && !$uucss_cron) {
            wp_schedule_event( time(), 'uucss_cron_interval', 'cron_uucss_process_queue');
        }

        add_action( 'cron_uucss_process_queue', [$this ,'uucss_process_queue'] );

        self::$post_types = apply_filters('uucss/queue/post_types',array(
            'post',
            'page',
            'product',
        ));

        register_deactivation_hook( RAPIDLOAD_PLUGIN_FILE, [ $this, 'unschedule_cron' ] );
    }

    function unschedule_cron(){

        $timestamp = wp_next_scheduled( 'cron_uucss_process_queue' );
        if(isset($timestamp)){
            wp_unschedule_event( $timestamp, 'cron_uucss_process_queue' );
        }

    }

    function cron_exist($cron_name = 'cron_uucss_process_queue'){

        $cron_array = _get_cron_array();

        if(!isset($cron_array) || empty($cron_array)){
            return false;
        }

        $uucss_cron = array_column($cron_array, $cron_name);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        $uucss_cron = array_shift($uucss_cron);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        $uucss_cron = array_shift($uucss_cron);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        return $uucss_cron;
    }

    static function get_post_types(){
        return self::$post_types;
    }

    function uucss_process_queue(){

        self::run_task();

    }

    const LOCK_OPTION = 'rapidload_queue_lock';

    /**
     * Seconds without a refresh after which a lock is considered abandoned
     * (crashed run). A live run refreshes the lock before every job (touch_lock)
     * and each job is bounded by the 360s API timeout, so a legitimate run
     * never goes this long without a refresh. Rows claimed by a dead run are
     * recovered separately by RapidLoad_Job_Data::release_stale_claims.
     */
    const LOCK_TTL = 600;

    private static $lock_token = null;

    /**
     * Runs the queue task unless another run (WP-Cron or the system cron script)
     * holds the lock. Shared by both entry points.
     *
     * @return bool false when skipped because another run is active
     */
    public static function run_task(){

        if(!self::acquire_lock()){
            return false;
        }

        // also released on fatals / Errors / exit(); a no-op once released
        register_shutdown_function([__CLASS__, 'release_lock']);

        do_action('uucss/queue/task');

        self::release_lock();

        return true;
    }

    /**
     * Lock value is "<token>|<unix time>". INSERT IGNORE on the unique
     * option_name succeeds for exactly one caller. An expired lock is taken over
     * with a DELETE conditional on the exact stale value, so two callers cannot
     * both steal it, and only the holder's token can refresh or release it.
     */
    public static function acquire_lock(){

        global $wpdb;

        $token = uniqid('', true);

        for ($i = 0; $i < 2; $i++) {

            $locked = $wpdb->query(
                $wpdb->prepare(
                    "INSERT IGNORE INTO `$wpdb->options` (`option_name`, `option_value`, `autoload`) VALUES (%s, %s, 'no')",
                    self::LOCK_OPTION,
                    $token . '|' . time()
                )
            );

            if($locked){
                self::$lock_token = $token;
                return true;
            }

            $current = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT option_value FROM `$wpdb->options` WHERE option_name = %s",
                    self::LOCK_OPTION
                )
            );

            if($current !== null){

                $parts = explode('|', $current);
                $since = isset($parts[1]) ? (int) $parts[1] : 0;

                if((time() - $since) < self::LOCK_TTL){
                    return false;
                }

                $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM `$wpdb->options` WHERE option_name = %s AND option_value = %s",
                        self::LOCK_OPTION,
                        $current
                    )
                );
            }
        }

        return false;
    }

    /**
     * Refresh the lock timestamp; call between long jobs.
     */
    public static function touch_lock(){

        if(self::$lock_token === null){
            return;
        }

        global $wpdb;

        $wpdb->query(
            $wpdb->prepare(
                "UPDATE `$wpdb->options` SET option_value = %s WHERE option_name = %s AND option_value LIKE %s",
                self::$lock_token . '|' . time(),
                self::LOCK_OPTION,
                $wpdb->esc_like(self::$lock_token . '|') . '%'
            )
        );
    }

    /**
     * Releases only the lock this process holds.
     */
    public static function release_lock(){

        if(self::$lock_token === null){
            return;
        }

        global $wpdb;

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM `$wpdb->options` WHERE option_name = %s AND option_value LIKE %s",
                self::LOCK_OPTION,
                $wpdb->esc_like(self::$lock_token . '|') . '%'
            )
        );

        self::$lock_token = null;
    }

    function uucss_process_queue_schedule($schedules){
        $schedules['uucss_cron_interval'] = array(
            'interval' => self::$interval,
            'display'  => __( 'uucss cron interval', 'unusedcss' ),
        );
        return $schedules;
    }
}
