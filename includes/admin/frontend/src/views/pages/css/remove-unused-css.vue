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
            <h1 class="font-semibold text-base text-black-font">Settings</h1>
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
                    <div @click="uucss_variables = !uucss_variables"  :class="uucss_variables? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_variables" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">CSS Variables</h1>
                  <p class="text-sm text-gray-font">Remove unused CSS variables</p>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_keyframes = !uucss_keyframes"  :class="uucss_keyframes? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_keyframes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font"> CSS Animation keyframes</h1>
                  <p class="text-sm text-gray-font">Remove unused keyframe animations</p>
                </div>
              </div>
            </div>


            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_fontface = !uucss_fontface"  :class="uucss_fontface? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_fontface" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">CSS @font-face rules</h1>
                  <p class="text-sm text-gray-font">Remove unused @font-face rules</p>
                </div>
              </div>
            </div>
            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_include_inline_css = !uucss_include_inline_css"  :class="uucss_include_inline_css? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_include_inline_css" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Inline CSS</h1>
                  <p class="text-sm text-gray-font">Optimize Inline CSS</p>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_cache_busting_v2 = !uucss_cache_busting_v2"  :class="uucss_cache_busting_v2? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_cache_busting_v2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Cash Busting</h1>
                  <p class="text-sm text-gray-font">Enable RapidLoad crawler to view pages with a random query string</p>
                </div>
              </div>
            </div>

            <div class="mt-5">
            <h1 class="font-semibold text-base text-black-font ">Force Include selectors</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully included into optimization.</p>

            <div class="grid mb-5">
              <textarea
                  v-model="uucss_safelist"
                  class="resize-none z-50 appearance-none border border-purple rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                  id="force-include" type="text" placeholder=""></textarea>

              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                  ‘elementor-*, *-gallery’ etc...</p>
              </div>
            </div>
            </div>

          <div class="mt-5">
            <h1 class="font-semibold text-base text-black-font ">Force Exclude selectors</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully included into optimization.</p>

            <div class="grid mb-5">
               <textarea
                   v-model="uucss_blocklist"
                   class="resize-none z-50 appearance-none border border-purple rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                   id="force-include" type="text" placeholder=""></textarea>

              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                  ‘elementor-*, *-gallery’ etc...</p>
              </div>
            </div>
          </div>

            <div class="mt-5">
              <h1 class="font-semibold text-base text-black-font ">Exclude CSS Files</h1>
              <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully included into optimization.</p>

              <div class="grid mb-5">
                <textarea
                    v-model="uucss_excluded_files"
                    class="resize-none z-50 appearance-none border border-purple rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>

                <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                  <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                    ‘elementor-*, *-gallery’ etc...</p>
                </div>
              </div>
            </div>


            <h1 class="font-semibold text-base text-black-font">Selector Packs (Safelist Packs)</h1>
            <p class="text-sm pb-3 text-gray-font">Selector packs contains predefined force exclude and include rules
              for
              plugins and themes.</p>
            <div class="grid mb-5">
              <div class="flex text-sm">
                <vue3-tags-input :tags="whitelist_packs"
                                 @on-tags-changed="handleChangeTag"
                                 @keydown.enter.prevent
                                 class="flex resize-none z-50 appearance-none border border-purple rounded-lg w-full p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                 placeholder="Type your plugin..."/>
