<template>
  <main>
    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-28 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>
            <h1 class="font-semibold text-base text-black-font">Javascript Delivery</h1>
            <p class="text-sm text-gray-font">Minify and deliver Javascript files with best practices</p>
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
                  <h1 class="font-semibold text-base text-black-font">Minify</h1>
                  <p class="text-sm text-gray-font">Remove unnecessary spaces, lines from JS files</p>
                </div>
              </div>
            </div>
          </div>


          <div class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="uucss_load_js_method.status" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Defer JavaScript</h1>
                <p class="text-sm text-gray-font">More advanced options for pro users</p>
              </div>
            </div>

            <div :class="!uucss_load_js_method.status? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
              <div class="flex mt-5">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="uucss_load_js_method.defer_inline_js" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Defer inline Javascript</h1>
                  <p class="text-sm text-gray-font">Defer inline Javascript</p>
                </div>
              </div>

              <div class="mt-5">
                <h1 class="font-semibold text-base text-black-font">Exclude Javascript from Deferring</h1>
                <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
                <div class="grid mb-5">
                <textarea
                    v-model="uucss_load_js_method.uucss_excluded_js_files_from_defer"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="force-include" type="text" placeholder=""></textarea>
                  <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                    <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                      ‘elementor-*, *-gallery’ etc...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>




          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Delay Javascripts to Load on User Interaction</h1>
            <p class="text-sm pb-3 text-gray-font">Feed set of domains to delay load</p>
            <textarea v-model="uucss_load_scripts_on_user_interaction"
                      class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="force-include" type="text" placeholder=""></textarea>
            <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
              <p class="text-sm text-dark-gray-font">
                Load Scripts On User Interaction from RapidLoad enter each file in new line</p>
            </div>
          </div>
          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Exclude Javascript</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <textarea v-model="uucss_excluded_js_files"
                      class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="force-include" type="text" placeholder=""></textarea>
            <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
              <p class="text-sm text-dark-gray-font">
                Exclude JS from RapidLoad enter each file in new line</p>
            </div>
          </div>
          <button @click="saveSettings" :disabled="loading" class="disabled:opacity-50 flex mb-3 transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
            <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });

    this.javascript = activeModules
    if (this.javascript) {
      Object.keys(this.javascript).map((key) => {
          if (this.id === this.javascript[key].id) {
            const options = this.javascript[key].options;
            this.uucss_load_js_method.defer_inline_js = options.defer_inline_js
            this.minify_js = options.minify_js
            this.uucss_excluded_js_files = options.uucss_excluded_js_files
            this.uucss_load_js_method.status = options.uucss_load_js_method === 'on-user-interaction'
            this.uucss_load_scripts_on_user_interaction = options.uucss_load_scripts_on_user_interaction
            this.uucss_load_js_method.uucss_excluded_js_files_from_defer = options.uucss_excluded_js_files_from_defer
          }

      });
    }
  },
  methods:{
       async saveSettings(){
         this.loading = true;
         const data = {
           defer_inline_js : this.uucss_load_js_method.defer_inline_js,
           minify_js : this.minify_js,
           uucss_excluded_js_files : this.uucss_excluded_js_files,
           uucss_load_js_method : this.uucss_load_js_method.status? 'on-user-interaction': 'none',
           uucss_load_scripts_on_user_interaction: this.uucss_load_scripts_on_user_interaction,
           uucss_excluded_js_files_from_defer: this.uucss_load_js_method.uucss_excluded_js_files_from_defer,
         }

         await axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data, {
            headers: {
             'Content-Type':'multipart/form-data'
            }
         })
              .then(response => {
                response.data;
                window.uucss_global.active_modules = response.data.data
                this.loading = false;
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
      js_optimization: false,
      minify_js: false,
      back: '/',
      loading: false,
      uucss_load_js_method: {
        status: false,
        defer_inline_js: false,
        uucss_excluded_js_files_from_defer: [],
      },
      uucss_excluded_js_files: [],
      uucss_load_scripts_on_user_interaction: [],

    }
  },


}
</script>

<style scoped>

</style>