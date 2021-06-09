<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Buffer
{

    public function __construct()
    {
        add_action('template_redirect', [$this, 'maybe_init_process']);
    }

    public function maybe_init_process() {
        ob_start( [ $this, 'maybe_process_buffer' ] );
    }

    public function maybe_process_buffer( $buffer ) {

        do_action( 'uucss_before_maybe_process_buffer', $buffer );

        if ( ! $this->is_html( $buffer ) ) {
            return $buffer;
        }

        //error_log((string)$buffer);
        return (string) apply_filters( 'rapidload_buffer', $buffer );
    }

    protected function is_html( $buffer ) {
        return preg_match( '/<\/html>/i', $buffer );
    }
}