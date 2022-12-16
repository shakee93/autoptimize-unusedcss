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
            <h1 class="font-semibold text-base text-black-font">CSS Delivery</h1>
            <p class="text-sm text-gray-font">Deliver CSS files by removing unused CSS and prioritizing critical CSS</p>
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
                      <input v-model="uucss_minify" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Minify</h1>
                  <p class="text-sm text-gray-font">Remove unnecessary spaces, lines from CSS files</p>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="critical_css.status" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Critical CSS</h1>
                  <p class="text-sm text-gray-font">Extract and prioritize above-the-fold CSS</p>
                </div>
              </div>

              <div :class="!critical_css.status? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
                <div class="flex mt-5">
                  <div class="pr-1">
                    <div class="flex items-center mr-4 mt-3">
                      <label>
                        <input v-model="critical_css.mobile_critical_css" type="checkbox" value=""
                               class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1 class="font-semibold text-base text-black-font">Mobile Critical CSS</h1>
                    <p class="text-sm text-gray-font">Extract Critical CSS for mobile screens</p>
                  </div>
                </div>

              <div class="mt-5">
                <h1 class="font-semibold text-base text-black-font">Above-the-fold CSS</h1>
                <p class="text-sm pb-3 text-gray-font">Include any CSS content you need to load above the fold.</p>
                <div class="grid mb-5">
                <textarea
                v-model="critical_css.additional_critical_css"
                class="resize-none z-50 appearance-none border border-purple rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                id="force-include" type="text" placeholder=""></textarea>
                  <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                    <p class="text-sm text-dark-gray-font">Paste any CSS content you would like to merge with Critical CSS</p>
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
                  <p class="text-sm text-gray-font">Remove unused CSS content by analyzing the HTML and CSS content in your website</p>
                </div>
              </div>


              <div :class="!remove_unused_css? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
                <div class="mt-5">
                  <RouterLink :to="unused_css_settings_link">
                    <button
                        class="bg-transparent mb-3 mt-2 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-purple hover:border-transparent rounded-lg">
                      Settings
                    </button>
                  </RouterLink>
                </div>
              </div>
            </div>

          <div :class="turn_on_group_by_pages? '': 'hidden'" class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="uucss_enable_rules" type="checkbox" value="" @change="saveRuleBased"
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Group by Pages</h1>
                <p class="text-sm text-gray-font">Define rules to group pages that have the same page structure. example groups : product pages, category pages or blog pages.</p>
              </div>
            </div>


            <div :class="!uucss_enable_rules? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
              <div class="mt-5">
                <a :href="uucss_url">
                <button @click="ruleSettings"
                    class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-purple hover:border-transparent mt-2 rounded-lg">
                  Settings
                </button>
              </a>
              </div>
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
                    <p class="font-semibold text-sm text-purple-back-font leading-5">Recommended for websites with 50 plus pages.
                      RapidLoad will analyze a parent page and will apply results for all matched pages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <button @click="saveSettings" :disabled="loading" class="disabled:opacity-50 flex mb-3 transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
            <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Save Settings
          </button>
        </div>
<!--        <button @click="turn_on_group_by_pages = !turn_on_group_by_pages">click me</button>-->
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
import messageBox from "../../../components/messageBox.vue";
import axios from "axios";

export default {
  name: "css",

  components: {
    Vue3TagsInput,
    dropDown,
    messageBox,
  },

  mounted() {

    const activeModules = [];
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });
    this.css_config = activeModules;

    if (this.css_config) {
      Object.keys(this.css_config).map((key) => {
        if (this.id === this.css_config[key].id) {
          const option = this.css_config[key].options;
          this.critical_css.status = option.critical_css.status === 'on';
          this.critical_css.mobile_critical_css = option.critical_css.options.uucss_enable_cpcss_mobile;
          this.critical_css.additional_critical_css = option.critical_css.options.uucss_additional_css;
          this.remove_unused_css = option.unused_css.status === 'on';
          this.uucss_enable_rules = option.uucss_enable_rules;
          this.uucss_minify = option.uucss_minify;
          this.turn_on_group_by_pages = option.turn_on_group_by_pages;
        }

      });
    }

    const href = new URL(window.location.href);
    href.searchParams.set('page', 'uucss');
    this.uucss_url = href.toString();



  },

  methods:{


    saveSettings(){
      this.loading = true;
     const data = {
       uucss_additional_css : this.critical_css.additional_critical_css,
       uucss_enable_cpcss_mobile : this.critical_css.mobile_critical_css,
       uucss_enable_cpcss : this.critical_css.status,
       uucss_enable_rules : this.uucss_enable_rules,
       uucss_minify : this.uucss_minify,
       uucss_enable_uucss : this.remove_unused_css,
     }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data,{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            window.uucss_global.active_modules = response.data.data;
            this.loading = false;
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "CSS Settings Updated!"
                },
                4000
            );
          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },

    saveRuleBased(){
      const data = {
        uucss_enable_rules : this.uucss_enable_rules,

      }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data,{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            window.uucss_global.active_modules = response.data.data;

          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },

    ruleSettings(){
     location.reload();
    }

  },

  data() {
    return {
      css_config: [],
      id: 'css',
      loading: false,
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      uucss_minify: false,
      remove_unused_css: false,
      uucss_enable_rules: false,
      unused_css_settings_link: '/remove-unused-css',
      turn_on_group_by_pages: false,
      uucss_url:'',
      critical_css:{
        status: false,
        mobile_critical_css: false,
        additional_critical_css: [],
      },
      back: '/',

    }
  },


}
</script>

<style scoped>

</style>