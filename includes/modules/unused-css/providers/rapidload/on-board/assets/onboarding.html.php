<?php

defined( 'ABSPATH' ) or die();

$steps = UnusedCSS_RapidLoad_Onboard::$onboard_steps;
$step  = UnusedCSS_RapidLoad_Onboard::$current_step + 1;
?>

<div class="main-section on-board">
    <div class="plugin-steps" data-total_steps="<?php echo count($steps)?>">
        <div class="logo-section">
            <img src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/logo.svg' ?>" alt="RapidLoad logo">
        </div>
        <div class="steps-wrap">
            <div class="step-text">
                <ul>
                    <li><span class="current"><?php echo $step ?></span>/<?php echo count($steps) ?></li>
                </ul>
            </div>
            <div class="progress-bar-wrap">
                <div id="progress-bar" style="width: <?php echo $step * 100/count($steps) ?>%;"></div>
            </div>
        </div>
        <div class="card">
            <div class="slide-contents-wrap">
                <div class="slide-contents" style="<?php
                if (($step - 1) !== 0) {
                    echo sprintf('transform: translate3d(%spx, 0px, 0px); transition-duration: 0.5s;', (($step - 1) * 223 * -1));
                }
                ?>">
                    <?php
                        foreach ($steps as $onboard_step){
                            if(isset($onboard_step['render'])){
                                $onboard_step['render']();
                            }
                        }
                    ?>
                </div>
            </div>
        </div>
        <div class="skip-wrap">
            <a href="<?php echo admin_url('options-general.php?page=uucss') ?>">Skip</a>
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
            <p class="success">You have reduced CSS size successfully</p>
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
                   href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Contact Support</a>
            </div>
        </div>
    </div>
</div>


