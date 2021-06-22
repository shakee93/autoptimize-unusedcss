<?php
$api_key_verified = isset($options['uucss_api_key_verified']) && $options['uucss_api_key_verified'] == '1';
$third_party_plugins = apply_filters('uucss/third-party/plugins', []);
$third_party_cache_plugins = array_filter($third_party_plugins, function ($plugin) {
    return isset($plugin['category']) && $plugin['category'] == 'cache';
});
$default_debug_mode = !empty($options['uucss_enable_debug']) && '1' === $options['uucss_enable_debug'];
$hide_view_log = apply_filters('uucss/view_debug/frontend', (boolean)$default_debug_mode);
?>

<div id="rapidload-dashboard">
    <div class="rapidload-wrap wrap">
        <div class="rapidload-body">
            <header class="rapidload-header">
                <div class="rapidload-header-logo">
                    <img src="<?php echo UUCSS_PLUGIN_URL . '/assets/images/logo.svg' ?>" width="163" height="44"
                         alt="Logo WP Rocket" class="wpr-Header-logo-desktop">
                </div>
                <div class="rapidload-header-nav">
                    <a href="#dashboard" id="rapidload-nav-dashboard" class="rapidload-menu-item isActive"
                       data-page="dashboard">
                        <div class="rapidload-menu-item-title">Dashboard</div>
                        <div class="rapidload-menu-item-description">Get help, account info</div>
                    </a>
                    <a href="#rapidload-modules" id="rapidload-nav-modules" class="rapidload-menu-item"
                       data-page="modules">
                        <div class="rapidload-menu-item-title">Modules</div>
                        <div class="rapidload-menu-item-description">Services</div>
                    </a>

                    <?php if(count(rapidload()->rapidload_module()->active_modules())): ?>

                        <a href="#optimize" id="rapidload-nav-uucss" class="rapidload-menu-item" data-page="optimize">
                            <div class="rapidload-menu-item-title">File Optimization</div>
                            <div class="rapidload-menu-item-description">Optimize CSS</div>
                        </a>

                    <?php endif; ?>

                    <div class="rapidload-header-footer">
                        version <?php echo UUCSS_VERSION ?>            </div>
            </header>
            <section class="wpr-Content isNotFull rapidload-content" id="uucss-wrapper">
                <form id='ao_settings_form' action='<?php echo admin_url('options.php'); ?>' method='post'>
                    <?php settings_fields('autoptimize_uucss_settings'); ?>
                    <div id="dashboard" class="rapidload-page rapidload-page-dashboard">
                        <div class="rapidload-section-header">
                            <h2 class="rapidload-title1 rapidload-icon-home">
                                Dashboard
                            </h2>
                        </div>
                        <div class="rapidload-page-row">
                            <div class="rapidload-page-col">
                                <div class="rapidload-option-header">
                                    <h3 class="rapidload-title2">License Information</h3>
                                </div>
                                <div class="rapidload-field rapidload-field-license">
                                    <div class="rapidload-flex">
                                        <div class="license-info">
                                            <span id="license-message"></span>
                                            <div class="spinner"></div>
                                            <ul style="display: none">
                                                <li><strong>Name : </strong> <span id="license-name"></span></li>
                                                <li><strong>Email : </strong> <span id="license-email"></span></li>
                                                <li><strong>Plan : </strong><span id="license-plan"></span></li>
                                                <li><strong>Next Billing : </strong><span
                                                            id="license-next_billing"></span></li>
                                                <li><strong>Domain : </strong><span id="license-domain"></span></li>
                                            </ul>

                                            <div style="display: inline-block">
                                                <input id='thirtd_part_cache_plugins' type='hidden'
                                                       value="<?php if (!empty($third_party_cache_plugins)) {
                                                           echo '1';
                                                       } ?>">
                                                <input id='uucss_auto_refresh_frontend-hidden' type='hidden'
                                                       name='autoptimize_uucss_settings[uucss_auto_refresh_frontend]'
                                                       value="<?php if (!empty($options['uucss_auto_refresh_frontend']) && '1' === $options['uucss_auto_refresh_frontend']) {
                                                           echo '1';
                                                       } ?>">
                                                <input id='uucss_dev_mode' type='hidden'
                                                       name='autoptimize_uucss_settings[uucss_dev_mode]'
                                                       value="<?php if (!empty($options['uucss_dev_mode']) && '1' === $options['uucss_dev_mode']) {
                                                           echo '1';
                                                       } ?>">
                                                <input id='uucss_auto_refresh_frontend-hidden_rule' type='hidden'
                                                       name='autoptimize_uucss_settings[uucss_auto_refresh_frontend_rule]'
                                                       value="<?php if (!empty($options['uucss_auto_refresh_frontend_rule']) && '1' === $options['uucss_auto_refresh_frontend_rule']) {
                                                           echo '1';
                                                       } ?>">
                                                <input type="hidden"
                                                       name="autoptimize_uucss_settings[uucss_api_key_verified]"
                                                       value="<?php if (isset($options['uucss_api_key_verified']))
                                                           echo $options['uucss_api_key_verified'] ?>">
                                                <input id='uucss_api_key' type='hidden'
                                                       name='autoptimize_uucss_settings[uucss_api_key]'
                                                       value="<?php echo (isset($options['uucss_api_key'])) ? $options['uucss_api_key'] : '' ?>"
                                                       size="40">
                                                <em id="verification_status"></em>
                                                <?php if (isset($options['valid_domain']) && $options['valid_domain']) : ?>
                                                    <a href="<?php echo(defined('UUCSS_APP_URL') && UUCSS_APP_URL ? UUCSS_APP_URL : 'https://app.rapidload.io/') ?>"
                                                       target="_blank"
                                                       class="uucss-activate" id="my-account"> My Account
                                                    </a>
                                                    <a href="<?php echo UnusedCSS::activation_url('deactivate') ?>"
                                                       class="uucss-activate" id="uucss-deactivate"> Deactivate License
                                                    </a>
                                                <?php else : ?>
                                                    <a href="<?php echo(defined('UUCSS_APP_URL') && UUCSS_APP_URL ? UUCSS_APP_URL : 'https://app.rapidload.io/') ?>"
                                                       target="_blank"
                                                       class="uucss-activate" id="my-account"> My Account
                                                    </a>
                                                    <a style="margin-left: 5px"
                                                       href="<?php echo UnusedCSS::activation_url('authorize') ?>"
                                                       class="uucss-activate"> Reactivate License
                                                    </a>

                                                    <a style="margin-left: 5px"
                                                       href="<?php echo UnusedCSS::activation_url('deactivate') ?>"
                                                       class="uucss-activate" id="uucss-deactivate"> Deactivate License
                                                    </a>
                                                <?php endif; ?>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="rapidload-option-header">
                                    <h3 class="rapidload-title2">Status</h3>
                                </div>
                                <div class="rapidload-field rapidload-field-status">
                                    <div class="rapidload-flex">
                                        <div class="rapidload-status">
                                            <div class="content">
                                                <?php
                                                $total = UnusedCSS_DB::get_total_job_count();
                                                $success = UnusedCSS_DB::get_total_job_count(' WHERE status = "success" AND warnings IS NULL ');
                                                $queued = UnusedCSS_DB::get_total_job_count(' WHERE status = "queued" ');
                                                $processing = UnusedCSS_DB::get_total_job_count(' WHERE status = "processing" ');
                                                $waiting = UnusedCSS_DB::get_total_job_count(' WHERE status = "waiting" ');
                                                $warnings = UnusedCSS_DB::get_total_job_count(' WHERE warnings IS NOT NULL ');
                                                $failed = UnusedCSS_DB::get_total_job_count(' WHERE status = "failed" ');
                                                ?>
                                                <p>
                                                    <strong>Cache Folder</strong> : <?php echo RapidLoad_Admin::$base_dir; ?>
                                                </p>
                                                <p <?php if (!$hide_view_log) echo 'style="display:none"' ?>>
                                                    <strong>Log File</strong>
                                                    : <?php echo UUCSS_LOG_DIR . 'debug.log'; ?> <a
                                                            id="status-view-uucss-log" href="#">View Logs</a>
                                                </p>
                                                <p>
                                                    <strong>Can We Write ?</strong> : <?php echo (rapidload()->admin()->initFileSystem()) ? 'Yes' : 'No' ; ?>
                                                </p>

                                                <?php if(rapidload()->rapidload_module()->is_active('unused-css')) :?>
                                                    <p class="style-sheet-count">
                                                        <strong>CSS Stylesheets</strong> : <?php echo rapidload()->uucss->cache_file_count() . ' files, totalling ' . rapidload()->uucss->size(); ?>
                                                    </p>
                                                    <p class="more-info-uucss-status">
                                                        <strong>Total Optimization Jobs</strong> : <span
                                                                class="total-jobs"><?php echo $total; ?></span>
                                                    </p>
                                                <?php endif; ?>

                                                <div class="uucss-status-more-info" style="display: none">
                                                    <p>
                                                        <strong>DB Version</strong>
                                                        : <?php echo UnusedCSS_DB::$current_version ?>
                                                    </p>
                                                    <?php
                                                    $hits = UnusedCSS_DB::get_total_job_count(' WHERE hits > 0 ');
                                                    ?>
                                                    <p class="status-hits-count">
                                                        <strong>Hits</strong> : <span
                                                                class="number"><?php echo $hits; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($hits / $total * 100, 0) : '0'; ?></span>%
                                                    </p>
                                                    <p class="status-success-count">
                                                        <strong>Success</strong> : <span
                                                                class="number"><?php echo $success; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($success / $total * 100, 0) : '0'; ?></span>%
                                                    </p>
                                                    <?php
                                                        if ( rapidload()->rapidload_module()->is_active('unused-css') && rapidload()->uucss->rules_enabled() ) :
                                                            $rule_based = UnusedCSS_DB::get_total_job_count(" WHERE status = 'rule-based'");
                                                    ?>
                                                            <p class="status-rule-based-count">
                                                                <strong>Rule Based</strong> : <span class="number"><?php /*echo $rule_based; */ ?></span> - <span class="percentage"><?php /*echo ($total != 0) ? number_format($rule_based/$total*100, 0) : '0'; */ ?></span>%
                                                            </p>
                                                    <?php
                                                        endif;
                                                    ?>
                                                    <p class="status-queued-count">
                                                        <strong>Queued</strong> : <span
                                                                class="number"><?php echo $queued; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($queued / $total * 100, 0) : '0' ?></span>%
                                                    </p>
                                                    <p class="status-waiting-count">
                                                        <strong>Waiting</strong> : <span
                                                                class="number"><?php echo $waiting; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($waiting / $total * 100, 0) : '0' ?></span>%
                                                    </p>
                                                    <p class="status-processing-count">
                                                        <strong>Processing</strong> : <span
                                                                class="number"><?php echo $processing; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($processing / $total * 100, 0) : '0' ?></span>%
                                                    </p>
                                                    <p class="status-warnings-count">
                                                        <strong>Warnings</strong> : <span
                                                                class="number"><?php echo $warnings; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($warnings / $total * 100, 0) : '0' ?></span>%
                                                    </p>
                                                    <p class="status-failed-count">
                                                        <strong>Failed Jobs</strong> : <span
                                                                class="number"><?php echo $failed; ?></span> - <span
                                                                class="percentage"><?php echo ($total != 0) ? number_format($failed / $total * 100, 0) : '0' ?></span>%
                                                    </p>
                                                    <?php
                                                    if (count($third_party_plugins) > 0):
                                                        ?>
                                                        <p>
                                                            <strong>Support Plugins</strong> :
                                                        </p>
                                                    <?php
                                                    endif;
                                                    ?>
                                                    <ul>
                                                        <?php
                                                        foreach ($third_party_plugins as $party_plugin) {
                                                            echo '<li style="margin-bottom:0">' . (isset($party_plugin['plugin']) ? $party_plugin['plugin'] : '') . ' - ' . (isset($party_plugin['category']) ? $party_plugin['category'] : '') . '</li>';
                                                        }
                                                        ?>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="modules" class="rapidload-page rapidload-page-modules" style="display:none">
                        <div class="rapidload-section-header">
                            <h2 class="rapidload-title1 rapidload-icon-home">
                                Modules
                            </h2>
                        </div>
                        <div class="rapidload-grid">
                            <?php foreach ($rapidload_modules as $module) : ?>
                                <div class="rapidload-box <?php if (isset($module['status']) && $module['status'] == 'on') echo 'active' ?>">
                                    <i>
                                    </i>
                                    <header>
                                        <h3><?php echo $module['title'] ?></h3>
                                        <p><?php echo $module['description'] ?></p>
                                    </header>
                                    <div class="status wp-clearfix">
                                    <span class="rapidload-switch-toggle">
                                        <input type="checkbox" class="rapidload-modules"
                                               id="module-<?php echo $module['id'] ?>"
                                               name="module-<?php echo $module['id'] ?>"
                                               value="<?php echo $module['id'] ?>"
                                        <?php if (isset($module['status']) && $module['status'] == 'on') echo 'checked' ?>>
                                        <label for="module-<?php echo $module['id'] ?>"
                                               class="rapidload-toggle-slider ">
                                            <svg width="3" height="8" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 2 6" class="toggle_on" role="img" aria-hidden="true"
                                                 focusable="false"><path d="M0 0h2v6H0z"></path></svg>
								            <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 6 6" class="toggle_off" role="img" aria-hidden="true"
                                                 focusable="false"><path
                                                        d="M3 1.5c.8 0 1.5.7 1.5 1.5S3.8 4.5 3 4.5 1.5 3.8 1.5 3 2.2 1.5 3 1.5M3 0C1.3 0 0 1.3 0 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"></path></svg>
							            </label>
                                        <span class="spinner"></span>
                                    </span>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div id="optimize" class="rapidload-page rapidload-page-optimize" style="display:none">
                        <?php if(rapidload()->rapidload_module()->is_active('unused-css')): ?>
                        <div class="rapidload-page-row">
                            <div class="rapidload-page-col">
                                <div class="rapidload-option-header">
                                    <h3 class="rapidload-title2">UnusedCSS Settings</h3>
                                </div>
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
                                    <?php if(rapidload()->uucss->provider != 'rapidload') : ?>
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
                                            <th scope="row"><?php _e( 'Rule Based Injection (Beta)', 'uucss' ); ?></th>
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
                                </table>
                            </div>
                        </div>
                        <?php endif; ?>
                        <?php if(rapidload()->rapidload_module()->is_active('critical-css')): ?>
                        <div class="rapidload-page-row">
                            <div class="rapidload-page-col">
                                <div class="rapidload-option-header">
                                    <h3 class="rapidload-title2">CriticalCSS Settings</h3>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                        <div class="rapidload-page-row">
                            <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary"
                                                     value="<?php _e( 'Save Changes', 'uucss' ); ?>"/>
                            </p>
                        </div>
                    </div>
                    <div style="display: none">
                        <input id='uucss_dev_mode' type='hidden'
                               name='autoptimize_uucss_settings[uucss_dev_mode]'  value="<?php if ( ! empty( $options['uucss_dev_mode'] ) && '1' === $options['uucss_dev_mode'] ) {
                            echo '1';
                        } ?>">
                        <input type="hidden" name="autoptimize_uucss_settings[uucss_api_key_verified]"
                               value="<?php if ( isset( $options['uucss_api_key_verified'] ) )
                                   echo $options['uucss_api_key_verified'] ?>">
                        <input id='uucss_api_key' type='hidden'
                               name='autoptimize_uucss_settings[uucss_api_key]'
                               value="<?php echo ( isset( $options['uucss_api_key'] ) ) ? $options['uucss_api_key'] : '' ?>"
                               size="40">
                    </div>
                </form>
            </section>
        </div>
    </div>
</div>
