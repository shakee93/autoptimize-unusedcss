<template>
  <main>

    <div class="rl-container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <div class="flex border-y border-gray-border-line p-4 mb-6 pr-8 border-t-0">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5833 14H7M7 14L14 7M7 14L14 21" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div class="pr-1">
            <div class="items-center mr-4 mt-3">
              <label>
                <input id="purple-checkbox" v-model="remove_css" type="checkbox" value=""
                       class="rounded-lg checkmark accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
              </label>
            </div>
          </div>
          <div>
            <h1 class="font-semibold text-base text-black-font">Remove Unused CSS</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import config from "../../config";

export default {
  name: "page-optimizer",

  data(){
    return{
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/',
      remove_css: false,
      back: '/',
    }
  }
}
</script>

<style scoped>

</style>