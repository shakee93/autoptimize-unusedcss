<template>
  <main>

    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>
            <h1 class="font-semibold text-base text-black-font">General Settings</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>



      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="grid mb-5">
            <h1 class="font-semibold text-base text-black-font">Exclude URLs</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <textarea v-model="uucss_excluded_links"
                class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="force-include" type="text" placeholder=""></textarea>
            <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
              <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                ‘elementor-*, *-gallery’ etc...</p>
            </div>
          </div>

          <div class="grid">
            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="uucss_query_string" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Query String</h1>
                  <p class="text-sm text-gray-font">Consider URLs with query strings as separate URLs.</p>
                </div>
              </div>
            </div>
          </div>


            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="uucss_enable_debug" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Debug Mode</h1>
                  <p class="text-sm text-gray-font">Enable debug logs for RapidLoad.</p>
                </div>
              </div>
            </div>


          <div class="flex mt-5">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">
                <label>
                  <input v-model="queue_option.default" type="checkbox" value=""
                         class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                </label>
              </div>
            </div>
            <div>
              <h1 class="font-semibold text-base text-black-font">Queue options</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>
          <div :class="{ expand: queue_option.default}" class="pl-9 not-expand">

            <div class="flex mt-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="queue_option.queue" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Queue</h1>

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
                  <label>
                    <input v-model="queue_option.uucss_disable_add_to_queue" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Disable Auto Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs adding to queue on user visits.</p>
              </div>
            </div>
            <div class="flex mt-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <label>
                    <input v-model="queue_option.uucss_disable_add_to_re_queue" type="checkbox" value=""
                           class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                  </label>
                </div>
              </div>
              <div>
                <h1 class="font-semibold text-base text-black-font">Disable Re-Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs re-queuing on warnings.</p>
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
    Object.keys(window.uucss_global).map((key) => {
      if (key === 'active_modules') {
        const entry = window.uucss_global[key];
        Object.keys(entry).forEach((a) => {
          activeModules.push(entry[a])
        });
      }
    });
    this.general_config = activeModules;
    console.log(activeModules)

    if (this.general_config) {
      Object.keys(this.general_config).map((key) => {
        if (this.id === this.general_config[key].id) {
          const option = this.general_config[key].options;

          this.queue_option.uucss_disable_add_to_queue = option.uucss_disable_add_to_queue;
          this.queue_option.uucss_disable_add_to_re_queue = option.uucss_disable_add_to_re_queue;
          this.uucss_enable_debug = option.uucss_enable_debug;
          this.uucss_excluded_links = option.uucss_excluded_links;
          this.uucss_query_string = option.uucss_query_string;
          this.queue_option.uucss_jobs_per_queue = option.uucss_jobs_per_queue < 2 ? option.uucss_jobs_per_queue + " Job" : option.uucss_jobs_per_queue + " Jobs";
          this.queue_option.uucss_queue_interval = option.uucss_queue_interval > 5999 ? option.uucss_queue_interval / 6000 + " Hour" : option.uucss_queue_interval < 61 ? option.uucss_queue_interval / 60 + " Minute" : option.uucss_queue_interval / 60 + " Minutes";


        }

      });
    }
  },

  methods:{
    saveSettings(){




      const data = {
        uucss_enable_debug : this.uucss_enable_debug,
        uucss_query_string : this.uucss_query_string,
        uucss_excluded_links : this.uucss_excluded_links,
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
            this.$notify(
                {
                  group: "success",
                  title: "Success",
                  text: "General Settings Updated!"
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
      general_config:[],
      id: 'general',
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      back: '/',

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