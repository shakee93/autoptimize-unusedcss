<template>
  <main>
    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>
            <h1 class="font-semibold text-base text-black-font">Javascript Optimization</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>



      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="grid">
            <div class="mb-5">
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
                  <h1 class="font-semibold text-base text-black-font">Minify Javsacript	</h1>
                  <p class="text-sm text-gray-font">Load Javascript after HTML is parsed</p>
                </div>
              </div>
            </div>
          </div>



            <h1 class="font-semibold text-base text-black-font">Load Javascript</h1>
            <p class="text-sm pb-3 text-gray-font">Load Scripts on User Interaction</p>
            <button v-on:click="uucss_load_js_method =  'none'"
                    :class="{ active: uucss_load_js_method === 'none' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
              None
            </button>

            <button v-on:click="uucss_load_js_method = 'defer'"
                    :class="{ active: uucss_load_js_method === 'defer' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
              Defer
            </button>
            <button v-on:click="uucss_load_js_method = 'on-user-interaction'"
                    :class="{ active: uucss_load_js_method === 'on-user-interaction' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
              On user interaction
            </button>


            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="defer_inline_js" type="checkbox" value=""
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


              <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Exclude JS</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
              <textarea v-model="uucss_excluded_js_files"
                  class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="force-include" type="text" placeholder=""></textarea>
              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">
                  Exclude JS from RapidLoad enter each file in new line</p>
              </div>
            </div>
          <button @click="saveSettings"
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
import messageBox from "../../components/messageBox.vue";
import axios from "axios";

export default {
  name: "java-script",

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {
    const activeModules = [];
    Object.keys(window.uucss_global).map((key) => {
      if (key === 'active_modules') {
        const entry = window.uucss_global[key];
        Object.keys(entry).forEach((a) => {
          activeModules.push(entry[a])
        });
      }
    });
    this.javascript = activeModules
    if (this.javascript) {
      Object.keys(this.javascript).map((key) => {
          if (this.id === this.javascript[key].id) {
            const options = this.javascript[key].options;
            this.defer_inline_js = options.defer_inline_js
            this.minify_js = options.minify_js
            this.uucss_excluded_js_files = options.uucss_excluded_js_files
            this.uucss_load_js_method = options.uucss_load_js_method
          }

      });
    }
  },
  methods:{
       async saveSettings(){
         const data = {
           defer_inline_js : this.defer_inline_js,
           minify_js : this.minify_js,
           uucss_excluded_js_files : this.uucss_excluded_js_files,
           uucss_load_js_method : this.uucss_load_js_method,
         }

         await axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data, {
            headers: {
             'Content-Type':'multipart/form-data'
            }
         })
              .then(response => {
                response.data
                this.$notify(
                    {
                      group: "success",
                      title: "Success",
                      text: "Javascript Settings Updated!"
                    },
                    4000
                );
              })
              .catch(error => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
              });
        }
  },

  data() {
    return {
      javascript: [],
      id: 'javascript',
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      defer_inline_js: false,
      js_optimization: false,
      minify_js: false,
      back: '/',
      uucss_load_js_method: 'none',
      uucss_excluded_js_files: [],

    }
  },


}
</script>

<style scoped>

</style>