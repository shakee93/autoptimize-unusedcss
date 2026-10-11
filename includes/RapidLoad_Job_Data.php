<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Job_Data{

    use RapidLoad_Utils;

    public $id;
    public $job_id;
    public $job_type;
    public $queue_job_id;
    public $data;
    public $stats;
    public $warnings;
    public $error;
    public $attempts;
    public $hits;
    public $status;
    public $created_at;

    public $job;

    public function __construct($job, $type)
    {
        $this->job = $job;
        $this->job_type = $type;

        $this->job_id = isset($this->job->parent) && $this->job->parent ? $this->job->parent->id : $this->job->id;

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->queue_job_id = $exist->queue_job_id;
            $this->data = $exist->data;
            $this->stats = $exist->stats;
            $this->warnings = $exist->warnings;
            $this->error = $exist->error;
            $this->attempts = $exist->attempts;
            $this->hits = $exist->hits;
            $this->status = $exist->status;
            $this->created_at = $exist->created_at;

        }else{

            $this->attempts = 0;
            $this->hits = 0;
            $this->status = 'queued';
            $this->created_at = gmdate( "Y-m-d H:i:s", time() );

        }

    }

    public function save($exclude = []){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);
        unset($data['job']);

        foreach ($exclude as $value){
            if(isset($data[$value])){
                unset($data[$value]);
            }
        }

        if(isset($this->id)){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_job_data',
                $data,
                [
                    'id' => $this->id
                ]
            );

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_job_data',
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

            }

        }

    }

    public function exist(){

        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = %s AND job_id = %d ORDER BY id LIMIT 1",
                $this->job_type,
                $this->job_id
            ),
            OBJECT
        );

    }

    public function requeue($attempts = -1){
        $this->status = 'queued';
        $this->queue_job_id = null;
        $this->attempts = $attempts >= 0 ? $attempts : $this->attempts + 1;
        $this->hits = 0;
        $this->stats = null;
        $this->warnings = null;
        $this->error = null;
        $this->created_at = gmdate( "Y-m-d H:i:s", time() );
        $this->clearFiles();
    }

    /**
     * Maximum number of API attempts for one job before it is marked as failed.
     * Override with the RAPIDLOAD_JOB_MAX_ATTEMPTS constant or the
     * 'rapidload/job/max_attempts' filter.
     */
    public static function max_attempts(){
        $max = defined('RAPIDLOAD_JOB_MAX_ATTEMPTS') ? (int) RAPIDLOAD_JOB_MAX_ATTEMPTS : 3;
        $max = (int) apply_filters('rapidload/job/max_attempts', $max);
        return $max > 0 ? $max : 1;
    }

    /**
     * Exponential backoff (seconds) before a failed attempt may be retried:
     * 120s, 240s, 480s ... capped at one hour.
     */
    public static function retry_delay($attempts){
        $attempts = max(1, min((int) $attempts, 10));
        $delay = (int) apply_filters('rapidload/job/retry_base_delay', 120) * pow(2, $attempts - 1);
        return min($delay, 3600);
    }

    /**
     * Counts one failed attempt. Requeues the job (not eligible for the queue
     * until the backoff has elapsed) while attempts are left, otherwise marks
     * it as failed with $error.
     *
     * The backoff is stored as a future created_at; the queue only picks up
     * rows with attempts > 0 once created_at <= now (see the *_DB
     * get_current_queued_tasks_job_ids methods).
     *
     * @return bool true when requeued, false when marked as failed
     */
    public function retry_or_fail($error){

        $attempts = (int) $this->attempts + 1;

        if($attempts >= self::max_attempts()){
            $this->mark_as_failed($error);
            $this->attempts = $attempts;
            return false;
        }

        $this->requeue_delayed();

        return true;
    }

    /**
     * Requeue that keeps counting attempts and waits for the exponential
     * backoff before the queue may pick the row up again. Use for automatic
     * (page view / retry) requeues. Explicit user or content-change requeues
     * should call requeue(0) instead, which resets attempts and is eligible
     * immediately.
     */
    public function requeue_delayed(){
        $attempts = (int) $this->attempts + 1;
        $this->requeue($attempts);
        $this->created_at = gmdate( "Y-m-d H:i:s", time() + self::retry_delay($attempts) );
    }

    /**
     * True for failures worth retrying (timeouts, transport errors, 5xx, 429);
     * false for definitive API errors (auth, validation) which fail at once.
     */
    public static function is_transient_error($result, $error){

        if(!isset($result) || is_string($result)){
            return true;
        }

        $code = isset($error['code']) ? (int) $error['code'] : 0;

        return $code >= 500 || $code === 429;
    }

    /**
     * Status exposed to the admin UI: the internal 'submitting' claim state is
     * shown as 'waiting'.
     */
    public static function display_status($status){
        return $status === 'submitting' ? 'waiting' : $status;
    }

    /**
     * Seconds after which a claimed ('submitting') row is considered abandoned.
     * Longer than the 360s API request timeout.
     */
    const CLAIM_TIMEOUT = 600;

    /**
     * Atomically moves this row out of 'queued' so only one queue run submits it.
     * created_at is set to now and doubles as the claim time.
     *
     * @return bool true when this process won the claim
     */
    public function claim(){

        if(!isset($this->id)){
            return true;
        }

        global $wpdb;

        $now = gmdate( "Y-m-d H:i:s", time() );

        $affected = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'submitting', created_at = %s WHERE id = %d AND status = 'queued'",
                $now,
                $this->id
            )
        );

        if($affected === 1){
            $this->status = 'submitting';
            $this->created_at = $now;
            return true;
        }

        return false;
    }

    /**
     * Recovers rows claimed by a run that died (fatal, timeout, killed) before
     * the API answered. After CLAIM_TIMEOUT the claim counts as a failed attempt:
     * the row returns to 'queued' (with the usual backoff) or, once the attempt
     * cap is reached, is marked failed. A row can therefore never stay in
     * 'submitting' forever, and a request that crashes PHP cannot loop forever.
     */
    public static function release_stale_claims($job_type){

        global $wpdb;

        $cutoff = gmdate( "Y-m-d H:i:s", time() - self::CLAIM_TIMEOUT );

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT job_id FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'submitting' AND job_type = %s AND created_at <= %s LIMIT 50",
                $job_type,
                $cutoff
            )
        );

        if(empty($rows)){
            return;
        }

        foreach ($rows as $row){

            $job = RapidLoad_Job::find_or_fail($row->job_id);

            if(!$job){
                continue;
            }

            $job_data = new RapidLoad_Job_Data($job, $job_type);

            // re-check on the loaded object in case another run already recovered it
            if($job_data->status !== 'submitting'){
                continue;
            }

            $job_data->retry_or_fail([
                'code' => 524,
                'message' => 'Request was interrupted before the API responded'
            ]);
            $job_data->save();
        }
    }

    public function clearFiles(){

    }

    public function mark_as_failed($error){
        $this->data = null;
        $this->status = 'failed';
        $this->error = serialize($error);
        $this->hits = 0;
        $this->clearFiles();
    }

    public function mark_as_success($data, $stats, $warnings, $status = 'success', $job_type = 'uucss'){
        $this->data = isset($data) ? is_string($data) ? $data : serialize($data) : null;
        if($job_type === 'uucss'){
            $this->status = $status;
        }else{
            $this->status = isset($data) && (isset($data['mobile']) && !empty($data['mobile']) || isset($data['desktop']) && !empty($data['desktop'])) ? 'success' : 'failed';
        }
        $this->hits = 0;
        $this->stats = isset($stats) ? serialize($stats) : null;
        $this->warnings = isset($warnings) && count($warnings) > 0 ? $warnings : null;
        $this->error = null;
    }

    public function mark_as_successful_hit(){
        $this->hits++;
        $this->error = NULL;
    }

    public function get_warnings(){
        if(isset($this->warnings) && !empty($this->warnings)){
            return unserialize($this->warnings);
        }
        return [];
    }

    public function get_files(){
        if(isset($this->data) && !empty($this->data)){
            return unserialize($this->data);
        }
        return [];
    }

    public function get_cpcss_data(){
        return self::transform_cpcss_data_to_array($this->data);
    }

    public static function transform_cpcss_data_to_array($input) {
        if (is_string($input) && is_serialized($input)) {
            $array = unserialize($input);
        } elseif (is_string($input)) {
            $array = [
                'desktop' => $input,
                'mobile' => str_replace(".css","-mobile.css",$input)
            ];
        } else {
            $array = [];
        }
        return $array;
    }

    public function get_stats(){
        if(isset($this->stats) && !empty($this->stats)){
            return unserialize($this->stats);
        }
        return null;
    }

    public function get_error(){
        if(isset($this->error) && !empty($this->error)){
            return unserialize($this->error);
        }
        return null;
    }

    public static function find_or_fail($id, $job_type){
        global $wpdb;
        $job_data = false;

        $exist = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT job_id FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = %s AND id = %s ORDER BY id LIMIT 1",
                $job_type,
                $id
            ),
            OBJECT
        );

        if($exist){
            $job = RapidLoad_Job::find_or_fail($exist->job_id);
            $job_data = new RapidLoad_Job_Data($job, $job_type);
        }

        return $job_data;
    }

    public function set_warnings($warnings){
        if(isset($warnings) && count($warnings) > 0){
            $this->hits = 0;
            $this->warnings = serialize($warnings);
        }else{
            $this->warnings = null;
        }
    }
}