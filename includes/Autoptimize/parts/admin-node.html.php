<style>

    li#wp-admin-bar-autoptimize-uucss {
        display: inline-block !important;
        padding: 12px 0 5px !important;
        background: #01579B !important;
    }

    .uucss-stats span {
        line-height: 0 !important;
    }

    li#wp-admin-bar-autoptimize-uucss a{
        height: auto;
    }

    li#wp-admin-bar-autoptimize-uucss a:hover{
        color : whitesmoke !important;
    }

    .uucss-stats {
        line-height: 0 !important;
    }

    span.uucss-stats__size {
        font-size: .7em !important;
    }

</style>
<div class="uucss-stats">
    <span>UnusedCSS</span>
    <div class="uucss-stats__actions">
        <span class="uucss-stats__size">Size : <?php echo $this->ao_uucss->size(); ?></span>
    </div>

</div>