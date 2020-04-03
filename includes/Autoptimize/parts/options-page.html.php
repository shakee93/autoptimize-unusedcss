<style>
    #ao_settings_form {background: white;border: 1px solid #ccc;padding: 1px 15px;margin: 15px 10px 10px 0;}
    #ao_settings_form .form-table th {font-weight: normal;}
    #autoptimize_imgopt_descr{font-size: 120%;}

    .uucss-tag-links .newtag {
        width: calc(60% - 100px);
        min-width: 180px;
    }

    .uucss-tag-links .tagchecklist>li {
        width: 100%;
    }

    .uucss-tag input[type="text"].ui-autocomplete-loading {
        background: none;
    }


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
        <tr>
            <th scope="row"><?php _e( 'Global CSS Whitelist', 'autoptimize' ); ?></th>
            <td>
                <div class="uucss-tag tagsdiv" id="uucss_whitelist_classes">
                    <div class="">
                        <div class="nojs-tags hide-if-js">
                            <label for="tax-input-post_tag">Add or remove tags</label>
                            <p><textarea name="autoptimize_uucss_settings[uucss_whitelist_classes]" rows="3" cols="20" class="the-tags" aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_whitelist_classes'] ) ? '' : $options['uucss_whitelist_classes'] ?></textarea></p>
                        </div>
                        <div class="ajaxtag hide-if-no-js">
                            <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                            <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16" autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                            <input type="button" class="button tagadd" value="Add Class">
                        </div>
                        <p class="howto" >
                            Whitelisted Classes (regex supported)
                        </p>
                    </div>
                    <ul class="tagchecklist" role="list"></ul>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Exclude Links', 'autoptimize' ); ?></th>
            <td>
                <div class="uucss-tag uucss-tag-links tagsdiv" id="uucss_excluded_links">
                    <div class="">
                        <div class="nojs-tags hide-if-js">
                            <label for="tax-input-post_tag">Add or remove tags</label>
                            <p><textarea name="autoptimize_uucss_settings[uucss_excluded_links]" rows="3" cols="20" class="the-tags" aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_excluded_links'] ) ? '' : $options['uucss_excluded_links'] ?></textarea></p>
                        </div>
                        <div class="ajaxtag hide-if-no-js">
                            <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                            <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16" autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                            <input type="button" class="button tagadd" value="Add Link">
                        </div>
                        <p class="howto" >
                            Whitelisted Links (regex supported)
                        </p>
                    </div>
                    <ul class="tagchecklist" role="list"></ul>
                </div>
            </td>
        </tr>


        <script>
            jQuery(document).ready(function () {

                window.tagBox.init();

            })
        </script>
    </table>
    <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'autoptimize' ); ?>" /></p>
</form>