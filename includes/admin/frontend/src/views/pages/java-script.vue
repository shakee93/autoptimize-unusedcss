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
          <div class="pr-1">
            <div class="items-center mr-4 mt-3">
              <label>
                <input id="purple-checkbox" v-model="js_optimization" type="checkbox" value=""
                       class="rounded-lg checkmark accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
              </label>
            </div>
          </div>
          <div>
            <h1 class="font-semibold text-base text-black-font">JS Optimization</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
          <div v-for="button in load_javascript">
            <h1 class="font-semibold text-base text-black-font">Load Javascript</h1>
            <p class="text-sm pb-3 text-gray-font">Load Scripts on User Interaction</p>
            <button v-on:click="button.load_js = 'user_interaction'"
                    :class="{ active: button.load_js === 'user_interaction' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
              On user interaction
            </button>

            <button v-on:click="button.load_js = 'defer'"
                    :class="{ active: button.load_js === 'defer' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
              Defer
            </button>
            <button v-on:click="button.load_js = 'none'"
                    :class="{ active: button.load_js === 'none' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
              None
            </button>

            <div :class="{ expand : button.load_js === 'none'}" class="not-expand">
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


            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="enable_javascript_optimization" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Enable Javascript Optimization</h1>
                  <p class="text-sm text-gray-font">This can help you group pages which has same html structure. Product
                    pages, Category pages etc...</p>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="defer_inline_javascript" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Defer inline Javascript</h1>
                  <p class="text-sm text-gray-font">Load Javascript after HTML is parsed</p>
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
  name: "java-script",

  components: {
    Vue3TagsInput,
  },

  methods:{

  },

  data() {
    return {
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      enable_javascript_optimization: false,
      defer_inline_javascript: false,
      js_optimization: false,
      back: '/',
      load_javascript: [
        {
          load_js: 'user_interaction',
        }
      ],


    }
  },


}
</script>

<style scoped>

</style>