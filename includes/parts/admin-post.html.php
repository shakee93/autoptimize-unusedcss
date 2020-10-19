<?php defined( 'ABSPATH' ) or die(); ?>

<style>
    #uucss-options .inside {
        padding-bottom: 0;
    }

    #uucss-options .uucss-actions {
        text-align: right;
        background: whitesmoke;
        border-top: 1px solid #dddddd;
        padding: 10px;
        margin: 0 -12px;
    }

    #uucss-options input[type="text"].ui-autocomplete-loading {
        background: none;
    }

    #uucss-options em {
        color: #9E9E9E;
    }

    #uucss-options .example span {
        display: inline-block;
        margin-bottom: 4px;
    }

    #uucss-options span em {
        background: #F5F5F5;
        color: #3F51B5;
        border: 1px solid #E0E0E0;
        border-radius: 3px;
        padding: 3px 8px;
    }

    #uucss-options .safelist-add button.button {
        width: 100%;
        margin-top: 8px;
    }
</style>

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
    </div>


</div>
<script>
	<?php include( "admin-post.js.php" ); ?>
</script>