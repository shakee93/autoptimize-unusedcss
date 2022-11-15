<template>
  <main>
    <div class="container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back"
                      class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div class="pr-1">
            <div class="items-center mr-4 mt-3">
              <label>
                <input id="purple-checkbox" v-model="remove_css" type="checkbox" value=""
                       class="rounded-lg checkmark accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
              </label>
            </div>
          </div>
          <div>
            <h1 class="font-semibold text-base text-black-font">Remove Unused CSS</h1>
            <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used
              CSS</p>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 pl-32 pr-72">
          <div v-for="button in load_original_css">
            <h1 class="font-semibold text-base text-black-font">Load Original CSS</h1>
            <p class="text-sm pb-3 text-gray-font">How to load the original CSS files?</p>
            <button v-on:click="button.load_css = 'user_interaction'"
                    :class="{ active: button.load_css === 'user_interaction' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
              On user interaction
            </button>

            <button v-on:click="button.load_css = 'asynchronously'"
                    :class="{ active: button.load_css === 'asynchronously' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
              Asynchronously
            </button>
            <button v-on:click="button.load_css = 'remove'"
                    :class="{ active: button.load_css === 'remove' }"
                    class="bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
              Remove
            </button>

            <div :class="{ expand : button.load_css === 'remove'}" class="not-expand">
              <div class="mt-5 bg-purple-lite border border-purple rounded-2xl px-4 py-3 shadow-md" role="alert">
                <div class="flex">
                  <div class="py-1 mt-1">
                    <svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20">
                      <path
                          d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-sm text-purple-back-font leading-5">Removing the original files from
                      loading may not be compatible with all the websites. <br> If you are having site-breaks try on
                      user
                      interaction or asynchronously.</p>
                  </div>
                </div>
              </div>
            </div>
            <h1 class="font-semibold text-base text-black-font mt-5">Force Include selectors</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully included into optimization.</p>

            <div class="grid mb-5">
            <textarea
                class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="force-include" type="text" placeholder=""></textarea>
              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                  ‘elementor-*, *-gallery’ etc...</p>
              </div>
            </div>

            <h1 class="font-semibold text-base text-black-font">Force Exclude selectors</h1>
            <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
            <div class="grid mb-5">
            <textarea
                class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="force-include" type="text" placeholder=""></textarea>
              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well
                  ‘elementor-*, *-gallery’ etc...</p>
              </div>
            </div>

            <h1 class="font-semibold text-base text-black-font">Selector Packs</h1>
            <p class="text-sm pb-3 text-gray-font">Selector packs contains predefined force exclude and include rules
              for
              plugins and themes.</p>
            <div class="grid mb-5">
              <div class="flex text-sm">
                <vue3-tags-input :tags="tags"
                                 class="flex resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full p-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                 placeholder="Type your plugin..."/>
                <!--          <textarea v-model="tags" class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="force-include" type="text" placeholder="Type your plugin..."></textarea>-->


                <div class="mt-3 z-50 -ml-9 cursor-pointer">
                  <svg :class="{'animate-spin': refresh_element}" @click="refresh_element = !refresh_element"
                       class="fill-none transition ease-in-out" width="20px" height="20px"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 13 13">
                    <g class="" clip-path="url(#clip0_49_525)">
                      <path
                          d="M11.466 4.33334C10.6301 2.42028 8.72122 1.08334 6.5 1.08334C3.6913 1.08334 1.38187 3.22113 1.11011 5.95834"
                          stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.20825 4.33333H11.5916C11.7711 4.33333 11.9166 4.18783 11.9166 4.00833V1.625"
                            stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path
                          d="M1.56079 8.66666C2.39665 10.5797 4.30557 11.9167 6.52676 11.9167C9.33546 11.9167 11.6449 9.77886 11.9167 7.04166"
                          stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.81844 8.66666H1.43511C1.25562 8.66666 1.11011 8.81215 1.11011 8.99166V11.375"
                            stroke="#7F54B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>

                  </svg>
                </div>
              </div>


              <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">Search by plugin or theme name. You can add multiple packs.</p>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="query_string" type="checkbox" value=""
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


            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="pages_with_rules" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Group pages with rules</h1>
                  <p class="text-sm text-gray-font">This can help you group pages which has same html structure. Product
                    pages, Category pages etc...</p>
                </div>
              </div>


              <div :class="{ expand: pages_with_rules }" class="pl-9 not-expand">
                <button
                    class="bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
                  Manage Rules
                </button>
                <div class="mb-5 bg-purple-lite border border-purple rounded-lg px-4 py-3 shadow-md" role="alert">
                  <div class="flex">
                    <div class="py-1 mt-1">
                      <svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20">
                        <path
                            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-sm text-purple-back-font leading-5">Recommended for websites with 50
                        plus pages.
                        RapidLoad will analyze a parent<br>
                        page and will apply results for all matched pages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div v-for="settings in advance_settings" class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <label>
                      <input v-model="settings.default" type="checkbox" value=""
                             class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                    </label>
                  </div>
                </div>
                <div>
                  <h1 class="font-semibold text-base text-black-font">Advanced Settings</h1>
                  <p class="text-sm text-gray-font">More advanced options for pro users</p>
                </div>
              </div>

              <div :class="{ expand: settings.default }" class="pl-9 not-expand">
                <div class="flex mt-5">
                  <div class="pr-1">
                    <div class="flex items-center mr-4 mt-3">
                      <label>
                        <input v-model="settings.queue_option.default" type="checkbox" value=""
                               class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1 class="font-semibold text-base text-black-font">Queue options</h1>
                    <p class="text-sm text-gray-font">More advanced options for pro users</p>
                  </div>
                </div>
                <div :class="{ expand: settings.queue_option.default}" class="pl-9 not-expand">

                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.queue_option.queue" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">Queue</h1>

                      <div class="flex">
                      <p class="text-sm text-gray-font pr-3 pt-1">Run</p>
                      <dropDown
                          :options="queue_jobs_options"
                          :default="'4 Jobs'"
                          class="select mr-3"
                          @input="this.queue_jobs=$event"
                      />
                        <p class="text-sm text-gray-font pr-3 pt-1">Per</p>
                        <dropDown
                            :options="jobs_timing_options"
                            :default="'10 Minutes'"
                            class="select mr-3" style="min-width: 110px"
                            @input="this.queue_jobs_time=$event"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.queue_option.disable_auto_queue" type="checkbox" value=""
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
                          <input v-model="settings.queue_option.disable_requeue" type="checkbox" value=""
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
                <div class="flex mt-5">
                  <div class="pr-1">
                    <div class="flex items-center mr-4 mt-3">
                      <label>
                        <input v-model="settings.misc_unused_css.default" type="checkbox" value=""
                               class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                      </label>
                    </div>
                  </div>
                  <div>
                    <h1 class="font-semibold text-base text-black-font">Misc unused CSS options</h1>
                    <p class="text-sm text-gray-font">More advanced options for pro users</p>
                  </div>
                </div>
                <div :class="{ expand: settings.misc_unused_css.default }" class="pl-9 not-expand">
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.minify" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">Minify</h1>
                      <p class="text-sm text-gray-font">Minify and Remove CSS comments via the API</p>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.css_variables" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">CSS Variables</h1>
                      <p class="text-sm text-gray-font">Remove unused CSS variables</p>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.css_animation" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">CSS Animation keyframes</h1>
                      <p class="text-sm text-gray-font">Remove unused keyframe animations</p>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.css_font" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">CSS @font-face rules</h1>
                      <p class="text-sm text-gray-font">Remove unused @font-face rules</p>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.inline_css" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">Inline CSS</h1>
                      <p class="text-sm text-gray-font">Optimize Inline CSS</p>
                    </div>
                  </div>
                  <div class="flex mt-5">
                    <div class="pr-1">
                      <div class="flex items-center mr-4 mt-3">
                        <label>
                          <input v-model="settings.misc_unused_css.cash_busting" type="checkbox" value=""
                                 class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                        </label>
                      </div>
                    </div>
                    <div>
                      <h1 class="font-semibold text-base text-black-font">Cache Busting</h1>
                      <p class="text-sm text-gray-font">Enable RapidLoad crawler to view pages</p>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
          <button
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
import config from "../../../config";
import Vue3TagsInput from 'vue3-tags-input';
import dropDown from '../../../components/dropDown.vue'

export default {
  name: "index",

  components: {
    Vue3TagsInput,
    dropDown,
  },

  methods: {
    triggerClick(){
      console.log(this.queue_jobs);
    }
  },

  data() {
    return {
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      tag: '',
      tags: ['Elementor'],
      refresh_element: false,
      page_animation: true,
      pages_with_rules: false,
      queue_jobs_options: ['1 Job', '2 Jobs', '4 Jobs', '8 Jobs', '16 Jobs'],
      queue_jobs:'',
      queue_jobs_time:'',
      jobs_timing_options: ['1 Minute', '5 Minutes', '10 Minutes', '30 Minutes', '1 Hour'],
      query_string: false,
      advance_settings:[{
        default: false,
        queue_option: [{
          default: false,
          queue: false,
          disable_auto_queue: false,
          disable_requeue: false,
        }],
        misc_unused_css:[{
          default: false,
          minify: false,
          css_variables: false,
          css_animation: false,
          css_font: false,
          inline_css: false,
          cash_busting: false

        }],
      }],
      remove_css: false,
      back: '/',
      load_original_css: [
        {
          load_css: 'user_interaction',
        }
      ],
      runJobDropDown: false,


    }
  },


}
</script>

<style scoped>

</style>