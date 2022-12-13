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
            <h1 class="font-semibold text-base text-black-font">Image Delivery</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
            <h1 class="font-semibold text-base text-black-font">Compression Level</h1>
            <p class="text-sm pb-3 text-gray-font">How to load the original CSS files?</p>
            <button v-on:click="compression_level = 'lossy'"
                    :class="{ active: compression_level === 'lossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
              LOSSY
            </button>

            <button v-on:click="compression_level = 'glossy'"
                    :class="{ active: compression_level === 'glossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
              GLOSSY
            </button>
            <button v-on:click="compression_level = 'lossless'"
                    :class="{ active: compression_level === 'lossless' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
              LOSSLESS
            </button>


          <div class="grid">
            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="next_gen_image" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Next-gen Images Support</h1>
                  <p class="text-sm text-gray-font">Serve the images in next-gen image formats to all the browsers that support them.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-2">
                    <label>
                      <input
                          v-model="image_count"
                          type="number"
                          style="max-width: 55px"
                          class="px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Exclude above the fold image count</h1>
                  <p class="text-sm text-gray-font">Serve the images in next-gen image formats to all the browsers that support them.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="grid mb-5">
              <h1 class="font-semibold text-base text-black-font">Exclude Images</h1>
              <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
              <textarea v-model="uucss_exclude_images"
                        class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="force-include" type="text" placeholder=""></textarea>
              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">
                  Exclude Images from RapidLoad enter each file in new line</p>
              </div>
            </div>
          </div>
          <div class="grid">
            <div class="grid mb-5">
              <h1 class="font-semibold text-base text-black-font">Preload LCP Image</h1>
              <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
              <textarea v-model="uucss_preload_lcp_image"
                        class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="force-include" type="text" placeholder=""></textarea>
              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">
                  Preload LCP Image from RapidLoad enter each file in new line</p>
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
import config from "../../config";
import Vue3TagsInput from 'vue3-tags-input';
import axios from "axios";
import messageBox from "../../components/messageBox.vue";

export default {
  name: "image-delivery",

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {
    const activeModules = [];
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });
    this.image_delivery = activeModules
    if (this.image_delivery) {
      Object.keys(this.image_delivery).map((key) => {
        if (this.id === this.image_delivery[key].id) {
          const options = this.image_delivery[key].options;
          this.compression_level = options.uucss_image_optimize_level
          this.next_gen_image = options.uucss_support_next_gen_formats
          this.image_count = options.uucss_exclude_above_the_fold_image_count
          this.uucss_exclude_images = options.uucss_exclude_images
          this.uucss_preload_lcp_image = options.uucss_preload_lcp_image
        }

      });
    }
  },

  methods:{
    async saveSettings(){
      const data = {
        uucss_image_optimize_level: this.compression_level,
        uucss_support_next_gen_formats: this.next_gen_image,
        uucss_exclude_above_the_fold_image_count: this.image_count,
        uucss_exclude_images : this.uucss_exclude_images,
        uucss_preload_lcp_image : this.uucss_preload_lcp_image,
        uucss_enable_image_delivery : true,
      }

      await axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data
            window.uucss_global.active_modules = response.data.data
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "Image Delivery Settings Updated!"
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
      back: '/',

      image_delivery: [],
      id: 'image-delivery',
      compression_level: 'lossy',
      next_gen_image: false,
      image_count: 3,
      uucss_exclude_images: [],
      uucss_preload_lcp_image: [],

    }
  },


}
</script>

<style scoped>

</style>