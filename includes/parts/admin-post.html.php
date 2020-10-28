<?php defined( 'ABSPATH' ) or die(); ?>


<div id="uucss-settings">

    <div class="uucss-fields">
		<?php wp_nonce_field( 'uucss_option_save', 'uucss_nonce' ) ?>

        <p>
            <label>
                <input id="uucss_exclude" type="checkbox"
                       name="uucss_exclude" <?php echo empty( $options['exclude'] ) ? '' : 'checked=checked' ?>>
                Exclude
            </label>
        </p>

        <p>
            <textarea hidden id="uucss_safelist"
                      name="uucss_safelist"><?php echo empty( $options['safelist'] ) ? '' : $options['safelist'] ?></textarea>
        <div class="safelist-add">
            <select name="" id="safelist-type">
                <option value="single">Single</option>
                <option value="deep">Deep</option>
                <option selected value="greedy">Greedy</option>
            </select>
            <input id="safelist-add" type="text" size="20"
                   autocomplete="off">
            <button class="button">Add Rule</button>
        </div>
        <div class="safelist-list">
            <ul></ul>
        </div>

        </p>

        <div class="uucss-info-wrapper" style="margin-bottom: 10px">
            <div class="info-icon">
                <span class="dashicons dashicons-info"></span>
            </div>
            <div class="info-details">
                <p>You can add rules to specify which css classes or id's are safe to left
                    in the final UnusedCSS output.</p>
                <p class="divider"></p>
                <p>
                    use * expressions and add one rule at a time,
                </p>
                <p class="divider"></p>
                <p>
                    examples : <br><em>my-class*</em>, <em>*my-id</em>, <em>*li*</em><br>
                </p>
            </div>
        </div>
    </div>


</div>
