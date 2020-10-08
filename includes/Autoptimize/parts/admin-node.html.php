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

    .uucss-stats span {
        line-height: 0 !important;
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
    <span>UnusedCSS</span>
    <div class="uucss-stats__stats">
        <span class="uucss-stats__size">Total Size : <?php echo $this->uucss->size(); ?></span>
    </div>
    <div class="uucss-stats__actions">

		<?php if ( $post ) {
			$exists = UnusedCSS_Settings::link_exists( get_permalink( $post ) ); ?>
            <div id="button-uucss-clear" <?php if ( ! $exists )
				echo 'class="hidden"' ?> title="clear page cache">clear
            </div>
            <div id="button-uucss-purge" <?php if ( $exists )
				echo 'class="hidden"' ?> title="generate page cache">generate
            </div>
		<?php } ?>
        <div id="button-uucss-clear-all" title="clear all unusedcss cache">clear all</div>
    </div>

</div>
<script>

    (function ($) {


        <?php if($post) : ?>

        $('#button-uucss-purge').click(function (e) {
            e.preventDefault();
            var $this = $(this);

            $this.text('loading...');

            var data = {
                url: '<?php echo get_permalink($post) ?>',
                args: {
                    post_id: <?php echo $post->ID ?>
                }
            }

            wp.ajax.post('uucss_purge_url', data).done(function (d) {
                $this.text('generate')
                $this.hide();
                $('#button-uucss-clear').css('display', 'inline-block')
            })
        });

        $('#button-uucss-clear').click(function (e) {
            e.preventDefault();

            var $this = $(this);

            $this.text('loading...');
            wp.ajax.post('uucss_purge_url', {
                clear: true,
                url: '<?php echo get_permalink($post) ?>',
                args: {
                    post_id: <?php echo $post->ID ?>
                }
            }).done(function (d) {
                $this.text('clear')
                $this.hide();
                $('#button-uucss-purge').css('display', 'inline-block')
            })

        });

        <?php endif ?>

        $('#button-uucss-clear-all').click(function (e) {
            e.preventDefault();

            var $this = $(this);

            $this.text('loading...');
            wp.ajax.post('uucss_purge_url', {
                clear: true,
                url: null,
            }).done(function (d) {
                $this.text('cleared all')
                $('#button-uucss-purge').css('display', 'inline-block')
                $('#button-uucss-clear').hide()
                $('.uucss-stats__size').text('Total Size : 0.00KB')

            })

        });

    })(jQuery)

</script>