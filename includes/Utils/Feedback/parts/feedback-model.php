<?php
?>

<div class="uucss-plugin-uninstall-feedback-popup uucss-feedback" id="uucss_uninstall_feedback_popup">
    <div class="popup--header">
        <h5>What's wrong? </h5>
    </div><!--/.popup--header-->
    <div class="popup--body">
        <ul class="popup--form">
            <li uucss-option-id="5">
                <input type="radio" name="uucss-deactivate-option" id="uucss_feedback5">
                <label for="uucss_feedback5">
                    I no longer need the plugin </label>
            </li>
            <li uucss-option-id="6">
                <input type="radio" name="uucss-deactivate-option" id="uucss_feedback6">
                <label for="uucss_feedback6">
                    It's a temporary deactivation. I'm just debugging an issue. </label>
            <li uucss-option-id="4">
                <input type="radio" name="uucss-deactivate-option" id="uucss_feedback4">
                <label for="uucss_feedback4">
                    I could not get the plugin to work </label>
            <li uucss-option-id="3">
                <input type="radio" name="uucss-deactivate-option" id="uucss_feedback3">
                <label for="uucss_feedback3">
                    I found a better plugin </label>
            <li uucss-option-id="999">
                <input type="radio" name="uucss-deactivate-option" id="uucss_feedback999">
                <label for="uucss_feedback999">
                    Other </label>
                <textarea width="100%" rows="2" name="comments" placeholder="What can we do better?"></textarea></li>
        </ul>
    </div><!--/.popup--body-->
    <div class="popup--footer">
        <div class="actions">
            <a href="#" class="info-disclosure-link">What info do we collect?</a>
            <div class="info-disclosure-content"><p>Below is a detailed view of all data that ThemeIsle will receive if
                    you fill in this survey. No domain name, email address or IP addresses are transmited after you
                    submit the survey.</p>
                <ul>
                    <li><strong> Plugin version </strong> <code id="uucss_plugin_version"> <?php echo UUCSS_VERSION ?> </code></li>
                    <li><strong>Current website:</strong> <code> <?php echo get_site_url() ?> </code></li>
                    <li><strong> Uninstall reason </strong> <i> Selected reason from the above survey </i></li>
                </ul>
            </div>
            <div class="buttons">
                <input type="submit"
                       name="uucss-deactivate-no"
                       id="uucss-deactivate-no"
                       class="button"
                       value="Skip &amp; Deactivate">
                <input type="submit"
                       name="uucss-deactivate-yes"
                       id="uucss-deactivate-yes"
                       class="button button-primary"
                       value="Submit &amp; Deactivate"
                       data-after-text="Submit &amp; Deactivate"
                       disabled="1"></div>
<!--                <a href="--><?php //echo UnusedCSS_Autoptimize_Admin::activate_plugin('autoptimize-unusedcss', 'deactivate') ?><!--" class="info-disclosure-link">Skip & Deactivate</a>-->


        </div><!--/.actions-->
    </div><!--/.popup--footer-->
</div>
