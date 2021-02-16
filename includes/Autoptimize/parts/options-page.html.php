<?php defined( 'ABSPATH' ) or die(); ?>

<script>document.title = "Autoptimize: RapidLoad " + document.title;</script>

<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
	<?php settings_fields( 'autoptimize_uucss_settings' );

	$api_key_verified = isset( $options['uucss_api_key_verified'] ) && $options['uucss_api_key_verified'] == '1';

	?>
    <div>
        <ul id="uucss-wrapper">
            <li class="uucss-notification" style="display: none">
                <div class="content"></div>
            </li>
			<?php if ( ! $api_key_verified ) : ?>
                <li class="uucss-intro">
					<?php include_once 'intro.html.php' ?>
                </li>
			<?php endif; ?>
			<?php if ( $api_key_verified) : ?>
                <li class="uucss-history">
                    <h2>
                        Optimizations
                        <span class="uucss-add-site-urls" data-featherlight="#add_url_featherlight_content" data-featherlight-variant="add-site-url-model show-url">
                    <span class="dashicons dashicons-plus-alt"></span>Add
                </span>
                    </h2>
                    <div class="content">
                        <div class="spinner spinner-history"></div>
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
                    <div class="content" style="display:none;">
                        <table class="form-table" id="uucss-options">
                            <tr>
                                <th scope="row"><?php _e( 'Sitewide Safelist', 'uucss' ); ?>
                                    <span class="css-whitelist has-tooltip"
                                          data-message="Safelist Selectors (regex supported)">
                                    </span>
                                </th>
                                <td class="safelist-wrapper">
                                    <textarea hidden id="uucss_safelist"
                                              name="autoptimize_uucss_settings[uucss_safelist]"><?php echo empty( $options['uucss_safelist'] ) ? '' : $options['uucss_safelist'] ?></textarea>
                                    <div class="safelist-add">
                                        <select name="" id="safelist-type">
                                            <option value="single">Single</option>
                                            <option selected value="greedy">Greedy</option>
                                            <option value="deep">Deep</option>
                                        </select>
                                        <input id="safelist-add" type="text" size="27"
                                               autocomplete="off">
                                        <button class="button">Add Rule</button>
                                    </div>
                                    <div class="safelist-list">
                                        <ul></ul>
                                    </div>

                                    <div class="uucss-info-wrapper safelist-settings" style="max-width: 350px;">
                                        <div class="info-icon">
                                            <span class="dashicons dashicons-info"></span>
                                        </div>
                                        <div class="info-details">
                                            <h4>Tip</h4>
                                            <p>You can add rules to specify which CSS classes or IDs are safe to left
                                                in the final RapidLoad output.</p>
                                            <p class="divider"></p>
                                            <p> use * expressions and add one rule at a time, <br>
                                            </p>
                                            <p class="divider"></p>
                                            <p>

                                                examples : <em>my-class*</em>, <em>*my-id</em>, <em>*li*</em><br>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Sitewide Blocklist', 'uucss' ); ?>
                                    <span class="css-whitelist has-tooltip"
                                          data-message="Blocklist Selectors (regex supported)">
                                    </span>
                                </th>
                                <td class="blocklist-wrapper">
                                    <textarea hidden id="uucss_blocklist"
                                              name="autoptimize_uucss_settings[uucss_blocklist]"><?php echo empty( $options['uucss_blocklist'] ) ? '' : $options['uucss_blocklist'] ?></textarea>
                                    <div class="blocklist-add uucss-tag">
                                        <input id="blocklist-add" type="text" size="27" class="newtag"
                                               autocomplete="off">
                                        <button class="button">Add Rule</button>
                                    </div>
                                    <div class="blocklist-list">
                                        <ul></ul>
                                    </div>

                                    <div class="uucss-info-wrapper blocklist-settings" style="max-width: 350px;">
                                        <div class="info-icon">
                                            <span class="dashicons dashicons-info"></span>
                                        </div>
                                        <div class="info-details">
                                            <h4>Tip</h4>
                                            <p>You can add rules to specify which CSS rules should be removed forcibly from the final
                                                CSS output.</p>
                                            <p class="divider"></p>
                                            <p> use * glob expressions and add one rule at a time <br>
                                            </p>
                                            <p class="divider"></p>
                                            <p>

                                                examples : <em>my-class*</em>, <em>*my-id</em>, <em>*li*</em><br>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><?php _e( 'Safelist Packs', 'uucss' ); ?>

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

                            <tr>
                                <th scope="row"><?php _e( 'Other Options', 'uucss' ); ?></th>
                                <td>

                                    <p>
                                        <label for="uucss_minify">
                                            <input id='uucss_minify'
                                                   type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_minify]'
                                                <?php if ( isset( $options['uucss_minify'] ) )
                                                    echo 'checked="checked"' ?>
                                                   value='1'>
                                            Minify <em>-- Minify and Remove CSS comments via the API</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_variables">
                                            <input id='uucss_variables' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_variables]'
                                                <?php if ( isset( $options['uucss_variables'] ) )
                                                    echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS Variables <em>-- Remove unused CSS variables</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_keyframes">
                                            <input id='uucss_keyframes' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_keyframes]'
                                                <?php if ( isset( $options['uucss_keyframes'] ) )
                                                    echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS Animation keyframes <em>-- Remove unused keyframe animations</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_fontface">
                                            <input id='uucss_fontface' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_fontface]'
                                                <?php if ( isset( $options['uucss_fontface'] ) )
                                                    echo 'checked="checked"' ?>
                                                   value='1'>
                                            CSS @font-face rules <em>-- Remove unused @font-face rules</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_cache_busting_v2">
                                            <input id='uucss_cache_busting_v2' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_cache_busting_v2]'
                                                <?php if ( isset( $options['uucss_cache_busting_v2'] ) )
                                                    echo 'checked="checked"' ?>
                                                   value='1'>
                                            Cache Busting <em>-- Enable RapidLoad crawler to view pages with a random query string</em>
                                        </label>
                                    </p>

                                    <p>
                                        <label for="uucss_analyze_javascript">
                                            <input id='uucss_analyze_javascript' type='checkbox'
                                                   name='autoptimize_uucss_settings[uucss_analyze_javascript]' <?php if ( ! empty( $options['uucss_analyze_javascript'] ) && '1' === $options['uucss_analyze_javascript'] ) {
                                                echo 'checked="checked"';
                                            } ?> value='1'>
                                            Analyze JavaScript <strong>(highly experimental)</strong> <em>-- Analyze
                                                JavaScript and Remove unused CSS which are
                                                not used in JS</em>
                                        </label>
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><?php _e( 'Exclude URLs', 'uucss' ); ?>
                                    <span class="exclude-links has-tooltip"
                                          data-message="Exclude from RapidLoad hello-url/some-url">

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
                                                <input type="button" class="button tagadd" value="Add URL">
                                            </div>
                                            <p class="howto">
                                                Exclude URLs from RapidLoad <em> hello-url/some-url, product/ </em>
                                            </p>
                                        </div>
                                        <ul class="tagchecklist" role="list"></ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Exclude CSS Files', 'uucss' ); ?>
                                    <span class="exclude-css-files has-tooltip"
                                          data-message="Exclude specific CSS files from RapidLoad my-styles.css, /my-theme/style.css">

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
                                                Exclude specific CSS files from RapidLoad <em> my-styles.css, /my-theme/style.css </em>
                                            </p>
                                        </div>
                                        <ul class="tagchecklist" role="list"></ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Load Original CSS Files', 'uucss' ); ?></th>
                                <td>
                                    <label><input id='uucss_load_original' type='checkbox'
                                                  name='autoptimize_uucss_settings[uucss_load_original]' <?php if ( ! empty( $options['uucss_load_original'] ) && '1' === $options['uucss_load_original'] ) {
					                        echo 'checked="checked"';
				                        } ?> value='1'>
                                        <i>
                                            Inject original CSS files on user interaction. this can help resolve Javascript
                                            DOM selector related issues.
                                        </i>
                                    </label>
                                </td>
                            </tr>


                            <tr>
                                <th scope="row"><?php _e( 'Parse All CSS Files', 'uucss' ); ?></th>
                                <td>
                                    <label><input id='autoptimize_uucss_include_all_files' type='checkbox'
                                                  name='autoptimize_uucss_settings[autoptimize_uucss_include_all_files]' <?php if ( ! empty( $options['autoptimize_uucss_include_all_files'] ) && '1' === $options['autoptimize_uucss_include_all_files'] ) {
											echo 'checked="checked"';
										} ?> value='1'>
                                        <i>
                                            Parse CSS files which are excluded by Autoptimize.
                                        </i>
                                    </label>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><?php _e( 'Inline Small CSS Files', 'uucss' ); ?></th>
                                <td>
                                    <label><input id='uucss_inline_css' type='checkbox'
                                                  name='autoptimize_uucss_settings[uucss_inline_css]' <?php if ( ! empty( $options['uucss_inline_css'] ) && '1' === $options['uucss_inline_css'] ) {
											echo 'checked="checked"';
										} ?> value='1'>
                                        <i>
                                            Inline CSS files which are smaller than 5kb after unused CSS is removed.
                                        </i>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Query String', 'uucss' ); ?></th>
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
                                <th>
                                    <?php _e( 'Queue', 'uucss' ); ?>
                                </th>
                                <td>
                                    <?php
                                        $intervals = [
                                                ['value' => 60, 'name' => '1 Minute', 'max' => 8],
                                                ['value' => 300, 'name' => '5 Minutes', 'max' => 8],
                                                ['value' => 600, 'name' => '10 Minutes', 'max' => 8],
                                                ['value' => 1200, 'name' => '20 Minutes', 'max' => 8],
                                                ['value' => 1800, 'name' => '30 Minutes', 'max' => 16],
                                                ['value' => 3600, 'name' => '1 Hour', 'max' => 16],
                                        ];
                                        $default_job_count = isset($options['uucss_jobs_per_queue']) ? $options['uucss_jobs_per_queue'] : UnusedCSS_Queue::$job_count;
                                        $default_interval = isset($options['uucss_queue_interval']) ? $options['uucss_queue_interval'] : UnusedCSS_Queue::$interval;
                                    ?>
                                    Run
                                    <select name="autoptimize_uucss_settings[uucss_jobs_per_queue]" id="uucss_jobs_per_queue">
                                        <?php
                                        foreach ([1,2,4,8,16] as $job_count){
                                            $label_jobs_per = 'Jobs';
                                            if($job_count == 1){
                                                $label_jobs_per = 'Job';
                                            }
                                            echo sprintf('<option value="%s" %s>%s %s</option>',$job_count,$job_count == $default_job_count ? 'selected' : '', $job_count, $label_jobs_per);
                                        }
                                        ?>
                                    </select>
                                     Per
                                    <select name="autoptimize_uucss_settings[uucss_queue_interval]" id="uucss_queue_interval">
                                        <?php
                                        foreach ($intervals as $interval){
                                                echo sprintf('<option value="%s" data-max="%s" %s>%s</option>',$interval['value'],$interval['max'], $interval['value'] == $default_interval ? 'selected' : '', $interval['name']);
                                            }
                                        ?>
                                    </select>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Debug Mode', 'uucss' ); ?></th>
                                <td>
                                    <label for="uucss_enable_debug"><input id='uucss_enable_debug' type='checkbox'
                                                  name='autoptimize_uucss_settings[uucss_enable_debug]' <?php if ( ! empty( $options['uucss_enable_debug'] ) && '1' === $options['uucss_enable_debug'] ) {
                                            echo 'checked="checked"';
                                        } ?> value='1'>
                                        <i>
                                            Enable error logs for RapidLoad.
                                        </i>
                                        <?php
                                            $default_debug_mode = ! empty( $options['uucss_enable_debug'] ) && '1' === $options['uucss_enable_debug'];
                                            $hide_view_log = apply_filters('uucss/view_debug/frontend', $default_debug_mode);
                                        ?>
                                        <a id="view-uucss-log" href="#" <?php if(!$hide_view_log) echo 'style="display:none"' ?>>View Logs</a>
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                </li>

                <li>
                    <h2>
                        License Information
                        <span<?php echo ( isset( $options['valid_domain'] ) && $options['valid_domain'] ) ? ' class="valid">Valid' : ' class="invalid">Invalid' ?></span>
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display: <?php echo ( $api_key_verified ) ? 'none' : 'block' ?>; ">

                        <div class="license-info">
                            <span id="license-message" style="display: none"></span>
                            <div class="spinner"></div>
                            <ul style="display: none">
                                <li><strong>Name : </strong> <span id="license-name"></span></li>
                                <li><strong>Email : </strong> <span id="license-email"></span></li>
                                <li><strong>Plan : </strong><span id="license-plan"></span></li>
                                <li><strong>Next Billing : </strong><span id="license-next_billing"></span></li>
                                <li><strong>Domain : </strong><span id="license-domain"></span></li>
                            </ul>

                            <div>
                                <input id='uucss_auto_refresh_frontend-hidden' type='hidden'
                                       name='autoptimize_uucss_settings[uucss_auto_refresh_frontend]'  value="<?php if ( ! empty( $options['uucss_auto_refresh_frontend'] ) && '1' === $options['uucss_auto_refresh_frontend'] ) {
                                    echo '1';
                                } ?>">
                                <input type="hidden" name="autoptimize_uucss_settings[uucss_api_key_verified]"
                                       value="<?php if ( isset( $options['uucss_api_key_verified'] ) )
									       echo $options['uucss_api_key_verified'] ?>">
                                <input id='uucss_api_key' type='hidden'
                                       name='autoptimize_uucss_settings[uucss_api_key]'
                                       value="<?php echo ( isset( $options['uucss_api_key'] ) ) ? $options['uucss_api_key'] : '' ?>"
                                       size="40">
                                <em id="verification_status"></em>
								<?php if ( isset( $options['valid_domain'] ) && $options['valid_domain'] ) : ?>
                                    <a href="<?php echo (defined('UUCSS_APP_URL') && UUCSS_APP_URL ? UUCSS_APP_URL : 'https://app.rapidload.io/')?>" target="_blank"
                                       class="uucss-activate" id="my-account"> My Account
                                    </a>
                                    <a href="<?php echo UnusedCSS_Autoptimize_Admin::activation_url( 'deactivate' ) ?>"
                                       class="uucss-activate" id="uucss-deactivate"> Deactivate License
                                    </a>
								<?php else : ?>
                                    <a href="<?php echo (defined('UUCSS_APP_URL') && UUCSS_APP_URL ? UUCSS_APP_URL : 'https://app.rapidload.io/')?>" target="_blank"
                                       class="uucss-activate" id="my-account"> My Account
                                    </a>
                                    <a style="margin-left: 5px"
                                        href="<?php echo UnusedCSS_Autoptimize_Admin::activation_url( 'authorize' ) ?>"
                                       class="uucss-activate"> Reactivate License
                                    </a>

                                    <a style="margin-left: 5px"
                                       href="<?php echo UnusedCSS_Autoptimize_Admin::activation_url( 'deactivate' ) ?>"
                                       class="uucss-activate" id="uucss-deactivate"> Deactivate License
                                    </a>
								<?php endif; ?>

                            </div>

                        </div>
                    </div>
                </li>

                <li class="submit">

                    <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary"
                                             value="<?php _e( 'Save Changes', 'uucss' ); ?>"/>

                        <a target="_blank" href="https://rapidload.io/">
                            <img
                                    src="<?php echo UUCSS_PLUGIN_URL . '/assets/images/logo.svg' ?>" width="130"
                                    alt="RapidLoad.io logo">
                        </a>
                    </p>
                </li>

			<?php endif; ?>

        </ul>
    </div>

    <div class="uucss-support">
        <div id="uucss-support-tooltip" style="display: none">
            <h3>Support</h3>
            <br>
            We are here to help, take a look at our knowledge base or feel free to open a ticket.
        </div>
        <a target="_blank" href="https://rapidload.zendesk.com/hc/en-us"><span class="dashicons dashicons-sos"></span>
            Help</a>
    </div>

</form>
<div id="add_url_featherlight_content" class="main-content">
    <div class="action-content">
        <div>
            <select id="model-requeue-post-type">
                <option value="url">URL</option>
                <?php
                $include = UnusedCSS_Queue::get_post_types();
                if(isset($include)){
                    foreach ($include as $value){
                        $post_object = get_post_type_object( $value );

                        if($post_object){

                            echo sprintf('<option value="%s">%s</option>', $value, $post_object->label);

                        }

                    }
                }
                ?>
                <option value="current">Current Jobs</option>
                <option value="pending">Pending Jobs</option>
                <option value="site_map">Site Map</option>
                <option value="all">All</option>
            </select>
        </div>
        <div>
            <input type="text" class="site-map-url show" placeholder="https://example.com/">
        </div>
        <div>
            <input id="model-queue-posts-type" type="button" class="button button-primary" value="Add">
        </div>
    </div>
</div>

