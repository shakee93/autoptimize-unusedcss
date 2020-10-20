<?php defined('ABSPATH') or die(); ?>

<div class="main-section">
    <div class="plugin-steps">
        <div class="logo-section">
            <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/ao+logo.svg' ?>" alt="UnusedCSS.io logo">
        </div>
        <div class="steps-wrap">
            <div class="step-text">
                <?php
                $step = 1;
                $steps = UnusedCSS_Autoptimize_Onboard::get_on_board_steps();
                $step = UnusedCSS_Autoptimize_Onboard::get_on_board_step();
                ?>
                <ul>
                    <li><span class="current"><?php echo $step ?></span>/3</li>
                </ul>
            </div>
            <div class="progress-bar-wrap">
                <div id="progress-bar" style="width: <?php echo $step * 33.33333333333 ?>%;"></div>
            </div>
        </div>
        <div class="card">
            <div class="slide-contents-wrap">
                <div class="slide-contents" style="<?php
                if (($step - 1) !== 0) {
                    echo sprintf('transform: translate3d(%spx, 0px, 0px); transition-duration: 0.5s;', (($step - 1) * 223 * -1));
                }
                ?>">
                    <div class="connect actions slide-content <?php if (UnusedCSS_Autoptimize_Admin::is_api_key_verified()) {
                        echo 'done';
                    } ?>">
                        <h2>Connect & Activate</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/connect.svg' ?>"
                             alt="">
                        <p>Connect with <strong><em>UnusedCSS.io</em></strong> engine to start automatic optimization of
                            your website and
                            watch your page speed and speed scores spike up.</p>
                        <div class="action-wrap">
                            <a class="act-button js-uucss-connect "
                               href="<?php echo UnusedCSS_Utils::activation_url("authorize") ?>"
                               target="_blank">
                                Connect <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                        </div>
                    </div>
                    <div class="install actions slide-content <?php echo UnusedCSS_Autoptimize_Admin::ao_active() ? 'done' : null ?>">
                        <h2>Autoptimize install and Activate</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/install-autoptimize.svg' ?>"
                             alt="">
                        <p>
                            Autoptimize (AO) is free to use and must be installed and active before running UnusedCSS.
                        </p>
                        <div class="action-wrap">
                            <a class="act-button js-activate-ao"
                               href="<?php
                               if (UnusedCSS_Autoptimize_Admin::ao_installed()) {
                                   echo UnusedCSS_Utils::activate_plugin(UnusedCSS_Autoptimize_Admin::get_installed_ao_plugin());
                               } else {
                                   echo network_admin_url('plugin-install.php?tab=plugin-information&plugin=autoptimize');
                               }
                               ?>"
                               data-activation_url="<?php echo UnusedCSS_Utils::activate_plugin(UnusedCSS_Autoptimize_Admin::get_installed_ao_plugin()); ?>"
                               target="_blank">
                                <?php
                                if (!UnusedCSS_Autoptimize_Admin::ao_installed()) {
                                    echo 'Install';
                                } else {
                                    echo 'Activate';
                                }
                                ?>
                                <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                            <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                        </div>
                    </div>
                    <div class="enable actions slide-content <?php if (UnusedCSS_Autoptimize_Admin::ao_css_option_enabled()) {
                        echo 'done';
                    } ?>">
                        <h2>Configure Autoptimize</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/configure.svg' ?>" alt="">
                        <p>
                            Enable the <strong><em>Optimize CSS</em></strong> option of Autoptimize in the settings.
                        </p>
                        <div class="action-wrap">
                            <a class="act-button js-enable-css-ao "
                               href="<?php echo admin_url('/options-general.php?page=autoptimize#configure_autoptimize_css') ?>"
                               target="_blank">
                                Configure <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                            <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                        </div>
                    </div>
                    <div class="run-job actions slide-content <?php if (UnusedCSS_Settings::get_first_link()) {
                        echo 'done';
                    } ?>">
                        <h2>Run First Job</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/run-first-job.svg' ?>"
                             alt="">
                        <p>Run your first UnusedCSS removal job and see how much weight it could remove from your
                            website. <strong>it could reduce css file size upto 98% on larger websites. </strong></p>
                        <div class="action-wrap">
                            <a class="act-button js-uucss-first-job" href="#" target="_blank">
                                Run First Job <span class="dashicons dashicons-yes-alt"></span>
                            </a>
                            <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="skip-wrap">
            <a href="<?php echo admin_url() ?>">Skip</a>
        </div>
    </div>
    <div class="card-complete loading">
        <div class="content">
            <div class="loading-spinner"></div>
            <h2 class="title error">OOPS!</h2>
            <img class="sad intro" style=""
                 src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/result_error.svg' ?>" alt="">
            <h2 class="title success">Congratulations</h2>
            <img class="success" style=""
                 src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/on-boarding/congrats.svg' ?>" alt="">
            <p class="success">You have reduced css size successfully</p>
            <p class="error">An error occurred</p>
            <div class="first-result">
                <div class="result-stat">
                    <div class="tippy-content" data-state="visible" style="transition-duration: 1000ms;">
                        <div class="stat-tooltip">
                            <div class="progress-bar-wrapper" aria-expanded="true">
                                <div class="progress-bar" aria-expanded="true">
                                    <span style="width:100%"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="error-result">
                <div>
                    <p>Error Code : <span class="code"></span></p>
                    <p><span class="description"></span></p>
                </div>
            </div>
            <div class="action-wrap">
                <a class="act-button uucss-settings js-goto-settings"
                   href="<?php echo admin_url('options-general.php?page=uucss') ?>">View Jobs</a>
                <a class="act-button uucss-support js-goto-support"
                   href="https://unusedcss.zendesk.com/hc/en-us/requests/new" target="_blank">Contact Support</a>
            </div>
        </div>
    </div>
</div>