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
            <h1 class="font-medium text-base text-black-font">Image Delivery</h1>
            <p class="text-sm text-gray-font">Optimize all your images on-the-fly with modern formats (AVIF, WEBP)</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
            <h1 class="font-normal text-base text-black-font">Compression Level</h1>
            <p class="text-sm pb-3 text-gray-font">Choose the image compression level</p>
            <button v-on:click="compression_level = 'lossy'"
                    :class="{ active: compression_level === 'lossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-2 border-purple	rounded-l-lg">
              LOSSY
            </button>

            <button v-on:click="compression_level = 'glossy'"
                    :class="{ active: compression_level === 'glossy' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y-2 border-purple">
              GLOSSY
            </button>
            <button v-on:click="compression_level = 'lossless'"
                    :class="{ active: compression_level === 'lossless' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-2 border-purple rounded-r-lg">
              LOSSLESS
            </button>


          <div class="grid">
            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="next_gen_image = !next_gen_image" :class="next_gen_image? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="next_gen_image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Serve next-gen Images (AVIF, WEBP)</h1>
                  <p class="text-sm text-gray-font">Serve the images in next-gen image formats to all the browsers that support them.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <div class="flex">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="uucss_lazy_load_images.status = !uucss_lazy_load_images.status" :class="uucss_lazy_load_images.status? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                    <svg v-if="uucss_lazy_load_images.status" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 class="font-normal text-base text-black-font">Lazy Load</h1>
                <p class="text-sm text-gray-font">Extract and prioritize above-the-fold CSS</p>
              </div>
            </div>

            <div :class="!uucss_lazy_load_images.status? 'pointer-events-none opacity-50' : ''" class="pl-6 main-border">
              <div class="mt-5">
                <h1 class="font-normal text-base text-black-font">Exclude Above-the-fold images from Lazy Load</h1>
                <p class="text-sm pb-3 text-gray-font">Choose the image compression level</p>


                  <button v-for="button in 5" v-on:click="uucss_lazy_load_images.image_count = button"
                          :class="['btn',(button === Number(uucss_lazy_load_images.image_count) ? 'active' : ''), (button ===1? 'rounded-l-lg' : ''), (button ===5? 'rounded-r-lg border-r-2' : '')]"
                          class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-l-2 border-y-2 border-purple">
                    {{ button }}
                  </button>

              </div>

              <div class="mt-5">

                <h1 class="font-normal text-base text-black-font">Exclude Images from Lazy Load</h1>
                <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
                <textarea
                    v-model="uucss_lazy_load_images.uucss_exclude_images_from_lazy_load"
                    @focus="focus='exclude'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
                  <div :class="focus==='exclude'? 'bg-purple-lite':'bg-gray-lite-background'"
                       class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                    <p class="text-sm text-dark-gray-font">Exclude Images from RapidLoad enter each file in new line</p>
                  </div>

              </div>

            </div>
          </div>

          <div class="grid">
            <div class="mb-5 mt-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_set_width_and_height = !uucss_set_width_and_height" :class="uucss_set_width_and_height? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_set_width_and_height" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Add Width and Height Attributes</h1>
                  <p class="text-sm text-gray-font">Serve the images in next-gen image formats to all the browsers that support them.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="grid mb-5">
              <h1 class="font-normal text-base text-black-font">Priority LCP Images</h1>
              <p class="text-sm pb-3 text-gray-font">Preload critical above-the-fold images to prioritize its loading. These images will not be lazy loaded</p>
                <textarea
                    v-model="uucss_preload_lcp_image"
                    @focus="focus='preload'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
                <div :class="focus==='preload'? 'bg-purple-lite':'bg-gray-lite-background'"
                     class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                  <p class="text-sm text-dark-gray-font">reload LCP Image from RapidLoad enter each file in new line</p>
                </div>
            </div>
          </div>

          <div class="grid">
            <div class="grid mb-5">
              <h1 class="font-normal text-base text-black-font">Exclude Images</h1>
              <p class="text-sm pb-3 text-gray-font">Exclude these images from loading on-the-fly via CDN</p>
              <textarea
                  v-model="uucss_exclude_images"
                  @focus="focus='exclude-images'" @blur="focus = null"
                  class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                  id="force-include" type="text" placeholder=""></textarea>
              <div :class="focus==='exclude-images'? 'bg-purple-lite':'bg-gray-lite-background'"
                   class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">Preload LCP Image from RapidLoad enter each file in new line</p>
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
          this.uucss_lazy_load_images.status= options.uucss_lazy_load_images
          this.uucss_lazy_load_images.image_count = options.uucss_exclude_above_the_fold_image_count
          this.uucss_lazy_load_images.uucss_exclude_images_from_lazy_load = options.uucss_exclude_images_from_lazy_load
          this.uucss_preload_lcp_image = options.uucss_preload_lcp_image
          this.uucss_set_width_and_height = options.uucss_set_width_and_height
          this.uucss_exclude_images = options.uucss_exclude_images
        }
      });

    }
  },

  methods:{

    dataSaved(){
      this.saved = true;
      setTimeout(() => this.saved = false, 2000)
    },

    async saveSettings(){
      this.loading = true;
      const data = {
        uucss_image_optimize_level: this.compression_level,
        uucss_support_next_gen_formats: this.next_gen_image,
        uucss_lazy_load_images: this.uucss_lazy_load_images.status,
        uucss_exclude_above_the_fold_image_count: this.uucss_lazy_load_images.image_count,
        uucss_exclude_images_from_lazy_load : this.uucss_lazy_load_images.uucss_exclude_images_from_lazy_load,
        uucss_preload_lcp_image : this.uucss_preload_lcp_image,
        uucss_set_width_and_height : this.uucss_set_width_and_height,
        uucss_exclude_images: this.uucss_exclude_images,
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
          })
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
      back: '/',
      loading : false,
      saved: false,
      focus: null,
      image_delivery: [],
      id: 'image-delivery',
      compression_level: 'lossy',
      next_gen_image: false,
      uucss_exclude_images: [],
      uucss_lazy_load_images:{
        status: false,
        image_count: 3,
        uucss_exclude_images_from_lazy_load: [],
      },
      uucss_set_width_and_height: false,
      uucss_preload_lcp_image: [],

    }
  },


}
</script>

<style scoped>

</style>