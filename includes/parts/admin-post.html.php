<style>
    #uucsss-options .inside {
        padding-bottom: 0;
    }
    #uucsss-options .uucss-actions {
        text-align: right;
        background: whitesmoke;
        border-top: 1px solid #dddddd;
        padding: 10px;
        margin: 0 -12px;
    }

</style>

<div class="uucss-fields">
    <?php wp_nonce_field('uucss_option_save','uucss_nonce') ?>

    <p>
        <label>
            <input id="uucss_exclude" type="checkbox" name="uucss_exclude" <?php echo empty($options['exclude']) ? '' : 'checked="checked"'   ?>">
            Exclude
        </label>
    </p>

    <p>
        <label>
            Whitelisted Classes (, separated)
            <textarea name="uucss_whitelist_classes" id="uucss_whitelist_classes" style="width: 100%" ><?php echo esc_attr( $options['whitelist_classes'] )  ?></textarea>
        </label>
    </p>
</div>

<div class="uucss-actions">
    <button id="button-uucss-clear" type="button" class="button button-medium button-link button-link-delete" style="margin-right: 15px;">Clear Cache</button>
    <button id="button-uucss-purge" type="button" class="button hide-if-no-js" >Purge CSS</button>
</div>


<script>
    <?php include ("admin-post.js.php"); ?>
</script>