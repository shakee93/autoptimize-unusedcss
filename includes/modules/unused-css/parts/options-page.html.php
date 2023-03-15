<?php defined( 'ABSPATH' ) or die(); ?>

<script>document.title = "Autoptimize: RapidLoad " + document.title;</script>

<?php

    global $uucss;
    global $rapidload;

    $third_party_plugins = apply_filters('uucss/third-party/plugins', []);
    $third_party_cache_plugins = array_filter($third_party_plugins, function ($plugin){
        return isset($plugin['category']) && $plugin['category'] == 'cache';
    });

?>

<form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
	<?php settings_fields( 'autoptimize_uucss_settings' );

	$api_key_verified = isset( $options['uucss_api_key_verified'] ) && $options['uucss_api_key_verified'] == '1';
    $default_debug_mode = ! empty( $options['uucss_enable_debug'] ) && '1' === $options['uucss_enable_debug'];
    $hide_view_log = apply_filters('uucss/view_debug/frontend', (boolean)$default_debug_mode);

	?>
    <div style="display: flex">
        <ul style="width: 78%" id="uucss-wrapper">
            <li class="uucss-notification" style="display: none">
                <div class="content"></div>
            </li>

			<?php if ( ! $api_key_verified ) : ?>
                <li class="uucss-intro">
					<?php include_once 'intro.html.php' ?>
                </li>
			<?php endif; ?>
			<?php if ( $api_key_verified) : ?>
                <li class="uucss-history uucss-job-history">
                    <h2>
                        Optimization Jobs
                        <span class="multiple-selected-text">
                            <span class="multiple-selected-value multiple-selected-value-job"></span>
                            Selected
                            <a href="#" id="js-uucss-clear-selection">clear</a>
                        </span>
                        <span class="uucss-add-menu uucss-add-site-urls" data-featherlight="#add_url_featherlight_content" data-featherlight-open-speed="50" data-featherlight-close-speed="50" data-featherlight-variant="add-site-url-model show-url">
                            <span class="dashicons dashicons-plus"></span>Add
                        </span>
                        <button class="uucss-sub-menu uucss-add-site-urls-submenu" aria-expanded="false">
                            <span class="dashicons dashicons-ellipsis"></span>
                        </button>
                    </h2>
                    <div class="content">
                        <div class="spinner spinner-history"></div>
                        <table id="uucss-history" width="100%" class="hover uucss-history-table uucss-job-history-table"></table>
                    </div>
                </li>
                <?php if($rapidload->rules_enabled()) : ?>
                <li class="uucss-history uucss-rule-history">
                    <h2>
                        Rules <a target="_blank" href="https://rapidload.zendesk.com/hc/en-us/articles/4404081180179-Rule-Based-Injection" style="font-size: 11px">Learn More</a>
                        <span class="multiple-selected-text">
                            <span class="multiple-selected-value multiple-selected-value-rule"></span>
                            Selected
                            <a href="#" id="js-uucss-clear-selection-rule">clear</a>
                        </span>
                        <span class="uucss-add-menu uucss-add-site-rule" data-featherlight="#add_rule_featherlight_content" data-featherlight-open-speed="50" data-featherlight-close-speed="50" data-featherlight-variant="add-site-rule-model">
                            <span class="dashicons dashicons-plus"></span>Add
                        </span>
                        <button class="uucss-sub-menu uucss-add-site-rule-submenu" aria-expanded="false">
                            <span class="dashicons dashicons-ellipsis"></span>
                        </button>
                    </h2>
                    <div class="content">
                        <div class="spinner spinner-history"></div>
                        <table id="uucss-rule-history" width="100%" class="hover uucss-history-table uucss-rule-history-table"></table>
                    </div>
                </li>
                <?php endif; ?>
                <li>
                    <h2>
                        Advanced Settings
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display:none;">
                        <?php
                            do_action('uucss/options/before_option_table');
                        ?>
                        <table class="form-table" id="uucss-options">
                            <tr>
                                <th class="sub-heading">
                                    <h4>General</h4>
                                </th>
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
                                                Exclude URLs from RapidLoad <em> *hello-url/some-url*, *product/**/ex/* </em>
                                                <a href="https://rapidload.zendesk.com/hc/en-us/articles/1500003020622-Excluding-Files-URLs" target="_blank">learn more</a>.
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
                                                Exclude specific CSS files from RapidLoad <em> *my-styles.css, */my-theme*/style.css </em>
                                                <a href="https://rapidload.zendesk.com/hc/en-us/articles/1500003020622-Excluding-Files-URLs" target="_blank">learn more</a>.
                                            </p>
                                        </div>
                                        <ul class="tagchecklist" role="list"></ul>
                                    </div>
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
                                            Consider URLs with query strings as separate URLs.
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
                                        ['value' => 60, 'name' => '1 Minute', 'max' => 16],
                                        ['value' => 300, 'name' => '5 Minutes', 'max' => 16],
                                        ['value' => 600, 'name' => '10 Minutes', 'max' => 16],
                                        ['value' => 1200, 'name' => '20 Minutes', 'max' => 16],
                                        ['value' => 1800, 'name' => '30 Minutes', 'max' => 16],
                                        ['value' => 3600, 'name' => '1 Hour', 'max' => 16],
                                    ];
                                    $default_job_count = isset($options['uucss_jobs_per_queue']) ? $options['uucss_jobs_per_queue'] : RapidLoad_Queue::$job_count;
                                    $default_interval = isset($options['uucss_queue_interval']) ? $options['uucss_queue_interval'] : RapidLoad_Queue::$interval;
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
                                <th scope="row"><?php _e( 'Disable Auto Queue', 'uucss' ); ?></th>
                                <td>
                                    <label for="uucss_disable_add_to_queue"><input id='uucss_disable_add_to_queue' type='checkbox'
                                                                                   name='autoptimize_uucss_settings[uucss_disable_add_to_queue]' <?php if ( ! empty( $options['uucss_disable_add_to_queue'] ) && '1' === $options['uucss_disable_add_to_queue'] ) {
                                            echo 'checked="checked"';
                                        } ?> value='1'>
                                        <i>
                                            Disable jobs adding to queue on user visits.
                                        </i>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><?php _e( 'Disable Re-Queue', 'uucss' ); ?></th>
                                <td>
                                    <label for="uucss_disable_add_to_re_queue"><input id='uucss_disable_add_to_re_queue' type='checkbox'
                                                                                      name='autoptimize_uucss_settings[uucss_disable_add_to_re_queue]' <?php if ( ! empty( $options['uucss_disable_add_to_re_queue'] ) && '1' === $options['uucss_disable_add_to_re_queue'] ) {
                                            echo 'checked="checked"';
                                        } ?> value='1'>
                                        <i>
                                            Disable jobs re-queuing on warnings.
                                        </i>
                                    </label>
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
                                            Enable debug logs for RapidLoad.
                                        </i>
                                        <a id="view-uucss-log" href="#" <?php if(!$hide_view_log) echo 'style="display:none"' ?>>View Logs</a>
                                    </label>
                                </td>
                            </tr>
                            <?php if(RapidLoad_DB::$current_version > 1.1): ?>
                                <tr>
                                    <th scope="row"><?php _e( 'Rule Based Injection', 'uucss' ); ?></th>
                                    <td>
                                        <label for="uucss_enable_rules"><input id='uucss_enable_rules' type='checkbox'
                                                                               name='autoptimize_uucss_settings[uucss_enable_rules]' <?php if ( ! empty( $options['uucss_enable_rules'] ) && '1' === $options['uucss_enable_rules'] ) {
                                                echo 'checked="checked"';
                                            } ?> value='1'>
                                            <i>
                                                Enable rule based injection.
                                            </i>
                                        </label>
                                    </td>
                                </tr>
                            <?php endif; ?>
                            <tr>
                                <th class="sub-heading">
                                    <h4>CSS Optimization</h4>
                                </th>
                            </tr>
                            <?php
                                do_action('uucss/options/css', $options);
                            ?>
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
                                        <p style="font-size: 12px; margin-left: 5px">
                                            Matched safelist rules <u><strong>will not be</strong> removed</u> during optimization
                                            <a href="https://rapidload.zendesk.com/hc/en-us/articles/360063292673-Sitewide-Safelists-Blocklists" target="_blank">learn more</a>.
                                        </p>
                                    </div>
                                    <div class="safelist-list">
                                        <ul></ul>
                                    </div>

                                    <div class="uucss-info-wrapper safelist-settings" style="max-width: 350px; display: none">
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
                                        <p style="font-size: 12px; margin-left: 5px">
                                            Matched blocklist rules <u><strong>will be</strong> removed</u> during optimization
                                            <a href="https://rapidload.zendesk.com/hc/en-us/articles/360063292673-Sitewide-Safelists-Blocklists" target="_blank">learn more</a>.
                                        </p>
                                    </div>
                                    <div class="blocklist-list">
                                        <ul></ul>
                                    </div>

                                    <!--<div class="uucss-info-wrapper blocklist-settings" style="max-width: 350px;">
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
                                    </div>-->
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

                                    <?php  if(apply_filters('uucss/inline-css-enabled', true)): ?>
                                        <p>
                                            <label for="uucss_include_inline_css">
                                                <input id='uucss_include_inline_css' type='checkbox'
                                                       name='autoptimize_uucss_settings[uucss_include_inline_css]'
                                                    <?php if ( isset( $options['uucss_include_inline_css'] ) )
                                                        echo 'checked="checked"' ?>
                                                       value='1'>
                                                Inline CSS <em>-- Optimize Inline CSS</em>
                                            </label>
                                        </p>
                                    <?php endif; ?>

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

                            <?php if($uucss->provider != 'rapidload') : ?>
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
                            <?php endif; ?>

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

                        </table>
                        <?php
                            do_action('uucss/options/after_option_table');
                        ?>
                    </div>
                </li>

                <?php do_action('uucss/options/after_settings_section'); ?>

                <li class="rapidload-status">
                    <h2>RapidLoad Status
                        <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
                    </h2>
                    <div class="content" style="display:none;">
                        <?php
                        $total = UnusedCSS_DB::get_total_job_count();
                        $success = 0;
                        $queued = 0;
                        $processing = 0;
                        $waiting = 0;
                        $warnings = 0;
                        $failed = 0;
                        ?>
                        <p>
                            <strong>Version</strong> : <?php echo UUCSS_VERSION ?>
                        </p>
                        <p>
                            <strong>DB Version</strong> : <?php echo UnusedCSS_DB::$current_version ?>
                        </p>
                        <p class="style-sheet-count">
                            <strong>CSS Stylesheets</strong> : <?php echo $this->uucss->cache_file_count() . ' files, totalling ' . $this->uucss->size(); ?>
                        </p>
                        <p>
                            <strong>Cache Folder</strong> : <?php echo UnusedCSS::$base_dir; ?>
                        </p>
                        <p <?php if(!$hide_view_log) echo 'style="display:none"' ?>>
                            <strong>Log File</strong> : <?php echo UUCSS_LOG_DIR . 'debug.log'; ?> <a id="status-view-uucss-log" href="#">View Logs</a>
                        </p>
                        <p>
                            <strong>Can We Write ?</strong> : <?php echo ($this->uucss->initFileSystem()) ? 'Yes' : 'No' ; ?>
                        </p>
                        <p class="more-info-uucss-status">
                            <strong>Total Optimization Jobs</strong> :  <span class="total-jobs"><?php echo $total; ?></span>
                        </p>
                        <div class="uucss-status-more-info" style="display: none">
                            <?php
                                $hits = 0;
                            ?>
                            <p class="status-hits-count">
                                <strong>Hits</strong> : <span class="number"><?php echo $hits; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($hits/$total*100, 0) : '0'; ?></span>%
                            </p>
                            <p class="status-success-count">
                                <strong>Success</strong> : <span class="number"><?php echo $success; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($success/$total*100, 0) : '0'; ?></span>%
                            </p>
                            <?php
                                if ( $rapidload->rules_enabled() ) :
                                $rule_based = 0;
                            ?>
                            <p class="status-rule-based-count">
                                <strong>Rule Based</strong> : <span class="number"><?php echo $rule_based; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($rule_based/$total*100, 0) : '0'; ?></span>%
                            </p>
                            <?php
                                endif;
                            ?>
                            <p class="status-queued-count">
                                <strong>Queued</strong> : <span class="number"><?php echo $queued; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($queued/$total*100, 0) : '0' ?></span>%
                            </p>
                            <p class="status-waiting-count">
                                <strong>Waiting</strong> : <span class="number"><?php echo $waiting; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($waiting/$total*100, 0) : '0' ?></span>%
                            </p>
                            <p class="status-processing-count">
                                <strong>Processing</strong> : <span class="number"><?php echo $processing; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($processing/$total*100, 0) : '0' ?></span>%
                            </p>
                            <p class="status-warnings-count">
                                <strong>Warnings</strong> : <span class="number"><?php echo $warnings; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($warnings/$total*100, 0) : '0' ?></span>%
                            </p>
                            <p class="status-failed-count">
                                <strong>Failed Jobs</strong> : <span class="number"><?php echo $failed; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($failed/$total*100, 0) : '0' ?></span>%
                            </p>
                            <?php
                                if(count($third_party_plugins) > 0):
                                ?>
                                    <p>
                                        <strong>Support Plugins</strong> :
                                    </p>
                                <?php
                                endif;
                            ?>
                            <ul>
                                <?php
                                    foreach ($third_party_plugins as $party_plugin){
                                        echo '<li style="margin-bottom:0">' . (isset($party_plugin['plugin']) ? $party_plugin['plugin'] : '') . ' - ' . (isset($party_plugin['category']) ? $party_plugin['category'] : '') .'</li>';
                                    }
                                ?>
                            </ul>
                        </div>
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
                                <input id='thirtd_part_cache_plugins' type='hidden'
                                       value="<?php if ( ! empty( $third_party_cache_plugins ) ) {
                                    echo '1';
                                } ?>">
                                <input id='uucss_auto_refresh_frontend-hidden' type='hidden'
                                       name='autoptimize_uucss_settings[uucss_auto_refresh_frontend]'  value="<?php if ( ! empty( $options['uucss_auto_refresh_frontend'] ) && '1' === $options['uucss_auto_refresh_frontend'] ) {
                                    echo '1';
                                } ?>">
                                <input id='uucss_dev_mode' type='hidden'
                                       name='autoptimize_uucss_settings[uucss_dev_mode]'  value="<?php if ( ! empty( $options['uucss_dev_mode'] ) && '1' === $options['uucss_dev_mode'] ) {
                                    echo '1';
                                } ?>">
                                <input id='uucss_auto_refresh_frontend-hidden_rule' type='hidden'
                                       name='autoptimize_uucss_settings[uucss_auto_refresh_frontend_rule]'  value="<?php if ( ! empty( $options['uucss_auto_refresh_frontend_rule'] ) && '1' === $options['uucss_auto_refresh_frontend_rule'] ) {
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
                                    <a href="<?php echo UnusedCSS::activation_url('deactivate' ) ?>"
                                       class="uucss-activate" id="uucss-deactivate"> Deactivate License
                                    </a>
								<?php else : ?>
                                    <a href="<?php echo (defined('UUCSS_APP_URL') && UUCSS_APP_URL ? UUCSS_APP_URL : 'https://app.rapidload.io/')?>" target="_blank"
                                       class="uucss-activate" id="my-account"> My Account
                                    </a>
                                    <a style="margin-left: 5px"
                                        href="<?php echo UnusedCSS::activation_url('authorize' ) ?>"
                                       class="uucss-activate"> Reactivate License
                                    </a>

                                    <a style="margin-left: 5px"
                                       href="<?php echo UnusedCSS::activation_url('deactivate' ) ?>"
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
        <?php if($api_key_verified): ?>
        <div style="width: 22%" class="uucss-banner-section">
