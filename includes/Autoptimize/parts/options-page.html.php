<script>document.title = "Autoptimize: UnusedCSS " + document.title;</script>

<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
	<?php settings_fields( 'autoptimize_uucss_settings' );

	$api_key_verified = isset( $options['uucss_api_key_verified'] ) && $options['uucss_api_key_verified'] == '1';
	?>
    <div>
        <ul id="uucss-wrapper">
			<?php if ( ! $api_key_verified ) : ?>
                <li class="uucss-intro">
                    <h2>Slash load times and boost PageSpeed scores by loading only CSS you need.</h2>
                    <div class="content">
                        <div class="left-section">
                            <p>
                                <strong>Slow load times</strong> are the <strong>#1</strong> reason for <strong>high
                                    bounce
                                    rates</strong> and one of the root causes of poor <strong>Google Rankings</strong>.
                            </p>
                            <p>
                                Up to 95% of each CSS file in Wordpress themes and plugins is loaded and never used.
                                That translates to anywhere from 1 to 4 additional seconds of load time.
                                <strong>That’s up to 4 additional seconds to load completely unnecessary code!</strong>
                            </p>
                            <p>
                                By analyzing each page and excluding unnecessary CSS, UnusedCSS instantly reduces load
                                times by <strong> up to 50%, boosts Boosts Google PageSpeed scores,</strong> and
                                <strong>improves user
                                    experience.</strong> Best of all, it’s totally automated. No combing through
                                countless files, no matching up styles to elements - just enable UnusedCSS and see the
                                benefits immediately!
                            </p>
                        </div>
                        <div class="right-section">
                            <img src="<?php echo UUCSS_PLUGIN_URL . '/assets/intro.png' ?>" alt="">
                        </div>
                    </div>
                </li>
			<?php endif; ?>
			<?php if ( $api_key_verified ) : ?>
                <li class="uucss-history">
                    <h2>
                        UnusedCSS : Completed URLs
                        <span class="uucss-toggle-section">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content">
                        <table id="uucss-history" width="100%" class="hover"></table>
                    </div>
                </li>


                <li>
                    <h2>
                        UnusedCSS : Advanced Settings
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display:none;">
                        <span id='autoptimize_imgopt_descr'><?php _e( 'Boost your site speed by removing all unwanted CSS files. Get your Google Page Speed Scores Spiked UP !!', 'autoptimize' ); ?></span>
                        <table class="form-table" id="uucss-options">
                            <tr>
                                <th scope="row"><?php _e( 'Global CSS Whitelist', 'autoptimize' ); ?></th>
                                <td>
                                    <div class="uucss-tag tagsdiv" id="uucss_whitelist_classes">
                                        <div class="">
                                            <div class="nojs-tags hide-if-js">
                                                <label for="tax-input-post_tag">Add or remove tags</label>
                                                <p><textarea name="autoptimize_uucss_settings[uucss_whitelist_classes]"
                                                             rows="3" cols="20"
                                                             class="the-tags"
                                                             aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_whitelist_classes'] ) ? '' : $options['uucss_whitelist_classes'] ?></textarea>
                                                </p>
                                            </div>
                                            <div class="ajaxtag hide-if-no-js">
                                                <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                                                <input type="text" class="newtag form-input-tip ui-autocomplete-input"
                                                       size="16"
                                                       autocomplete="off" aria-describedby="new-tag-post_tag-desc" value=""
                                                       role="combobox"
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
                                            <p><strong>Rule (<small>with children</small>) : </strong>
                                                <span><em>c:/red$/</em></span>
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
                                                <p><textarea name="autoptimize_uucss_settings[uucss_excluded_links]"
                                                             rows="3" cols="20"
                                                             class="the-tags"
                                                             aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_excluded_links'] ) ? '' : $options['uucss_excluded_links'] ?></textarea>
                                                </p>
                                            </div>
                                            <div class="ajaxtag hide-if-no-js">
                                                <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                                                <input type="text" class="newtag form-input-tip ui-autocomplete-input"
                                                       size="16"
                                                       autocomplete="off" aria-describedby="new-tag-post_tag-desc" value=""
                                                       role="combobox"
                                                       aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                                                <input type="button" class="button tagadd" value="Add Link">
                                            </div>
                                            <p class="howto">
                                                Whitelisted links example <em> example.com/some-url,
                                                    /another-url/some-url </em>
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
                                                <p><textarea name="autoptimize_uucss_settings[uucss_excluded_files]"
                                                             rows="3" cols="20"
                                                             class="the-tags"
                                                             aria-describedby="new-tag-post_tag-desc"><?php echo empty( $options['uucss_excluded_files'] ) ? '' : $options['uucss_excluded_files'] ?></textarea>
                                                </p>
                                            </div>
                                            <div class="ajaxtag hide-if-no-js">
                                                <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                                                <input type="text" class="newtag form-input-tip ui-autocomplete-input"
                                                       size="16"
                                                       autocomplete="off" aria-describedby="new-tag-post_tag-desc" value=""
                                                       role="combobox"
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
                                            <input id='uucss_analyze_javascript' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_analyze_javascript]' <?php if ( ! empty( $options['uucss_analyze_javascript'] ) && '1' === $options['uucss_analyze_javascript'] ) {
												echo 'checked="checked"';
											} ?> value='1'>
                                            Analyze javascript <em>-- analyze javascript and remove unused css which are not
                                                used in JS (experimental)</em>
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
                            <tr>
                                <th scope="row"><?php _e( 'Inline small CSS files', 'autoptimize' ); ?></th>
                                <td>
                                    <label><input id='uucss_inline_css' type='checkbox'
                                                  name='autoptimize_uucss_settings[uucss_inline_css]' <?php if ( ! empty( $options['uucss_inline_css'] ) && '1' === $options['uucss_inline_css'] ) {
											echo 'checked="checked"';
										} ?> value='1'>
                                        <i>
                                            inline CSS files which are smaller than 15kb after unusedcss are removed
                                        </i>
                                    </label>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><?php _e( 'Whitelist Packs', 'autoptimize' ); ?>

                                </th>
                                <td>

                                    <label>
                                        <select id="whitelist_packs" multiple class="js-example-basic-single"
                                                name="autoptimize_uucss_settings[whitelist_packs][]">
											<?php if ( isset( $options['whitelist_packs'] ) ) {
												foreach ( $options['whitelist_packs'] as $whitelist_pack ) { ?>
                                                    <option selected
                                                            value="<?php echo $whitelist_pack ?>"><?php $name = explode( ':', $whitelist_pack );
														echo end( $name ) ?></option>
												<?php }
											} ?>
                                        </select>
                                        <input id="uucss-pack-suggest" type="button" class="button"
                                               value="Load Recommended Packs">
                                    </label>
                                    <p style="color: red" id="uucss-pack-suggest-error"></p>

                                </td>
                            </tr>

                        </table>
                    </div>
                </li>
			<?php endif; ?>
            <li>

                <h2>
                    UnusedCSS : API
                    <span<?php echo ( $api_key_verified ) ? ' class="valid">Valid' : ' class="invalid">Invalid' ?></span>
                    <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                </h2>
                <div class="content" style="display: <?php echo ( $api_key_verified ) ? 'none' : 'block' ?>">
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
                                    <input type="hidden" name="autoptimize_uucss_settings[uucss_api_key_verified]"
                                           value="<?php if ( isset( $options['uucss_api_key_verified'] ) )
										       echo $options['uucss_api_key_verified'] ?>">
                                    <input id='uucss_api_key' type='text'
                                           name='autoptimize_uucss_settings[uucss_api_key]'
                                           value="<?php echo ( isset( $options['uucss_api_key'] ) ) ? $options['uucss_api_key'] : '' ?>"
                                           size="40">
                                    <em id="verification_status"></em>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
            </li>

            <li class="submit">

                <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary"
                                         value="<?php _e( 'Save & Clear Cache', 'autoptimize' ); ?>"/>

                    <a target="_blank" href="https://unusedcss.io/">
                        <img
                                src="<?php echo UUCSS_PLUGIN_URL . '/assets/logo.svg' ?>" width="130"
                                alt="UnusedCSS.io logo">
                    </a>
                </p>
            </li>
        </ul>
    </div>


</form>


