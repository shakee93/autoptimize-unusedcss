(function ($) {

    $('#button-uucss-purge').click(function (e) {
        e.preventDefault();
        var $this = $(this);

        $this.text('loading...');
        wp.ajax.post('uucss_purge_url', {
            url: '<?php echo get_permalink($post) ?>',
            args: {
                post_id: <?php echo $post->ID ?>
            }
        }).done(function (d) {
            $this.text('Job Queued');
            console.log(d);
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
