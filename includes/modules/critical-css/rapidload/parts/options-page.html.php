<table class="form-table" id="cpcss-options">
    <tr>
        <th scope="row"><?php _e( 'Enable Critical CSS', 'uucss' ); ?></th>
        <td>
            <label><input id='cpcss_load_original' type='checkbox'
                          name='autoptimize_uucss_settings[cpcss_enable_critical_css]' <?php if ( ! empty( $options['cpcss_enable_critical_css'] ) && '1' === $options['cpcss_enable_critical_css'] ) {
                    echo 'checked="checked"';
                } ?> value='1'>
                <i>
                    Inject Critical CSS.
                </i>
            </label>
        </td>
    </tr>
</table>