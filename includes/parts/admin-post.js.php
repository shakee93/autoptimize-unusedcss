(function ($) {

    $(document).ready(function () {
        tagBox.init();
    });


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

        if($("[name='uucss_exclude']").prop('checked') == true) {
            data.uucss_exclude = "on";
        }

        if ($("[name='uucss_whitelist_classes']").val().length > 0) {
            data.uucss_whitelist_classes = $("[name='uucss_whitelist_classes']").val();
        }

        wp.ajax.post('uucss_purge_url', data).done(function (d) {
            $this.text('Job Queued');
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
            $this.text('Cache Cleared');
            console.log(d);
        })

    });

}(jQuery))
