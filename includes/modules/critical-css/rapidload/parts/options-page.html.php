<table class="form-table" id="rccss-options">
    <tr>
        <th scope="row"><?php _e( 'Enable Critical CSS', 'uucss' ); ?></th>
        <td>
            <label><input id='rccss_load_original' type='checkbox'
                          name='autoptimize_uucss_settings[rccss_enable_critical_css]' <?php if ( ! empty( $options['rccss_enable_critical_css'] ) && '1' === $options['rccss_enable_critical_css'] ) {
                    echo 'checked="checked"';
                } ?> value='1'>
                <i>
                    Inject Critical CSS.
                </i>
            </label>
        </td>
    </tr>
</table>