<!--                          <textarea v-model="whitelist" class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="force-include" type="text" placeholder="Type your plugin..."></textarea>-->


                <div class="mt-3 z-50 -ml-9 cursor-pointer">
                  <svg :class="{'animate-spin': refresh_element}" @click="loadWhitelistPacks"
                       class="fill-none transition ease-in-out" width="20px" height="20px"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 13 13">
                    <g class="" clip-path="url(#clip0_49_525)">
                      <path
                          d="M11.466 4.33334C10.6301 2.42028 8.72122 1.08334 6.5 1.08334C3.6913 1.08334 1.38187 3.22113 1.11011 5.95834"
                          stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.20825 4.33333H11.5916C11.7711 4.33333 11.9166 4.18783 11.9166 4.00833V1.625"
                            stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path
                          d="M1.56079 8.66666C2.39665 10.5797 4.30557 11.9167 6.52676 11.9167C9.33546 11.9167 11.6449 9.77886 11.9167 7.04166"
                          stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.81844 8.66666H1.43511C1.25562 8.66666 1.11011 8.81215 1.11011 8.99166V11.375"
                            stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>

                  </svg>
                </div>
              </div>


              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">Search by plugin or theme name. You can add multiple packs.</p>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_inline_css = !uucss_inline_css"  :class="uucss_inline_css? 'bg-purple':''" class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_inline_css" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Inline Small CSS Files</h1>
                  <p class="text-sm text-gray-font">Inline CSS files which are smaller than 5kb after unused CSS is removed.</p>
                </div>
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
import config from "../../../config";
import Vue3TagsInput from 'vue3-tags-input';
import dropDown from '../../../components/dropDown.vue';
import messageBox from "../../../components/messageBox.vue";
import axios from "axios";

export default {
  name: "remove-unused-css",

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
    this.remove_css_config = activeModules;

    if (this.remove_css_config) {
      Object.keys(this.remove_css_config).map((key) => {
        if (this.id === this.remove_css_config[key].id) {
          const option = this.remove_css_config[key].options;
          const safelist = option.unused_css.options.uucss_safelist;
          if(safelist){
            this.safelist = JSON.parse(safelist).map((i)=>{ return i.rule }).join("\r\n");
          }
          const blocklist = option.unused_css.options.uucss_blocklist;
          if(blocklist){
            this.blocklist = JSON.parse(blocklist).map((i)=>{ return i }).join("\r\n");
          }
          this.uucss_variables = option.unused_css.options.uucss_variables;
          this.uucss_keyframes = option.unused_css.options.uucss_keyframes;
          this.uucss_fontface = option.unused_css.options.uucss_fontface;
          this.uucss_include_inline_css = option.unused_css.options.uucss_include_inline_css;
          this.uucss_cache_busting_v2 = option.unused_css.options.uucss_cache_busting_v2;
          this.uucss_excluded_files = option.unused_css.options.uucss_excluded_files.split(",").join("\r\n");
          this.uucss_safelist= this.safelist;
          this.uucss_blocklist= this.blocklist;
          this.whitelist_packs= option.unused_css.options.whitelist_packs;
          this.uucss_inline_css = option.unused_css.options.uucss_inline_css;

        }

      });
    }
  },

  methods: {
    loadWhitelistPacks(){
      this.refresh_element = true;
      axios.post(window.uucss_global.ajax_url + '?action=suggest_whitelist_packs')
          .then(response =>{

            this.whitelist_packs = response.data.data.map((value)=>{
               return value.id + ':' + value.name;
            })
            this.refresh_element = false;

          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },
    handleChangeTag(tags) {
      this.whitelist = tags;
    },

    saveSettings(){
      this.loading = true;
      const data = {
        uucss_enable_uucss : true,
        uucss_cache_busting_v2 : this.uucss_cache_busting_v2,
        uucss_excluded_files : this.uucss_excluded_files,
        uucss_fontface : this.uucss_fontface,
        uucss_include_inline_css: this.uucss_include_inline_css,
        uucss_keyframes : this.uucss_keyframes,
        uucss_variables : this.uucss_variables,
        uucss_safelist: this.uucss_safelist,
        uucss_blocklist: this.uucss_blocklist,
        whitelist_packs: this.whitelist,
        uucss_inline_css : this.uucss_inline_css,
      }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data,{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data
            window.uucss_global.active_modules = response.data.data;
            this.loading = false;
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "Remove Unused CSS Settings Updated!"
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
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      loading: false,
      remove_css_config: [],
      id: 'css',
      uucss_variables: false,
      uucss_keyframes: false,
      uucss_fontface: false,
      uucss_include_inline_css : false,
      uucss_inline_css: false,
      uucss_cache_busting_v2: false,
      inline_small_css: false,
      uucss_excluded_files : '',
      uucss_safelist: '',
      uucss_blocklist: '',
      whitelist: [],
      whitelist_packs: [],
      refresh_element: false,
      back: '/css',

    }
  },


}
</script>

<style scoped>

</style>