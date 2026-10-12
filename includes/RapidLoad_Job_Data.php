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
     * until the backoff has elapsed) while retries are left, otherwise marks
     * it as failed with $error.
     *
     * The cap applies to consecutive failures (see consecutive_retries()), not
     * to the lifetime attempts counter: attempts also grows with page-view
     * requeues and is never reset by a success, so capping on it would fail a
     * long-lived URL on its first transient error.
     *
     * The backoff is stored as a future created_at; the queue only picks up
     * rows with attempts > 0 once created_at <= now (see the *_DB
     * get_current_queued_tasks_job_ids methods).
     *
     * @return bool true when requeued, false when marked as failed
     */
    public function retry_or_fail($error){

        $retries = $this->consecutive_retries() + 1;

        if($retries >= self::max_attempts()){
            $this->forget_retries();
            $this->mark_as_failed($error);
            $this->attempts = (int) $this->attempts + 1;
            return false;
        }

        $this->requeue_delayed($retries);
        $this->remember_retries($retries);

        return true;
    }

    /**
     * Requeue that keeps counting attempts and waits for the exponential
     * backoff before the queue may pick the row up again. Use for automatic
     * (page view / retry) requeues. Explicit user or content-change requeues
     * should call requeue(0) instead, which resets attempts and is eligible
     * immediately.
     *
     * @param int|null $step backoff step; defaults to the new attempts count
     */
    public function requeue_delayed($step = null){
        $attempts = (int) $this->attempts + 1;
        $this->requeue($attempts);
        $this->created_at = gmdate( "Y-m-d H:i:s", time() + self::retry_delay(isset($step) ? $step : $attempts) );
    }

    /**
     * Requeue that waits $seconds without counting as a failed retry (e.g. the
     * API asked us to come back later with 429 + Retry-After). attempts still
     * grows so the queue honours the future created_at.
     */
    public function defer($seconds){
        $this->requeue((int) $this->attempts + 1);
        $this->created_at = gmdate( "Y-m-d H:i:s", time() + max(60, (int) $seconds) );
    }

    /**
     * Handles a failed submit (s/criticalcss, s/unusedcss):
     * - 429 with Retry-After: deferred until the API window resets, not counted as a retry
     * - timeouts / transport errors / 5xx / other 429: retried with backoff (retry_or_fail)
     * - definitive API errors (auth, validation): failed at once
     *
     * @return bool true when the job stays queued, false when marked as failed
     */
    public function handle_submit_error($result, $error, $retry_after = 0){

        $retry_after = (int) $retry_after;

        if(isset($error['code']) && (int) $error['code'] === 429 && $retry_after > 0){
            $this->defer(min($retry_after, DAY_IN_SECONDS));
            return true;
        }

        if(self::is_transient_error($result, $error)){
            return $this->retry_or_fail($error);
        }

        $this->mark_as_failed($error);

        return false;
    }

    /**
     * Number of consecutive failed retries in the current failure episode.
     *
     * Kept in a transient (no schema change) together with the attempts value
     * it was recorded at. Any other change to attempts in between (explicit
     * reset, page-view requeue, deferral) or a success ends the episode.
     * If the transient is lost (object cache eviction) the count restarts; the
     * backoff still grows with attempts, so this stays bounded.
     */
    public function consecutive_retries(){

        if(!isset($this->id)){
            return 0;
        }

        $value = get_transient($this->retries_key());

        if(!is_string($value) || strpos($value, ':') === false){
            return 0;
        }

        list($at_attempts, $retries) = explode(':', $value, 2);

        return (int) $at_attempts === (int) $this->attempts ? (int) $retries : 0;
    }

    private function remember_retries($retries){
        if(isset($this->id)){
            set_transient($this->retries_key(), (int) $this->attempts . ':' . (int) $retries, DAY_IN_SECONDS);
        }
    }

    private function forget_retries(){
        if(isset($this->id)){
            delete_transient($this->retries_key());
        }
    }

    private function retries_key(){
        return 'rapidload_job_retries_' . (int) $this->id;
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
     * @param bool $any_status claim from any status except 'submitting'; for
     *                         explicit submits (titan) that may run on a row
     *                         that is not 'queued' (e.g. the second strategy
     *                         after the immediate one succeeded or failed)
     * @return bool true when this process won the claim
     */
    public function claim($any_status = false){

        if(!isset($this->id)){
            return true;
        }

        global $wpdb;

        $now = gmdate( "Y-m-d H:i:s", time() );

        $status_sql = $any_status ? "status <> 'submitting'" : "status = 'queued'";

        $affected = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'submitting', created_at = %s WHERE id = %d AND $status_sql", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- fixed fragment
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
                "SELECT job_id FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'submitting' AND job_type = %s AND created_at <= %s ORDER BY created_at ASC LIMIT 50",
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
                // orphaned row (job deleted): drop it, like the queue fetchers do,
                // so it cannot be selected again on every tick
                $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = %s AND job_id = %d",
                        $job_type,
                        $row->job_id
                    )
                );
                continue;
            }

            $job_data = new RapidLoad_Job_Data($job, $job_type);

            // re-check on the loaded object in case another run already recovered it
            if($job_data->status !== 'submitting'){
                continue;
            }

            $requeued = $job_data->retry_or_fail([
                'code' => 524,
                'message' => 'Request was interrupted before the API responded'
            ]);
            $job_data->save();

            if(!$requeued){
                do_action( 'uucss/cache_cleared', [
                    'url' => $job->url
                ]);
            }
        }
    }

    /**
     * Minimum seconds between save_post-driven requeues of the same URL
     * (default 60 minutes, filter rapidload/job/save_post_min_interval, in minutes).
     * Keeps content-change submissions at <= 24/URL/day, within the API's
     * per-URL daily limit. A change inside the interval is not dropped: it is
     * replayed by a deferred requeue (see schedule_deferred_requeue()).
     */
    public static function save_post_min_interval(){
        $minutes = (int) apply_filters('rapidload/job/save_post_min_interval', 60);
        return max(0, $minutes) * 60;
    }

    const DEFERRED_REQUEUE_HOOK = 'rapidload/job/deferred_requeue';

    /**
     * Schedules one clear_cache replay for this URL once the throttle interval
     * (counted from the last requeue / claim) has passed, or shortly after an
     * in-flight submit. At most one event per job and type is pending, so a
     * save storm still produces a single requeue that includes the latest
     * content. Handled by RapidLoad_CriticalCSS / RapidLoad_UnusedCSS.
     */
    public function schedule_deferred_requeue(){

        $args = [ $this->job_type, (int) $this->job_id ];

        if(wp_next_scheduled(self::DEFERRED_REQUEUE_HOOK, $args)){
            return;
        }

        $at = time() + 60;

        if(!empty($this->created_at)){
            $at = max($at, strtotime($this->created_at) + self::save_post_min_interval());
        }

        wp_schedule_single_event($at, self::DEFERRED_REQUEUE_HOOK, $args);
    }

    /**
     * True when the row was (re)queued or claimed less than $seconds ago.
     * created_at is refreshed by requeue() and claim(); a future value
     * (backoff pending) also counts as recent.
     */
    public function queued_within($seconds){
        if($seconds <= 0 || empty($this->created_at)){
            return false;
        }
        return (time() - strtotime($this->created_at)) < $seconds;
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
        $this->forget_retries();
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