<?php

?>

<div id="rapidload-dashboard">
    <h2>RapidLoad</h2>

    <?php foreach ($rapidload_modules as $module) : ?>

        <p>
            <?php echo $module['title'] ?>
        </p>

        <label class="switch" for="module-<?php echo $module['id'] ?>">
            <input type="checkbox" class="rapidload-modules"
                   id="module-<?php echo $module['id'] ?>"
                   name="module-<?php echo $module['id'] ?>" value="<?php echo $module['id'] ?>"
                <?php if(isset($module['status']) && $module['status'] == 'on') echo 'checked' ?>>
            <span class="slider round"></span>
        </label>

    <?php endforeach; ?>


</div>
