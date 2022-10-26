<script setup>

</script>

<template>
  <main>

    <ul class="nav-items  flex flex-direction-column gap-8">

      <li v-for="item in items" :key="item.link" class="w-72 h-56 drop-shadow-sm rounded-xl border border-slate-300 bg-slate-100 ">

        <div class="content p-4">
          <img v-if="item.image" :src="base + item.image" :alt="item.name">
          <h4 class="mt-2 text-gray-800 font-bold text-base">{{ item.name }}</h4>
          <p class="mb-1 text-sm text-gray-500 ">{{ item.description }}</p>
        </div>
        <hr class="border-slate-300 border-b-0">
        <div class="actions p-4 mt-1">
          <RouterLink class="rounded-lg hover:bg-slate-200 border border-slate-300 py-2 px-4 text-sm" :to="item.link">
            <button>Settings</button>
          </RouterLink>
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
          link: '/unused-css'
        },
        {
          name: "Critical CSS",
          description : 'Generate above the fold critical CSS for your pages',
          image : 'critical-css.svg',
          link: '/critical-css'
        },
      ],
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/'
    }
  }
}
</script>