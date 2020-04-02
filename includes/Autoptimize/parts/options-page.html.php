<style>
    #ao_settings_form {background: white;border: 1px solid #ccc;padding: 1px 15px;margin: 15px 10px 10px 0;}
    #ao_settings_form .form-table th {font-weight: normal;}
    #autoptimize_imgopt_descr{font-size: 120%;}
</style>
<script>document.title = "Autoptimize: UnusedCSS " + document.title;</script>
<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
    <?php settings_fields( 'autoptimize_uucss_settings' ); ?>
    <h2><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></h2>
    <span id='autoptimize_imgopt_descr'><?php _e( 'Boost your site speed by removing all unwanted CSS files. Get your Google Page Speed Scores Spiked UP !!', 'autoptimize' ); ?></span>
    <table class="form-table">
        <tr>
            <th scope="row"><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></th>
            <td>
                <label><input id='autoptimize_uucss_enabled' type='checkbox' name='autoptimize_uucss_settings[autoptimize_uucss_enabled]' <?php if ( ! empty( $options['autoptimize_uucss_enabled'] ) && '1' === $options['autoptimize_uucss_enabled'] ) { echo 'checked="checked"'; } ?> value='1'></label>
            </td>
        </tr>
    </table>
    <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'autoptimize' ); ?>" /></p>
</form>