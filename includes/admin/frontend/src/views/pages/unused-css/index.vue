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
            <h1 class="font-semibold text-base text-black-font">CSS Optimization</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
          <div class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="uucss_load_original" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Load Original CSS</h1>
                <p class="text-sm text-gray-font">How to load the original CSS files?</p>
              </div>
            </div>
          </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="uucss_minify" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Minify</h1>
                  <p class="text-sm text-gray-font">Minify and Remove CSS comments via the API</p>
                </div>
              </div>
            </div>

            <div v-for="settings in critical_css" class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="settings.status" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Critical CSS</h1>
                  <p class="text-sm text-gray-font">More advanced options for pro users</p>
                </div>
              </div>

              <div :class="{ expand: settings.status }" class="pl-9 not-expand">
                <div class="flex mt-5">
                  <div class="pr-1">
                    <div class="flex items-center mr-4 mt-3">
                      <label>
                        <input v-model="settings.mobile_critical_css" type="checkbox" value=""
                               class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1 class="font-semibold text-base text-black-font">Mobile Critical CSS</h1>
                    <p class="text-sm text-gray-font">Generate separate mobile version of Critical CSS</p>
                  </div>
                </div>

              <div class="mt-5">
                <h1 class="font-semibold text-base text-black-font">Aditional CSS</h1>
                <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
                <div class="grid mb-5">
                <textarea
                v-model="settings.additional_critical_css"
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

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="remove_unused_css" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Remove Unused CSS</h1>
                  <p class="text-sm text-gray-font">This can help you group pages which has same html structure. Product
                    pages, Category pages etc...</p>
                </div>
              </div>


              <div :class="{ expand: remove_unused_css }" class="pl-9 not-expand">
                <RouterLink :to="unused_css_settings_link">
                <button
                    class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
                  Settings
                </button>
                </RouterLink>
                <div class="mb-5 bg-purple-lite border border-purple rounded-lg px-4 py-3 shadow-md" role="alert">
                  <div class="flex">
                    <div class="py-1 mt-1">
                      <svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20">
                        <path
                            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-sm text-purple-back-font leading-5">Recommended for websites with 50
                        plus pages.
                        RapidLoad will analyze a parent<br>
                        page and will apply results for all matched pages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="uucss_enable_rules" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Rule Based Injection</h1>
                <p class="text-sm text-gray-font">Enable rule based injection.</p>
              </div>
            </div>


            <div :class="{ expand: uucss_enable_rules }" class="pl-9 not-expand">
              <RouterLink :to="unused_css_settings_link">
                <button
                    class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
                  Settings
                </button>
              </RouterLink>
              <div class="mb-5 bg-purple-lite border border-purple rounded-lg px-4 py-3 shadow-md" role="alert">
                <div class="flex">
                  <div class="py-1 mt-1">
                    <svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20">
                      <path
                          d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-sm text-purple-back-font leading-5">Recommended for websites with 50
                      plus pages.
                      RapidLoad will analyze a parent<br>
                      page and will apply results for all matched pages.</p>
                  </div>
                </div>
              </div>
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
import config from "../../../config";
import Vue3TagsInput from 'vue3-tags-input';
import dropDown from '../../../components/dropDown.vue'
import axios from "axios";

export default {
  name: "css",

  components: {
    Vue3TagsInput,
    dropDown,
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
    this.css_config = activeModules;

    if (this.css_config) {
      Object.keys(this.css_config).map((key) => {
        if (this.id === this.css_config[key].id) {
          const option = this.css_config[key].options;
          this.critical_css.status = option.critical_css.status === 'on';
          this.critical_css.mobile_critical_css = option.critical_css.options.uucss_enable_cpcss_mobile;
          this.critical_css.additional_critical_css = option.critical_css.options.uucss_additional_css;
          this.remove_css = option.unused_css.status === 'on';
          this.uucss_enable_rules = option.uucss_enable_rules;
          this.uucss_load_original = option.uucss_load_original;
          this.uucss_minify = option.uucss_minify;
          console.log(option)
        }

      });
    }
  },

  methods:{

    saveSettings(){
     const data = {
       uucss_additional_css : this.critical_css.additional_critical_css,
       uucss_enable_cpcss_mobile : this.critical_css.mobile_critical_css,
       uucss_enable_cpcss : this.critical_css.status,
       uucss_enable_rules : this.uucss_enable_rules,
       uucss_load_original : this.uucss_load_original,
       uucss_minify : this.uucss_minify,
       uucss_enable_uucss : this.remove_css,
     }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data)
          .then(response => console.log(response.data))
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    }
  },

  data() {
    return {
      css_config: [],
      id: 'css',
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      uucss_minify: false,
      remove_unused_css: false,
      uucss_enable_rules: false,
      unused_css_settings_link: '/remove-unused-css',
      critical_css:[{
        status: false,
        mobile_critical_css: false,
        additional_critical_css: [],
      }],
      remove_css: false,
      back: '/',
      uucss_load_original: false,

    }
  },


}
</script>

<style scoped>

</style>