<!--            <div class="uucss-banner">-->
<!--                <div class="banner-title">-->
<!--                    <h2>Boost Your Website's Speed <br> with RapidLoad 2.0</h2>-->
<!--                </div>-->
<!--                <div class="banner-image">-->
<!--                    <img src="--><?php //echo UUCSS_PLUGIN_URL . '/assets/images/referral.svg' ?><!--" alt="" width="120px">-->
<!--                </div>-->
<!--                <div class="banner-content">-->
<!--                    <p>refer-a-friend and give your friend 10% off, get yourself up to $60 in cash backs.</p>-->
<!--                    <p><a href="https://rapidload.io/referral/?utm_source=rapidload_plugin&utm_medium=sidebar-banner" target="_blank">Learn More</a></p>-->
<!--                </div>-->
<!--                <div class="banner-footer">-->
<!--                    <a href="https://app.rapidload.io/auth/sign-in/?goto=https://app.rapidload.io/referral-program" class="button button-primary" target="_blank">Invite</a>-->
<!--                </div>-->
<!--            </div>-->
            <div class="uucss-banner">
                <div class="banner-title">
                    <h2 style="font-size: 15px; margin: 3px;">Boost Your Website's Speed</h2>
                    <div class="banner-title" style="display: flex; justify-content: center;">
                        <h2 style="font-size: 15px; margin: 3px;"> with RapidLoad 2.0</h2>
                        <span style="margin: 3px; background-color:#7F54B3; padding: 0px 8px 2px 8px; color:white; width: 23px; height: 17px; border-radius: 20px; font-size: 10px;">Beta</span>
                    </div>
                    <svg style="padding-top: 5px;" width="129" height="28" viewBox="0 0 129 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M122.5 0C122.5 5.6 118.5 8 115.5 8L121.5 9.5C124 6.5 122.833 1.83333 122.5 0Z" fill="#EE4E10"/>
                        <rect y="8" width="129" height="20" rx="10" fill="#EE4E10"/>
                        <path d="M23.8367 22V14.3H25.1237L29.5897 20.317L29.3477 20.361C29.3184 20.1557 29.2927 19.9467 29.2707 19.734C29.2487 19.514 29.2267 19.2867 29.2047 19.052C29.1901 18.8173 29.1754 18.5717 29.1607 18.315C29.1534 18.0583 29.1461 17.7907 29.1387 17.512C29.1314 17.226 29.1277 16.9253 29.1277 16.61V14.3H30.5467V22H29.2377L24.7497 16.071L25.0357 15.994C25.0724 16.4047 25.1017 16.7567 25.1237 17.05C25.1531 17.336 25.1751 17.5853 25.1897 17.798C25.2044 18.0033 25.2154 18.1757 25.2227 18.315C25.2374 18.4543 25.2447 18.5827 25.2447 18.7C25.2521 18.81 25.2557 18.9163 25.2557 19.019V22H23.8367ZM35.0221 22.11C34.4428 22.11 33.9258 21.9817 33.4711 21.725C33.0164 21.461 32.6571 21.1017 32.3931 20.647C32.1291 20.1923 31.9971 19.6753 31.9971 19.096C31.9971 18.5167 32.1291 17.9997 32.3931 17.545C32.6571 17.0903 33.0164 16.7347 33.4711 16.478C33.9258 16.214 34.4428 16.082 35.0221 16.082C35.5941 16.082 36.1074 16.214 36.5621 16.478C37.0168 16.7347 37.3724 17.0903 37.6291 17.545C37.8931 17.9997 38.0251 18.5167 38.0251 19.096C38.0251 19.6753 37.8931 20.1923 37.6291 20.647C37.3724 21.1017 37.0168 21.461 36.5621 21.725C36.1074 21.9817 35.5941 22.11 35.0221 22.11ZM35.0221 20.911C35.3374 20.911 35.6161 20.8303 35.8581 20.669C36.1074 20.5077 36.3018 20.2913 36.4411 20.02C36.5878 19.7487 36.6574 19.4407 36.6501 19.096C36.6574 18.744 36.5878 18.4323 36.4411 18.161C36.3018 17.8897 36.1074 17.677 35.8581 17.523C35.6161 17.3617 35.3374 17.281 35.0221 17.281C34.7068 17.281 34.4208 17.3617 34.1641 17.523C33.9148 17.677 33.7204 17.8933 33.5811 18.172C33.4418 18.4433 33.3721 18.7513 33.3721 19.096C33.3721 19.4407 33.4418 19.7487 33.5811 20.02C33.7204 20.2913 33.9148 20.5077 34.1641 20.669C34.4208 20.8303 34.7068 20.911 35.0221 20.911ZM40.3845 22L38.4375 16.203L39.8235 16.192L41.1215 20.328L40.8795 20.306L42.2875 17.072H43.1015L44.5425 20.306L44.2565 20.339L45.5655 16.203H46.9515L44.9935 22H44.0255L42.5405 18.524L42.7495 18.546L41.3415 22H40.3845ZM50.5647 22L53.5677 14.3H54.9097L57.8907 22H56.4057L54.7557 17.622C54.719 17.534 54.6677 17.3947 54.6017 17.204C54.543 17.0133 54.477 16.808 54.4037 16.588C54.3303 16.3607 54.2643 16.1517 54.2057 15.961C54.147 15.763 54.103 15.62 54.0737 15.532L54.3487 15.521C54.3047 15.6677 54.2533 15.8327 54.1947 16.016C54.136 16.1993 54.0737 16.39 54.0077 16.588C53.9417 16.786 53.8757 16.9767 53.8097 17.16C53.751 17.3433 53.696 17.5083 53.6447 17.655L51.9947 22H50.5647ZM51.9287 20.24L52.4237 18.997H55.9327L56.4607 20.24H51.9287ZM60.1725 22L57.7305 16.203H59.2045L60.8545 20.537L60.5685 20.614L62.3065 16.203H63.7475L61.1845 22H60.1725ZM66.7652 22.11C66.2885 22.11 65.8558 21.978 65.4672 21.714C65.0785 21.45 64.7668 21.0907 64.5322 20.636C64.2975 20.1813 64.1802 19.6643 64.1802 19.085C64.1802 18.5057 64.2975 17.9887 64.5322 17.534C64.7668 17.0793 65.0858 16.7237 65.4892 16.467C65.8925 16.2103 66.3472 16.082 66.8532 16.082C67.1465 16.082 67.4142 16.126 67.6562 16.214C67.8982 16.2947 68.1108 16.412 68.2942 16.566C68.4775 16.72 68.6278 16.896 68.7452 17.094C68.8698 17.292 68.9542 17.5047 68.9982 17.732L68.7012 17.655V16.203H70.0652V22H68.6902V20.614L69.0092 20.559C68.9578 20.757 68.8625 20.9513 68.7232 21.142C68.5912 21.3253 68.4225 21.4903 68.2172 21.637C68.0192 21.7763 67.7955 21.89 67.5462 21.978C67.3042 22.066 67.0438 22.11 66.7652 22.11ZM67.1392 20.911C67.4545 20.911 67.7332 20.834 67.9752 20.68C68.2172 20.526 68.4042 20.3133 68.5362 20.042C68.6755 19.7633 68.7452 19.4443 68.7452 19.085C68.7452 18.733 68.6755 18.4213 68.5362 18.15C68.4042 17.8787 68.2172 17.666 67.9752 17.512C67.7332 17.358 67.4545 17.281 67.1392 17.281C66.8238 17.281 66.5452 17.358 66.3032 17.512C66.0685 17.666 65.8852 17.8787 65.7532 18.15C65.6212 18.4213 65.5552 18.733 65.5552 19.085C65.5552 19.4443 65.6212 19.7633 65.7532 20.042C65.8852 20.3133 66.0685 20.526 66.3032 20.68C66.5452 20.834 66.8238 20.911 67.1392 20.911ZM71.7878 22V16.203H73.1408V22H71.7878ZM72.4478 14.971C72.1765 14.971 71.9638 14.905 71.8098 14.773C71.6631 14.6337 71.5898 14.4393 71.5898 14.19C71.5898 13.9553 71.6668 13.7647 71.8208 13.618C71.9748 13.4713 72.1838 13.398 72.4478 13.398C72.7265 13.398 72.9391 13.4677 73.0858 13.607C73.2398 13.739 73.3168 13.9333 73.3168 14.19C73.3168 14.4173 73.2398 14.6043 73.0858 14.751C72.9318 14.8977 72.7191 14.971 72.4478 14.971ZM74.8675 22V13.86H76.2315V22H74.8675ZM79.9029 22.11C79.4262 22.11 78.9935 21.978 78.6049 21.714C78.2162 21.45 77.9045 21.0907 77.6699 20.636C77.4352 20.1813 77.3179 19.6643 77.3179 19.085C77.3179 18.5057 77.4352 17.9887 77.6699 17.534C77.9045 17.0793 78.2235 16.7237 78.6269 16.467C79.0302 16.2103 79.4849 16.082 79.9909 16.082C80.2842 16.082 80.5519 16.126 80.7939 16.214C81.0359 16.2947 81.2485 16.412 81.4319 16.566C81.6152 16.72 81.7655 16.896 81.8829 17.094C82.0075 17.292 82.0919 17.5047 82.1359 17.732L81.8389 17.655V16.203H83.2029V22H81.8279V20.614L82.1469 20.559C82.0955 20.757 82.0002 20.9513 81.8609 21.142C81.7289 21.3253 81.5602 21.4903 81.3549 21.637C81.1569 21.7763 80.9332 21.89 80.6839 21.978C80.4419 22.066 80.1815 22.11 79.9029 22.11ZM80.2769 20.911C80.5922 20.911 80.8709 20.834 81.1129 20.68C81.3549 20.526 81.5419 20.3133 81.6739 20.042C81.8132 19.7633 81.8829 19.4443 81.8829 19.085C81.8829 18.733 81.8132 18.4213 81.6739 18.15C81.5419 17.8787 81.3549 17.666 81.1129 17.512C80.8709 17.358 80.5922 17.281 80.2769 17.281C79.9615 17.281 79.6829 17.358 79.4409 17.512C79.2062 17.666 79.0229 17.8787 78.8909 18.15C78.7589 18.4213 78.6929 18.733 78.6929 19.085C78.6929 19.4443 78.7589 19.7633 78.8909 20.042C79.0229 20.3133 79.2062 20.526 79.4409 20.68C79.6829 20.834 79.9615 20.911 80.2769 20.911ZM87.9725 22.11C87.7158 22.11 87.4628 22.0733 87.2135 22C86.9715 21.9193 86.7515 21.813 86.5535 21.681C86.3555 21.549 86.1905 21.4023 86.0585 21.241C85.9265 21.0723 85.8385 20.9037 85.7945 20.735L86.1135 20.592L86.0805 21.978H84.7715V13.86H86.1245V17.545L85.8825 17.435C85.9192 17.259 85.9998 17.094 86.1245 16.94C86.2565 16.7787 86.4178 16.6357 86.6085 16.511C86.7992 16.379 87.0082 16.2763 87.2355 16.203C87.4628 16.1223 87.6938 16.082 87.9285 16.082C88.4492 16.082 88.9075 16.2103 89.3035 16.467C89.7068 16.7237 90.0222 17.0793 90.2495 17.534C90.4842 17.9887 90.6015 18.5057 90.6015 19.085C90.6015 19.6717 90.4878 20.1923 90.2605 20.647C90.0332 21.1017 89.7178 21.461 89.3145 21.725C88.9185 21.9817 88.4712 22.11 87.9725 22.11ZM87.6865 20.922C87.9945 20.922 88.2695 20.845 88.5115 20.691C88.7535 20.5297 88.9442 20.3133 89.0835 20.042C89.2228 19.7633 89.2925 19.4443 89.2925 19.085C89.2925 18.733 89.2228 18.4213 89.0835 18.15C88.9515 17.8787 88.7645 17.666 88.5225 17.512C88.2805 17.358 88.0018 17.281 87.6865 17.281C87.3712 17.281 87.0925 17.358 86.8505 17.512C86.6085 17.666 86.4178 17.8787 86.2785 18.15C86.1392 18.4213 86.0695 18.733 86.0695 19.085C86.0695 19.4443 86.1392 19.7633 86.2785 20.042C86.4178 20.3133 86.6085 20.5297 86.8505 20.691C87.0925 20.845 87.3712 20.922 87.6865 20.922ZM91.8186 22V13.86H93.1826V22H91.8186ZM97.382 22.11C96.7734 22.11 96.2344 21.9817 95.765 21.725C95.303 21.4683 94.94 21.12 94.676 20.68C94.4194 20.2327 94.291 19.723 94.291 19.151C94.291 18.6963 94.3644 18.282 94.511 17.908C94.6577 17.534 94.8594 17.2113 95.116 16.94C95.38 16.6613 95.6917 16.4487 96.051 16.302C96.4177 16.148 96.8174 16.071 97.25 16.071C97.6314 16.071 97.987 16.1443 98.317 16.291C98.647 16.4377 98.933 16.6393 99.175 16.896C99.417 17.1453 99.6004 17.446 99.725 17.798C99.857 18.1427 99.9194 18.5203 99.912 18.931L99.901 19.404H95.204L94.951 18.48H98.768L98.592 18.667V18.425C98.57 18.1977 98.4967 17.9997 98.372 17.831C98.2474 17.655 98.086 17.5193 97.888 17.424C97.6974 17.3213 97.4847 17.27 97.25 17.27C96.8907 17.27 96.5864 17.3397 96.337 17.479C96.095 17.6183 95.9117 17.82 95.787 18.084C95.6624 18.3407 95.6 18.6633 95.6 19.052C95.6 19.426 95.677 19.7523 95.831 20.031C95.9924 20.3097 96.216 20.526 96.502 20.68C96.7954 20.8267 97.1364 20.9 97.525 20.9C97.7964 20.9 98.0457 20.856 98.273 20.768C98.5004 20.68 98.746 20.5223 99.01 20.295L99.681 21.23C99.483 21.4133 99.2557 21.571 98.999 21.703C98.7497 21.8277 98.4857 21.9267 98.207 22C97.9284 22.0733 97.6534 22.11 97.382 22.11ZM101.341 19.294C101.29 18.8393 101.239 18.37 101.187 17.886C101.143 17.3947 101.107 16.9107 101.077 16.434C101.048 15.95 101.033 15.4917 101.033 15.059V14.256H102.463V15.059C102.463 15.5063 102.449 15.9757 102.419 16.467C102.397 16.9583 102.361 17.446 102.309 17.93C102.265 18.414 102.214 18.8687 102.155 19.294H101.341ZM101.726 22.121C101.462 22.121 101.257 22.044 101.11 21.89C100.971 21.736 100.901 21.5197 100.901 21.241C100.901 20.9843 100.975 20.7753 101.121 20.614C101.275 20.4453 101.477 20.361 101.726 20.361C101.99 20.361 102.192 20.438 102.331 20.592C102.478 20.7387 102.551 20.955 102.551 21.241C102.551 21.4977 102.474 21.7103 102.32 21.879C102.174 22.0403 101.976 22.121 101.726 22.121Z" fill="white"/>
                    </svg>

                </div>
                <div class="banner-image" style="padding-top: 5px;">
                    <svg width="187" height="207" viewBox="0 0 187 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M147.83 75.85V120.62C147.83 123.72 145.02 126.23 141.55 126.23H85.28C81.81 126.23 79 123.72 79 120.62V75.85C79 72.76 81.81 70.25 85.28 70.25H141.55C145.02 70.25 147.83 72.76 147.83 75.85Z" fill="#F2F2F2"/>
                        <path d="M144.07 77.0399H82.62C82.5995 77.0412 82.5788 77.0384 82.5594 77.0315C82.5401 77.0245 82.5225 77.0137 82.5074 76.9997C82.4924 76.9856 82.4804 76.9686 82.4723 76.9497C82.4641 76.9308 82.4599 76.9104 82.46 76.8899C82.4612 76.8702 82.4664 76.8509 82.4751 76.8332C82.4838 76.8155 82.496 76.7996 82.5109 76.7866C82.5257 76.7736 82.543 76.7637 82.5618 76.7574C82.5805 76.7511 82.6003 76.7485 82.62 76.7499H144.07C144.108 76.7498 144.145 76.7642 144.173 76.7902C144.2 76.8162 144.217 76.8519 144.22 76.8899C144.22 76.9297 144.204 76.9678 144.176 76.9959C144.148 77.0241 144.11 77.0399 144.07 77.0399Z" fill="white"/>
                        <path d="M89.5199 74.6801C90.1495 74.6801 90.6599 74.1563 90.6599 73.5101C90.6599 72.8639 90.1495 72.3401 89.5199 72.3401C88.8903 72.3401 88.3799 72.8639 88.3799 73.5101C88.3799 74.1563 88.8903 74.6801 89.5199 74.6801Z" fill="white"/>
                        <path d="M93.4603 74.6801C94.0899 74.6801 94.6003 74.1563 94.6003 73.5101C94.6003 72.8639 94.0899 72.3401 93.4603 72.3401C92.8307 72.3401 92.3203 72.8639 92.3203 73.5101C92.3203 74.1563 92.8307 74.6801 93.4603 74.6801Z" fill="white"/>
                        <path d="M97.3998 74.6801C98.0294 74.6801 98.5398 74.1563 98.5398 73.5101C98.5398 72.8639 98.0294 72.3401 97.3998 72.3401C96.7702 72.3401 96.2598 72.8639 96.2598 73.5101C96.2598 74.1563 96.7702 74.6801 97.3998 74.6801Z" fill="white"/>
                        <path d="M101.89 74.48C101.876 74.4864 101.861 74.4896 101.845 74.4896C101.83 74.4896 101.814 74.4864 101.8 74.48L101.03 73.7C101.007 73.6741 100.993 73.6402 100.993 73.605C100.993 73.5698 101.007 73.5359 101.03 73.51L101.8 72.72C101.825 72.6948 101.86 72.6807 101.895 72.6807C101.931 72.6807 101.965 72.6948 101.99 72.72C102.016 72.7452 102.03 72.7794 102.03 72.815C102.03 72.8506 102.016 72.8848 101.99 72.91L101.31 73.6L101.99 74.29C102.015 74.3175 102.029 74.3531 102.029 74.39C102.029 74.4269 102.015 74.4625 101.99 74.49C101.958 74.5 101.923 74.5 101.89 74.49V74.48Z" fill="white"/>
                        <path d="M103.19 74.48C103.172 74.4814 103.154 74.479 103.137 74.4731C103.12 74.4672 103.105 74.4578 103.092 74.4456C103.079 74.4334 103.068 74.4186 103.061 74.4022C103.054 74.3857 103.05 74.3679 103.05 74.35C103.041 74.3173 103.041 74.2826 103.05 74.25L103.73 73.56L103.05 72.87C103.038 72.8575 103.028 72.8427 103.021 72.8264C103.014 72.8101 103.011 72.7926 103.011 72.775C103.011 72.7574 103.014 72.7399 103.021 72.7236C103.028 72.7073 103.038 72.6925 103.05 72.68C103.063 72.6675 103.077 72.6576 103.094 72.6508C103.11 72.6441 103.127 72.6406 103.145 72.6406C103.163 72.6406 103.18 72.6441 103.197 72.6508C103.213 72.6576 103.228 72.6675 103.24 72.68L104.01 73.47C104.025 73.4812 104.036 73.4956 104.044 73.5121C104.053 73.5285 104.057 73.5466 104.057 73.565C104.057 73.5833 104.053 73.6015 104.044 73.6179C104.036 73.6344 104.025 73.6488 104.01 73.66L103.24 74.44C103.228 74.458 103.21 74.4719 103.19 74.48Z" fill="white"/>
                        <path d="M133.091 72.48H131.651C131.612 72.48 131.573 72.4878 131.537 72.503C131.501 72.5182 131.469 72.5404 131.442 72.5684C131.415 72.5964 131.394 72.6296 131.38 72.6659C131.366 72.7023 131.359 72.7411 131.361 72.78V74.21C131.361 74.2481 131.368 74.2858 131.383 74.321C131.397 74.3561 131.419 74.3881 131.445 74.415C131.472 74.442 131.504 74.4633 131.54 74.4779C131.575 74.4925 131.612 74.5 131.651 74.5H133.091C133.129 74.5 133.166 74.4925 133.201 74.4779C133.237 74.4633 133.269 74.442 133.296 74.415C133.323 74.3881 133.344 74.3561 133.358 74.321C133.373 74.2858 133.381 74.2481 133.381 74.21V72.78C133.382 72.7411 133.375 72.7023 133.361 72.6659C133.347 72.6296 133.326 72.5964 133.299 72.5684C133.272 72.5404 133.24 72.5182 133.204 72.503C133.168 72.4878 133.129 72.48 133.091 72.48Z" fill="white"/>
                        <path d="M129.58 72.4799H128.15C128.11 72.4785 128.07 72.4853 128.033 72.4999C127.996 72.5145 127.963 72.5365 127.935 72.5647C127.906 72.5928 127.884 72.6264 127.87 72.6635C127.855 72.7005 127.848 72.7401 127.85 72.7799V74.2099C127.85 74.248 127.857 74.2857 127.872 74.3209C127.886 74.3561 127.908 74.388 127.935 74.415C127.962 74.4419 127.994 74.4633 128.029 74.4778C128.064 74.4924 128.102 74.4999 128.14 74.4999H129.58C129.618 74.4999 129.656 74.4924 129.691 74.4778C129.726 74.4633 129.758 74.4419 129.785 74.415C129.812 74.388 129.833 74.3561 129.848 74.3209C129.862 74.2857 129.87 74.248 129.87 74.2099V72.7799C129.871 72.741 129.865 72.7022 129.851 72.6659C129.837 72.6295 129.816 72.5964 129.789 72.5684C129.761 72.5404 129.729 72.5181 129.693 72.5029C129.657 72.4877 129.619 72.4799 129.58 72.4799Z" fill="white"/>
                        <path d="M136.36 72.55H134.93C134.853 72.55 134.779 72.5805 134.725 72.6349C134.67 72.6893 134.64 72.763 134.64 72.84V74.28C134.64 74.3569 134.67 74.4307 134.725 74.485C134.779 74.5394 134.853 74.57 134.93 74.57H136.36C136.399 74.5713 136.437 74.5648 136.474 74.5508C136.51 74.5369 136.543 74.5157 136.571 74.4886C136.599 74.4616 136.621 74.4292 136.637 74.3933C136.652 74.3574 136.66 74.3189 136.66 74.28V72.84C136.66 72.801 136.652 72.7625 136.637 72.7266C136.621 72.6908 136.599 72.6583 136.571 72.6313C136.543 72.6042 136.51 72.5831 136.474 72.5691C136.437 72.5551 136.399 72.5486 136.36 72.55Z" fill="white"/>
                        <path d="M120.75 73.0901H109.3C109.205 73.0901 109.113 73.128 109.046 73.1956C108.978 73.2631 108.94 73.3546 108.94 73.4501C108.94 73.5456 108.978 73.6371 109.046 73.7047C109.113 73.7722 109.205 73.8101 109.3 73.8101H120.75C120.846 73.8101 120.937 73.7722 121.005 73.7047C121.073 73.6371 121.11 73.5456 121.11 73.4501C121.108 73.3554 121.069 73.2653 121.002 73.1983C120.935 73.1314 120.845 73.0926 120.75 73.0901Z" fill="white"/>
                        <path d="M58.4724 87H96.5418C96.7995 87 97 86.77 97 86.5C97 86.23 96.7995 86 96.5418 86H58.4724C58.2147 86 58 86.22 58 86.5C58 86.78 58.2147 87 58.4724 87Z" fill="#3F3D56"/>
                        <path d="M0.00277319 206.5C-0.0108188 206.619 0.0259198 206.738 0.104898 206.832C0.183876 206.925 0.298701 206.986 0.424663 207H186.588C186.726 206.968 186.846 206.885 186.92 206.77C186.995 206.655 187.018 206.517 186.986 206.386C186.965 206.293 186.917 206.207 186.847 206.138C186.776 206.07 186.686 206.022 186.588 206H0.424663C0.299988 206.017 0.186995 206.078 0.108577 206.171C0.030159 206.264 -0.00773594 206.382 0.00277319 206.5Z" fill="#CCCCCC"/>
                        <path d="M50.6299 199.72L54.1899 200.72L59.7499 187.47L54.4899 185.99L50.6299 199.72Z" fill="#A0616A"/>
                        <path d="M56.8297 84.0601C56.0978 84.1877 55.4444 84.5952 55.0077 85.1962C54.5709 85.7972 54.3852 86.5445 54.4897 87.2801C54.5158 87.4292 54.5525 87.5762 54.5997 87.7201L40.0098 100.59L45.4098 104.37L58.3097 89.3701C58.8829 89.1258 59.3599 88.6997 59.6671 88.1576C59.9743 87.6155 60.0948 86.9874 60.0098 86.3701C59.9549 86.0167 59.8309 85.6776 59.6449 85.3721C59.4589 85.0667 59.2144 84.8009 58.9255 84.5901C58.6367 84.3792 58.309 84.2275 57.9614 84.1434C57.6138 84.0593 57.2531 84.0446 56.8998 84.1001H56.8297V84.0601Z" fill="#A0616A"/>
                        <path d="M48.1301 206.82H11.4601C9.89008 206.82 8.62012 205.21 8.62012 203.23V164.23C8.62012 162.23 9.89008 160.64 11.4601 160.64H48.1301C49.7001 160.64 50.9701 162.25 50.9701 164.23V203.23C50.9701 205.21 49.7001 206.82 48.1301 206.82Z" fill="#F2F2F2"/>
                        <path d="M73.5898 202.42H77.2898L79.0499 188.16H73.5898V202.42Z" fill="#A0616A"/>
                        <path d="M73.4602 206.27H84.8202V206.13C84.8202 204.958 84.3545 203.834 83.5256 203.005C82.6967 202.176 81.5725 201.71 80.4003 201.71L78.3202 200.13L74.4502 201.71H73.4502L73.4602 206.27Z" fill="#2F2E41"/>
                        <path d="M49.46 203.39L60.36 206.48V206.34C60.6771 205.21 60.5329 204.001 59.9592 202.977C59.3855 201.954 58.4291 201.199 57.2999 200.88L55.73 198.8L51.5699 199.27L50.5699 199L49.46 203.39Z" fill="#2F2E41"/>
                        <path d="M41.1501 139C41.1501 139 39.9701 138.88 43.0001 139.93C46.2901 141.07 51.2701 140.93 56.0001 142.64L60.45 144.24L61.34 144.57C63.27 145.27 65.17 145.98 66.96 146.65L67.71 146.94C73.56 149.16 78.1601 151.07 78.9201 151.83C79.6801 152.59 80.0701 158.13 80.1601 164.91C80.3301 177.48 79.6601 194.5 79.6601 194.5H72.83C72.83 194.5 72.83 194.35 72.7 194.07C72.55 193.55 72.2701 192.59 71.8901 191.32C70.3401 186.05 67.21 175.61 65.48 170.82C65.2243 169.963 64.8651 169.14 64.4101 168.37C63.2501 167.18 64.41 166.65 65.57 165.9C66.73 165.15 65.57 164.9 64.72 163.9C63.87 162.9 65.0401 160.69 65.0401 160.69L63.0401 160.63L55.57 160.45L52.44 160.37H50.2L46.1501 160.29C44.8601 160.29 45.86 160.29 45.08 159.29C44.96 159.14 44.83 159 44.7 158.86C44.5041 158.642 44.29 158.441 44.06 158.26C43.89 158.19 44.1201 158.65 43.9901 159.26C43.9267 159.59 43.7706 159.895 43.5401 160.14C42.3901 161.42 38.8601 160.04 38.8601 160.04C33.0401 162.94 28.28 162.74 24.6 161.38C21.9644 160.359 19.5998 158.744 17.69 156.66C16.9466 155.862 16.2772 154.999 15.69 154.08L15.22 153.99C15.22 153.99 14.57 132.41 15.31 130.99C16.47 128.71 33.59 130.41 33.59 130.41L41.1501 139Z" fill="#2F2E41"/>
                        <path d="M69.3597 160.14C68.1497 166.74 63.0198 182.14 59.9198 191.23C58.5098 195.36 58.3998 193.8 58.3998 193.8L56.7898 193.3L54.0697 192.44L53.0697 192.12L51.8698 191.74C51.8698 191.74 51.2797 181.24 51.0897 173.35C51.1372 171.772 51.0165 170.193 50.7297 168.64C49.9797 167.16 51.2397 167 52.5697 166.64C53.8997 166.28 52.8697 165.7 52.3497 164.5C51.9897 163.7 52.6897 162.63 53.1797 162.02C53.3097 161.85 53.4597 161.69 53.6097 161.53L46.3798 159.07L45.2197 158.68C46.0758 158.426 46.8984 158.07 47.6698 157.62C48.8598 156.46 49.3898 157.62 50.1398 158.78C50.8898 159.94 51.1398 158.78 52.1398 157.92C53.1398 157.06 55.3397 158.24 55.3397 158.24C55.3397 158.24 55.3398 157.47 55.3998 156.24C55.3998 154.42 55.5097 151.6 55.5797 148.77C55.5797 147.7 55.5798 146.64 55.6598 145.63C57.6598 147.19 59.6597 148.73 61.4897 150.15C65.8197 153.56 69.0697 156.31 69.4897 157.15C69.6912 158.142 69.6466 159.169 69.3597 160.14Z" fill="#2F2E41"/>
                        <path d="M25.27 93.82C30.1356 93.82 34.08 89.8756 34.08 85.0099C34.08 80.1443 30.1356 76.2 25.27 76.2C20.4043 76.2 16.46 80.1443 16.46 85.0099C16.46 89.8756 20.4043 93.82 25.27 93.82Z" fill="#A0616A"/>
                        <path d="M23.6196 92.2899L22.8996 94.5799C21.2744 93.87 19.7536 92.9414 18.3796 91.8199C17.6925 91.2553 17.1246 90.5596 16.7091 89.7733C16.2936 88.9869 16.0388 88.1258 15.9596 87.2399C16.0195 86.3243 16.0195 85.4056 15.9596 84.4899C15.6524 83.5031 15.2885 82.5348 14.8696 81.5899C14.5995 80.5494 14.7014 79.4472 15.1579 78.4739C15.6145 77.5006 16.3968 76.7175 17.3696 76.2599C18.8296 75.6099 20.4996 75.7899 22.0796 75.6399C23.6596 75.4899 25.4396 74.7699 25.8896 73.2299C26.0496 72.6599 26.0295 71.9899 26.5495 71.6099C26.8059 71.4399 27.1161 71.3703 27.4205 71.4146C27.7249 71.4589 28.0023 71.6139 28.1996 71.8499C28.4958 72.2843 28.6839 72.7832 28.7483 73.3051C28.8126 73.8269 28.7513 74.3566 28.5696 74.8499C29.5992 74.7175 30.5896 74.3705 31.4767 73.8313C32.3638 73.2922 33.1279 72.5729 33.7196 71.7199C34.277 72.2442 34.6038 72.9682 34.6282 73.7331C34.6525 74.4979 34.3725 75.2412 33.8496 75.7999C34.3495 75.8008 34.8352 75.6337 35.2287 75.3254C35.6223 75.0171 35.9008 74.5855 36.0196 74.0999C36.6904 74.8943 37.1785 75.8262 37.4496 76.8299C37.569 77.3302 37.528 77.8553 37.3324 78.3309C37.1368 78.8065 36.7964 79.2085 36.3596 79.4799C35.8825 79.6671 35.3716 79.7522 34.8596 79.7299L30.9396 79.7999C29.7766 79.8207 28.6675 80.294 27.8478 81.1193C27.0281 81.9445 26.5624 83.0568 26.5495 84.2199C25.4153 84.0127 24.2468 84.1058 23.1597 84.4899C22.6643 84.6929 22.2422 85.0416 21.9496 85.4899C21.2396 86.7199 21.9496 87.9899 22.5696 89.0999C22.8984 89.5352 23.1234 90.0399 23.2274 90.5755C23.3314 91.111 23.3117 91.6632 23.1697 92.1899" fill="#2F2E41"/>
                        <path d="M63.8201 181.71L47.4901 175.93C47.2732 175.853 47.0738 175.734 46.9031 175.579C46.7324 175.425 46.5938 175.238 46.4954 175.03C46.3969 174.822 46.3404 174.596 46.3292 174.367C46.318 174.137 46.3523 173.907 46.43 173.69L54.0801 152.08C54.2341 151.643 54.5555 151.284 54.9736 151.084C55.3918 150.883 55.8724 150.857 56.3101 151.01L72.6401 156.79C72.8566 156.866 73.0558 156.984 73.2264 157.138C73.397 157.291 73.5356 157.477 73.6342 157.684C73.7327 157.892 73.7892 158.116 73.8005 158.346C73.8118 158.575 73.7777 158.804 73.7001 159.02C73.586 166.868 70.9023 174.463 66.0601 180.64C65.9017 181.077 65.5782 181.433 65.1592 181.634C64.7401 181.834 64.2592 181.861 63.8201 181.71Z" fill="#E6E6E6"/>
                        <path d="M57.7898 178.12L49.0997 175.04C48.6902 174.895 48.3549 174.594 48.1674 174.202C47.98 173.81 47.9556 173.36 48.0997 172.95L54.9097 153.71C55.0547 153.301 55.3561 152.965 55.7479 152.778C56.1397 152.59 56.5899 152.566 56.9997 152.71L70.9997 157.71C71.2033 157.781 71.3908 157.891 71.5515 158.035C71.7121 158.178 71.8426 158.352 71.9356 158.546C72.0286 158.741 72.0822 158.952 72.0932 159.167C72.1042 159.382 72.0724 159.597 71.9997 159.8C71.1997 165.59 69.9997 170.8 67.0797 173.7C66.4261 175.512 65.0835 176.993 63.3438 177.821C61.6042 178.649 59.6082 178.756 57.7898 178.12Z" fill="white"/>
                        <path d="M54.2997 163.18C54.363 163.007 54.4919 162.866 54.6585 162.787C54.8251 162.709 55.016 162.699 55.1898 162.76L66.1198 166.66C66.2928 166.723 66.434 166.852 66.5126 167.019C66.5913 167.185 66.601 167.376 66.5399 167.55C66.4764 167.723 66.3481 167.865 66.1819 167.945C66.0158 168.026 65.825 168.038 65.6498 167.98L54.7198 164.08C54.6321 164.05 54.5514 164.002 54.4825 163.94C54.4136 163.878 54.3579 163.803 54.3187 163.719C54.2795 163.635 54.2576 163.544 54.2543 163.451C54.2511 163.359 54.2665 163.266 54.2997 163.18Z" fill="#674399"/>
                        <path d="M64.1099 163.63C64.1731 163.457 64.3021 163.316 64.4687 163.237C64.6353 163.159 64.8262 163.149 64.9999 163.21L67.3999 164.07C67.5737 164.131 67.716 164.258 67.7957 164.424C67.8754 164.59 67.8859 164.781 67.8249 164.955C67.7639 165.129 67.6363 165.271 67.4704 165.351C67.3044 165.43 67.1136 165.441 66.9399 165.38L64.54 164.52C64.3651 164.459 64.2216 164.331 64.141 164.164C64.0604 163.997 64.0492 163.805 64.1099 163.63Z" fill="#674399"/>
                        <path d="M52.2398 168.95C52.303 168.777 52.4319 168.636 52.5986 168.557C52.7652 168.479 52.956 168.469 53.1298 168.53L64.0597 172.43C64.1462 172.46 64.2259 172.507 64.294 172.569C64.3621 172.63 64.4172 172.704 64.4563 172.787C64.4954 172.87 64.5176 172.96 64.5216 173.051C64.5257 173.143 64.5114 173.234 64.4798 173.32C64.4507 173.406 64.4046 173.486 64.3443 173.554C64.2839 173.622 64.2105 173.677 64.1285 173.716C64.0464 173.755 63.9574 173.777 63.8666 173.781C63.7758 173.786 63.685 173.772 63.5998 173.74L52.6698 169.84C52.495 169.779 52.3515 169.651 52.2709 169.484C52.1903 169.317 52.1791 169.125 52.2398 168.95Z" fill="#674399"/>
                        <path d="M53.2701 166.07C53.3313 165.895 53.4594 165.752 53.6262 165.671C53.793 165.59 53.9851 165.579 54.1601 165.64L65.0901 169.55C65.1761 169.58 65.2553 169.627 65.3232 169.688C65.3911 169.749 65.4463 169.822 65.4858 169.904C65.5253 169.987 65.5482 170.076 65.5532 170.167C65.5582 170.258 65.5453 170.349 65.5151 170.435C65.4849 170.521 65.438 170.6 65.3772 170.668C65.3163 170.736 65.2428 170.791 65.1606 170.831C65.0784 170.87 64.9893 170.893 64.8983 170.898C64.8073 170.903 64.7161 170.89 64.6301 170.86L53.7 166.96C53.5252 166.899 53.3817 166.771 53.3011 166.604C53.2205 166.437 53.2094 166.245 53.2701 166.07Z" fill="#674399"/>
                        <path d="M58.8704 151.32C58.6712 150.599 58.1969 149.986 57.5497 149.612C56.9025 149.238 56.1342 149.133 55.4104 149.32C55.2619 149.358 55.1178 149.412 54.9803 149.48L40.5503 136.48L37.4004 142.28L53.7904 153.4C54.102 153.944 54.5844 154.371 55.163 154.613C55.7415 154.855 56.3839 154.9 56.9904 154.74C57.6848 154.548 58.2749 154.089 58.6311 153.463C58.9873 152.837 59.0805 152.095 58.8904 151.4C58.8884 151.372 58.8816 151.345 58.8704 151.32Z" fill="#A0616A"/>
                        <path d="M51.2903 98.6199C51.2903 98.6199 48.0002 102.41 43.9902 106.7L43.1403 107.6C40.7103 110.18 38.0802 112.86 35.8002 114.94C33.3802 117.17 31.3402 118.72 30.3602 118.76C30.2772 118.77 30.1932 118.77 30.1102 118.76C27.1102 117.87 29.5902 118.93 28.3302 120.76C27.0702 122.59 27.2202 120.2 24.3302 118.76C21.4402 117.32 23.0002 118.76 21.8702 120.97C21.5202 121.67 18.4402 121.53 14.3802 120.97C13.9202 117.09 13.2502 113.75 13.2502 113.75C13.2413 111.428 13.4792 109.112 13.9602 106.84C21.0402 106.71 26.8902 106.64 27.1902 106.73C27.9602 106.96 29.6202 106.37 31.4502 105.33C31.9382 105.023 32.409 104.689 32.8602 104.33C33.4402 103.91 34.1302 103.38 34.8602 102.79C35.5902 102.2 37.2102 101.79 37.6902 100.58C39.0902 97.1899 38.6102 99.7199 38.9902 99.5799C39.5403 99.4436 40.0813 99.2733 40.6102 99.0699C40.7312 99.0177 40.8307 98.9259 40.8925 98.8096C40.9543 98.6933 40.9746 98.5594 40.9502 98.4299C40.9241 98.3199 40.8872 98.2127 40.8402 98.1099C40.4402 97.3099 41.0502 97.2299 41.6202 97.1099C41.8597 97.0989 42.0929 97.0303 42.3002 96.9099L46.3002 93.6599L46.9302 94.2899L50.6403 98.0399L51.2903 98.6199Z" fill="#674399"/>
                        <path d="M41.4401 135.48L40.3801 136.17L37.6401 137.95L33.9401 140.35L14.1702 153.18C14.1702 153.18 11.7301 148.18 13.9701 143.87C14.2588 143.321 14.4933 142.745 14.6702 142.15C15.5702 139.05 13.8301 137.7 13.8301 137.7C13.8301 137.7 10.9301 134.88 13.7101 132.28C14.3554 131.412 14.7058 130.361 14.7101 129.28C14.8836 126.506 14.7765 123.722 14.3901 120.97C13.9301 117.09 13.2601 113.75 13.2601 113.75C13.2512 111.428 13.4891 109.112 13.9701 106.84C14.437 104.46 15.3351 102.186 16.6201 100.13C17.079 99.4097 17.6119 98.7394 18.2101 98.1299C19.0452 97.2739 20.0232 96.57 21.1001 96.0499C22.7101 95.2799 25.4702 95.7399 27.9102 96.0499L29.3301 96.2299C29.7749 96.2818 30.2223 96.3084 30.6702 96.3099L31.6702 99.9999L32.05 101.39L32.2401 102.09L32.68 103.68L32.8601 104.33L35.7501 114.9L38.1201 123.53L39.4202 128.29L41.4202 135.41L41.4401 135.48Z" fill="#674399"/>
                        <path d="M48.0999 142.1L47.54 142.8L44.2299 146.91L43.78 147.47C43.78 147.47 39.0499 144.22 33.9399 140.39C27.7999 135.79 21.11 130.39 21.41 128.7C21.95 125.7 21.1799 128.2 19.2399 127.15C17.2999 126.1 19.68 125.99 20.76 123.01C21.84 120.03 20.62 121.69 18.28 120.82C16.72 120.24 17.54 106.93 18.28 98.14C19.1151 97.284 20.0931 96.5801 21.17 96.06C23.1 95.13 26.7 95.99 29.4 96.27C30.92 107.52 33.12 123.97 33.03 124.49C32.88 125.28 33.66 126.86 34.89 128.57C35.47 129.37 38.4699 132.44 41.4599 135.45C44.7599 138.81 48.0999 142.1 48.0999 142.1Z" fill="#674399"/>
                        <path d="M38.4253 98.8795L41.518 97L43 99.241L38 102L38.4253 98.8795Z" fill="#674399"/>
                        <path d="M57.9004 84.18V60.4799C57.9004 60.3199 57.6804 60.1899 57.4004 60.1899C57.1204 60.1899 56.9004 60.3199 56.9004 60.4799V84.18C56.9004 84.34 57.1304 84.4699 57.4004 84.4699C57.6704 84.4699 57.9004 84.34 57.9004 84.18Z" fill="#3F3D56"/>
                        <path d="M57.4102 8.5C58.3767 8.5 59.1602 7.7165 59.1602 6.75C59.1602 5.7835 58.3767 5 57.4102 5C56.4437 5 55.6602 5.7835 55.6602 6.75C55.6602 7.7165 56.4437 8.5 57.4102 8.5Z" fill="#674399"/>
                        <path d="M57.4102 21.5C58.3767 21.5 59.1602 20.7165 59.1602 19.75C59.1602 18.7835 58.3767 18 57.4102 18C56.4437 18 55.6602 18.7835 55.6602 19.75C55.6602 20.7165 56.4437 21.5 57.4102 21.5Z" fill="#674399"/>
                        <path d="M57.4102 34.5C58.3767 34.5 59.1602 33.7165 59.1602 32.75C59.1602 31.7835 58.3767 31 57.4102 31C56.4437 31 55.6602 31.7835 55.6602 32.75C55.6602 33.7165 56.4437 34.5 57.4102 34.5Z" fill="#674399"/>
                        <path d="M57.4102 47.5C58.3767 47.5 59.1602 46.7165 59.1602 45.75C59.1602 44.7835 58.3767 44 57.4102 44C56.4437 44 55.6602 44.7835 55.6602 45.75C55.6602 46.7165 56.4437 47.5 57.4102 47.5Z" fill="#674399"/>
                        <path d="M57.4102 60.5C58.3767 60.5 59.1602 59.7165 59.1602 58.75C59.1602 57.7835 58.3767 57 57.4102 57C56.4437 57 55.6602 57.7835 55.6602 58.75C55.6602 59.7165 56.4437 60.5 57.4102 60.5Z" fill="#674399"/>
                        <path d="M62.7755 36V34.5014H64.0122V30.1626H62.7755V28.664H67.0409V30.1626H65.7938V34.5014H67.0409V36H62.7755ZM68.7354 36V28.664H70.3283L73.0007 33.0132L71.8584 33.0027L74.5622 28.664H76.0923V36H74.3631V33.7154C74.3631 33.0866 74.3771 32.5206 74.405 32.0176C74.44 31.5146 74.4959 31.015 74.5727 30.519L74.7718 31.0639L72.7387 34.2184H72.047L70.0558 31.0849L70.255 30.519C70.3318 30.9871 70.3842 31.4691 70.4122 31.9652C70.4471 32.4543 70.4646 33.0377 70.4646 33.7154V36H68.7354ZM77.0033 36L79.9063 28.664H81.4154L84.2974 36H82.4949L81.1115 32.2796C81.0556 32.1329 80.9997 31.9757 80.9438 31.808C80.8879 31.6403 80.832 31.4691 80.7761 31.2945C80.7203 31.1128 80.6644 30.9382 80.6085 30.7705C80.5596 30.5958 80.5176 30.4351 80.4827 30.2884L80.7971 30.2779C80.7552 30.4526 80.7063 30.6238 80.6504 30.7914C80.6015 30.9591 80.5491 31.1268 80.4932 31.2945C80.4443 31.4552 80.3884 31.6194 80.3255 31.787C80.2626 31.9477 80.2032 32.1154 80.1473 32.2901L78.764 36H77.0033ZM78.3867 34.5957L78.9421 33.2542H82.3167L82.8617 34.5957H78.3867ZM88.414 36.1048C87.8271 36.1048 87.2962 36.0105 86.8211 35.8218C86.346 35.6332 85.9372 35.3677 85.5949 35.0254C85.2526 34.683 84.9906 34.2813 84.8089 33.8202C84.6272 33.3521 84.5364 32.8455 84.5364 32.3006C84.5364 31.7556 84.6307 31.2561 84.8194 30.8019C85.015 30.3408 85.291 29.9391 85.6473 29.5967C86.0036 29.2544 86.4228 28.9889 86.9049 28.8002C87.394 28.6116 87.925 28.5173 88.4979 28.5173C88.9031 28.5173 89.2839 28.5697 89.6402 28.6745C90.0035 28.7793 90.3319 28.9225 90.6253 29.1042C90.9187 29.2858 91.1668 29.4954 91.3694 29.733L90.2899 30.8753C90.1153 30.7076 89.9336 30.5679 89.745 30.4561C89.5633 30.3443 89.3677 30.257 89.1581 30.1941C88.9485 30.1242 88.7249 30.0893 88.4874 30.0893C88.18 30.0893 87.897 30.1452 87.6385 30.257C87.387 30.3687 87.1634 30.5259 86.9678 30.7286C86.7791 30.9242 86.6324 31.1582 86.5276 31.4307C86.4228 31.6962 86.3704 31.9862 86.3704 32.3006C86.3704 32.615 86.4263 32.9084 86.5381 33.1809C86.6499 33.4534 86.8036 33.6909 86.9992 33.8935C87.1948 34.0891 87.4254 34.2463 87.6909 34.3651C87.9634 34.4769 88.2533 34.5328 88.5607 34.5328C88.7773 34.5328 88.9799 34.4979 89.1686 34.428C89.3642 34.3581 89.5319 34.2638 89.6716 34.145C89.8114 34.0263 89.9231 33.8865 90.007 33.7258C90.0908 33.5582 90.1327 33.38 90.1327 33.1914V32.9189L90.3633 33.2752H88.3407V31.8814H91.7886C91.8026 31.9582 91.813 32.063 91.82 32.1958C91.827 32.3285 91.8305 32.4578 91.8305 32.5835C91.8375 32.7093 91.841 32.8036 91.841 32.8665C91.841 33.3416 91.7536 33.7782 91.579 34.1765C91.4113 34.5677 91.1738 34.9066 90.8663 35.193C90.5589 35.4795 90.1956 35.7031 89.7764 35.8638C89.3572 36.0245 88.9031 36.1048 88.414 36.1048ZM93.2058 36V28.664H98.32V30.1836H94.935V34.4804H98.4248V36H93.2058ZM94.0442 32.9922V31.546H97.8484V32.9922H94.0442ZM103.317 36V28.664H106.388C106.926 28.664 107.418 28.7548 107.866 28.9365C108.313 29.1111 108.697 29.3627 109.018 29.691C109.347 30.0194 109.598 30.4072 109.773 30.8543C109.948 31.3015 110.035 31.794 110.035 32.332C110.035 32.87 109.948 33.366 109.773 33.8202C109.598 34.2673 109.347 34.6551 109.018 34.9834C108.697 35.3048 108.313 35.5563 107.866 35.738C107.418 35.9127 106.926 36 106.388 36H103.317ZM105.099 34.7843L104.858 34.428H106.336C106.629 34.428 106.891 34.3791 107.122 34.2813C107.352 34.1765 107.548 34.0333 107.708 33.8516C107.876 33.6699 108.005 33.4499 108.096 33.1914C108.187 32.9329 108.232 32.6464 108.232 32.332C108.232 32.0176 108.187 31.7311 108.096 31.4726C108.005 31.2141 107.876 30.9941 107.708 30.8124C107.548 30.6307 107.352 30.491 107.122 30.3932C106.891 30.2884 106.629 30.236 106.336 30.236H104.826L105.099 29.9006V34.7843ZM111.413 36V28.664H116.527V30.1836H113.142V34.4804H116.632V36H111.413ZM112.251 32.9922V31.546H116.055V32.9922H112.251ZM118.167 36V28.664H119.949V34.428H123.219V36H118.167ZM124.407 36V34.5014H125.644V30.1626H124.407V28.664H128.672V30.1626H127.425V34.5014H128.672V36H124.407ZM132.421 36L129.486 28.664H131.341L132.756 32.4054C132.84 32.6219 132.91 32.8106 132.966 32.9713C133.029 33.132 133.081 33.2822 133.123 33.4219C133.172 33.5617 133.214 33.7049 133.249 33.8516C133.291 33.9913 133.336 34.152 133.385 34.3337H133.06C133.116 34.0961 133.172 33.8865 133.228 33.7049C133.284 33.5162 133.347 33.3241 133.416 33.1285C133.486 32.9259 133.574 32.6848 133.678 32.4054L135.041 28.664H136.864L133.909 36H132.421ZM137.828 36V28.664H142.942V30.1836H139.557V34.4804H143.047V36H137.828ZM138.666 32.9922V31.546H142.47V32.9922H138.666ZM144.582 36V28.664H147.884C148.352 28.664 148.774 28.7653 149.152 28.9679C149.536 29.1705 149.836 29.45 150.053 29.8063C150.269 30.1557 150.378 30.5539 150.378 31.001C150.378 31.4622 150.269 31.8779 150.053 32.2482C149.836 32.6115 149.539 32.8979 149.162 33.1075C148.785 33.3171 148.359 33.4219 147.884 33.4219H146.28V36H144.582ZM148.649 36L146.783 32.6883L148.607 32.4263L150.682 36H148.649ZM146.28 32.0595H147.726C147.908 32.0595 148.065 32.0211 148.198 31.9442C148.338 31.8604 148.442 31.7451 148.512 31.5984C148.589 31.4517 148.628 31.284 148.628 31.0954C148.628 30.9067 148.586 30.7425 148.502 30.6028C148.418 30.4561 148.296 30.3443 148.135 30.2674C147.981 30.1906 147.793 30.1522 147.569 30.1522H146.28V32.0595ZM153.316 36V32.3425L153.389 32.856L150.423 28.664H152.446L154.71 31.9128L153.787 31.8814L155.831 28.664H157.791L154.951 32.9713L155.108 32.2586V36H153.316Z" fill="#555160"/>
                        <path d="M66.2549 23.1048C65.7029 23.1048 65.1929 23.014 64.7248 22.8323C64.2637 22.6437 63.8619 22.3817 63.5196 22.0463C63.1773 21.704 62.9118 21.3022 62.7231 20.8411C62.5415 20.373 62.4506 19.8595 62.4506 19.3006C62.4506 18.7556 62.5485 18.2526 62.7441 17.7914C62.9397 17.3303 63.2087 16.9321 63.551 16.5967C63.9004 16.2544 64.3091 15.9889 64.7772 15.8002C65.2523 15.6116 65.7693 15.5173 66.3282 15.5173C66.6776 15.5173 67.0199 15.5627 67.3553 15.6535C67.6906 15.7443 68.0015 15.8806 68.288 16.0622C68.5814 16.2369 68.833 16.4465 69.0426 16.691L67.9526 17.9382C67.8059 17.7845 67.6487 17.6517 67.481 17.5399C67.3203 17.4211 67.1422 17.3303 66.9466 17.2674C66.7509 17.2046 66.5413 17.1731 66.3178 17.1731C66.0383 17.1731 65.7728 17.2255 65.5213 17.3303C65.2767 17.4281 65.0602 17.5714 64.8715 17.76C64.6899 17.9417 64.5466 18.1652 64.4418 18.4307C64.337 18.6962 64.2846 18.9931 64.2846 19.3215C64.2846 19.6429 64.337 19.9363 64.4418 20.2018C64.5466 20.4603 64.6934 20.6839 64.882 20.8726C65.0706 21.0612 65.2977 21.2044 65.5632 21.3022C65.8357 21.4001 66.1361 21.449 66.4645 21.449C66.6881 21.449 66.9011 21.4175 67.1038 21.3546C67.3064 21.2918 67.4915 21.2079 67.6592 21.1031C67.8339 20.9913 67.9876 20.8656 68.1203 20.7258L68.9797 22.0882C68.805 22.2839 68.571 22.4585 68.2775 22.6122C67.9911 22.7659 67.6697 22.8882 67.3134 22.979C66.964 23.0629 66.6112 23.1048 66.2549 23.1048ZM72.6302 23.1048C72.1482 23.1048 71.7115 23.0489 71.3202 22.9371C70.936 22.8183 70.5936 22.6507 70.2932 22.4341C69.9928 22.2105 69.7238 21.9485 69.4862 21.6481L70.5657 20.4219C70.915 20.89 71.2643 21.2044 71.6137 21.3651C71.97 21.5258 72.3368 21.6062 72.7141 21.6062C72.9027 21.6062 73.0739 21.5817 73.2276 21.5328C73.3813 21.4839 73.5001 21.414 73.5839 21.3232C73.6678 21.2254 73.7097 21.1066 73.7097 20.9669C73.7097 20.8621 73.6817 20.7678 73.6258 20.6839C73.5769 20.6001 73.5071 20.5267 73.4162 20.4638C73.3254 20.401 73.2171 20.3451 73.0914 20.2962C72.9656 20.2403 72.8329 20.1949 72.6931 20.1599C72.5534 20.118 72.4102 20.0831 72.2634 20.0551C71.8582 19.9643 71.5054 19.8525 71.205 19.7198C70.9045 19.587 70.653 19.4263 70.4504 19.2377C70.2548 19.0421 70.1081 18.822 70.0102 18.5774C69.9124 18.3259 69.8635 18.0465 69.8635 17.739C69.8635 17.4107 69.9369 17.1102 70.0836 16.8378C70.2373 16.5583 70.4399 16.3207 70.6914 16.1251C70.9499 15.9225 71.2469 15.7688 71.5822 15.664C71.9176 15.5522 72.2669 15.4963 72.6302 15.4963C73.1123 15.4963 73.5245 15.5487 73.8669 15.6535C74.2162 15.7513 74.5131 15.8946 74.7577 16.0832C75.0092 16.2718 75.2223 16.4989 75.397 16.7644L74.2966 17.8229C74.1498 17.6412 73.9891 17.491 73.8145 17.3722C73.6468 17.2535 73.4651 17.1626 73.2695 17.0998C73.0809 17.0369 72.8853 17.0054 72.6826 17.0054C72.473 17.0054 72.2914 17.0334 72.1377 17.0893C71.991 17.1382 71.8757 17.2115 71.7918 17.3094C71.708 17.4002 71.6661 17.512 71.6661 17.6447C71.6661 17.7635 71.701 17.8648 71.7709 17.9486C71.8407 18.0325 71.9351 18.1093 72.0538 18.1792C72.1726 18.2421 72.3089 18.298 72.4626 18.3469C72.6163 18.3888 72.777 18.4237 72.9446 18.4517C73.3289 18.5285 73.6747 18.6298 73.9822 18.7556C74.2966 18.8814 74.5655 19.0351 74.7891 19.2167C75.0197 19.3984 75.1943 19.615 75.3131 19.8665C75.4389 20.111 75.5018 20.3975 75.5018 20.7258C75.5018 21.2359 75.376 21.669 75.1245 22.0254C74.8799 22.3747 74.5411 22.6437 74.1079 22.8323C73.6817 23.014 73.1892 23.1048 72.6302 23.1048ZM79.2723 23.1048C78.7903 23.1048 78.3536 23.0489 77.9623 22.9371C77.5781 22.8183 77.2357 22.6507 76.9353 22.4341C76.6349 22.2105 76.3659 21.9485 76.1283 21.6481L77.2078 20.4219C77.5571 20.89 77.9065 21.2044 78.2558 21.3651C78.6121 21.5258 78.9789 21.6062 79.3562 21.6062C79.5448 21.6062 79.716 21.5817 79.8697 21.5328C80.0234 21.4839 80.1422 21.414 80.226 21.3232C80.3099 21.2254 80.3518 21.1066 80.3518 20.9669C80.3518 20.8621 80.3238 20.7678 80.2679 20.6839C80.219 20.6001 80.1492 20.5267 80.0583 20.4638C79.9675 20.401 79.8592 20.3451 79.7335 20.2962C79.6077 20.2403 79.475 20.1949 79.3352 20.1599C79.1955 20.118 79.0523 20.0831 78.9055 20.0551C78.5003 19.9643 78.1475 19.8525 77.8471 19.7198C77.5466 19.587 77.2951 19.4263 77.0925 19.2377C76.8969 19.0421 76.7502 18.822 76.6523 18.5774C76.5545 18.3259 76.5056 18.0465 76.5056 17.739C76.5056 17.4107 76.579 17.1102 76.7257 16.8378C76.8794 16.5583 77.082 16.3207 77.3335 16.1251C77.5921 15.9225 77.889 15.7688 78.2243 15.664C78.5597 15.5522 78.909 15.4963 79.2723 15.4963C79.7544 15.4963 80.1666 15.5487 80.509 15.6535C80.8583 15.7513 81.1553 15.8946 81.3998 16.0832C81.6513 16.2718 81.8644 16.4989 82.0391 16.7644L80.9387 17.8229C80.7919 17.6412 80.6313 17.491 80.4566 17.3722C80.2889 17.2535 80.1073 17.1626 79.9116 17.0998C79.723 17.0369 79.5274 17.0054 79.3247 17.0054C79.1151 17.0054 78.9335 17.0334 78.7798 17.0893C78.6331 17.1382 78.5178 17.2115 78.4339 17.3094C78.3501 17.4002 78.3082 17.512 78.3082 17.6447C78.3082 17.7635 78.3431 17.8648 78.413 17.9486C78.4829 18.0325 78.5772 18.1093 78.6959 18.1792C78.8147 18.2421 78.951 18.298 79.1047 18.3469C79.2584 18.3888 79.4191 18.4237 79.5867 18.4517C79.971 18.5285 80.3169 18.6298 80.6243 18.7556C80.9387 18.8814 81.2077 19.0351 81.4312 19.2167C81.6618 19.3984 81.8365 19.615 81.9552 19.8665C82.081 20.111 82.1439 20.3975 82.1439 20.7258C82.1439 21.2359 82.0181 21.669 81.7666 22.0254C81.5221 22.3747 81.1832 22.6437 80.75 22.8323C80.3238 23.014 79.8313 23.1048 79.2723 23.1048ZM86.84 23V15.664H89.9106C90.4486 15.664 90.9411 15.7548 91.3883 15.9365C91.8354 16.1111 92.2197 16.3627 92.5411 16.691C92.8695 17.0194 93.121 17.4072 93.2957 17.8543C93.4703 18.3015 93.5577 18.794 93.5577 19.332C93.5577 19.87 93.4703 20.366 93.2957 20.8202C93.121 21.2673 92.8695 21.6551 92.5411 21.9834C92.2197 22.3048 91.8354 22.5563 91.3883 22.738C90.9411 22.9127 90.4486 23 89.9106 23H86.84ZM88.6216 21.7843L88.3805 21.428H89.8582C90.1517 21.428 90.4137 21.3791 90.6442 21.2813C90.8748 21.1765 91.0704 21.0333 91.2311 20.8516C91.3988 20.6699 91.528 20.4499 91.6189 20.1914C91.7097 19.9329 91.7551 19.6464 91.7551 19.332C91.7551 19.0176 91.7097 18.7311 91.6189 18.4726C91.528 18.2141 91.3988 17.9941 91.2311 17.8124C91.0704 17.6307 90.8748 17.491 90.6442 17.3932C90.4137 17.2884 90.1517 17.236 89.8582 17.236H88.3491L88.6216 16.9006V21.7843ZM94.9354 23V15.664H100.05V17.1836H96.6646V21.4804H100.154V23H94.9354ZM95.7738 19.9922V18.546H99.578V19.9922H95.7738ZM101.69 23V15.664H103.472V21.428H106.741V23H101.69ZM107.93 23V21.5014H109.166V17.1626H107.93V15.664H112.195V17.1626H110.948V21.5014H112.195V23H107.93ZM115.944 23L113.009 15.664H114.864L116.279 19.4054C116.363 19.6219 116.433 19.8106 116.488 19.9713C116.551 20.132 116.604 20.2822 116.646 20.4219C116.695 20.5617 116.736 20.7049 116.771 20.8516C116.813 20.9913 116.859 21.152 116.908 21.3337H116.583C116.639 21.0961 116.695 20.8865 116.75 20.7049C116.806 20.5162 116.869 20.3241 116.939 20.1285C117.009 19.9259 117.096 19.6848 117.201 19.4054L118.564 15.664H120.387L117.432 23H115.944ZM121.35 23V15.664H126.465V17.1836H123.079V21.4804H126.569V23H121.35ZM122.189 19.9922V18.546H125.993V19.9922H122.189ZM128.105 23V15.664H131.406C131.874 15.664 132.297 15.7653 132.674 15.9679C133.059 16.1705 133.359 16.45 133.576 16.8063C133.792 17.1557 133.9 17.5539 133.9 18.001C133.9 18.4622 133.792 18.8779 133.576 19.2482C133.359 19.6115 133.062 19.8979 132.685 20.1075C132.307 20.3171 131.881 20.4219 131.406 20.4219H129.803V23H128.105ZM132.171 23L130.306 19.6883L132.129 19.4263L134.204 23H132.171ZM129.803 19.0595H131.249C131.431 19.0595 131.588 19.0211 131.721 18.9442C131.86 18.8604 131.965 18.7451 132.035 18.5984C132.112 18.4517 132.15 18.284 132.15 18.0954C132.15 17.9067 132.108 17.7425 132.024 17.6028C131.941 17.4561 131.818 17.3443 131.658 17.2674C131.504 17.1906 131.315 17.1522 131.092 17.1522H129.803V19.0595ZM136.838 23V19.3425L136.912 19.856L133.946 15.664H135.969L138.232 18.9128L137.31 18.8814L139.354 15.664H141.313L138.473 19.9713L138.63 19.2586V23H136.838Z" fill="#555160"/>
                        <path d="M64.7353 10.1048C64.4698 10.1048 64.2183 10.0734 63.9807 10.0105C63.7432 9.95459 63.5266 9.87075 63.331 9.75896C63.1353 9.64019 62.9607 9.50045 62.807 9.33976C62.6533 9.17208 62.5205 8.98693 62.4087 8.78432L63.4253 7.72584C63.5231 7.87256 63.6174 7.99483 63.7082 8.09264C63.7991 8.18347 63.8864 8.26032 63.9702 8.3232C64.0611 8.38608 64.1519 8.43149 64.2427 8.45944C64.3405 8.48739 64.4418 8.50136 64.5466 8.50136C64.7143 8.50136 64.861 8.46293 64.9868 8.38608C65.1195 8.30224 65.2209 8.19045 65.2907 8.05072C65.3606 7.91099 65.3955 7.7468 65.3955 7.55816V4.21504H64.0541V2.664H68.267V4.21504H67.1352V7.76776C67.1352 8.12408 67.0723 8.44547 66.9466 8.73192C66.8278 9.01837 66.6601 9.2664 66.4435 9.476C66.2269 9.67861 65.9719 9.83581 65.6785 9.9476C65.392 10.0524 65.0776 10.1048 64.7353 10.1048ZM72.3232 10.1048C71.8411 10.1048 71.4045 10.0489 71.0132 9.93712C70.6289 9.81835 70.2866 9.65067 69.9862 9.43408C69.6857 9.21051 69.4168 8.94851 69.1792 8.64808L70.2586 7.42192C70.608 7.89003 70.9573 8.20443 71.3066 8.36512C71.663 8.52581 72.0298 8.60616 72.407 8.60616C72.5957 8.60616 72.7669 8.58171 72.9206 8.5328C73.0743 8.48389 73.193 8.41403 73.2769 8.3232C73.3607 8.22539 73.4026 8.10661 73.4026 7.96688C73.4026 7.86208 73.3747 7.76776 73.3188 7.68392C73.2699 7.60008 73.2 7.52672 73.1092 7.46384C73.0184 7.40096 72.9101 7.34507 72.7843 7.29616C72.6586 7.24027 72.5258 7.19485 72.3861 7.15992C72.2464 7.118 72.1031 7.08307 71.9564 7.05512C71.5512 6.96429 71.1984 6.85251 70.8979 6.71976C70.5975 6.58701 70.346 6.42632 70.1434 6.23768C69.9477 6.04205 69.801 5.82197 69.7032 5.57744C69.6054 5.32592 69.5565 5.04645 69.5565 4.73904C69.5565 4.41067 69.6298 4.11024 69.7766 3.83776C69.9303 3.55829 70.1329 3.32075 70.3844 3.12512C70.6429 2.92251 70.9398 2.7688 71.2752 2.664C71.6106 2.55221 71.9599 2.49632 72.3232 2.49632C72.8053 2.49632 73.2175 2.54872 73.5598 2.65352C73.9092 2.75133 74.2061 2.89456 74.4506 3.0832C74.7022 3.27184 74.9153 3.49891 75.0899 3.7644L73.9895 4.82288C73.8428 4.64123 73.6821 4.49101 73.5074 4.37224C73.3398 4.25347 73.1581 4.16264 72.9625 4.09976C72.7738 4.03688 72.5782 4.00544 72.3756 4.00544C72.166 4.00544 71.9844 4.03339 71.8306 4.08928C71.6839 4.13819 71.5686 4.21155 71.4848 4.30936C71.401 4.40019 71.359 4.51197 71.359 4.64472C71.359 4.76349 71.394 4.8648 71.4638 4.94864C71.5337 5.03248 71.628 5.10933 71.7468 5.1792C71.8656 5.24208 72.0018 5.29797 72.1555 5.34688C72.3092 5.3888 72.4699 5.42373 72.6376 5.45168C73.0219 5.52853 73.3677 5.62984 73.6751 5.7556C73.9895 5.88136 74.2585 6.03507 74.4821 6.21672C74.7126 6.39837 74.8873 6.61496 75.0061 6.86648C75.1318 7.11101 75.1947 7.39747 75.1947 7.72584C75.1947 8.23587 75.069 8.66904 74.8174 9.02536C74.5729 9.37469 74.2341 9.64368 73.8009 9.83232C73.3747 10.014 72.8821 10.1048 72.3232 10.1048ZM79.8908 10V2.664H82.9615C83.4994 2.664 83.992 2.75483 84.4392 2.93648C84.8863 3.11115 85.2706 3.36267 85.592 3.69104C85.9203 4.01941 86.1718 4.40717 86.3465 4.85432C86.5212 5.30147 86.6085 5.79403 86.6085 6.332C86.6085 6.86997 86.5212 7.36603 86.3465 7.82016C86.1718 8.26731 85.9203 8.65507 85.592 8.98344C85.2706 9.30483 84.8863 9.55635 84.4392 9.738C83.992 9.91267 83.4994 10 82.9615 10H79.8908ZM81.6724 8.78432L81.4314 8.428H82.9091C83.2025 8.428 83.4645 8.37909 83.6951 8.28128C83.9256 8.17648 84.1213 8.03325 84.282 7.8516C84.4496 7.66995 84.5789 7.44987 84.6697 7.19136C84.7605 6.93285 84.806 6.6464 84.806 6.332C84.806 6.0176 84.7605 5.73115 84.6697 5.47264C84.5789 5.21413 84.4496 4.99405 84.282 4.8124C84.1213 4.63075 83.9256 4.49101 83.6951 4.3932C83.4645 4.2884 83.2025 4.236 82.9091 4.236H81.4L81.6724 3.90064V8.78432ZM87.9862 10V2.664H93.1005V4.1836H89.7154V8.4804H93.2053V10H87.9862ZM88.8246 6.99224V5.546H92.6289V6.99224H88.8246ZM94.7409 10V2.664H96.5225V8.428H99.7923V10H94.7409ZM100.98 10V8.50136H102.217V4.16264H100.98V2.664H105.246V4.16264H103.999V8.50136H105.246V10H100.98ZM108.994 10L106.06 2.664H107.915L109.33 6.40536C109.414 6.62195 109.483 6.81059 109.539 6.97128C109.602 7.13197 109.655 7.28219 109.697 7.42192C109.745 7.56165 109.787 7.70488 109.822 7.8516C109.864 7.99133 109.91 8.15203 109.959 8.33368H109.634C109.69 8.09613 109.745 7.88653 109.801 7.70488C109.857 7.51624 109.92 7.32411 109.99 7.12848C110.06 6.92587 110.147 6.68483 110.252 6.40536L111.614 2.664H113.438L110.483 10H108.994ZM114.401 10V2.664H119.515V4.1836H116.13V8.4804H119.62V10H114.401ZM115.24 6.99224V5.546H119.044V6.99224H115.24ZM121.156 10V2.664H124.457C124.925 2.664 125.348 2.76531 125.725 2.96792C126.109 3.17053 126.41 3.45 126.626 3.80632C126.843 4.15565 126.951 4.55389 126.951 5.00104C126.951 5.46216 126.843 5.87787 126.626 6.24816C126.41 6.61147 126.113 6.89792 125.736 7.10752C125.358 7.31712 124.932 7.42192 124.457 7.42192H122.854V10H121.156ZM125.222 10L123.357 6.68832L125.18 6.42632L127.255 10H125.222ZM122.854 6.05952H124.3C124.481 6.05952 124.639 6.02109 124.771 5.94424C124.911 5.8604 125.016 5.74512 125.086 5.5984C125.163 5.45168 125.201 5.284 125.201 5.09536C125.201 4.90672 125.159 4.74253 125.075 4.6028C124.992 4.45608 124.869 4.34429 124.709 4.26744C124.555 4.19059 124.366 4.15216 124.143 4.15216H122.854V6.05952ZM129.889 10V6.34248L129.963 6.856L126.997 2.664H129.019L131.283 5.9128L130.361 5.88136L132.404 2.664H134.364L131.524 6.97128L131.681 6.25864V10H129.889Z" fill="#555160"/>
                        <path d="M62.9222 49V41.664H64.7038V49H62.9222ZM63.7502 46.1914V44.7032H67.5439V46.1914H63.7502ZM63.7502 43.236V41.664H67.9736V43.236H63.7502ZM72.6516 49.1048C72.0927 49.1048 71.5826 49.0105 71.1215 48.8218C70.6604 48.6332 70.2587 48.3677 69.9163 48.0254C69.574 47.683 69.3085 47.2813 69.1198 46.8202C68.9312 46.359 68.8369 45.8525 68.8369 45.3006C68.8369 44.7486 68.9312 44.2421 69.1198 43.781C69.3085 43.3198 69.574 42.9181 69.9163 42.5758C70.2587 42.2334 70.6604 41.9679 71.1215 41.7793C71.5826 41.5906 72.0892 41.4963 72.6411 41.4963C73.1931 41.4963 73.6996 41.5906 74.1607 41.7793C74.6218 41.9679 75.0236 42.2334 75.3659 42.5758C75.7083 42.9181 75.9703 43.3198 76.1519 43.781C76.3406 44.2421 76.4349 44.7486 76.4349 45.3006C76.4349 45.8455 76.3406 46.3521 76.1519 46.8202C75.9703 47.2813 75.7083 47.683 75.3659 48.0254C75.0236 48.3677 74.6218 48.6332 74.1607 48.8218C73.6996 49.0105 73.1966 49.1048 72.6516 49.1048ZM72.6411 47.428C72.9276 47.428 73.1896 47.3756 73.4271 47.2708C73.6717 47.166 73.8813 47.0193 74.0559 46.8306C74.2376 46.635 74.3773 46.4079 74.4751 46.1494C74.5729 45.8909 74.6218 45.608 74.6218 45.3006C74.6218 44.9931 74.5729 44.7102 74.4751 44.4517C74.3773 44.1932 74.2376 43.9696 74.0559 43.781C73.8813 43.5853 73.6717 43.4351 73.4271 43.3303C73.1896 43.2255 72.9276 43.1731 72.6411 43.1731C72.3547 43.1731 72.0892 43.2255 71.8446 43.3303C71.6071 43.4351 71.3975 43.5853 71.2158 43.781C71.0342 43.9696 70.8945 44.1932 70.7966 44.4517C70.7058 44.7102 70.6604 44.9931 70.6604 45.3006C70.6604 45.608 70.7058 45.8944 70.7966 46.1599C70.8945 46.4184 71.0342 46.642 71.2158 46.8306C71.3975 47.0193 71.6071 47.166 71.8446 47.2708C72.0892 47.3756 72.3547 47.428 72.6411 47.428ZM77.8133 49V41.664H79.4062L83.2524 46.904L82.9065 46.8516C82.8716 46.621 82.8437 46.401 82.8227 46.1914C82.8017 45.9818 82.7808 45.7757 82.7598 45.573C82.7458 45.3704 82.7319 45.1643 82.7179 44.9547C82.7109 44.7451 82.7039 44.5181 82.6969 44.2735C82.6969 44.029 82.6969 43.7635 82.6969 43.477V41.664H84.4261V49H82.8122L78.7984 43.5923L79.3329 43.6657C79.3678 44.001 79.3957 44.2875 79.4167 44.525C79.4446 44.7556 79.4656 44.9617 79.4796 45.1434C79.5005 45.325 79.5145 45.4892 79.5215 45.6359C79.5285 45.7826 79.532 45.9294 79.532 46.0761C79.539 46.2158 79.5425 46.373 79.5425 46.5477V49H77.8133ZM87.8598 49V43.236H85.68V41.664H91.8736V43.236H89.6414V49H87.8598ZM96.491 49V41.664H99.5616C100.1 41.664 100.592 41.7548 101.039 41.9365C101.486 42.1111 101.871 42.3627 102.192 42.691C102.52 43.0194 102.772 43.4072 102.947 43.8543C103.121 44.3015 103.209 44.794 103.209 45.332C103.209 45.87 103.121 46.366 102.947 46.8202C102.772 47.2673 102.52 47.6551 102.192 47.9834C101.871 48.3048 101.486 48.5563 101.039 48.738C100.592 48.9127 100.1 49 99.5616 49H96.491ZM98.2726 47.7843L98.0315 47.428H99.5092C99.8027 47.428 100.065 47.3791 100.295 47.2813C100.526 47.1765 100.721 47.0333 100.882 46.8516C101.05 46.6699 101.179 46.4499 101.27 46.1914C101.361 45.9329 101.406 45.6464 101.406 45.332C101.406 45.0176 101.361 44.7311 101.27 44.4726C101.179 44.2141 101.05 43.9941 100.882 43.8124C100.721 43.6307 100.526 43.491 100.295 43.3932C100.065 43.2884 99.8027 43.236 99.5092 43.236H98.0001L98.2726 42.9006V47.7843ZM104.586 49V41.664H109.701V43.1836H106.316V47.4804H109.805V49H104.586ZM105.425 45.9922V44.546H109.229V45.9922H105.425ZM111.341 49V41.664H113.123V47.428H116.392V49H111.341ZM117.581 49V47.5014H118.817V43.1626H117.581V41.664H121.846V43.1626H120.599V47.5014H121.846V49H117.581ZM125.595 49L122.66 41.664H124.515L125.93 45.4054C126.014 45.6219 126.084 45.8106 126.139 45.9713C126.202 46.132 126.255 46.2822 126.297 46.4219C126.346 46.5617 126.388 46.7049 126.422 46.8516C126.464 46.9913 126.51 47.152 126.559 47.3337H126.234C126.29 47.0961 126.346 46.8865 126.401 46.7049C126.457 46.5162 126.52 46.3241 126.59 46.1285C126.66 45.9259 126.747 45.6848 126.852 45.4054L128.215 41.664H130.038L127.083 49H125.595ZM131.001 49V41.664H136.116V43.1836H132.73V47.4804H136.22V49H131.001ZM131.84 45.9922V44.546H135.644V45.9922H131.84ZM137.756 49V41.664H141.057C141.525 41.664 141.948 41.7653 142.325 41.9679C142.71 42.1705 143.01 42.45 143.227 42.8063C143.443 43.1557 143.551 43.5539 143.551 44.001C143.551 44.4622 143.443 44.8779 143.227 45.2482C143.01 45.6115 142.713 45.8979 142.336 46.1075C141.958 46.3171 141.532 46.4219 141.057 46.4219H139.454V49H137.756ZM141.822 49L139.957 45.6883L141.78 45.4263L143.855 49H141.822ZM139.454 45.0595H140.9C141.082 45.0595 141.239 45.0211 141.372 44.9442C141.511 44.8604 141.616 44.7451 141.686 44.5984C141.763 44.4517 141.801 44.284 141.801 44.0954C141.801 43.9067 141.759 43.7425 141.676 43.6028C141.592 43.4561 141.469 43.3443 141.309 43.2674C141.155 43.1906 140.966 43.1522 140.743 43.1522H139.454V45.0595ZM146.489 49V45.3425L146.563 45.856L143.597 41.664H145.62L147.883 44.9128L146.961 44.8814L149.005 41.664H150.964L148.124 45.9713L148.282 45.2586V49H146.489Z" fill="#555160"/>
                        <path d="M66.2549 62.1048C65.7029 62.1048 65.1929 62.014 64.7248 61.8323C64.2637 61.6437 63.8619 61.3817 63.5196 61.0463C63.1773 60.704 62.9118 60.3022 62.7231 59.8411C62.5415 59.373 62.4506 58.8595 62.4506 58.3006C62.4506 57.7556 62.5485 57.2526 62.7441 56.7914C62.9397 56.3303 63.2087 55.9321 63.551 55.5967C63.9004 55.2544 64.3091 54.9889 64.7772 54.8002C65.2523 54.6116 65.7693 54.5173 66.3282 54.5173C66.6776 54.5173 67.0199 54.5627 67.3553 54.6535C67.6906 54.7443 68.0015 54.8806 68.288 55.0622C68.5814 55.2369 68.833 55.4465 69.0426 55.691L67.9526 56.9382C67.8059 56.7845 67.6487 56.6517 67.481 56.5399C67.3203 56.4211 67.1422 56.3303 66.9466 56.2674C66.7509 56.2046 66.5413 56.1731 66.3178 56.1731C66.0383 56.1731 65.7728 56.2255 65.5213 56.3303C65.2767 56.4281 65.0602 56.5714 64.8715 56.76C64.6899 56.9417 64.5466 57.1652 64.4418 57.4307C64.337 57.6962 64.2846 57.9931 64.2846 58.3215C64.2846 58.6429 64.337 58.9363 64.4418 59.2018C64.5466 59.4603 64.6934 59.6839 64.882 59.8726C65.0706 60.0612 65.2977 60.2044 65.5632 60.3022C65.8357 60.4001 66.1361 60.449 66.4645 60.449C66.6881 60.449 66.9011 60.4175 67.1038 60.3546C67.3064 60.2918 67.4915 60.2079 67.6592 60.1031C67.8339 59.9913 67.9876 59.8656 68.1203 59.7258L68.9797 61.0882C68.805 61.2839 68.571 61.4585 68.2775 61.6122C67.9911 61.7659 67.6697 61.8882 67.3134 61.979C66.964 62.0629 66.6112 62.1048 66.2549 62.1048ZM70.1989 62V54.664H73.2695C73.8075 54.664 74.3001 54.7548 74.7472 54.9365C75.1943 55.1111 75.5786 55.3627 75.9 55.691C76.2284 56.0194 76.4799 56.4072 76.6546 56.8543C76.8292 57.3015 76.9166 57.794 76.9166 58.332C76.9166 58.87 76.8292 59.366 76.6546 59.8202C76.4799 60.2673 76.2284 60.6551 75.9 60.9834C75.5786 61.3048 75.1943 61.5563 74.7472 61.738C74.3001 61.9127 73.8075 62 73.2695 62H70.1989ZM71.9805 60.7843L71.7394 60.428H73.2171C73.5106 60.428 73.7726 60.3791 74.0031 60.2813C74.2337 60.1765 74.4293 60.0333 74.59 59.8516C74.7577 59.6699 74.8869 59.4499 74.9778 59.1914C75.0686 58.9329 75.114 58.6464 75.114 58.332C75.114 58.0176 75.0686 57.7311 74.9778 57.4726C74.8869 57.2141 74.7577 56.9941 74.59 56.8124C74.4293 56.6307 74.2337 56.491 74.0031 56.3932C73.7726 56.2884 73.5106 56.236 73.2171 56.236H71.708L71.9805 55.9006V60.7843ZM78.2943 62V54.664H79.8872L83.7334 59.904L83.3876 59.8516C83.3526 59.621 83.3247 59.401 83.3037 59.1914C83.2828 58.9818 83.2618 58.7757 83.2408 58.573C83.2269 58.3704 83.2129 58.1643 83.1989 57.9547C83.1919 57.7451 83.1849 57.5181 83.178 57.2735C83.178 57.029 83.178 56.7635 83.178 56.477V54.664H84.9072V62H83.2932L79.2794 56.5923L79.8139 56.6657C79.8488 57.001 79.8768 57.2875 79.8977 57.525C79.9257 57.7556 79.9466 57.9617 79.9606 58.1434C79.9816 58.325 79.9955 58.4892 80.0025 58.6359C80.0095 58.7826 80.013 58.9294 80.013 59.0761C80.02 59.2158 80.0235 59.373 80.0235 59.5477V62H78.2943Z" fill="#555160"/>
                        <path d="M106.97 106.12V103.48H108.17C108.289 103.48 108.406 103.511 108.51 103.57C108.614 103.62 108.709 103.688 108.79 103.77C108.87 103.849 108.931 103.944 108.97 104.05C109.012 104.155 109.035 104.267 109.04 104.38C109.039 104.489 109.019 104.598 108.98 104.7C108.945 104.8 108.89 104.891 108.82 104.97C108.745 105.05 108.652 105.112 108.55 105.15L109.18 106.15H108.6L108.04 105.26H107.52V106.15H106.97V106.12ZM107.49 104.78H108.15C108.214 104.785 108.278 104.768 108.33 104.73C108.384 104.69 108.428 104.639 108.46 104.58C108.475 104.507 108.475 104.433 108.46 104.36C108.466 104.285 108.445 104.21 108.4 104.15C108.37 104.09 108.325 104.038 108.27 104C108.219 103.958 108.156 103.934 108.09 103.93H107.45L107.49 104.78Z" fill="#7F54B3"/>
                        <path d="M109.27 105.55C109.27 105.434 109.309 105.321 109.38 105.23C109.46 105.128 109.568 105.052 109.69 105.01C109.83 104.955 109.98 104.928 110.13 104.93H110.38C110.455 104.943 110.529 104.963 110.6 104.99V104.88C110.603 104.828 110.595 104.776 110.576 104.728C110.557 104.68 110.528 104.636 110.49 104.6C110.443 104.562 110.389 104.533 110.33 104.516C110.272 104.499 110.211 104.493 110.15 104.5C110.044 104.499 109.938 104.519 109.84 104.56C109.729 104.603 109.622 104.657 109.52 104.72L109.35 104.39C109.478 104.314 109.611 104.251 109.75 104.2C109.897 104.159 110.048 104.139 110.2 104.14C110.438 104.12 110.674 104.191 110.86 104.34C110.938 104.417 110.998 104.509 111.038 104.61C111.078 104.712 111.095 104.821 111.09 104.93V105.54C111.079 105.576 111.079 105.614 111.09 105.65C111.09 105.65 111.15 105.65 111.19 105.65V106.06H110.97C110.885 106.061 110.802 106.036 110.73 105.99C110.68 105.951 110.648 105.893 110.64 105.83V105.76C110.553 105.872 110.44 105.961 110.31 106.02C110.184 106.076 110.048 106.106 109.91 106.11C109.785 106.115 109.661 106.088 109.55 106.03C109.449 105.985 109.362 105.912 109.3 105.82C109.274 105.732 109.264 105.641 109.27 105.55ZM110.51 105.65L110.58 105.57C110.587 105.544 110.587 105.516 110.58 105.49V105.3C110.52 105.273 110.456 105.252 110.39 105.24H110.18C110.065 105.238 109.952 105.265 109.85 105.32C109.811 105.341 109.778 105.373 109.755 105.412C109.732 105.451 109.72 105.495 109.72 105.54C109.707 105.582 109.707 105.628 109.72 105.67C109.75 105.716 109.792 105.754 109.84 105.78C109.903 105.796 109.968 105.796 110.03 105.78C110.103 105.797 110.178 105.797 110.25 105.78C110.343 105.75 110.431 105.707 110.51 105.65Z" fill="#7F54B3"/>
                        <path d="M112.79 106.16C112.646 106.16 112.504 106.122 112.38 106.05C112.262 105.99 112.164 105.896 112.1 105.78V106.92H111.59V104.19H112.03V104.53C112.103 104.418 112.203 104.325 112.32 104.26C112.441 104.189 112.58 104.155 112.72 104.16C112.848 104.159 112.974 104.186 113.09 104.24C113.201 104.293 113.299 104.367 113.38 104.46C113.466 104.553 113.534 104.662 113.58 104.78C113.623 104.902 113.647 105.03 113.65 105.16C113.647 105.337 113.606 105.511 113.53 105.67C113.465 105.818 113.361 105.946 113.23 106.04C113.098 106.123 112.945 106.165 112.79 106.16ZM112.61 105.74C112.683 105.745 112.757 105.728 112.82 105.69C112.882 105.664 112.938 105.623 112.98 105.57C113.024 105.511 113.061 105.447 113.09 105.38C113.104 105.307 113.104 105.233 113.09 105.16C113.105 105.087 113.105 105.012 113.09 104.94C113.065 104.876 113.028 104.819 112.98 104.77C112.934 104.712 112.871 104.671 112.8 104.65C112.727 104.634 112.652 104.634 112.58 104.65H112.44L112.31 104.72L112.18 104.82L112.1 104.95V105.41C112.128 105.48 112.169 105.544 112.22 105.6C112.273 105.655 112.333 105.702 112.4 105.74H112.61Z" fill="#7F54B3"/>
                        <path d="M114 103.9V103.42H114.51V103.9H114ZM114 106.12V104.17H114.51V106.12H114Z" fill="#7F54B3"/>
                        <path d="M114.85 105.16C114.849 104.987 114.887 104.816 114.96 104.66C115.033 104.517 115.14 104.393 115.27 104.3C115.405 104.205 115.566 104.156 115.73 104.16C115.871 104.162 116.009 104.2 116.13 104.27C116.244 104.333 116.337 104.427 116.4 104.54V103.4H116.91V105.57C116.9 105.602 116.9 105.637 116.91 105.67C116.92 105.687 116.935 105.701 116.953 105.71C116.971 105.719 116.991 105.722 117.01 105.72V106.12H116.79C116.751 106.124 116.711 106.12 116.673 106.108C116.635 106.096 116.6 106.076 116.57 106.05C116.54 106.03 116.515 106.004 116.498 105.972C116.481 105.941 116.471 105.906 116.47 105.87V105.75C116.395 105.873 116.288 105.973 116.16 106.04C116.04 106.096 115.908 106.124 115.775 106.124C115.642 106.124 115.511 106.096 115.39 106.04C115.275 105.991 115.172 105.916 115.09 105.82C115.004 105.727 114.936 105.618 114.89 105.5C114.86 105.389 114.846 105.275 114.85 105.16ZM116.4 105.42V104.97C116.378 104.897 116.336 104.832 116.28 104.78L116.1 104.65C116.035 104.616 115.964 104.596 115.89 104.59C115.819 104.587 115.748 104.608 115.69 104.65C115.621 104.668 115.561 104.711 115.52 104.77C115.476 104.828 115.439 104.892 115.41 104.96C115.397 105.029 115.397 105.101 115.41 105.17C115.395 105.246 115.395 105.324 115.41 105.4C115.439 105.468 115.476 105.532 115.52 105.59C115.567 105.649 115.629 105.694 115.7 105.72C115.773 105.73 115.847 105.73 115.92 105.72C115.97 105.726 116.02 105.726 116.07 105.72L116.21 105.65L116.34 105.54C116.35 105.5 116.357 105.46 116.36 105.42H116.4Z" fill="#7F54B3"/>
                        <path d="M117.47 106.12V103.48H117.99V105.67H119.36V106.12H117.47Z" fill="#565A63"/>
                        <path d="M120.531 106.16C120.38 106.16 120.231 106.133 120.09 106.08C119.964 106.034 119.851 105.959 119.76 105.86C119.664 105.773 119.592 105.663 119.55 105.54C119.506 105.418 119.483 105.29 119.48 105.16C119.483 105.027 119.507 104.896 119.55 104.77C119.593 104.645 119.666 104.532 119.76 104.44C119.853 104.345 119.966 104.273 120.09 104.23C120.226 104.172 120.373 104.145 120.521 104.15C120.671 104.143 120.822 104.17 120.96 104.23C121.082 104.281 121.193 104.352 121.291 104.44C121.379 104.535 121.447 104.647 121.49 104.77C121.54 104.894 121.563 105.027 121.56 105.16C121.562 105.29 121.538 105.419 121.49 105.54C121.445 105.658 121.377 105.767 121.291 105.86C121.196 105.955 121.084 106.029 120.96 106.08C120.824 106.135 120.678 106.162 120.531 106.16ZM120.021 105.16C120.024 105.264 120.047 105.366 120.09 105.46C120.132 105.545 120.198 105.614 120.281 105.66C120.357 105.712 120.448 105.737 120.541 105.73C120.633 105.73 120.724 105.702 120.8 105.65C120.882 105.595 120.95 105.524 121 105.44C121.046 105.35 121.07 105.251 121.07 105.15C121.069 105.046 121.045 104.944 121 104.85C120.955 104.765 120.886 104.695 120.8 104.65C120.726 104.594 120.634 104.565 120.541 104.57C120.447 104.567 120.356 104.595 120.281 104.65C120.203 104.699 120.141 104.768 120.1 104.85C120.042 104.942 120.014 105.051 120.021 105.16Z" fill="#565A63"/>
                        <path d="M121.78 105.55C121.785 105.435 121.823 105.324 121.89 105.23C121.97 105.128 122.078 105.052 122.2 105.01C122.34 104.955 122.49 104.928 122.64 104.93H122.89C122.965 104.943 123.039 104.963 123.11 104.99V104.88C123.113 104.828 123.105 104.776 123.086 104.728C123.067 104.68 123.038 104.636 123 104.6C122.955 104.562 122.902 104.534 122.845 104.517C122.789 104.5 122.729 104.494 122.67 104.5C122.561 104.5 122.452 104.52 122.35 104.56C122.239 104.603 122.132 104.657 122.03 104.72L121.87 104.39C121.995 104.311 122.13 104.247 122.27 104.2C122.413 104.159 122.561 104.139 122.71 104.14C122.948 104.12 123.184 104.191 123.37 104.34C123.45 104.416 123.512 104.508 123.553 104.609C123.595 104.711 123.614 104.82 123.61 104.93V105.54C123.6 105.576 123.6 105.614 123.61 105.65C123.626 105.657 123.643 105.661 123.66 105.661C123.678 105.661 123.695 105.657 123.71 105.65V106.06H123.49C123.405 106.061 123.322 106.036 123.25 105.99C123.2 105.951 123.168 105.893 123.16 105.83V105.74C123.073 105.849 122.959 105.935 122.83 105.99C122.706 106.053 122.569 106.088 122.43 106.09C122.306 106.091 122.183 106.063 122.07 106.01C121.969 105.964 121.885 105.887 121.83 105.79C121.805 105.712 121.788 105.631 121.78 105.55ZM123.01 105.65L123.08 105.57C123.083 105.543 123.083 105.516 123.08 105.49V105.3C123.018 105.275 122.955 105.255 122.89 105.24H122.68C122.565 105.236 122.451 105.264 122.35 105.32C122.309 105.34 122.275 105.371 122.252 105.41C122.229 105.449 122.218 105.494 122.22 105.54C122.21 105.583 122.21 105.627 122.22 105.67C122.257 105.72 122.305 105.759 122.361 105.786C122.417 105.812 122.479 105.824 122.54 105.82C122.613 105.835 122.688 105.835 122.76 105.82C122.856 105.784 122.942 105.726 123.01 105.65Z" fill="#565A63"/>
                        <path d="M123.981 105.16C123.979 104.987 124.017 104.816 124.09 104.66C124.164 104.514 124.274 104.39 124.411 104.3C124.541 104.205 124.699 104.156 124.861 104.16C124.997 104.161 125.13 104.196 125.249 104.263C125.368 104.329 125.468 104.425 125.541 104.54V103.4H126.05V105.57C126.042 105.603 126.042 105.637 126.05 105.67C126.061 105.686 126.076 105.7 126.094 105.709C126.111 105.717 126.131 105.721 126.151 105.72V106.12H125.93C125.891 106.124 125.851 106.12 125.813 106.108C125.775 106.096 125.74 106.076 125.71 106.05C125.68 106.03 125.656 106.004 125.638 105.972C125.621 105.941 125.611 105.906 125.611 105.87V105.75C125.537 105.871 125.434 105.97 125.31 106.04C125.185 106.097 125.049 106.128 124.911 106.13C124.78 106.131 124.65 106.103 124.531 106.05C124.415 106.001 124.312 105.926 124.231 105.83C124.146 105.737 124.082 105.628 124.041 105.51C124.002 105.397 123.982 105.279 123.981 105.16ZM125.541 105.42V104.97C125.51 104.899 125.466 104.834 125.411 104.78C125.355 104.731 125.294 104.687 125.231 104.65C125.169 104.616 125.101 104.596 125.031 104.59C124.956 104.585 124.882 104.607 124.82 104.65C124.752 104.671 124.693 104.713 124.651 104.77C124.557 104.883 124.504 105.023 124.501 105.17C124.49 105.246 124.49 105.324 124.501 105.4C124.529 105.468 124.566 105.532 124.611 105.59C124.659 105.647 124.721 105.692 124.791 105.72C124.864 105.73 124.938 105.73 125.011 105.72C125.064 105.725 125.117 105.725 125.171 105.72C125.218 105.704 125.262 105.681 125.3 105.65L125.43 105.54C125.471 105.504 125.508 105.463 125.541 105.42Z" fill="#565A63"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M103.271 107.18C103.96 107.146 104.609 106.842 105.075 106.332C105.541 105.823 105.788 105.15 105.76 104.46C105.743 104.236 105.7 104.014 105.63 103.8C105.741 104.14 105.769 104.502 105.71 104.856C105.652 105.209 105.509 105.543 105.294 105.829C105.08 106.116 104.799 106.346 104.476 106.501C104.154 106.656 103.798 106.731 103.44 106.72H103.31L103.271 107.18Z" fill="#B59CD3"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M100.97 106.05C101.203 106.386 101.512 106.664 101.871 106.86C102.23 107.056 102.631 107.166 103.04 107.18V106.72C102.727 106.682 102.426 106.578 102.157 106.414C101.888 106.25 101.657 106.03 101.48 105.77L100.97 106.05Z" fill="#A080C6"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M100.74 103.48C100.577 103.864 100.502 104.28 100.521 104.697C100.54 105.115 100.653 105.522 100.85 105.89L101.37 105.59C101.235 105.322 101.165 105.025 101.165 104.725C101.165 104.425 101.235 104.128 101.37 103.86L100.74 103.48Z" fill="#9572C0"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M103.04 101.75C102.58 101.802 102.14 101.964 101.755 102.222C101.371 102.479 101.054 102.825 100.83 103.23L101.52 103.62C101.692 103.374 101.917 103.17 102.178 103.023C102.44 102.876 102.731 102.789 103.03 102.77V101.77L103.04 101.75Z" fill="#8B64B9"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M105.65 102.84C105.37 102.484 105.011 102.198 104.601 102.006C104.192 101.813 103.743 101.719 103.29 101.73V102.73C103.779 102.757 104.243 102.955 104.6 103.29L105.65 102.84Z" fill="#7F54B3"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M103.161 104.2C103.224 104.197 103.287 104.207 103.346 104.23C103.406 104.252 103.46 104.286 103.506 104.33C103.552 104.374 103.588 104.427 103.613 104.485C103.638 104.544 103.651 104.606 103.651 104.67C103.655 104.768 103.629 104.864 103.578 104.947C103.526 105.031 103.451 105.096 103.362 105.137C103.273 105.177 103.174 105.189 103.078 105.173C102.981 105.156 102.892 105.111 102.822 105.044C102.751 104.976 102.702 104.889 102.682 104.793C102.661 104.698 102.67 104.598 102.706 104.507C102.743 104.417 102.805 104.339 102.886 104.284C102.967 104.229 103.063 104.2 103.161 104.2Z" fill="#51555F"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M106.2 102.97L104.76 103.97L103.33 104.92L103.21 104.7L103.08 104.48L104.64 103.75L106.2 102.97Z" fill="#51555F"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M106.68 102.71L106.28 103.12C106.276 103.067 106.258 103.015 106.23 102.97L106.13 102.85L106.7 102.71C106.7 102.71 106.7 102.71 106.68 102.71Z" fill="#7F54B3"/>
                        <path d="M92.8054 113.67V108.693H94.9526C95.2654 108.693 95.5427 108.764 95.7845 108.906C96.0309 109.048 96.2253 109.243 96.3675 109.489C96.5144 109.736 96.5879 110.013 96.5879 110.321C96.5879 110.643 96.5144 110.933 96.3675 111.189C96.2253 111.44 96.0309 111.639 95.7845 111.786C95.5427 111.933 95.2654 112.006 94.9526 112.006H94.0141V113.67H92.8054ZM93.9927 110.947H94.7819C94.8862 110.947 94.981 110.921 95.0663 110.869C95.1517 110.816 95.2204 110.745 95.2725 110.655C95.3247 110.565 95.3507 110.461 95.3507 110.342C95.3507 110.219 95.3247 110.115 95.2725 110.03C95.2204 109.944 95.1517 109.878 95.0663 109.831C94.981 109.783 94.8862 109.759 94.7819 109.759H93.9927V110.947ZM97.513 113.67V108.693H98.7217V112.603H100.94V113.67H97.513ZM103.804 113.713C103.392 113.713 103.024 113.63 102.702 113.464C102.38 113.293 102.126 113.061 101.941 112.767C101.761 112.473 101.671 112.137 101.671 111.757V108.693H102.894V111.693C102.894 111.873 102.934 112.037 103.015 112.184C103.096 112.326 103.205 112.44 103.342 112.525C103.48 112.606 103.634 112.646 103.804 112.646C103.984 112.646 104.143 112.606 104.281 112.525C104.423 112.44 104.537 112.326 104.622 112.184C104.707 112.037 104.75 111.873 104.75 111.693V108.693H105.93V111.757C105.93 112.137 105.838 112.473 105.653 112.767C105.473 113.061 105.221 113.293 104.899 113.464C104.577 113.63 104.212 113.713 103.804 113.713ZM109.454 113.741C109.056 113.741 108.696 113.677 108.373 113.549C108.051 113.421 107.774 113.241 107.542 113.009C107.309 112.776 107.132 112.504 107.008 112.191C106.885 111.873 106.823 111.53 106.823 111.16C106.823 110.79 106.887 110.451 107.015 110.143C107.148 109.831 107.335 109.558 107.577 109.326C107.819 109.093 108.103 108.913 108.43 108.785C108.762 108.657 109.122 108.593 109.511 108.593C109.786 108.593 110.044 108.629 110.286 108.7C110.533 108.771 110.755 108.868 110.954 108.992C111.153 109.115 111.322 109.257 111.459 109.418L110.727 110.193C110.608 110.079 110.485 109.985 110.357 109.909C110.234 109.833 110.101 109.774 109.959 109.731C109.817 109.684 109.665 109.66 109.504 109.66C109.295 109.66 109.103 109.698 108.928 109.774C108.757 109.849 108.606 109.956 108.473 110.094C108.345 110.226 108.245 110.385 108.174 110.57C108.103 110.75 108.068 110.947 108.068 111.16C108.068 111.373 108.106 111.572 108.181 111.757C108.257 111.942 108.362 112.103 108.494 112.241C108.627 112.374 108.783 112.48 108.964 112.561C109.148 112.637 109.345 112.675 109.554 112.675C109.701 112.675 109.838 112.651 109.966 112.603C110.099 112.556 110.213 112.492 110.307 112.411C110.402 112.331 110.478 112.236 110.535 112.127C110.592 112.013 110.62 111.892 110.62 111.764V111.58L110.777 111.821H109.404V110.876H111.744C111.753 110.928 111.76 110.999 111.765 111.089C111.77 111.179 111.772 111.267 111.772 111.352C111.777 111.437 111.779 111.501 111.779 111.544C111.779 111.866 111.72 112.163 111.601 112.433C111.488 112.698 111.326 112.928 111.118 113.122C110.909 113.317 110.663 113.468 110.378 113.577C110.094 113.687 109.786 113.741 109.454 113.741ZM112.536 113.67V112.653H113.375V109.71H112.536V108.693H115.43V109.71H114.584V112.653H115.43V113.67H112.536ZM116.579 113.67V108.693H117.66L120.27 112.248L120.035 112.212C120.011 112.056 119.992 111.907 119.978 111.764C119.964 111.622 119.95 111.482 119.935 111.345C119.926 111.207 119.916 111.068 119.907 110.925C119.902 110.783 119.897 110.629 119.893 110.463C119.893 110.297 119.893 110.117 119.893 109.923V108.693H121.066V113.67H119.971L117.248 110.001L117.61 110.051C117.634 110.278 117.653 110.473 117.667 110.634C117.686 110.79 117.7 110.93 117.71 111.053C117.724 111.177 117.734 111.288 117.738 111.388C117.743 111.487 117.745 111.587 117.745 111.686C117.75 111.781 117.753 111.888 117.753 112.006V113.67H116.579Z" fill="#2F2C35"/>
                        <path d="M124.386 113.67L124.151 113.087L125.602 111.501C125.682 111.411 125.77 111.309 125.865 111.196C125.96 111.082 126.052 110.966 126.142 110.847C126.232 110.724 126.303 110.606 126.355 110.492C126.412 110.378 126.441 110.274 126.441 110.179C126.441 110.084 126.419 110.001 126.377 109.93C126.334 109.859 126.272 109.804 126.192 109.767C126.111 109.724 126.009 109.703 125.886 109.703C125.777 109.703 125.673 109.731 125.573 109.788C125.474 109.84 125.379 109.923 125.289 110.037C125.204 110.15 125.123 110.29 125.047 110.456L124.151 109.973C124.251 109.698 124.391 109.456 124.571 109.248C124.756 109.034 124.971 108.871 125.218 108.757C125.464 108.638 125.727 108.579 126.007 108.579C126.301 108.584 126.566 108.648 126.803 108.771C127.04 108.89 127.228 109.058 127.365 109.276C127.507 109.489 127.578 109.74 127.578 110.03C127.578 110.129 127.566 110.233 127.543 110.342C127.519 110.451 127.483 110.565 127.436 110.684C127.389 110.797 127.325 110.921 127.244 111.053C127.168 111.181 127.076 111.317 126.967 111.459C126.858 111.601 126.73 111.753 126.583 111.914L125.452 113.144L125.31 112.603H127.799V113.67H124.386ZM128.772 113.748C128.577 113.748 128.426 113.694 128.317 113.585C128.212 113.476 128.16 113.319 128.16 113.115C128.16 112.926 128.217 112.772 128.331 112.653C128.445 112.535 128.592 112.475 128.772 112.475C128.966 112.475 129.118 112.532 129.227 112.646C129.336 112.755 129.39 112.912 129.39 113.115C129.39 113.3 129.333 113.452 129.22 113.57C129.106 113.689 128.957 113.748 128.772 113.748ZM132.084 113.741C131.638 113.741 131.257 113.639 130.939 113.435C130.626 113.231 130.387 112.94 130.221 112.561C130.055 112.177 129.972 111.717 129.972 111.181C129.972 110.646 130.055 110.188 130.221 109.809C130.387 109.425 130.626 109.131 130.939 108.928C131.257 108.724 131.638 108.622 132.084 108.622C132.529 108.622 132.911 108.724 133.228 108.928C133.546 109.131 133.788 109.425 133.954 109.809C134.12 110.188 134.203 110.646 134.203 111.181C134.203 111.717 134.12 112.177 133.954 112.561C133.788 112.94 133.546 113.231 133.228 113.435C132.911 113.639 132.529 113.741 132.084 113.741ZM132.084 112.717C132.392 112.717 132.629 112.584 132.795 112.319C132.965 112.054 133.051 111.674 133.051 111.181C133.051 110.674 132.965 110.286 132.795 110.015C132.629 109.74 132.392 109.603 132.084 109.603C131.776 109.603 131.536 109.74 131.366 110.015C131.2 110.286 131.117 110.674 131.117 111.181C131.117 111.674 131.2 112.054 131.366 112.319C131.536 112.584 131.776 112.717 132.084 112.717Z" fill="#674399"/>
                        <path d="M99.4901 83.3999V89.5399H97.4901C97.3999 89.5399 97.3134 89.5041 97.2496 89.4403C97.1859 89.3765 97.1501 89.2901 97.1501 89.1999C97.1502 89.1114 97.1157 89.0264 97.0541 88.963C96.9925 88.8995 96.9085 88.8625 96.8201 88.8599H95.4701C95.288 88.8612 95.1076 88.8265 94.939 88.7577C94.7704 88.689 94.617 88.5875 94.4878 88.4593C94.3586 88.331 94.2561 88.1784 94.1862 88.0103C94.1162 87.8422 94.0801 87.662 94.0801 87.4799V85.4799C94.0801 85.2978 94.1162 85.1175 94.1862 84.9495C94.2561 84.7814 94.3586 84.6288 94.4878 84.5005C94.617 84.3722 94.7704 84.2708 94.939 84.2021C95.1076 84.1333 95.288 84.0986 95.4701 84.0999H96.8201C96.9085 84.0973 96.9925 84.0603 97.0541 83.9968C97.1157 83.9333 97.1502 83.8484 97.1501 83.7599C97.1527 83.6715 97.1897 83.5875 97.2532 83.5259C97.3167 83.4643 97.4016 83.4299 97.4901 83.4299L99.4901 83.3999Z" fill="#7F54B3"/>
                        <path d="M99.7402 84.51H101.92C102.045 84.51 102.164 84.5595 102.253 84.6477C102.341 84.7358 102.39 84.8553 102.39 84.98C102.39 85.1046 102.341 85.2242 102.253 85.3123C102.164 85.4005 102.045 85.45 101.92 85.45H99.7402V84.5V84.51Z" fill="#674893"/>
                        <path d="M99.7402 87.48H101.92C102.045 87.48 102.164 87.5295 102.253 87.6176C102.341 87.7058 102.39 87.8253 102.39 87.95C102.39 88.0746 102.341 88.1942 102.253 88.2823C102.164 88.3704 102.045 88.42 101.92 88.42H99.7402V87.47V87.48Z" fill="#674893"/>
                        <path d="M92.5801 85.6899H94.0901V87.2299H92.5801C92.4581 87.2299 92.3411 87.1815 92.2548 87.0952C92.1686 87.0089 92.1201 86.8919 92.1201 86.7699V86.1499C92.1201 86.0279 92.1686 85.9109 92.2548 85.8247C92.3411 85.7384 92.4581 85.6899 92.5801 85.6899Z" fill="#674893"/>
                        <path d="M107.569 93.3611C106.258 94.9469 105.545 96.9423 105.554 98.9998H102.499C102.493 96.1316 103.52 93.3572 105.392 91.1836L107.569 93.3611Z" fill="#C11F2F"/>
                        <path d="M106.072 90.4684C108.188 88.3848 111.003 87.1626 113.97 87.0397V90.1109C111.814 90.2221 109.774 91.118 108.234 92.6297L106.072 90.4684Z" fill="#E76B25"/>
                        <path d="M122.874 90.4847L120.712 92.6459C119.163 91.1239 117.113 90.2172 114.944 90.0947V87.0397C117.925 87.1575 120.753 88.3864 122.874 90.4847Z" fill="#FFCB1A"/>
                        <path d="M126.416 98.9999H123.426C123.426 96.9545 122.726 94.9708 121.444 93.3774L123.605 91.2162C125.446 93.3891 126.444 96.152 126.416 98.9999Z" fill="#21BF25"/>
                        <path d="M122.55 98.9996H121.494C121.567 97.1001 120.902 95.246 119.639 93.8255C118.376 92.4049 116.613 91.528 114.718 91.3784H114.978C116.991 91.3912 118.916 92.1999 120.335 93.6278C121.754 95.0556 122.55 96.9867 122.55 98.9996Z" fill="#BEBFC1"/>
                        <path d="M99.8975 98.9999H101.701C101.701 91.915 106.869 86.1625 113.352 86H112.881C109.436 86.0043 106.134 87.3758 103.699 89.8133C101.265 92.2508 99.8975 95.5549 99.8975 98.9999Z" fill="#BEBFC1"/>
                        <path d="M115.709 98.9995H113.418C113.461 98.7254 113.601 98.476 113.813 98.2969C114.025 98.1178 114.294 98.0211 114.572 98.0245C114.853 98.0297 115.123 98.1333 115.336 98.317C115.527 98.4875 115.658 98.7156 115.709 98.967V98.9995Z" fill="black"/>
                        <path d="M119.609 96.6434L115.725 98.9672L115.676 98.9997H115.189L114.929 98.4634L115.335 98.3009L119.609 96.6434Z" fill="black"/>
                        <path d="M110.73 96L110.714 95.96L111.578 94.192L111.662 94.46C111.628 94.5507 111.581 94.632 111.522 94.704C111.464 94.776 111.396 94.84 111.318 94.896C111.244 94.9493 111.165 94.9907 111.082 95.02C111 95.0467 110.918 95.06 110.838 95.06C110.686 95.06 110.546 95.0187 110.418 94.936C110.29 94.8533 110.188 94.744 110.11 94.608C110.033 94.472 109.994 94.3227 109.994 94.16C109.994 93.968 110.038 93.7947 110.126 93.64C110.217 93.4853 110.34 93.364 110.494 93.276C110.649 93.1853 110.824 93.14 111.018 93.14C111.157 93.14 111.288 93.1653 111.41 93.216C111.533 93.264 111.641 93.3333 111.734 93.424C111.828 93.512 111.9 93.6133 111.95 93.728C112.004 93.8427 112.03 93.9653 112.03 94.096C112.03 94.1813 112.022 94.268 112.006 94.356C111.99 94.444 111.966 94.536 111.934 94.632C111.902 94.7253 111.861 94.828 111.81 94.94C111.762 95.0493 111.706 95.1707 111.642 95.304L111.294 96H110.73ZM110.978 94.564C111.069 94.564 111.149 94.544 111.218 94.504C111.288 94.464 111.342 94.4107 111.382 94.344C111.422 94.2747 111.442 94.1987 111.442 94.116C111.442 94.0253 111.422 93.9453 111.382 93.876C111.345 93.804 111.292 93.748 111.222 93.708C111.153 93.6653 111.073 93.644 110.982 93.644C110.9 93.644 110.825 93.664 110.758 93.704C110.694 93.744 110.642 93.7987 110.602 93.868C110.565 93.9373 110.546 94.0187 110.546 94.112C110.546 94.192 110.565 94.2667 110.602 94.336C110.642 94.4027 110.694 94.4573 110.758 94.5C110.825 94.5427 110.898 94.564 110.978 94.564ZM113.336 96.012C113.149 96.012 112.98 95.976 112.828 95.904C112.676 95.8293 112.554 95.7293 112.464 95.604C112.373 95.4787 112.328 95.3387 112.328 95.184C112.328 95.088 112.34 95 112.364 94.92C112.39 94.84 112.429 94.768 112.48 94.704C112.533 94.64 112.597 94.584 112.672 94.536C112.746 94.488 112.833 94.4467 112.932 94.412L112.892 94.552C112.817 94.5227 112.75 94.488 112.692 94.448C112.633 94.4053 112.582 94.3573 112.54 94.304C112.497 94.2507 112.465 94.1933 112.444 94.132C112.422 94.068 112.412 94.0013 112.412 93.932C112.412 93.788 112.453 93.6587 112.536 93.544C112.618 93.4293 112.729 93.3387 112.868 93.272C113.009 93.2027 113.165 93.168 113.336 93.168C113.506 93.168 113.661 93.2027 113.8 93.272C113.938 93.3387 114.049 93.4293 114.132 93.544C114.214 93.6587 114.256 93.788 114.256 93.932C114.256 94.0013 114.245 94.0667 114.224 94.128C114.205 94.1893 114.174 94.2467 114.132 94.3C114.092 94.3507 114.041 94.3973 113.98 94.44C113.921 94.4827 113.853 94.52 113.776 94.552L113.748 94.428C113.836 94.4547 113.916 94.492 113.988 94.54C114.062 94.5853 114.125 94.6413 114.176 94.708C114.229 94.772 114.27 94.844 114.3 94.924C114.329 95.004 114.344 95.0907 114.344 95.184C114.344 95.3413 114.298 95.4827 114.208 95.608C114.117 95.7333 113.996 95.832 113.844 95.904C113.692 95.976 113.522 96.012 113.336 96.012ZM113.336 95.52C113.416 95.52 113.489 95.504 113.556 95.472C113.622 95.44 113.674 95.3973 113.712 95.344C113.749 95.288 113.768 95.224 113.768 95.152C113.768 95.0773 113.749 95.012 113.712 94.956C113.674 94.8973 113.622 94.8507 113.556 94.816C113.492 94.7813 113.418 94.764 113.336 94.764C113.253 94.764 113.178 94.7813 113.112 94.816C113.048 94.8507 112.997 94.8973 112.96 94.956C112.922 95.012 112.904 95.0773 112.904 95.152C112.904 95.2213 112.922 95.284 112.96 95.34C112.997 95.3933 113.048 95.4373 113.112 95.472C113.178 95.504 113.253 95.52 113.336 95.52ZM113.336 94.276C113.408 94.276 113.472 94.2627 113.528 94.236C113.584 94.2067 113.628 94.1693 113.66 94.124C113.694 94.076 113.712 94.02 113.712 93.956C113.712 93.8947 113.694 93.84 113.66 93.792C113.628 93.7413 113.584 93.7013 113.528 93.672C113.472 93.6427 113.408 93.628 113.336 93.628C113.264 93.628 113.198 93.6427 113.14 93.672C113.084 93.7013 113.04 93.7413 113.008 93.792C112.976 93.84 112.96 93.8947 112.96 93.956C112.96 94.02 112.976 94.076 113.008 94.124C113.04 94.1693 113.084 94.2067 113.14 94.236C113.198 94.2627 113.264 94.276 113.336 94.276ZM115.147 96L116.999 93.2H117.539L115.667 96H115.147ZM115.355 94.684C115.224 94.684 115.107 94.6507 115.003 94.584C114.901 94.5173 114.821 94.4267 114.763 94.312C114.707 94.1947 114.679 94.0613 114.679 93.912C114.679 93.7627 114.707 93.6293 114.763 93.512C114.821 93.392 114.901 93.3 115.003 93.236C115.107 93.1693 115.224 93.136 115.355 93.136C115.488 93.136 115.604 93.1693 115.703 93.236C115.804 93.3 115.883 93.392 115.939 93.512C115.997 93.6293 116.027 93.7627 116.027 93.912C116.027 94.0587 115.997 94.1907 115.939 94.308C115.88 94.4227 115.8 94.5147 115.699 94.584C115.597 94.6507 115.483 94.684 115.355 94.684ZM115.355 94.308C115.403 94.308 115.444 94.292 115.479 94.26C115.513 94.228 115.54 94.1827 115.559 94.124C115.577 94.0627 115.587 93.992 115.587 93.912C115.587 93.832 115.577 93.7613 115.559 93.7C115.54 93.6387 115.513 93.592 115.479 93.56C115.444 93.528 115.403 93.512 115.355 93.512C115.307 93.512 115.264 93.5293 115.227 93.564C115.192 93.596 115.165 93.6427 115.147 93.704C115.128 93.7627 115.119 93.832 115.119 93.912C115.119 93.992 115.128 94.0627 115.147 94.124C115.165 94.1827 115.192 94.228 115.227 94.26C115.264 94.292 115.307 94.308 115.355 94.308ZM117.371 96.036C117.24 96.036 117.123 96.0027 117.019 95.936C116.917 95.8693 116.837 95.7787 116.779 95.664C116.72 95.5467 116.691 95.4133 116.691 95.264C116.691 95.1147 116.719 94.9813 116.775 94.864C116.833 94.7467 116.913 94.6547 117.015 94.588C117.119 94.5213 117.237 94.488 117.371 94.488C117.501 94.488 117.617 94.5213 117.719 94.588C117.82 94.6547 117.899 94.7467 117.955 94.864C118.011 94.9813 118.039 95.1147 118.039 95.264C118.039 95.4107 118.009 95.5427 117.951 95.66C117.895 95.7773 117.816 95.8693 117.715 95.936C117.613 96.0027 117.499 96.036 117.371 96.036ZM117.371 95.664C117.419 95.664 117.46 95.648 117.495 95.616C117.529 95.5813 117.556 95.5347 117.575 95.476C117.593 95.4173 117.603 95.3467 117.603 95.264C117.603 95.184 117.593 95.1147 117.575 95.056C117.556 94.9947 117.529 94.948 117.495 94.916C117.46 94.8813 117.419 94.864 117.371 94.864C117.32 94.864 117.277 94.8813 117.243 94.916C117.208 94.948 117.18 94.9947 117.159 95.056C117.14 95.1147 117.131 95.184 117.131 95.264C117.131 95.3467 117.14 95.4173 117.159 95.476C117.177 95.5347 117.204 95.5813 117.239 95.616C117.276 95.648 117.32 95.664 117.371 95.664Z" fill="black"/>
                    </svg>
                </div>
                <div class="banner-content">
                    <p>Rev up your website's speed and leave slow loading times behind - Grab your seats and upgrade to RapidLoad 2.0 beta today!</p>
