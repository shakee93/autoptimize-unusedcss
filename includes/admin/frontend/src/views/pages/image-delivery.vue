<template>
  <main>
    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>
            <h1 class="font-semibold text-base text-black-font">Image Delivery</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
            <h1 class="font-semibold text-base text-black-font">Compression Level</h1>
            <p class="text-sm pb-3 text-gray-font">How to load the original CSS files?</p>
            <button v-on:click="compression_level = 'lossy'"
                    :class="{ active: compression_level === 'lossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
              LOSSY
            </button>

            <button v-on:click="compression_level = 'glossy'"
                    :class="{ active: compression_level === 'glossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
              GLOSSY
            </button>
            <button v-on:click="compression_level = 'lossless'"
                    :class="{ active: compression_level === 'lossless' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
              LOSSLESS
            </button>

            <div :class="{ expand : compression_level === 'lossless'}" class="not-expand">
              <div class="mt-5 bg-purple-lite border border-purple rounded-2xl px-4 py-3 shadow-md" role="alert">
                <div class="flex">
                  <div class="py-1 mt-1">
                    <svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20">
                      <path
                          d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-sm text-purple-back-font leading-5">Removing the original files from
                      loading may not be compatible with all the websites. <br> If you are having site-breaks try on user
                      interaction or asynchronously.</p>
                  </div>
                </div>
              </div>
            </div>

          <div class="grid">
            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="minify_js" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Next-gen Images Support</h1>
                  <p class="text-sm text-gray-font">Serve the images in next-gen image formats to all the browsers that support them.</p>
                </div>
              </div>
            </div>
          </div>


          <button
              class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
            Save Settings
          </button>
        </div>
      </div>
      <div class="pb-6">
      </div>
    </div>

  </main>

</template>

<script>
import config from "../../config";
import Vue3TagsInput from 'vue3-tags-input';

export default {
  name: "image-delivery",

  components: {
    Vue3TagsInput,
  },

  methods:{

  },

  data() {
    return {
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',

      compression_level: 'lossy',


      tag: '',
      tags: ['Elementor'],
      refresh_element: false,
      page_animation: true,
      pages_with_rules1: false,
      advance_settings1: false,
      pages_with_rules2: false,
      advance_settings2: false,
      remove_css: false,
      back: '/',
      buttons: [
        {
          load_original_css: 'user_interaction',
        }
      ],


    }
  },


}
</script>

<style scoped>

</style>