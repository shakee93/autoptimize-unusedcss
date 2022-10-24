<script setup>

</script>

<template>
  <main>

    <ul class="nav-items mt-8 flex flex-direction-column gap-8">

      <li v-for="item in items" :key="item.link" class="w-72 h-56 rounded-xl border border-slate-200 bg-gradient-to-l from-slate-50 ">

        <div class="content p-4">
          <img v-if="item.image" src="@/assets/unused-css.svg" :alt="item.name">
          <h4 class="mt-2 text-gray-800 font-bold">{{ item.name }}</h4>
          <p class="mb-1 text-sm text-gray-500 ">{{ item.description }}</p>
        </div>

        <hr>

        <div class="actions p-4">
          <RouterLink class="rounded border border-slate-300" :to="item.link">
            <button>Settings</button>
          </RouterLink>
        </div>
      </li>
    </ul>

  </main>
</template>

<script>

export default {
  data() {
    return {
      items : [
        {
          name: "Unused CSS",
          description : 'Reduce your CSS file size by remove unused CSS from your pages',
          image : '@/assets/unused-css.svg',

          link: '/unused-css'
        },
        {
          name: "Critical CSS",
          link: '/critical-css'
        },

      ]
    }
  }
}
</script>