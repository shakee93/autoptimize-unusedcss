<?php


class UnusedCSS_Feedback {

	function __construct() {

		global $pagenow;

		if($pagenow != 'plugins.php'){

			return;

		}

		add_action('admin_enqueue_scripts', [$this, 'enqueue_feedback_scripts']);

		add_action('admin_footer', [$this, 'render_feedback_model']);

	}

	function enqueue_feedback_scripts(){

		wp_enqueue_script( 'uucss_feedback', UUCSS_PLUGIN_URL . 'assets/js/utils/uucss_feedback.js?v=1.0', array(
			'jquery'
		) );

		wp_enqueue_style('uucss_feedback', UUCSS_PLUGIN_URL . 'assets/css/utils/uucss_feedback.css?v=1.0');
	}

	function render_feedback_model(){

		include_once 'parts/feedback-model.php';

	}

}