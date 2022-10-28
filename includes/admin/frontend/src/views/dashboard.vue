<script setup>

</script>

<template>
  <main>

    <ul class="nav-items inline-grid grid grid-cols-3 gap-8">

      <li v-for="item in items" :key="item.link" class="w-72 h-56 drop-shadow-sm rounded-xl border border-slate-300 bg-slate-100 ">
<div>
        <div class="content p-4">
          <img v-if="item.image" :src="base + item.image" :alt="item.name">
          <h4 class="mt-2 text-gray-800 font-bold text-base">{{ item.name }}</h4>
          <p class="mb-1 text-sm text-gray-500 ">{{ item.description }}</p>
        </div>
        <hr class="border-slate-300 border-b-0">
        <div class="actions p-4 mt-1 grid grid-cols-2 gap-4">

          <div class="col-start-1 col-end-3 ...">
            <RouterLink class="rounded-lg hover:bg-slate-200 border border-slate-300 py-2 px-4 text-sm" :to="item.link">
            <button>Settings</button>
          </RouterLink>
          </div>
          <div class="col-end-7 col-span-2 ...">
            <label :for="'toggle'+item.name" class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" v-model="item.enable" value="" :id="'toggle'+item.name" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          </div>

        </div>
</div>
      </li>
    </ul>

  </main>
</template>

<script>

import config from "../config";

export default {
  data() {
    return {
      items : [
        {
          name: "Unused CSS",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : 'unused-css.svg',
          link: '/unused-css',
          enable: false
        },
        {
          name: "Critical CSS",
          description : 'Generate above the fold critical CSS for your pages',
          image : 'critical-css.svg',
          link: '/critical-css',
          enable: false
        },
        {
          name: "Image Delivery",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : 'image-delivery.svg',
          link: '/critical-css',
          enable: true
        },
        {
          name: "Speed Montoring",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : 'speed-montoring.svg',
          link: '/critical-css',
          enable: true
        },
        {
          name: "Asset Manager",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : 'asset-manager.svg',
          link: '/critical-css',
          enable: false
        },
        {
          name: "Font Optimization",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : 'font-optimization.svg',
          link: '/critical-css',
          enable: false
        },

      ],
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/'
    }
  }
}
</script>