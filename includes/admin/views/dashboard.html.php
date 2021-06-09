<?php
$api_key_verified = isset( $options['uucss_api_key_verified'] ) && $options['uucss_api_key_verified'] == '1';
    $third_party_plugins = apply_filters('uucss/third-party/plugins', []);
    $third_party_cache_plugins = array_filter($third_party_plugins, function ($plugin){
        return isset($plugin['category']) && $plugin['category'] == 'cache';
    });
    $default_debug_mode = ! empty( $options['uucss_enable_debug'] ) && '1' === $options['uucss_enable_debug'];
    $hide_view_log = apply_filters('uucss/view_debug/frontend', (boolean)$default_debug_mode);
?>

<div id="rapidload-dashboard">

    <?php foreach ($rapidload_modules as $module) : ?>

        <p>
            <?php echo $module['title'] ?>
        </p>

        <label class="switch" for="module-<?php echo $module['id'] ?>">
            <input type="checkbox" class="rapidload-modules"
                   id="module-<?php echo $module['id'] ?>"
                   name="module-<?php echo $module['id'] ?>" value="<?php echo $module['id'] ?>"
                <?php if(isset($module['status']) && $module['status'] == 'on') echo 'checked' ?>>
            <span class="slider round"></span>
        </label>

    <?php endforeach; ?>

    <div>
        <ul id="uucss-wrapper">
            <li class="rapidload-status">
                <h2>RapidLoad Status
                    <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                </span>
                </h2>
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
                        <strong>Version</strong> : <?php echo UUCSS_VERSION ?>
                    </p>
                    <p>
                        <strong>DB Version</strong> : <?php echo UnusedCSS_DB::$current_version ?>
                    </p>
                    <p class="style-sheet-count">
                        <strong>CSS Stylesheets</strong> : <?php echo rapidload()->uucss->cache_file_count() . ' files, totalling ' . rapidload()->uucss->size(); ?>
                    </p>
                    <p>
                        <strong>Cache Folder</strong> : <?php echo UnusedCSS::$base_dir; ?>
                    </p>
                    <p <?php if(!$hide_view_log) echo 'style="display:none"' ?>>
                        <strong>Log File</strong> : <?php echo UUCSS_LOG_DIR . 'debug.log'; ?> <a id="status-view-uucss-log" href="#">View Logs</a>
                    </p>
                    <p>
                        <strong>Can We Write ?</strong> : <?php echo (rapidload()->uucss->initFileSystem()) ? 'Yes' : 'No' ; ?>
                    </p>
                    <p class="more-info-uucss-status">
                        <strong>Total Optimization Jobs</strong> :  <span class="total-jobs"><?php echo $total; ?></span>
                    </p>
                    <div class="uucss-status-more-info" style="display: none">
                        <?php
                        $hits = UnusedCSS_DB::get_total_job_count(' WHERE hits > 0 ');
                        ?>
                        <p class="status-hits-count">
                            <strong>Hits</strong> : <span class="number"><?php echo $hits; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($hits/$total*100, 0) : '0'; ?></span>%
                        </p>
                        <p class="status-success-count">
                            <strong>Success</strong> : <span class="number"><?php echo $success; ?></span> - <span class="percentage"><?php echo ($total != 0) ? number_format($success/$total*100, 0) : '0'; ?></span>%
                        </p>
                        <?php
                        if ( rapidload()->uucss->rules_enabled() ) :
                            $rule_based = UnusedCSS_DB::get_total_job_count(" WHERE status = 'rule-based'");
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
                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                </span>
                </h2>
                <div class="content">

                    <div class="license-info">
                        <span id="license-message"></span>
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
        </ul>
    </div>

</div>
