<script setup>

</script>

<template>
  <main>

    <ul class="nav-items inline-grid grid grid-cols-3 gap-8">
      <messageBox></messageBox>

      <div v-if="!license_information.licensed_domain" class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div class="content pl-4 pr-4 pb-2 pt-2">
          <h4 class="mt-2 text-gray-h text-base font-semibold">Connect your website</h4>
          <img v-if="tick_image" :src="base + tick_image" :alt="tick_image">
        </div>
        <hr class="border-gray-border-line border-b-0">

        <div class="content p-2 pl-4 pr-4 pb-1 font-normal">
          <p class="mb-1 text-gray-p text-xss"><b>Slow load times</b> are the <b>#1 reason</b> for <b>high
            bounce rates</b> and one of the root causes of
            <b>poor Google Rankings.</b></p>
        </div>

       <div class="actions grid justify-center">
         <a :href="license_information.link" target="_blank">
           <button class="text-xss bg-purple font-semibold text-white py-2 px-4 border rounded-full"
           >Get RapidLoad</button>
         </a>
       </div>

       <p class="mb-1 text-xsm mt-2 text-purple-p pl-4">Already have license ?</p>
        <div class="actions pl-4 pr-4 pb-2 grid grid-cols-2 gap-4">
          <div class="col-start-1 col-end-3" >
            <a :href="license_information.connect_link" target="_blank">
              <button class="text-xsss bg-transparent mb-3 text-black-font transition duration-300 hover:bg-black-b font-semibold hover:text-white py-1 px-4 border border-gray-button-border hover:border-transparent rounded-full"
              >Connect</button>
            </a>
          </div>

          <div class="col-end-7 col-span-2 ...">
            <a :href="license_information.link" target="_blank">
              <button class="text-xsss bg-transparent mb-3 text-black-font transition duration-300 hover:bg-black-b font-semibold hover:text-white py-1 px-4 border border-gray-button-border hover:border-transparent rounded-full"
              >Connect with license key</button>
            </a>
          </div>

        </div>
      </div>

      <div v-if="license_information.licensed_domain"  class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div class="content pl-4 pr-4 pb-2 pt-2">
          <h4 class="mt-2 text-gray-800 font-bold text-base">License Information</h4>
          <img v-if="tick_image" :src="base + tick_image" :alt="tick_image">
        </div>
        <hr class="border-gray-border-line border-b-0">

        <div class="content p-2 pl-4 pr-4 pb-3.5">
          <p class="mb-1 text-sm text-gray-500 ">Name: {{license_information.name}}</p>
          <p class="mb-1 text-sm text-gray-500 ">Expiration Date: {{license_information.exp_date.toLocaleDateString()}}</p>
          <p class="mb-1 text-sm text-gray-500 ">License: {{license_information.license}}</p>
        </div>

<!--        <p class="mb-1 text-sm mt-1 text-gray-500 pl-4">Want to change plan?</p>-->
        <div class="actions pt-2 pl-4 pr-4 pb-2 grid grid-cols-2 gap-4">

          <div class="col-start-1 col-end-3" >
              <a :href="license_information.link" target="_blank">
              <button class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">View My Account</button>
              </a>
          </div>

        </div>
      </div>


      <li v-for="item in items" :key="item.id"
          class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div :class="{disableBlock: !license_information.licensed_domain}">
          <div class="content p-4 pb-6">
            <img v-if="item.image" :src="base + item.image" :alt="item.title">
            <h4 class="mt-2 text-black font-bold text-base">{{ item.title }}</h4>
            <p class="mb-1 text-xm text-black leading-db-lh">{{ item.description }}</p>
          </div>
          <hr class="border-gray-border-line border-b-0 mt-1">
          <div class="actions p-4 mt-1 grid grid-cols-2 gap-4">

            <div class="col-start-1 col-end-3" >
              <RouterLink v-if="item.id !== 'cdn'" :class="{disableClick: !item.status}" class="text-xsss bg-transparent mb-3 text-black-b transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                          :to="item.link">
                <button >Settings</button>
              </RouterLink>


              <svg v-if="item.id === 'cdn' && loading === true" class="" width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="loader">
                  <animateTransform
                      xlink:href="#loader"
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      from="0 50 50"
                      to="360 50 50"
                      dur="1s"
                      begin="0s"
                      repeatCount="indefinite"
                      restart="always"
                  />
                  <path class="a" opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#66B1DC"/>
                  <path class="b" fill-rule="evenodd" clip-rule="evenodd" d="M100 50C100 22.3858 77.6142 0 50 0V10C72.0914 10 90 27.9086 90 50H100Z" fill="#7F54B3"/>
                </g>
              </svg>
            </div>


            <div class="col-end-7 col-span-2 ...">
              <label :for="'toggle'+item.title" class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" v-model="item.status" @click="update(item.status, item.id)" value="" :id="'toggle'+item.title" class="sr-only peer">
                <div
                    class="w-11 h-6 bg-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple"></div>
              </label>
            </div>

          </div>
        </div>
      </li>
    </ul>

    <div class="pt-6">
