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
            <h1 class="font-medium text-base text-black-font">Font Delivery</h1>
            <p class="text-sm text-gray-font">Locally host and optimize your fonts for faster page load times</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="self_host_google_font = !self_host_google_font" :class="self_host_google_font? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="self_host_google_font" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Self Host Google Fonts</h1>
                  <p class="text-sm text-gray-font">Self host all your Google fonts load the fonts faster. Turn on CDN to serve these fonts faster through RapidLoad CDN</p>
                </div>
              </div>
            </div>

          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Preload Fonts</h1>
            <p class="text-sm pb-3 text-gray-font">Preload critical font files to avoid FOUT and signal browsers to download fonts earlier.</p>

            <div class="grid mb-5">
                <textarea
                    v-model="preload_font_urls"
                    @focus="focus='preload'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
              <div :class="focus==='preload'? 'bg-purple-lite':'bg-gray-lite-background'"
                   class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">Add one font URL per line. Make sure you have the full font URL.</p>
              </div>
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
import axios from "axios";
import messageBox from "../../components/messageBox.vue";

export default {
  name: "font-optimization",

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {

    const activeModules = [];
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });
    this.font_config = activeModules;

    if (this.font_config) {
      Object.keys(this.font_config).map((key) => {
        if (this.id === this.font_config[key].id) {
          const option = this.font_config[key].options;
          this.preload_font_urls = option.uucss_preload_font_urls? option.uucss_preload_font_urls.replace(/,/g, '\n'): "";
          this.self_host_google_font= option.uucss_self_host_google_fonts;

        }

      });
    }
  },

  methods:{
    dataSaved(){
      this.saved = true;
      setTimeout(() => this.saved = false, 2000)
    },

    saveSettings(){
      this.loading = true;
      const data = {
        uucss_preload_font_urls : this.preload_font_urls.replace(/\n/g, ","),
        uucss_self_host_google_fonts : this.self_host_google_font,
        uucss_enable_font_optimization : true,
      }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data,{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            window.uucss_global.active_modules = response.data.data;
          } )
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
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/',
      focus: null,
      saved: false,
      font_config:[],
      id: 'font',
      loading: false,
      self_host_google_font: false,
      preload_font_urls: [],
      back: '/',


    }
  },


}
</script>

<style scoped>

</style>