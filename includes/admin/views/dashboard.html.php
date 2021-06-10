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
                    <a href="#optimize" id="rapidload-nav-uucss" class="rapidload-menu-item">
                        <div class="rapidload-menu-item-title">File Optimization</div>
                        <div class="rapidload-menu-item-description">Optimize CSS</div>
                    </a>
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

                                                <?php if(rapidload()->rapidload_module()->is_active('unused-css')) :?>
                                                    <p class="style-sheet-count">
                                                        <strong>CSS Stylesheets</strong> : <?php echo rapidload()->uucss->cache_file_count() . ' files, totalling ' . rapidload()->uucss->size(); ?>
                                                    </p>
                                                <?php endif; ?>
                                                <p>
                                                    <strong>Cache Folder</strong> : <?php echo UnusedCSS::$base_dir; ?>
                                                </p>
                                                <p <?php if (!$hide_view_log) echo 'style="display:none"' ?>>
                                                    <strong>Log File</strong>
                                                    : <?php echo UUCSS_LOG_DIR . 'debug.log'; ?> <a
                                                            id="status-view-uucss-log" href="#">View Logs</a>
                                                </p>
                                                <?php if(rapidload()->rapidload_module()->is_active('unused-css')) :?>
                                                    <p>
                                                        <strong>Can We Write ?</strong> : <?php echo (rapidload()->uucss->initFileSystem()) ? 'Yes' : 'No' ; ?>
                                                    </p>
                                                <?php endif; ?>
                                                <p class="more-info-uucss-status">
                                                    <strong>Total Optimization Jobs</strong> : <span
                                                            class="total-jobs"><?php echo $total; ?></span>
                                                </p>
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
                </form>
            </section>
        </div>
    </div>
</div>
