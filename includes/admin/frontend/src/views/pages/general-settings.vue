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
            <h1 class="font-medium text-base text-black-font">General Settings</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>



      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Exclude URLs</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>

                <textarea
                    v-model="uucss_excluded_links"
                    @focus="focus='exclude'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
              <div :class="focus==='exclude'? 'bg-purple-lite':'bg-gray-lite-background'"
                   class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                  ‘elementor-*, *-gallery’ etc...</p>
              </div>

          </div>

          <div class="grid">
            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_query_string = !uucss_query_string" :class="uucss_query_string? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_query_string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Query String</h1>
                  <p class="text-sm text-gray-font">Consider URLs with query strings as separate URLs.</p>
                </div>
              </div>
            </div>
          </div>


            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_enable_debug = !uucss_enable_debug" :class="uucss_enable_debug? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                      <svg v-if="uucss_enable_debug" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 class="font-normal text-base text-black-font">Debug Mode</h1>
                  <p class="text-sm text-gray-font">Enable debug logs for RapidLoad.</p>
                </div>
              </div>
            </div>


          <div class="flex mt-5 pb-1 transition duration-300 hover:cursor-pointer rounded" @click="queue_option.default=!queue_option.default">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">

                <svg class="ml-[-3px]" :class="{'advanced-after': queue_option.default , 'advanced-before' : !queue_option.default }" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967L16.5303 11.4697C16.8232 11.7626 16.8232 12.2374 16.5303 12.5303L10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303C9.17678 18.2374 9.17678 17.7626 9.46967 17.4697L14.9393 12L9.46967 6.53033C9.17678 6.23744 9.17678 5.76256 9.46967 5.46967Z" fill="#030D45"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="font-normal text-base text-black-font">Queue options</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>
          <div :class="{ expand: queue_option.default}" class="mt-3 pl-6 not-expand main-border">

            <div class="flex">
              <div>
                <h1 class="font-normal text-base text-black-font">Queue</h1>

                <div class="flex">
                  <p class="text-sm text-gray-font pr-3 pt-1">Run</p>

                  <dropDown v-if="queue_option.uucss_jobs_per_queue"
                      :options="queue_jobs_options"
                      :default="queue_option.uucss_jobs_per_queue"
                      class="select mr-3"
                      @input="queue_option.uucss_jobs_per_queue=$event"
                  />
                  <p class="text-sm text-gray-font pr-3 pt-1">Per</p>
                  <dropDown v-if="queue_option.uucss_queue_interval"
                      :options="jobs_timing_options"
                      :default="queue_option.uucss_queue_interval"
                      class="select mr-3" style="min-width: 110px"
                      @input="queue_option.uucss_queue_interval=$event"
                  />
                </div>
              </div>
            </div>
            <div class="flex mt-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="queue_option.uucss_disable_add_to_queue = !queue_option.uucss_disable_add_to_queue" :class="queue_option.uucss_disable_add_to_queue? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                    <svg v-if="queue_option.uucss_disable_add_to_queue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 class="font-normal text-base text-black-font">Disable Auto Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs adding to queue on user visits.</p>
              </div>
            </div>
            <div class="flex mt-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="queue_option.uucss_disable_add_to_re_queue = !queue_option.uucss_disable_add_to_re_queue" :class="queue_option.uucss_disable_add_to_re_queue? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200">
                    <svg v-if="queue_option.uucss_disable_add_to_re_queue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 class="font-normal text-base text-black-font">Disable Re-Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs re-queuing on warnings.</p>
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
import config from "../../config";
import Vue3TagsInput from 'vue3-tags-input';
import dropDown from '../../components/dropDown.vue'
import messageBox from "../../components/messageBox.vue";
import axios from "axios";

export default {
  name: "general-settings",

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
    this.general_config = activeModules;

    if (this.general_config) {
      Object.keys(this.general_config).map((key) => {
        if (this.id === this.general_config[key].id) {
          const option = this.general_config[key].options;

          this.queue_option.uucss_disable_add_to_queue = option.uucss_disable_add_to_queue;
          this.queue_option.uucss_disable_add_to_re_queue = option.uucss_disable_add_to_re_queue;
          this.uucss_enable_debug = option.uucss_enable_debug;
          this.uucss_excluded_links = option.uucss_excluded_links?.replace(/,/g, '\n');
          this.uucss_query_string = option.uucss_query_string;
          this.queue_option.uucss_jobs_per_queue = option.uucss_jobs_per_queue < 2 ? option.uucss_jobs_per_queue + " Job" : option.uucss_jobs_per_queue + " Jobs";
          this.queue_option.uucss_queue_interval = option.uucss_queue_interval > 5999 ? option.uucss_queue_interval / 6000 + " Hour" : option.uucss_queue_interval < 61 ? option.uucss_queue_interval / 60 + " Minute" : option.uucss_queue_interval / 60 + " Minutes";


        }

      });
    }
  },

  methods:{

    saveSettings(){
      this.loading = true;
      const data = {
        uucss_enable_debug : this.uucss_enable_debug,
        uucss_query_string : this.uucss_query_string,
        uucss_excluded_links : this.uucss_excluded_links.replace(/\n/g, ","),
        uucss_jobs_per_queue : this.queue_option.uucss_jobs_per_queue.replace(/\D/g,''),
        uucss_queue_interval : this.queue_option.uucss_queue_interval === '1 Hour' ? this.queue_option.uucss_queue_interval.replace(/\D/g,'')*6000 : this.queue_option.uucss_queue_interval.replace(/\D/g,'')*60,
        uucss_disable_add_to_queue : this.queue_option.uucss_disable_add_to_queue,
        uucss_disable_add_to_re_queue : this.queue_option.uucss_disable_add_to_re_queue,
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
        });

    }
  },

  data() {
    return {
      general_config:[],
      id: 'general',
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      focus: null,
      back: '/',
      loading : false,
      uucss_enable_debug: false,
      uucss_query_string: false,
      uucss_excluded_links: [],
      queue_jobs_options: ['1 Job', '2 Jobs', '4 Jobs', '8 Jobs', '16 Jobs'],
      jobs_timing_options: ['1 Minute', '5 Minutes', '10 Minutes', '30 Minutes', '1 Hour'],

      queue_option: {
        default: false,
        queue: false,
        uucss_disable_add_to_queue: false,
        uucss_disable_add_to_re_queue: false,
        uucss_jobs_per_queue:'',
        uucss_queue_interval:'',
        test: 4 +" test",
      },


    }
  },


}
</script>

<style scoped>

</style>