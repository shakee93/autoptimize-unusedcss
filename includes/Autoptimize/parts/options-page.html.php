<?php defined( 'ABSPATH' ) or die(); ?>

<script>document.title = "Autoptimize: UnusedCSS " + document.title;</script>

<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
	<?php settings_fields( 'autoptimize_uucss_settings' );

	$api_key_verified = isset( $options['uucss_api_key_verified'] ) && $options['uucss_api_key_verified'] == '1';

	?>
    <div>
        <ul id="uucss-wrapper">
			<?php if ( ! $api_key_verified ) : ?>
                <li class="uucss-intro">
					<?php include_once 'intro.html.php' ?>
                </li>
			<?php endif; ?>
			<?php if ( $api_key_verified) : ?>
                <li class="uucss-history">
                    <h2>
                        Job Queue
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
                        Advanced Settings
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display:block;">
                        <table class="form-table" id="uucss-options">
                            <tr>
                                <th scope="row"><?php _e( 'Sitewide Safelist', 'autoptimize' ); ?>
                                    <span class="dashicons dashicons-info-outline css-whitelist has-tooltip"
                                          data-message="Whitelisted Selectors (regex supported)">
                                    </span>
                                </th>
                                <td class="safelist-wrapper">
                                    <textarea hidden id="uucss_safelist"
                                              name="autoptimize_uucss_settings[uucss_safelist]"><?php echo empty( $options['uucss_safelist'] ) ? '' : $options['uucss_safelist'] ?></textarea>
                                    <div class="safelist-add">
                                        <select name="" id="safelist-type">
                                            <option value="single">Single</option>
                                            <option value="deep">Deep</option>
                                            <option selected value="greedy">Greedy</option>
                                        </select>
                                        <input id="safelist-add" type="text" size="27"
                                               autocomplete="off">
                                        <button class="button">Add Rule</button>
                                    </div>
                                    <div class="safelist-list">
                                        <ul></ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Exclude URLs', 'autoptimize' ); ?>
                                    <span class="dashicons dashicons-info-outline exclude-links has-tooltip" data-message="Whitelisted links example example.com/some-url, /another-url/some-url">

                                    </span></th>
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
                                <th scope="row"><?php _e( 'Exclude Css files', 'autoptimize' ); ?>
                                    <span class="dashicons dashicons-info-outline exclude-css-files has-tooltip" data-message="Whitelisted files example my-styles.css, /my-theme/style.css">

                                    </span></th>
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
                                        <label for="uucss_minify">
                                            <input id='uucss_minify'
                                                   type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_minify]'
						                        <?php if ( isset( $options['uucss_minify'] ) )
							                        echo 'checked="checked"' ?>
                                                   value='1'>
                                            Minify <em>-- minify and remove css comments via the api</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_variables">
                                            <input id='uucss_variables' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_variables]'
						                        <?php if ( isset( $options['uucss_variables'] ) )
							                        echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS Variables <em>-- remove unused css variables</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_keyframes">
                                            <input id='uucss_keyframes' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_keyframes]'
						                        <?php if ( isset( $options['uucss_keyframes'] ) )
							                        echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS Animation keyframes <em>-- remove unused keyframe animations</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_fontface">
                                            <input id='uucss_fontface' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_fontface]'
						                        <?php if ( isset( $options['uucss_fontface'] ) )
							                        echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS Font-face rules <em>-- remove unused @font-face rules</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_analyze_javascript">
                                            <input id='uucss_analyze_javascript' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_analyze_javascript]' <?php if ( ! empty( $options['uucss_analyze_javascript'] ) && '1' === $options['uucss_analyze_javascript'] ) {
						                        echo 'checked="checked"';
					                        } ?> value='1'>
                                            Analyze javascript <em>-- analyze javascript and remove unused css which are
                                                not
                                                used in JS (experimental)</em>
                                        </label>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Parse all CSS files', 'autoptimize' ); ?></th>
                                <td>
                                    <label><input id='autoptimize_uucss_include_all_files' type='checkbox'
                                                  name='autoptimize_uucss_settings[autoptimize_uucss_include_all_files]' <?php if ( ! empty( $options['autoptimize_uucss_include_all_files'] ) && '1' === $options['autoptimize_uucss_include_all_files'] ) {
					                        echo 'checked="checked"';
				                        } ?> value='1'>
                                        <i>
                                            Parse css files which are excluded by autoptimize as well (experimental)
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
                                <th scope="row"><?php _e( 'Query String', 'autoptimize' ); ?></th>
                                <td>
                                    <label><input id='uucss_query_string' type='checkbox'
                                                  name='autoptimize_uucss_settings[uucss_query_string]' <?php if ( ! empty( $options['uucss_query_string'] ) && '1' === $options['uucss_query_string'] ) {
		                                    echo 'checked="checked"';
	                                    } ?> value='1'>
                                        <i>
                                            Consider links with query strings as separate links.
                                        </i>
                                    </label>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><?php _e( 'Safelist Packs', 'autoptimize' ); ?>

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

                <li>
                    <h2>
                        License Information
                        <span<?php echo ( $options['valid_domain'] ) ? ' class="valid">Valid' : ' class="invalid">Invalid' ?></span>
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display: <?php echo ( $api_key_verified ) ? 'none' : 'block' ?>">
                        <table class="form-table" id="uucss-options">

                            <tr>
                                <th scope="row"><?php _e( 'License', 'autoptimize' ); ?></th>
                                <td>
                                    <label>
                                        <input type="hidden" name="autoptimize_uucss_settings[uucss_api_key_verified]"
                                               value="<?php if ( isset( $options['uucss_api_key_verified'] ) )
											       echo $options['uucss_api_key_verified'] ?>">
                                        <input id='uucss_api_key' type='hidden'
                                               name='autoptimize_uucss_settings[uucss_api_key]'
                                               value="<?php echo ( isset( $options['uucss_api_key'] ) ) ? $options['uucss_api_key'] : '' ?>"
                                               size="40">
                                        <em id="verification_status"></em>
                                        <a href="<?php echo ( $options['valid_domain'] ) ? UnusedCSS_Autoptimize_Admin::activation_url('deactivate') :
											UnusedCSS_Autoptimize_Admin::activation_url('authorize') ?>"
                                           class="uucss-activate">
											<?php echo ( $options['valid_domain']) ? 'Deactivate License' : 'Reactivate License' ?>
                                        </a>
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

			<?php endif; ?>

        </ul>
    </div>


</form>


