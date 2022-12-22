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
            <h1 class="font-medium text-base text-black-font">Cloud Delivery (CDN)</h1>
            <p class="text-sm text-gray-font">Load resource files faster by using 112 edge locations with only 27ms latency</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="mb-5">
            <div class="mb-3">
              <div class="pr-1 mr-5">
                  <h1 class="font-normal text-base text-black-font">Clear CDN Cache</h1>
                  <p class="text-sm text-gray-font">Clear resource caches across the CDN network</p>
              </div>
            </div>
            <div>
              <div>
                <button @click="purgeCach" :disabled="loading" class="disabled:opacity-50 flex mb-3 transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-gray-button-border hover:border-transparent rounded-lg">
                  <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Purge Cache
                </button>
                <!--                <button @click="purgeCach"-->
                <!--                        class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent rounded-lg">-->
                <!--                  Purge Cache-->
                <!--                </button>-->
              </div>
            </div>
          </div>

          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">CDN Endpoint</h1>
            <p class="text-sm pb-3 text-gray-font">Your CDN endpoint to store and serve all your resource across the CDN network</p>
            <div class="flex">

              <input :class="{ 'pointer-events-none	cursor-default disabled': !devmode }"
                     ref="cdn_url"
                     v-model="uucss_cdn_url"
                     class="resize-none text-xs z-50 appearance-none border gray-border rounded-l-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                     id="cdn-url" type="text" placeholder="">
              <div class="relative z-50">
              <button @click="copy" :disabled="loading"
                      :class="{ 'hidden': !uucss_cdn_url }"
                      class="ml-1 flex pt-2 -ml-10 transition duration-300 bg-transparent font-semibold text-black py-1.5 px-2 border border-transparent rounded-r-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" class="w-6 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                </svg>
              </button>
              <div :class="copied ? 'Show' : 'Hide'" class="-mt-10 mr-6 px-2 mt-0.5 license-error-popup absolute -left-10" >
                <div class="arrow-top-copied arrow-top font-medium text-xs relative bg-purple-lite leading-arw-mbox text-center text-purple rounded-[7px] px-2">
                  Copied</div>
              </div>
              </div>

            </div>
          </div>

          <div :class="{ expand: devmode }" class="not-expand">
          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Zone</h1>
            <p class="text-sm pb-3 text-gray-font"></p>
            <input
                v-model="uucss_cdn_zone_id"
                class="resize-none text-xs z-50 appearance-none border gray-border rounded-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="bunny-cdn" type="text" placeholder="">
          </div>
          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">DNS</h1>
            <p class="text-sm pb-3 text-gray-font"></p>
            <input
                v-model="uucss_cdn_dns_id"
                class="resize-none text-xs z-50 appearance-none border gray-border rounded-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="clouldflare" type="text" placeholder="">
          </div>



            <button @click="saveSettings" :disabled="loading"
                    class="disabled:opacity-50 flex mb-3 transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
              <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Save Settings
            </button>
          </div>
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
  name: "cdn",

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {
    if(window.location.href.indexOf("dev_mode") > -1){
      this.devmode = true;
    }

    const activeModules = [];
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });
    this.cdn_config = activeModules;

    if (this.cdn_config) {
      Object.keys(this.cdn_config).map((key) => {
        if (this.id === this.cdn_config[key].id) {
          const option = this.cdn_config[key].options;
          this.uucss_cdn_dns_id = option.uucss_cdn_dns_id;
          this.uucss_cdn_url= option.uucss_cdn_url;
          this.uucss_cdn_zone_id = option.uucss_cdn_zone_id;
        }

      });
    }
  },

  methods:{
    copy(){
      this.copied=true;
      this.$refs.cdn_url.select();
      document.execCommand('copy');
      setTimeout(() => this.copied = false, 1000)
    },
    purgeCach(){
      this.loading = true;
      axios.post(window.uucss_global.ajax_url + '?action=purge_rapidload_cdn' , {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            this.loading = false;
          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
    },
    saveSettings(){
      this.loading = true;
      if(!this.devmode){
        this.loading = false;
        return;

      }
      const data = {
        uucss_enable_cdn : true,
        uucss_cdn_dns_id : this.uucss_cdn_dns_id,
        uucss_cdn_url : this.uucss_cdn_url,
        uucss_cdn_zone_id : this.uucss_cdn_zone_id,
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
      focus: null,
      cdn_config:[],
      id: 'cdn',
      copied: false,
      loading: false,
      uucss_cdn_dns_id: null,
      uucss_cdn_url: null,
      uucss_cdn_zone_id: null,
      devmode: false,
      back: '/',


    }
  },


}
</script>

<style scoped>

</style>