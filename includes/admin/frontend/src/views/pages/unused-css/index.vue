<template>
  <main>
    <div class="bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <div class="flex border-y border-gray-border-line p-4 mt-12 mb-6 pr-8">
        <div class="flex-initial w-32 pl-8">
          <RouterLink type="button" :to="back" class="bg-white hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
            <img :src="base+'/arrow-left.svg'" alt="Back">
          </RouterLink>
        </div>
        <div class="flex mt-1">
        <div class="pr-1">
          <div class="items-center mr-4 mt-3">
            <label>
              <input id="purple-checkbox" type="checkbox" value="" class="rounded-lg accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
            </label>
          </div>
        </div>
        <div>
          <h1 class="font-semibold text-base text-black-font">Remove Unused CSS</h1>
          <p class="text-sm text-gray-font">Remove unused css and generate optimized css files with only with used CSS</p>
        </div>
        </div>
      </div>


      <div v-for="button in buttons" class="p-4 pl-32	pr-96">
        <h1 class="font-semibold text-base text-black-font">Load Original CSS</h1>
        <p class="text-sm pb-3 text-gray-font">How to load the original CSS files?</p>
        <button v-on:click ="button.load_original_css = 'user_interaction'" :class="{ 'bg-purple text-white': button.load_original_css === 'user_interaction' }" class="bg-transparent text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	hover:border-transparent rounded-l-lg">
          On user interaction
        </button>

        <button v-on:click ="button.load_original_css = 'asynchronously'" :class="{ 'bg-purple text-white': button.load_original_css === 'asynchronously' }" class="bg-transparent text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border-y border-gray-button-border	 hover:border-transparent">
          Asynchronously
        </button>
        <button v-on:click ="button.load_original_css = 'remove'" :class="{ 'bg-purple text-white': button.load_original_css === 'remove' }" class="bg-transparent text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border	 hover:border-transparent rounded-r-lg">
          Remove
        </button>

        <div class="mt-5 mb-5 bg-purple-lite border border-purple rounded-2xl px-4 py-3 shadow-md" role="alert">
          <div class="flex">
            <div class="py-1 mt-1"><svg class="fill-current h-6 w-6 text-purple mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p class="font-semibold text-purple-back-font leading-5">Removing the original files from loading may not be compatible with all the websites. <br> If you are having site-breaks try on user interaction or {{button.load_original_css}}.</p>
            </div>
          </div>
        </div>

        <h1 class="font-semibold text-base text-black-font">Force Include selectors</h1>
        <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully included into optimization.</p>

        <div class="grid mb-5">
        <textarea class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="force-include" type="text" placeholder=""></textarea>
        <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
          <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well ‘elementor-*, *-gallery’ etc...</p>
        </div>
        </div>

        <h1 class="font-semibold text-base text-black-font">Force Exclude selectors</h1>
        <p class="text-sm pb-3 text-gray-font">These selectors will be forcefully excluded from optimization.</p>
        <div class="grid mb-5">
          <textarea class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="force-include" type="text" placeholder=""></textarea>
          <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
            <p class="text-sm text-dark-gray-font">One selector rule per line. You can use wildcards as well ‘elementor-*, *-gallery’ etc...</p>
          </div>
        </div>

        <h1 class="font-semibold text-base text-black-font">Selector Packs</h1>
        <p class="text-sm pb-3 text-gray-font">Selector packs contains predefined force exclude and include rules for plugins and themes.</p>
        <div class="grid mb-5">
          <textarea v-model="tags" class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="force-include" type="text" placeholder="Type your plugin..."></textarea>
          <div class="-mt-3 bg-gray-lite-background rounded-lg px-4 py-4 pb-2" role="alert">
            <p class="text-sm text-dark-gray-font">Search by plugin or theme name. You can add multiple packs.</p>
          </div>
        </div>

        <div class="mb-5">
          <div class="flex">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">
                <label>
                  <input v-model="pages_with_rules1" type="checkbox" value=""
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


          <div v-if="pages_with_rules1" class="pl-9">
            <button
                class="bg-transparent mb-3 text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
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
                  <p class="font-semibold text-purple-back-font leading-5">Recommended for websites with 50 plus pages.
                    RapidLoad will analyze a parent<br>
                    page and will apply results for all matched pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <div class="flex">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">
                <label>
                  <input v-model="pages_with_rules2" type="checkbox" value=""
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


          <div v-if="pages_with_rules2" class="pl-9">
            <button
                class="bg-transparent mb-3 text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
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
                  <p class="font-semibold text-purple-back-font leading-5">Recommended for websites with 50 plus pages.
                    RapidLoad will analyze a parent<br>
                    page and will apply results for all matched pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="mb-5">
          <div class="flex">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">
                <label>
                  <input v-model="advance_settings1" type="checkbox" value=""
                         class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                </label>
              </div>
            </div>
            <div>
              <h1 class="font-semibold text-base text-black-font">Advanced Settings</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>


          <div v-if="advance_settings1" class="pl-9">
            <button
                class="bg-transparent mb-3 text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
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
                  <p class="font-semibold text-purple-back-font leading-5">Recommended for websites with 50 plus pages.
                    RapidLoad will analyze a parent<br>
                    page and will apply results for all matched pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <div class="flex">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">
                <label>
                  <input v-model="advance_settings2" type="checkbox" value=""
                         class="accent-purple w-4 h-4 transition duration-200 text-purple-600 bg-purple-100 rounded border-purple-300 dark:ring-offset-purple-800 dark:bg-purple-700 dark:border-purple-600">
                </label>
              </div>
            </div>
            <div>
              <h1 class="font-semibold text-base text-black-font">Advanced Settings</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>


          <div v-if="advance_settings2" class="pl-9">
            <button
                class="bg-transparent mb-3 text-black-font hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">
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
                  <p class="font-semibold text-purple-back-font leading-5">Recommended for websites with 50 plus pages.
                    RapidLoad will analyze a parent<br>
                    page and will apply results for all matched pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="px-32 pb-8">
      <button class="bg-purple-500 hover:bg-purple-500 font-semibold hover:text-white text-white py-2 px-4 border border-gray-300	 hover:border-transparent mt-5 rounded-lg">
        Save Settings
      </button>
      </div>
    </div>

  </main>

</template>

<script>
import config from "../../../config";

export default {
  name: "index",
  data(){
    return {
      base: config.is_plugin ? config.public_base + '/public/images/' : 'images/',
      tag: '',
      tags:['Elementor', 'ActiveCampaign'],
      pages_with_rules1: false,
      advance_settings1: false,
      pages_with_rules2: false,
      advance_settings2: false,
      back: '/',
      active: 'bg-purple',
      buttons:[
        {
          load_original_css: 'user_interaction',
        }
      ],


    }
  },


}
</script>

<style scoped>

</style>