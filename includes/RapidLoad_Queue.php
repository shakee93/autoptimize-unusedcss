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
     * A crashed run leaves its lock behind; it is considered dead after this
     * many seconds (the claim of any row it held is recovered separately by
     * RapidLoad_Job_Data::release_stale_claims).
     */
    const LOCK_TTL = 600;

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

        try{
            do_action('uucss/queue/task');
        }catch (Exception $e){
            self::release_lock();
            throw $e;
        }

        self::release_lock();

        return true;
    }

    /**
     * Atomic lock: INSERT IGNORE on the unique option_name succeeds for exactly
     * one caller. An expired lock (crashed run) is taken over with a conditional
     * DELETE so two callers cannot both steal it.
     */
    public static function acquire_lock(){

        global $wpdb;

        for ($i = 0; $i < 2; $i++) {

            $locked = $wpdb->query(
                $wpdb->prepare(
                    "INSERT IGNORE INTO `$wpdb->options` (`option_name`, `option_value`, `autoload`) VALUES (%s, %s, 'no')",
                    self::LOCK_OPTION,
                    (string) time()
                )
            );

            if($locked){
                return true;
            }

            $current = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT option_value FROM `$wpdb->options` WHERE option_name = %s",
                    self::LOCK_OPTION
                )
            );

            if($current !== null && (time() - (int) $current) < self::LOCK_TTL){
                return false;
            }

            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM `$wpdb->options` WHERE option_name = %s AND option_value = %s",
                    self::LOCK_OPTION,
                    (string) $current
                )
            );
        }

        return false;
    }

    public static function release_lock(){

        global $wpdb;

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM `$wpdb->options` WHERE option_name = %s",
                self::LOCK_OPTION
            )
        );
    }

    function uucss_process_queue_schedule($schedules){
        $schedules['uucss_cron_interval'] = array(
            'interval' => self::$interval,
            'display'  => __( 'uucss cron interval', 'unusedcss' ),
        );
        return $schedules;
    }
}
