<style>
    #ao_settings_form {
        background: white;
        border: 1px solid #ccc;
        padding: 1px 15px;
        margin: 15px 10px 10px 0;
    }

    #ao_settings_form .form-table th {
        font-weight: normal;
    }

    #autoptimize_imgopt_descr {
        font-size: 120%;
    }

    .uucss-tag-links .newtag {
        width: 100%;
        max-width: 300px;
    }

    .uucss-tag-links .tagchecklist > li {
        width: 100%;
    }

    .uucss-tag input[type="text"].ui-autocomplete-loading {
        background: none;
    }

    #uucss-options em {
        color: #9E9E9E;
    }

    #uucss-options span {
        display: inline-block;
        margin-bottom: 4px;
    }

    #uucss-options span em {
        background: #F5F5F5;
        color: #3F51B5;
        border: 1px solid #E0E0E0;
        border-radius: 3px;
        padding: 3px 8px;
    }

    #uucss-options em#verification_status {
        margin-left: 10px;
    }

    #uucss-options em#verification_status.success {
        color: green;
    }

    #uucss-options em#verification_status.failed {
        color: red;
    }

</style>
<script>document.title = "Autoptimize: UnusedCSS " + document.title;</script>
<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
	<?php settings_fields( 'autoptimize_uucss_settings' ); ?>
    <h2><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></h2>
    <span id='autoptimize_imgopt_descr'><?php _e( 'Boost your site speed by removing all unwanted CSS files. Get your Google Page Speed Scores Spiked UP !!', 'autoptimize' ); ?></span>
    <table class="form-table" id="uucss-options">
        <tr>
            <th scope="row"><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></th>
            <td>
                <label>
                    <input id='autoptimize_uucss_enabled' type='checkbox'
                           name='autoptimize_uucss_settings[autoptimize_uucss_enabled]' <?php if ( ! empty( $options['autoptimize_uucss_enabled'] ) && '1' === $options['autoptimize_uucss_enabled'] ) {
						echo 'checked="checked"';
					} ?> value='1'>
                </label>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Api Key', 'autoptimize' ); ?></th>
            <td>
                <label>
                    <input id='uucss_api_key' type='text' name='autoptimize_uucss_settings[uucss_api_key]'
                           value="<?php echo ( isset( $options['uucss_api_key'] ) ) ? $options['uucss_api_key'] : '' ?>">
                    <em id="verification_status"></em>
                </label>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Global CSS Whitelist', 'autoptimize' ); ?></th>
            <td>
                <div class="uucss-tag tagsdiv" id="uucss_whitelist_classes">
                    <div class="">
                        <div class="nojs-tags hide-if-js">
                            <label for="tax-input-post_tag">Add or remove tags</label>
                            <p><textarea name="autoptimize_uucss_settings[uucss_whitelist_classes]" rows="3" cols="20"
                                         class="the-tags"
                                         aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_whitelist_classes'] ) ? '' : $options['uucss_whitelist_classes'] ?></textarea>
                            </p>
                        </div>
                        <div class="ajaxtag hide-if-no-js">
                            <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                            <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16"
                                   autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox"
                                   aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                            <input type="button" class="button tagadd" value="Add Class">
                        </div>
                        <p class="howto">
                            Whitelisted Selectors (regex supported)
                        </p>
                    </div>
                    <ul class="tagchecklist" role="list"></ul>
                    <div class="example">
                        <p><strong>Rule : </strong><span><em>red</em></span>
                            <br>
                            <strong>Ignores : </strong><em>#red</em>, <em>.red</em>, <em>red</em>
                        </p>
                        <p><strong>Rule : </strong><span><em>/^orange/</em></span>
                            <br>
                            <strong>Ignores : </strong><em>.orange-large</em>, <em>#orange</em>
                        </p>
                        <p><strong>Rule (<small>with children</small>) : </strong> <span><em>c:/red$/</em></span>
                            <br>
                            <strong>Ignores : </strong><em>red p</em>, <em>.bg-red .child-of-bg</em>
                        </p>
                    </div>
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
                            <p><textarea name="autoptimize_uucss_settings[uucss_excluded_links]" rows="3" cols="20"
                                         class="the-tags"
                                         aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_excluded_links'] ) ? '' : $options['uucss_excluded_links'] ?></textarea>
                            </p>
                        </div>
                        <div class="ajaxtag hide-if-no-js">
                            <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                            <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16"
                                   autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox"
                                   aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                            <input type="button" class="button tagadd" value="Add Link">
                        </div>
                        <p class="howto">
                            Whitelisted links example <em> example.com/some-url, /another-url/some-url </em>
                        </p>
                    </div>
                    <ul class="tagchecklist" role="list"></ul>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Exclude Css files', 'autoptimize' ); ?></th>
            <td>
                <div class="uucss-tag uucss-tag-links tagsdiv" id="uucss_excluded_files">
                    <div class="">
                        <div class="nojs-tags hide-if-js">
                            <label for="tax-input-post_tag">Add or remove tags</label>
                            <p><textarea name="autoptimize_uucss_settings[uucss_excluded_files]" rows="3" cols="20"
                                         class="the-tags"
                                         aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_excluded_files'] ) ? '' : $options['uucss_excluded_files'] ?></textarea>
                            </p>
                        </div>
                        <div class="ajaxtag hide-if-no-js">
                            <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                            <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16"
                                   autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox"
                                   aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                            <input type="button" class="button tagadd" value="Add File">
                        </div>
                        <p class="howto">
                            Whitelisted files example <em> my-styles.css, /my-theme/style.css </em>
                        </p>
                    </div>
                    <ul class="tagchecklist" role="list"></ul>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Other Options', 'autoptimize' ); ?></th>
            <td>

                <p>
                    <label for="uucss_analyze_javascript">
                        <input id='uucss_analyze_javascript' type='checkbox' name='autoptimize_uucss_settings[uucss_analyze_javascript]' <?php if ( ! empty( $options['uucss_analyze_javascript'] ) && '1' === $options['uucss_analyze_javascript'] ) { echo 'checked="checked"'; } ?> value='1'>
                        Analyze javascript <em>-- analyze javascript and remove unused css which are not used in JS (experimental)</em>
                    </label>
                </p>

                <p>
                    <label for="uucss_minify">
                        <input id='uucss_minify'
                               type='checkbox'
                               name='autoptimize_uucss_settings[uucss_minify]'
							<?php
							if ( ! empty( $options['uucss_minify'] ) && '1' === $options['uucss_minify'] ) {
								echo 'checked="checked"';
							}
							?> value='1'>
                        Disable Minify <em>-- minify and remove css comments via the api</em>
                    </label>
                </p>

                <p>
                    <label for="uucss_variables">
                        <input id='uucss_variables' type='checkbox'
                               name='autoptimize_uucss_settings[uucss_variables]' <?php if ( ! empty( $options['uucss_variables'] ) && '1' === $options['uucss_variables'] ) {
							echo 'checked="checked"';
						} ?> value='1'>
                        Disable Variables <em>-- remove unused css variables</em>
                    </label>
                </p>

                <p>
                    <label for="uucss_keyframes">
                        <input id='uucss_keyframes' type='checkbox'
                               name='autoptimize_uucss_settings[uucss_keyframes]' <?php if ( ! empty( $options['uucss_keyframes'] ) && '1' === $options['uucss_keyframes'] ) {
							echo 'checked="checked"';
						} ?> value='1'>
                        Disable Keyframes <em>-- remove unused keyframe animations</em>
                    </label>
                </p>

                <p>
                    <label for="uucss_fontface">
                        <input id='uucss_fontface' type='checkbox'
                               name='autoptimize_uucss_settings[uucss_fontface]' <?php if ( ! empty( $options['uucss_fontface'] ) && '1' === $options['uucss_fontface'] ) {
							echo 'checked="checked"';
						} ?> value='1'>
                        Disable Fontface <em>-- remove unused @font-face rules</em>
                    </label>
                </p>


            </td>
        </tr>
        <tr>
            <th scope="row"><?php _e( 'Include all CSS files', 'autoptimize' ); ?></th>
            <td>
                <label><input id='autoptimize_uucss_include_all_files' type='checkbox'
                              name='autoptimize_uucss_settings[autoptimize_uucss_include_all_files]' <?php if ( ! empty( $options['autoptimize_uucss_include_all_files'] ) && '1' === $options['autoptimize_uucss_include_all_files'] ) {
						echo 'checked="checked"';
					} ?> value='1'>
                    <i>
                        Include css files which are excluded by autoptimize as well (experimental)
                    </i>
                </label>
            </td>
        </tr>
        <script>
            (function ($) {

                $(document).ready(function () {
                    window.tagBox.init();


                    var $status = $('#verification_status')
                    var $input = $('#uucss_api_key')

                    function verifyApiKey() {

                        if ($input.val().length === 0) {
                            $status.removeClass().text('please fill your api key here !');
                            return;
                        }


                        $status.text('loading...');

                        wp.ajax.post('verify_api_key', {api_key: $input.val()}).done(function () {

                            $status.text('verified !').removeClass().addClass('success')

                        }).fail(function () {

                            $status.text('failed !').removeClass().addClass('failed')

                        });

                    }

                    verifyApiKey()
                    $input.on('input', verifyApiKey )

                })

            })(jQuery)
        </script>
    </table>
    <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary"
                             value="<?php _e( 'Save & Clear Cache', 'autoptimize' ); ?>"/></p>
</form>