<!--                    <p><a href="https://rapidload.io/referral/?utm_source=rapidload_plugin&utm_medium=sidebar-banner" target="_blank">Learn More</a></p>-->
                </div>
                <div class="banner-footer">
                    <a style="border-radius: 30px;" href="https://rapidload.io/" class="button button-primary" target="_blank">Get RapidLoad</a>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <div class="uucss-support">
        <div id="uucss-support-tooltip" style="display: none">
            <h3>Support</h3>
            <br>
            We are here to help, take a look at our knowledge base or feel free to open a ticket.
        </div>
        <a target="_blank" href="https://rapidload.zendesk.com/hc/en-us/articles/1500000568821-FAQ"><span class="dashicons dashicons-sos"></span>
            Help</a>
    </div>

</form>

<?php
    do_action('uucss/options/after_render_form');
?>

<div id="add_rule_featherlight_content" class="main-content uucss-update-form-fetherlight">
    <div class="action-content">
        <div>
            <label for="model-uucss-rules">
                <strong>Type</strong>
            </label>
            <select id="model-uucss-rules">
                <?php
                $rules = RapidLoad_Base::get()->get_pre_defined_rules(true);

                if(isset($rules) && !empty($rules)){

                    $rules_by_category = [];

                    foreach($rules as $rule)
                    {
                        if(isset($rule['category'])){
                            $rules_by_category[$rule['category']][] = $rule;
                        }else{
                            $rules_by_category['general'][] = $rule;
                        }
                    }

                    foreach ($rules_by_category as $key => $category){

                        echo sprintf('<optgroup label="%s">', $key);

                        foreach ($category as $rule){

                            if(isset($rule['rule']) && !empty($rule['rule'])){

                                $permalink = isset($rule['permalink']) ? $rule['permalink'] : trailingslashit(get_site_url());

                                echo sprintf('<option data-type="%s" data-permalink="%s" value="%s">%s</option>', $rule['rule'], $permalink,$rule['rule'], $rule['rule']);

                            }

                        }

                        echo '</optgroup>';
                    }


                }
                ?>
            </select>
        </div>
        <div>
            <label for="rule-base-url">
                <strong>Base URL</strong>
            </label>
            <input type="text" class="rule-base-url"
                   placeholder="<?php echo trailingslashit(get_site_url())?>" >
        </div>
        <div>
            <label for="rule-url-regex">
                <strong>Pattern</strong>
            </label>
            <input type="text" class="rule-url-regex"
                   placeholder="*/slug/*" value="/">
        </div>
        <div>
            <label for="orce-requeue-rule">
                <strong>Regenerate</strong>
            </label>
            <input type="checkbox" id="force-requeue-rule" style="width:20px">
        </div>
        <div class="add-action-wrap">
            <input id="model-update-rule" type="button" class="button button-primary" value="Update Rule">
        </div>
    </div>
