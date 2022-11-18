<script setup>

</script>

<template>
  <main>

    <ul class="nav-items inline-grid grid grid-cols-3 gap-8">

      <li v-for="item in items" :key="item.link"
          class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div>
          <div class="content p-4">
            <img v-if="item.image" :src="base + item.image" :alt="item.title">
            <h4 class="mt-2 text-gray-800 font-bold text-base">{{ item.title }}</h4>
            <p class="mb-1 text-sm text-gray-500 ">{{ item.description }}</p>
          </div>
          <hr class="border-gray-border-line border-b-0">
          <div class="actions p-4 mt-1 grid grid-cols-2 gap-4">

            <div class="col-start-1 col-end-3 ..." >
              <RouterLink class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                          :to="item.link">
                <button>Settings</button>
              </RouterLink>
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
      <RouterLink class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                  to="/page-optimizer">
        <button>Page Optimizer</button>
      </RouterLink>

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

export default {
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
    this.items_data = activeModules
    console.log(activeModules);
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

    update(toggle, module){
      if(!toggle){
        toggle = "on";
      } else{
        toggle = "off";
      }

      axios.post(window.uucss_global.ajax_url + '?action=activate_module&module='+module+'&active='+toggle)
          .then(response => console.log(response.data))
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    }
  },
  data() {
    return {
      items_data: [],
      // items : this.items_data.data.map((component) => ({
      //   name: component.title,
      //   description: component.description,
      //   link: '/'+component.id,
      //   image: component.id + '.svg',
      //   status: component.status,
      // })),
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
          id : "speed-monitoring",
          title: "Speed Monitoring",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'speed-monitoring.svg',
          link: '/speed-monitoring',
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
          id : "font-optimization",
          title: "Font Optimization",
          description: 'Reduce your CSS file size by remove unused CSS from your pages',
          image: 'font-optimization.svg',
          link: '/font-optimization',
          status: false,
          isDisabled: true
        },

      ],
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/'
    }
  }

}
</script>