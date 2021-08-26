<?php

defined( 'ABSPATH' ) or die();

global $post;
?>

<style>

    li#wp-admin-bar-autoptimize-uucss {
        display: inline-block !important;
        padding: 12px 0 5px !important;
        background: #01579B !important;
        color: white;
        cursor: ;
    }

    .uucss-stats a.rapidload {
        line-height: 0 !important;
        display: inline-block !important;
        margin-top: 2px !important;
        margin-left: -10px !important;
        cursor: pointer !important;
        height: 0 !important;
    }

    .uucss-stats .hidden {
        display: none;
    }

    li#wp-admin-bar-autoptimize-uucss a{
        cursor: default;
        height: auto;
    }

    li#wp-admin-bar-autoptimize-uucss a:hover, a.ab-item:hover{
        color : rgba(240, 245, 250, 0.7) !important;
    }

    .uucss-stats {
        line-height: 0 !important;
    }

    span.uucss-stats__size {
        font-size: .7em !important;
    }

    .uucss-stats__actions div {
        display: inline-block;
        padding: 0 7px !important;
        background: #009688;
        line-height: 1.5 !important;
        border-radius: 3px !important;
        margin-right: 3px !important;
        cursor: pointer;
    }


</style>
<div class="uucss-stats">
    <script>
        if (!window.uucss) {
            window.uucss = {}
        }

        window.uucss.nonce = '<?php echo wp_create_nonce( 'uucss_nonce' ); ?>';
    </script>
    <a class="rapidload" href="<?php echo admin_url( 'options-general.php?page=uucss' ) ?>">RapidLoad</a>
    <div class="uucss-stats__stats">
        <span class="uucss-stats__size">Size: <?php echo $this->uucss->size(); ?></span>
    </div>
    <div class="uucss-stats__actions">

		<?php if ( $post ) {
			$exists = RapidLoad_Settings::link_exists( get_permalink( $post ) );?>
            <div id="button-uucss-clear" <?php if ( ! $exists ) echo 'class="hidden"' ?> title="clear page cache">remove
            </div>
            <div id="button-uucss-purge" <?php if ( $exists ) echo 'class="hidden"' ?> title="generate page cache">optimize
            </div>
		<?php } ?>
        <div id="button-uucss-clear-all" title="remove all RapidLoad optimizations">remove all</div>
    </div>

</div>