</div>

<div id="add_url_featherlight_content" class="main-content uucss-update-form-fetherlight">
    <div class="action-content">
        <div>
            <select id="model-requeue-post-type">
                <option value="url">URL</option>
                <?php
                $include = RapidLoad_Queue::get_post_types();
                if(isset($include)){
                    foreach ($include as $value){
                        $post_object = get_post_type_object( $value );

                        if($post_object){

                            echo sprintf('<option value="%s">%s</option>', $value, $post_object->label);

                        }

                    }
                }
                ?>
                <option value="site_map">Site Map</option>
            </select>
        </div>
        <div>
            <input type="text" class="site-map-url show" placeholder="<?php echo trailingslashit(get_site_url())?>" data-site_url="<?php echo trailingslashit(get_site_url())?>" data-sitemap_url="<?php
                /*$robots = UnusedCSS_Admin::get_robots_text(get_site_url());
                if($robots && isset($robots->sitemap)){
                    echo apply_filters('uucss/sitemap-path', $robots->sitemap);
                }else{
                    echo apply_filters('uucss/sitemap-path', home_url('/sitemap_index.xml'));
                }*/
                echo apply_filters('uucss/sitemap-path', home_url('/sitemap_index.xml'));
            ?>">
        </div>
        <div class="add-action-wrap">
            <input id="model-queue-posts-type" type="button" class="button button-primary" value="Add to Optimization">
        </div>
    </div>
</div>

