<?php defined( 'ABSPATH' ) or die(); ?>

(function ($) {

    $(document).ready(function () {
        tagBox.init();
    });

    /**
     * Safelist input in options
     *
     * @type {any}
     */

    window.safelist = JSON.parse($('#uucss_safelist').val() || '[]');
    drawSafeList();

    $('#uucss-options .safelist-add button').on('click', function (e) {
        e.preventDefault();
        addRule();
    });

    $('#uucss-options .safelist-add #safelist-add').on('keydown', function (e) {
        if (e.key && e.key === 'Enter') {
            e.preventDefault();
            addRule();
        }
    });

    function addRule() {

        var type = $('#safelist-type');
        var item = $('#safelist-add');

        var pattern = {
            type: type.val(),
            rule: item.val().trim()
        }

        if (!pattern.rule) {
            return;
        }

        var exists = window.safelist.findIndex(function (p) {
            return p.rule === pattern.rule && p.type === pattern.type
        });

        if (exists >= 0) {
            return;
        }

        safelist.push(pattern);

        item.val('')
        type.val('greedy')

        drawSafeList();

    }

    function updateInput() {
        $('#uucss_safelist').val(JSON.stringify(window.safelist))
    }


    function drawSafeList() {

        $('.safelist-list ul').empty();

        window.safelist.forEach(function (item) {

            var li = $(`<li><span data-rule="` + item.rule + `" data-type="` + item.type + `" class="dashicons dashicons-remove"></span> <span class="safelist-list-type"> ` + item.type + `</span> <span>` + item.rule + `</span></li>`)

            li.find('.dashicons-remove').click(function () {
                var _item = $(this).data()

                window.safelist = window.safelist.filter(function (i) {
                    return !(i.rule === _item.rule && i.type === _item.type)
                });

                drawSafeList();
            });

            $('.safelist-list ul').append(li)

        });

        updateInput();
    }


}(jQuery))
