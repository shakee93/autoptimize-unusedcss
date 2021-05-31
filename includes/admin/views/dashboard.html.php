<?php

?>

<div id="rapidload-dashboard">
    <h2>RapidLoad</h2>

    <p>
        Unused CSS
    </p>
    <label class="switch" for="module-unused-css">
        <input type="checkbox" class="rapidload-modules"
               id="module-unused-css"
               name="module-unused-css" value="unused-css"
        <?php if(isset($rapidload_modules['unused-css']) && $rapidload_modules['unused-css'] == 'on') echo 'checked' ?>>
        <span class="slider round"></span>
    </label>

    <!--<label class="switch">
        <input type="checkbox" checked>
        <span class="slider round"></span>
    </label>-->

</div>
