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
            <h1 class="font-semibold text-base text-black-font">Cloud Delivery (CDN)</h1>
            <p class="text-sm text-gray-font">Load resources faster using 112 edge locations with only 27ms latency</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="mb-5">
            <div class="flex">
              <div class="pr-1 mr-5">
                  <h1 class="font-semibold text-base text-black-font">Clear Cache</h1>
                  <p class="text-sm text-gray-font">Purge Cache</p>
              </div>
              <div>
                <button @click="purgeCach"
                        class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent rounded-lg">
                  Purge Cache
                </button>
              </div>
            </div>
          </div>

          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">CDN URL</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <input :class="{ 'pointer-events-none	cursor-default disabled': !devmode }"
                v-model="uucss_cdn_url"
                class="resize-none text-xs z-50 appearance-none border gray-border rounded-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cdn-url" type="text" placeholder="">
          </div>

          <div :class="{ expand: devmode }" class="not-expand">
          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Bunny CDN Zone</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <input
                v-model="uucss_cdn_zone_id"
                class="resize-none text-xs z-50 appearance-none border gray-border rounded-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="bunny-cdn" type="text" placeholder="">
          </div>
          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Cloudflare DNS</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <input
                v-model="uucss_cdn_dns_id"
                class="resize-none text-xs z-50 appearance-none border gray-border rounded-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="clouldflare" type="text" placeholder="">
          </div>



          <button @click="saveSettings"
                  class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
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
    console.log(this.cdn_config)
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
    purgeCach(){
      axios.post(window.uucss_global.ajax_url + '?action=purge_rapidload_cdn' , {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "Cache Cleared"
                },
                4000
            );
          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
    },
    saveSettings(){

      if(!this.devmode){
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
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "CDN Settings Updated!"
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

      cdn_config:[],
      id: 'cdn',

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