<!--      <RouterLink class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                  to="/page-optimizer">
        <button>Page Optimizer</button>
      </RouterLink>-->

      <RouterLink class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                  to="/general-settings">
        <button>General Settings</button>
      </RouterLink>
    </div>

  </main>
</template>

<script>

import config from "../config";
import axios from 'axios';
import messageBox from "../components/messageBox.vue";
import Vue3TagsInput from "vue3-tags-input";

export default {

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {

    this.update_license()

    const activeModules = [];

    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });

    this.items_data = activeModules

    if (this.items_data) {
      Object.keys(this.items_data).map((key) => {
        this.items.map((val) => {
          if (val.id === this.items_data[key].id) {
            val.status = this.items_data[key].status === 'on';
          }
        })
      });
    }
  },
  methods:{

    disconnect_license(){
      axios.post(window.uucss_global.ajax_url + '?action=uucss_license', {disconnect:true},{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })

    },
    update_license(){
      axios.post(window.uucss_global.ajax_url + '?action=uucss_license').then((response)=>{
        if(response.data?.data){
          this.license_information.name = response.data?.data?.name
          this.license_information.exp_date = new Date(response.data?.data?.next_billing * 1000)
          this.license_information.license = response.data?.data?.plan
          this.license_information.licensed_domain = response.data?.data?.licensedDomain
          if(!response.data?.data?.licensedDomain){
            this.disconnect_license();
          }
        }
      })
    },

    update(toggle, module){
      if(module==='cdn'){
        this.loading = true;
      }

      if(!toggle){
        toggle = "on";
      } else{
        toggle = "off";
      }

      axios.post(window.uucss_global.ajax_url + '?action=activate_module&module='+module+'&active='+toggle)
          .then(response => {
            response.data
            window.uucss_global.active_modules = response.data.data

            this.loading = false;
          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },

  },

  data() {
    return {
      tick_image: '',
      license_information:
          {
            name: '',
            exp_date:new Date(),
            license:'',
            status: true,
            link: window.uucss_global.app_url,
            licensed_domain: null,
            connect_link: window.uucss_global.activation_url,
          },
      items_data: [],
      loading: false,
      items: [
        {
          id : "css",
          title: "CSS Delivery",
          description: 'Deliver CSS files by removing unused CSS and prioritizing critical CSS',
          image: 'unused-css.svg',
          link: '/unused-css',
          status: false,
          isDisabled: false,
        },
        {
          id : "javascript",
          title: "Javascript Delivery",
          description: 'Minify and deliver Javascript files with best practices',
          image: 'javascript.svg',
          link: '/java-script',
          status: false,
          isDisabled: false
        },
        {
          id : "image-delivery",
          title: "Image Delivery",
          description: 'Optimize all your images on-the-fly with modern formats (AVIF, WEBP)',
          image: 'image-delivery.svg',
          link: '/image-delivery',
          status: false,
          isDisabled: false
        },
        {
          id : "font",
          title: "Font Delivery",
          description: 'Locally host and optimize your fonts for faster page load times',
          image: 'font.svg',
          link: '/font-optimization',
          status: false,
          isDisabled: true
        },
        {
          id : "cdn",
          title: "Cloud Delivery (CDN)",
          description: 'Load resource files faster by using 112 edge locations with only 27ms latency',
          image: 'cdn.svg',
          link: '/cdn',
          status: false,
          isDisabled: true
        },

        /*{
          id : "asset-manager",
          title: "Asset Manager",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'asset-manager.svg',
          link: '/asset-manager',
          status: false,
          isDisabled: true
        },


        {
          id : "speed-monitoring",
          title: "Speed Monitoring",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'speed-monitoring.svg',
          link: '/speed-monitoring',
          status: false,
          isDisabled: true
        },*/

      ],
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/'
    }
  }

}
</script>