<template>
  <main>
    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mb-6 pr-8 border-t-0">
        <div class="flex-initial w-28 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>
            <h1 class="font-medium text-base text-black-font">Javascript Delivery</h1>
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
                    <div @click="minify_js = !minify_js" :class="minify_js? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="minify_js" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Minify</h1>
                  <p class="text-sm text-gray-font">Remove unnecessary spaces, lines from JS files</p>
                </div>
              </div>
            </div>
          </div>


          <div class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="uucss_load_js_method.status = !uucss_load_js_method.status" :class="uucss_load_js_method.status? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                    <svg v-if="uucss_load_js_method.status" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 class="font-normal text-base text-black-font">Defer JavaScript</h1>
                <p class="text-sm text-gray-font">More advanced options for pro users</p>
              </div>
            </div>

            <div :class="!uucss_load_js_method.status? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
              <div class="flex mt-5">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_load_js_method.defer_inline_js = !uucss_load_js_method.defer_inline_js" :class="uucss_load_js_method.defer_inline_js? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_load_js_method.defer_inline_js" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Defer inline Javascript</h1>
                  <p class="text-sm text-gray-font">Defer inline Javascript</p>
                </div>
              </div>

              <div class="mt-5">
                <h1 class="font-normal text-base text-black-font">Exclude Javascript from Deferring</h1>
                <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from
                  optimization.</p>

                <div class="grid mb-5">
                <textarea
                    v-model="uucss_load_js_method.uucss_excluded_js_files_from_defer"
                    @focus="focus='exclude'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
                  <div :class="focus==='exclude'? 'bg-purple-lite':'bg-gray-lite-background'"
                       class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                    <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                      ‘elementor-*, *-gallery’ etc...</p>
                  </div>
                </div>


              </div>
            </div>
          </div>


          <div class="grid mb-5">
            <div class="flex mb-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="delay_javascript = !delay_javascript" :class="delay_javascript? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                    <svg v-if="delay_javascript" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 class="font-normal text-base text-black-font">Delay Javascripts to Load on User Interaction</h1>
                <p class="text-sm pb-3 text-gray-font">Feed set of domains to delay load</p>
              </div>
            </div>
            <div :class="!delay_javascript? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
              <div>
                <div class="grid">
                <textarea
                    v-model="uucss_load_scripts_on_user_interaction"
                    @focus="focus='delay'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
                  <div :class="focus==='delay'? 'bg-purple-lite':'bg-gray-lite-background'"
                       class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                    <p class="text-sm text-dark-gray-font">Load Scripts On User Interaction from RapidLoad enter each file in new line</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Exclude Javascript</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
                <textarea
                    v-model="uucss_excluded_js_files"
                    @focus="focus='exclude-js'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
              <div :class="focus==='exclude-js'? 'bg-purple-lite':'bg-gray-lite-background'"
                   class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">Exclude JS from RapidLoad enter each file in new line</p>
              </div>
          </div>
          <button @click="saveSettings" :disabled="loading" :class="saved? 'pointer-events-none': ''"
                  class="disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
            <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg :class="saved ? 'block' : 'hidden'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                 class="transform scale-125 w-5 h-3.5 mt-1 mr-3 -ml-1">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
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
          this.delay_javascript = options.delay_javascript
          this.uucss_excluded_js_files = options.uucss_excluded_js_files
          this.uucss_load_js_method.status = options.uucss_load_js_method === 'defer'
          this.uucss_load_scripts_on_user_interaction = options.uucss_load_scripts_on_user_interaction
          this.uucss_load_js_method.uucss_excluded_js_files_from_defer = options.uucss_excluded_js_files_from_defer
        }

      });
    }
  },
  methods: {
    dataSaved(){
      this.saved = true;
      setTimeout(() => this.saved = false, 2000)
    },

    async saveSettings() {
      this.loading = true;
      const data = {
        defer_inline_js: this.uucss_load_js_method.defer_inline_js,
        minify_js: this.minify_js,
        delay_javascript: this.delay_javascript,
        uucss_excluded_js_files: this.uucss_excluded_js_files,
        uucss_load_js_method: this.uucss_load_js_method.status ? 'defer' : 'none',
        uucss_load_scripts_on_user_interaction: this.uucss_load_scripts_on_user_interaction,
        uucss_excluded_js_files_from_defer: this.uucss_load_js_method.uucss_excluded_js_files_from_defer,
      }

      await axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            window.uucss_global.active_modules = response.data.data

          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          }).finally(()=>{
            this.loading = false;
            this.dataSaved();
          });
    }
  },

  data() {
    return {
      javascript: [],
      id: 'javascript',
      saved: false,
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      focus: null,
      js_optimization: false,
      minify_js: false,
      delay_javascript: false,
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