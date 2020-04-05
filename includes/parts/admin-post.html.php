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

    #uucss-options span {
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
</style>

<div id="uucss-settings">

    <div class="uucss-fields">
        <?php wp_nonce_field('uucss_option_save','uucss_nonce') ?>

        <p>
            <label>
                <input id="uucss_exclude" type="checkbox" name="uucss_exclude" <?php echo empty($options['exclude']) ? '' : 'checked=checked'   ?>>
                Exclude
            </label>
        </p>

        <div class="tagsdiv" id="uucss_whitelist_classes">
            <div class="">
                <div class="nojs-tags hide-if-js">
                    <label for="tax-input-post_tag">Add or remove tags</label>
                    <p><textarea name="uucss_whitelist_classes" rows="3" cols="20" class="the-tags" aria-describedby="new-tag-post_tag-desc"><?php echo esc_attr( $options['whitelist_classes'] )  ?></textarea></p>
                </div>
                <div class="ajaxtag hide-if-no-js">
                    <label class="screen-reader-text" for="new-tag-post_tag">Add New Tag</label>
                    <input type="text" class="newtag form-input-tip ui-autocomplete-input" size="16" autocomplete="off" aria-describedby="new-tag-post_tag-desc" value="" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-owns="ui-id-1">
                    <input type="button" class="button tagadd" value="Add">
                </div>
                <p class="howto" >
                    Whitelisted Selectors (regex supported)
                </p>
            </div>
            <ul class="tagchecklist" role="list"></ul>
            <div class="example">
                <p><strong>Rule : </strong><span><em>red</em></span>
                    <br>
                    <strong>Ignores : </strong><em>#red</em>, <em>.red</em>, <em>red</em>
                </p>
                <p><strong>Rule : </strong><span><em>/^orange/</em></span>
                    <br>
                    <strong>Ignores : </strong><em>.orange-large</em>, <em>#orange</em>
                </p>
                <p><strong>Rule (<small>with children</small>) : </strong> <span><em>c:/red$/</em></span>
                    <br>
                    <strong>Ignores : </strong><em>red p</em>, <em>.bg-red .child-of-bg</em>
                </p>
            </div>
        </div>
    </div>

    <div class="uucss-actions">
        <button id="button-uucss-clear" type="button" class="button button-small button-link button-link-delete" style="margin-right: 5px;">Clear Cache</button>
        <button id="button-uucss-purge" type="button" class="button button-small hide-if-no-js" >Regenerate</button>
    </div>
</div>
<script>
    <?php include ("admin-post.js.php"); ?>
</script>