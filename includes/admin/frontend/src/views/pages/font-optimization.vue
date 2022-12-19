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
                    <label>
                      <input v-model="self_host_google_font" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Self Host Google Fonts</h1>
                  <p class="text-sm text-gray-font">This can help you group pages which has same html structure. Product
                    pages, Category pages etc...</p>
                </div>
              </div>
            </div>

          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Preload Font URLs</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <textarea v-model="preload_font_urls"
                      class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="force-include" type="text" placeholder=""></textarea>
            <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
              <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                ‘elementor-*, *-gallery’ etc...</p>
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
    saveSettings(){

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
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "Font Settings Updated!"
                },
                4000
            );
          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    }
  },

  data() {
    return {
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',

      font_config:[],
      id: 'font',

      self_host_google_font: false,
      preload_font_urls: [],
      back: '/',


    }
  },


}
</script>

<style scoped>

</style>