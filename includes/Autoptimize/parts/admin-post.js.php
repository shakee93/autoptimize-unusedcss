(function ($) {

    var el = $('<button type="button"></button>')
        .addClass('button button-small hide-if-no-js').css('margin-left', '5px').text('Purge CSS');

    el.click(function (e) {
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

    var el_clear = el.clone().text('Clear Cache').off()
        .click(function (e) {

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
                $this.text('Cleared');
                console.log(d);
            })

        });

    var slugButtons = $('#edit-slug-buttons');
    var appendTo = (slugButtons.length) ? slugButtons : $('#sample-permalink');
    appendTo.after(el_clear)
        .after(el);

}(jQuery))
