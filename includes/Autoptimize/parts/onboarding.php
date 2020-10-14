<?php defined( 'ABSPATH' ) or die(); ?>

<div class="main-section">
    <div class="plugin-steps">
        <div class="logo-section">
            <img src="https://unusedcss.io/wp-content/uploads/2020/09/logo.svg" alt="UnusedCSS.io logo">
        </div>
        <div class="steps-wrap">
            <div class="step-text">
				<?php
                    $step = 1;
                    $steps = [
                        'Install and Actvate',
                        'Enable',
                        'Connnect',
                        'Run First Job'
                    ];

                    if(class_exists('autoptimizeOptionWrapper') &&
                        autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "" ){
                        $step = 2;
                    }else if(
	                    is_plugin_active('autoptimize/autoptimize.php') &&
	                    class_exists( 'autoptimizeOptionWrapper' ) &&
	                    autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "on" &&
	                    ! UnusedCSS_Autoptimize_Admin::is_api_key_verified()
                    ) {
	                    $step = 3;
                    } else if ( UnusedCSS_Autoptimize_Admin::is_api_key_verified() ) {
	                    $step = 4;
                    }
				?>
                <ul>
                    <li><span class="current"><?php echo $step ?></span>/4</li>
                </ul>
            </div>
            <div class="progress-bar-wrap">
                <div id="progress-bar" style="width: <?php echo $step * 25 ?>%;"></div>
            </div>
        </div>
        <div class="card">
            <div class="slide-contents-wrap">
                <div class="slide-contents" style="<?php
				if ( ( $step - 1 ) !== 0 ) {
                        echo sprintf('transform: translate3d(%spx, 0px, 0px); transition-duration: 0.5s;',(($step - 1) * 223 * -1));
                    }
                ?>">
                    <div class="install actions slide-content <?php echo is_plugin_active('autoptimize/autoptimize.php') ? 'done' : null ?>">
                        <h2>Autoptimize install and Activate</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/on-boarding/macbook_isometric.svg'?>" alt="">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                        <a class="act-button js-activate-ao"
                           href="<?php
                            if(file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php')){
                                echo UnusedCSS_Utils::activate_plugin( 'autoptimize/autoptimize.php' );
                            }else{
                                echo network_admin_url( 'plugin-install.php?tab=plugin-information&plugin=autoptimize' );
                            }
                           ?>"
                           data-activation_url="<?php  echo UnusedCSS_Utils::activate_plugin( 'autoptimize/autoptimize.php' ); ?>"
                           target="_blank">
                            <?php
                            if(!file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php')){
                                echo 'Install';
                            }else{
                                echo 'Activate';
                            }
                            ?>
                            <span class="dashicons dashicons-yes-alt"></span>
                        </a>
                        <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                    </div>
                    <div class="enable actions slide-content <?php
                        if(class_exists('autoptimizeOptionWrapper') && autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "on") {
                            echo 'done';
                        }
                    ?>">
                        <h2>Configure Autoptimize</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/on-boarding/innovation_isometric.svg'?>" alt="">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                        <a class="act-button js-enable-css-ao "
                           href="<?php echo admin_url('/options-general.php?page=autoptimize#configure_autoptimize_css') ?>" target="_blank">
                            Configure <span class="dashicons dashicons-yes-alt"></span>
                        </a>
                        <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                        <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                    </div>
                    <div class="connect actions slide-content <?php
                        if(UnusedCSS_Autoptimize_Admin::is_api_key_verified()){
                            echo 'done';
                        }
                    ?>">
                        <h2>Connect & Activate</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/on-boarding/money_transfer__isometric.svg'?>" alt="">
                        <p>Connect with UnusedCSS.io engine to automatically remove unused css from your website and
                            unleash your page speed and speed scores.</p>
                        <a class="act-button js-uucss-connect "
                           href="<?php echo UnusedCSS_Utils::activation_url("authorize") ?>"
                           target="_blank">
                            Connect <span class="dashicons dashicons-yes-alt"></span>
                        </a>
                        <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                        <span class="next nav"><span class="dashicons dashicons-arrow-right-alt2"></span></span>
                    </div>
                    <div class="run-job actions slide-content <?php
                        if ( UnusedCSS_Settings::get_first_link() ) {
	                        echo 'done';
                        }
                    ?>">
                        <h2>Run First Job</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/on-boarding/career__isometric.svg'?>" alt="">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                        <a class="act-button js-uucss-first-job" href="#" target="_blank">
                            Run First Job <span class="dashicons dashicons-yes-alt"></span>
                        </a>
                        <span class="previous nav"><span class="dashicons dashicons-arrow-left-alt2"></span></span>
                    </div>
                    <div class="actions slide-content">
                        <h2>Congratulations!</h2>
                        <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/on-boarding/career__isometric.svg'?>" alt="">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                        <a class="act-button js-goto-settings" href="<?php echo admin_url('options-general.php?page=uucss')?>">View Jobs</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="skip-wrap">
            <a href="<?php echo admin_url()?>">Skip</a>
        </div>
    </div>
</div>