<?php

class UnusedCSS_Queue extends WP_Background_Process {

	protected $action = 'florianbrinkmann_background_processx';

	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over
	 *
	 * @return mixed
	 */
	protected function task( $item ) {
		error_log( json_encode($_POST) );
	//s	error_log( json_encode($item) );

				// error_log('fetching started :' . json_encode($_POST));
        // //error_log($url);
        // $css = (new UnusedCSS_Api())->get($_POST['url']);

        // error_log($css);

		return false;
	}

	/**
	 * Complete
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		parent::complete();

		error_log('done');
	}
}