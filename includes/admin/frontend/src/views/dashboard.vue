<script setup>

</script>

<template>
  <main>

    <ul class="nav-items inline-grid grid grid-cols-3 gap-8">
      <messageBox></messageBox>
      <li v-for="item in items" :key="item.id"
          class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div>
          <div class="content p-4">
            <img v-if="item.image" :src="base + item.image" :alt="item.title">
            <h4 class="mt-2 text-gray-800 font-bold text-base">{{ item.title }}</h4>
            <p class="mb-1 text-sm text-gray-500 ">{{ item.description }}</p>
          </div>
          <hr class="border-gray-border-line border-b-0">
          <div class="actions p-4 mt-1 grid grid-cols-2 gap-4">

            <div class="col-start-1 col-end-3" >
              <RouterLink v-if="item.id !== 'cdn'" :class="{disableClick: !item.status}" class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
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

      <RouterLink class="ml-6 text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
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
    this.getData();
  },
  methods:{


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
            this.modules = response.data.data;
            window.uucss_global.active_modules = response.data.data
            // console.log(window.uucss_global)
            // console.log(response.data)
           // window.uucss_global = response.data;
           // this.getData(response.data.data)
            this.loading = false;
          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },

    getData(){
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
    }
  },

  watch: {
    '$route' () {
          // console.log(this.items.map((val) =>{
          //   return{
          //     id: val.id,
          //     val: val.status
          //   }
          // }))

    }
  },
  data() {
    return {
      items_data: [],
      loading: false,
      modules: null,
      items: [
        {
          id : "css",
          title: "CSS",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'unused-css.svg',
          link: '/unused-css',
          status: false,
          isDisabled: false,
        },
        {
          id : "javascript",
          title: "Javascript",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'image-delivery.svg',
          link: '/java-script',
          status: false,
          isDisabled: false
        },
        {
          id : "image-delivery",
          title: "Image Delivery",
          description: 'Generate above the fold critical CSS for your pages',
          image: 'image-delivery.svg',
          link: '/image-delivery',
          status: false,
          isDisabled: false
        },
        {
          id : "cdn",
          title: "CDN",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'speed-monitoring.svg',
          link: '/cdn',
          status: false,
          isDisabled: true
        },

        {
          id : "font-optimization",
          title: "Font Optimization",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'font-optimization.svg',
          link: '/font-optimization',
          status: false,
          isDisabled: true
        },

        {
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
        },

      ],
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/'
    }
  }

}
</script>