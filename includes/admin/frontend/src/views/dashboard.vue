<script setup>

</script>

<template>
  <main>


    <div class="flex">


    <div class="w-[448px] h-[165px] mb-8 drop-shadow-sm rounded-xl border-2 border-purple bg-tips-purple mr-8">

      <div class="pl-6 pr-6 mt-3 inline-flex">
      <div class="leading-[15px] text-xsss font-medium flex mb-1 transition duration-300 bg-purple text-white py-1 px-3 border border-purple rounded-full">
        <svg class="mr-2 mt-[3px]" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#fff" viewBox="0 0 351.72 351.52"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M64.19,286.1c-12.92-2.89-24.31-8.05-34.19-16.22C10.71,253.92.5,233.28.29,208.3q-.54-64.38,0-128.77C.66,39.23,29.38,6.8,69.19.85A86.68,86.68,0,0,1,81.88.05Q176,0,270.13,0c39.6,0,71.76,25.8,79.8,64.05a87.45,87.45,0,0,1,1.68,17.47q.21,62.33.06,124.65c-.08,40.19-26.53,72.52-65.6,80a90.8,90.8,0,0,1-16.74,1.28c-28.32.13-56.64,0-84.95.15a12.6,12.6,0,0,0-6.52,2q-43.65,28.91-87.14,58.06c-3.62,2.42-7.41,4.16-11.86,3.74-8.56-.8-14.55-7.23-14.62-16-.13-15,0-29.95,0-44.92ZM176,127.88h74.87c7.11,0,14.23.11,21.33,0a15.9,15.9,0,0,0,15.27-13c1.3-7.91-2.84-15.37-10.29-17.83a26.11,26.11,0,0,0-8.08-1.09q-93.21-.09-186.41,0a31,31,0,0,0-3.74.11c-6.64.78-11.43,4.15-13.79,10.48-4,10.67,3.88,21.39,15.77,21.4Q128.45,127.94,176,127.88Zm-.27,63.84H212c9.48,0,19,.17,28.43-.09a15.76,15.76,0,0,0,14.76-20.14c-2-7.24-8.15-11.58-16.75-11.59q-62.49,0-125,0c-1,0-2,0-3,.09a15.79,15.79,0,0,0-13.88,11.8c-2.57,10.45,4.78,19.83,15.87,19.89C133.55,191.8,154.63,191.71,175.71,191.72Z"/></g></g></svg>
        Feeling lost?
      </div>
      </div>

      <div class="content pl-6 pr-6 pt-1 min-h-[76px]">
        <h2 class="mb-1 text-xsm text-purple-tips-text font-semibold">RapidLoad support is here</h2>
        <p class="text-xsmm text-purple-tips-text font-normal">If you need an extra hand, We are here to help. Take a look at our knowledge base or feel free to reach us.</p>
      </div>

      <div class="actions pl-6 pr-6 pb-2 grid grid-cols-2 gap-4">

        <div class="col-end-7 col-span-2">
          <a :href="support" target="_blank">
            <button @click=""
                class="text-xsss mb-3 text-black-font transition duration-300 bg-purple font-semibold text-white py-[6px] px-8 border border-purple hover:border-transparent rounded-lg">
              Get Help</button>
          </a>
        </div>

      </div>
    </div>

      <div class="w-[448px] h-[165px] mb-8 drop-shadow-sm rounded-xl border-2 border-tips-border-green bg-tips-green-bg mr-8">

        <div class="pl-6 pr-6 mt-3 inline-flex">
          <div class="leading-[15px] text-xsss font-medium flex mb-1 transition duration-300 bg-tips-green-head text-white py-1 px-3 border border-tips-green-head rounded-full">
            <svg class="mr-2 mt-[2px]" width="9" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33922 9.53101H2.7373V11.174H7.33922V9.53101Z" fill="white"/>
              <path d="M5.03476 2.5883e-06C4.10821 -0.000674638 3.2066 0.300187 2.46613 0.857142C1.72567 1.4141 1.18655 2.19689 0.930235 3.08728C0.673915 3.97767 0.714311 4.92729 1.04532 5.7927C1.37633 6.6581 1.97997 7.39229 2.76507 7.88435H7.29313C8.07855 7.39249 8.68251 6.65832 9.01374 5.79282C9.34497 4.92731 9.38547 3.97751 9.1291 3.08695C8.87273 2.1964 8.33344 1.4135 7.59273 0.856575C6.85202 0.299654 5.95015 -0.00101774 5.02343 2.5883e-06H5.03476Z" fill="white"/>
            </svg>
            Tips to improve PageSpeed
          </div>
        </div>

        <div class="content pl-6 pr-6 pt-1 min-h-[76px] flex">
          <div  :class="improvetips_count=== improvetips_count? 'tips-slide':'tips-hidden'">
            <h2 class="mb-1 text-xsm text-tips-dark-green-font font-semibold" >{{tips[improvetips_count].title}}</h2>
            <p class="text-xsmm text-tips-dark-green-font font-normal" v-html="tips[improvetips_count].description"></p>
          </div>
        </div>

        <div class="actions pl-6 pr-6 pb-2 grid grid-cols-2 gap-4">
          <div class="col-start-1 col-end-3 mt-2" >
            <p class="mb-1 text-xsmm text-tips-dark-green font-normal">{{improvetips_count+1}} of
              {{tips.length}}</p>

          </div>
          <div class="col-end-7 col-span-2">
            <a :href="tips[improvetips_count].learn_more" target="_blank">
              <button class="mr-2 text-xsss mb-3 text-tips-dark-green transition duration-300 font-semibold">
                Learn more</button>
            </a>

              <button @click="tipsimprovenext"
                      class="text-xsss mb-3 text-black-font transition duration-300 bg-tips-dark-green font-semibold text-white py-[6px] px-8 border border-tips-dark-green hover:border-transparent rounded-lg">
                Next</button>

          </div>

        </div>
      </div>


      <div class="-mt-[63px] -ml-[295px] flex">
        <div class="mr-1">
          <a :href="support" target="_blank" :class="{disableBlock: !license_information.licensed_domain}">
            <button @click=""
                    class="bg-white border border-gray-button-border hover:border-transparent hover:bg-purple doc hover:doc-hover text-gray-font hover:text-white cursor-pointer leading-[15px] ml-2 text-xsmm flex mb-1 transition duration-300 py-1 px-3 rounded-full">
              2.0 Feedback
            </button>
          </a>
        </div>
        <div class="mr-2">
          <a :href="docs" target="_blank" :class="{disableBlock: !license_information.licensed_domain}">
            <button @click=""
                    class="bg-white border border-gray-button-border hover:border-transparent hover:bg-purple doc hover:doc-hover text-gray-font hover:text-white cursor-pointer leading-[15px] ml-2 text-xsmm flex mb-1 transition duration-300 py-1 px-3 rounded-full">
              Documentation
            </button>
          </a>

        </div>
        <div class="mr-2">
          <RouterLink :class="{disableBlock: !license_information.licensed_domain}"
                      to="/settings">
            <button  @mouseover="general_hover = true"
                     @mouseleave="general_hover = false">
              <svg height="25" viewBox="0 0 512 512" width="25" xmlns="http://www.w3.org/2000/svg" fill="#7F54B3">
                <path
                    d="M262.29,192.31a64,64,0,1,0,57.4,57.4A64.13,64.13,0,0,0,262.29,192.31ZM416.39,256a154.34,154.34,0,0,1-1.53,20.79l45.21,35.46A10.81,10.81,0,0,1,462.52,326l-42.77,74a10.81,10.81,0,0,1-13.14,4.59l-44.9-18.08a16.11,16.11,0,0,0-15.17,1.75A164.48,164.48,0,0,1,325,400.8a15.94,15.94,0,0,0-8.82,12.14l-6.73,47.89A11.08,11.08,0,0,1,298.77,470H213.23a11.11,11.11,0,0,1-10.69-8.87l-6.72-47.82a16.07,16.07,0,0,0-9-12.22,155.3,155.3,0,0,1-21.46-12.57,16,16,0,0,0-15.11-1.71l-44.89,18.07a10.81,10.81,0,0,1-13.14-4.58l-42.77-74a10.8,10.8,0,0,1,2.45-13.75l38.21-30a16.05,16.05,0,0,0,6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16,16,0,0,0-6.07-13.94l-38.19-30A10.81,10.81,0,0,1,49.48,186l42.77-74a10.81,10.81,0,0,1,13.14-4.59l44.9,18.08a16.11,16.11,0,0,0,15.17-1.75A164.48,164.48,0,0,1,187,111.2a15.94,15.94,0,0,0,8.82-12.14l6.73-47.89A11.08,11.08,0,0,1,213.23,42h85.54a11.11,11.11,0,0,1,10.69,8.87l6.72,47.82a16.07,16.07,0,0,0,9,12.22,155.3,155.3,0,0,1,21.46,12.57,16,16,0,0,0,15.11,1.71l44.89-18.07a10.81,10.81,0,0,1,13.14,4.58l42.77,74a10.8,10.8,0,0,1-2.45,13.75l-38.21,30a16.05,16.05,0,0,0-6.05,14.08C416.17,247.67,416.39,251.83,416.39,256Z"/>
              </svg>
            </button>
          </RouterLink>
          <div :class="general_hover ? 'rl-Show' : 'rl-Hide'" class="-mt-[4px] mr-6 px-2 absolute -ml-[48px]" >
            <div class="arrow-top-copied font-medium text-xsmm relative bg-purple-lite leading-arw-mbox text-center text-purple rounded-[7px] px-2">
              General Settings</div>
          </div>
        </div>
      </div>
    </div>


    <ul class="nav-items inline-grid grid grid-cols-3 gap-8">
      <messageBox></messageBox>

      <li v-for="item in items" :key="item.id"
          :class="{disableBlock: !license_information.licensed_domain}" class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
        <div>
          <div class="content p-4 pb-6">
<!--            <img v-if="item.image" :src="base + item.image" :alt="item.title" width="49" height="49">-->
            <span v-html="item.image"></span>

            <h4 class="mt-2 text-black font-medium text-base opacity-80">{{ item.title }}</h4>
            <p class="mb-1 mt-1 text-xm text-black leading-db-lh">{{ item.description }}</p>
          </div>
          <hr class="border-gray-border-line border-b-0 mt-1">
          <div class="actions p-4 mt-1 grid grid-cols-2 gap-4">

            <div class="col-start-1 col-end-3" >
              <RouterLink v-if="item.id !== 'cdn' && license_information.licensed_domain" :class="item.status ? 'rl-Show' :'rl-Hide'" class=" text-xs bg-transparent mb-3 text-black-b transition duration-300 hover:bg-purple font-medium hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                          :to="item.link">
                <button >Settings</button>
              </RouterLink>
              <RouterLink v-if="item.id === 'cdn' && license_information.licensed_domain" :class="item.status && !loading? 'rl-Show': 'rl-Hide'" class=" text-xs bg-transparent mb-3 text-black-b transition duration-300 hover:bg-purple font-medium hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg"
                          :to="item.link">
                <button >Settings</button>
              </RouterLink>


              <svg v-if="item.id === 'cdn'"  :class="loading? 'rl-Show': 'rl-Hide'" class="absolute" style="top:80.5%;" width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <div v-if="!license_information.licensed_domain" class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white mb-1">
        <!--        popup starts Here-->

        <div :class="connect_btn? 'rl-Show': 'rl-Hide'" class="w-72 h-56 transition duration-300 rounded-xl bg-white absolute mt-[0px] z-[100]">

          <div class="actions pl-4 pr-4 pb-2 grid grid-cols-2">
            <div class="col-start-1 col-end-3" >
              <h4 class="mt-4 text-gray-h text-base font-semibold">Enter your License Key below</h4>
            </div>

            <div class="col-end-7 col-span-2">
              <img @click="connect_btn = !connect_btn" class="absolute top-2 right-2 cursor-pointer" :src="base+'/close.svg'" alt="Back">
            </div>

          </div>

          <hr class="border-gray-border-line border-b-0">

          <div class="content p-2 pl-4 pr-4 pb-1 font-normal">
            <p class="mb-1 text-gray-p text-xss"><b>Slow load times</b> are the <b>#1 reason</b> for <b>high
              bounce rates</b> and one of the root causes of
              <b>poor Google Rankings.</b></p>
          </div>

          <div class="content p-2 pl-4 pr-4 pb-2.5 pt-1 mt-4">

            <div class="grid">
<!--              <div :class="connect_with_license_error.length ? 'Show' : 'Hide'" class="mt-0.5 license-error-popup" >-->
<!--                <div class="arrow-top font-medium text-xs relative bg-arrow-message leading-arw-mbox text-center text-arrow-message-tc rounded-[7px] px-2">-->
<!--                  {{ connect_with_license_error }}</div>-->
<!--              </div>-->
              <div :class="connect_with_license_error.length ? 'rl-Show' : 'rl-Hide'" class="flex mt-0.5 license-error-popup absolute" >
                <div class="font-medium text-xs relative leading-arw-mbox text-center text-arrow-message-tc rounded-[7px] px-2">
                  {{ connect_with_license_error }}</div>
                <img class="mt-3 w-3 absolute top-[26px] right-3.5" :src="base+'/error.svg'" alt="Back">
              </div>
              <input
                  @focus="focus='license-error'"
                  @blur="focus=''"
                  v-model="license_information.key"
                  :class="focus==='license-error' ? 'cdn-endpoint':'' || connect_with_license_error.length ? 'red-border' : 'gray-border' "
                  class="cdn resize-none text-xs z-50 appearance-none border rounded-lg w-full py-2 px-3 h-[2rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="force-include" type="text" placeholder="License Key">
            </div>
          </div>

          <div class="actions pl-2 pr-4 pb-2 grid grid-cols-2 gap-4">

            <div class="col-end-7 col-span-2">
              <button @click="connect_license" :disabled="license_loading" :class="license_loading? 'bg-purple text-white' : ''"
                      class="disabled:opacity-50 flex text-xs bg-transparent text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-1.5 px-4 border border-gray-button-border hover:border-transparent rounded-lg"
              >
                <svg :class="license_loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>

                Connect</button>
            </div>

          </div>
        </div>

        <!--        ends here-->

        <div class="content pl-4 pr-4 pb-2 pt-2">
          <h4 class="mt-2 text-gray-h text-base font-semibold">Connect your website</h4>
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



        <p class="mb-1 text-xsm mt-2 text-color-grey pl-4">Already have license?</p>
        <div class="actions pl-4 pr-4 pb-2 grid grid-cols-2 gap-4">
          <div class="col-start-1 col-end-3" >
            <a :href="license_information.connect_link">
              <button class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-black-b font-medium hover:text-white py-1 px-4 border border-gray-button-border hover:border-transparent rounded-full"
              >Connect</button>
            </a>
          </div>

          <div class="col-end-7 col-span-2">
            <button @click="connect_btn = !connect_btn"
                    class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-black-b font-medium hover:text-white py-1 px-4 border border-gray-button-border hover:border-transparent rounded-full"
            >License Key</button>
          </div>

        </div>


      </div>

      <div v-if="license_information.licensed_domain"  class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">

        <div class="content pl-4 pr-4 pb-2 pt-2 grid grid-cols-2 gap-4 items-center">
          <div class="col-start-1 col-end-3" >
            <h4 class="mt-2 text-gray-h text-base font-semibold">License Information</h4>
          </div>
          <div class="col-end-7 col-span-2">
            <img class="mt-2" v-if="tick_image" :src="base + tick_image" :alt="tick_image">
          </div>
        </div>

        <hr class="border-gray-border-line border-b-0">

        <div class="content p-2 pl-4 pr-4 pb-1 pt-6">
          <p class="mb-1 text-xm text-black font-medium">Name: <span class="text-color-grey">{{license_information.name}}</span></p>
          <p class="mb-1 text-xm text-black font-medium">Expiration Date: <span class="text-color-grey">{{license_information.exp_date.toLocaleDateString()}}</span></p>
          <p class="mb-1 text-xm text-black font-medium">License: <span class="text-color-grey">{{license_information.license}}</span></p>
        </div>

        <!--        <p class="mb-1 text-sm mt-1 text-gray-500 pl-4">Want to change plan?</p>-->
        <div class="actions pt-1 pl-4 pr-4 pb-2 grid grid-cols-2 gap-4">

          <div class="col-start-1 col-end-3" >
            <a :href="license_information.link" target="_blank">
              <button class="text-xs bg-transparent mb-3 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent mt-5 rounded-lg">View My Account</button>
            </a>
          </div>

        </div>
      </div>


    </ul>



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

    const rapidLoadLicense = JSON.parse(localStorage.getItem("rapidLoadLicense"));

    if (rapidLoadLicense) {
      Object.keys(rapidLoadLicense).forEach((a) => {
        const data = rapidLoadLicense[a];
        this.license_information.name = data.name
        this.license_information.exp_date = new Date(data.next_billing * 1000)
        this.license_information.license = data.plan
        this.license_information.licensed_domain = data.licensedDomain
      })
      this.update_license()
    }else{
      this.update_license()
    }


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

    // whatsnext(){
    //   this.whatstips_count++;
    //   if(this.whatstips_count===4){
    //     this.whatstips_count = 1;
    //   }
    //
    // },
    tipsimprovenext(){
      this.improvetips_count++;
      if(this.improvetips_count===5){
        this.improvetips_count = 0;
      }
    },
    connect_license(){
      this.license_loading = true;
      this.connect_with_license_error = "";
      axios.post(window.uucss_global.ajax_url + '?action=uucss_connect', {license_key:this.license_information.key},{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      }).then((response)=>{
        //console.log(response.data.data)
        if(response.data?.success){
          window.location.href = '?token=' + this.license_information.key + '&nonce=' + response.data.data.activation_nonce +'&page=rapidload#/'
          this.license_loading = false;
        }else{
          this.license_loading = false;
          if(typeof response.data?.data === "string"){
            this.connect_with_license_error = response.data?.data
          }else{
            this.connect_with_license_error = "Invalid License Key"
          }
        }
      })

    },

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
          if(!response.data?.data?.licensedDomain){
            this.disconnect_license();
            localStorage.clear();
            this.license_information.name = null
            this.license_information.exp_date = null
            this.license_information.license = null
            this.license_information.licensed_domain = null
            this.license_information.key = ''
          }else{
            const licenseData = []
            licenseData.push(response.data?.data)
            localStorage.setItem('rapidLoadLicense', JSON.stringify(licenseData))
            this.license_information.name = response.data?.data?.name
            this.license_information.exp_date = new Date(response.data?.data?.next_billing * 1000)
            this.license_information.license = response.data?.data?.plan
            this.license_information.licensed_domain = response.data?.data?.licensedDomain
          }
        }
      })

    },

    update(toggle, module){

      if(!this.license_information.licensed_domain){
        //console.log("return true");
        return;

      }
      if(module==='cdn'){
        this.loading = true;
      }

      if(!toggle){
        toggle = "on";
      } else{
        toggle = "off";
      }

      if(this.axios_request){
        this.axios_request.cancel("");
        this.axios_request = null;
      }

      this.axios_request = axios.CancelToken.source();
      const cancelToken = this.axios_request.token;

      axios.post(window.uucss_global.ajax_url + '?action=activate_module&module='+module+'&active='+toggle, {}, {
        cancelToken: cancelToken
      })
          .then(response => {
            response.data
            window.uucss_global.active_modules = response.data.data

            this.loading = false;

            this.items.map((item)=>{
              item.status = response.data.data[item.id].status === "on";
            })
          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },

  },

  data() {
    return {
      axios_request : null,
      tick_image: 'license-information.svg',
      whats_new: 'tips-whats.svg',
      tips_toimprove: 'tips-toimprove.svg',
      connect_btn: false,
      connect_with_license_error : '',
      // whatstips_count: 1,
      support: 'https://rapidload.zendesk.com/hc/en-us/requests/new',
      docs: ' https://docs.rapidload.io/',
      improvetips_count: 0,
      focus: null,
      general_hover: false,
      license_information:
          {
            name: '',
            key:'',
            exp_date:new Date(),
            license:'',
            status: true,
            link: window.uucss_global.app_url,
            licensed_domain: null,
            connect_link: window.uucss_global.activation_url,
            activation_nonce: null,
          },
      items_data: [],
      loading: false,
      license_loading: false,
      tips: [
        {
          title : "Image compression",
          description: 'Lossless image compression will <b>reduce image size by 30%</b> causing this to have a 50% effect on your page speed score.',
          learn_more: 'https://docs.rapidload.io/features/image-delivery',
        },
        {
          title : "Unused JS",
          description: "Removing Unused JS can <b>improve the website's performance</b> by reducing the amount of code the browser has to parse and execute.",
          learn_more: 'https://docs.rapidload.io/features/javascript-delivery',
        },
        {
          title : "CDN",
          description: "Using a CDN on-site will <b>improve the reliability of resource delivery</b> by using multiple servers in different locations, especially for users who are physically far from the server.",
          learn_more: 'https://docs.rapidload.io/features/cloud-delivery',
        },
        {
          title : "Self-hosting Google fonts",
          description: "Google fonts may not work correctly when loaded from external servers. Self-hosting the fonts <b>helps avoid these compatibility issues</b>.",
          learn_more: 'https://docs.rapidload.io/features/font-delivery',
        },
        {
          title : "Unused CSS",
          description: "RapidLoad will cut unused CSS <b>up to 97% and increase the page speed</b> by 50% positively affecting your conversion rate.",
          learn_more: 'https://docs.rapidload.io/features/css-delivery',
        },
      ],
      items: [
        {
          id : "css",
          title: "CSS Delivery",
          description: 'Deliver CSS files by removing unused CSS and prioritizing critical CSS.',
          image: '<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#7F54B3"/> <path d="M16.4048 24.8452V23.5028C17.0298 23.5028 17.4631 23.3821 17.7045 23.1406C17.946 22.8956 18.0668 22.5121 18.0668 21.9901V21.1591C18.0668 20.392 18.1857 19.799 18.4237 19.38C18.6651 18.9574 18.9883 18.6555 19.3931 18.4744C19.8015 18.2933 20.2631 18.185 20.7781 18.1495C21.293 18.1104 21.8239 18.0909 22.3707 18.0909V20.2216C21.9446 20.2216 21.6286 20.2695 21.4226 20.3654C21.2166 20.4613 21.0817 20.6069 21.0178 20.8022C20.9538 20.9975 20.9219 21.2443 20.9219 21.5426V22.7145C20.9219 22.9808 20.8615 23.2418 20.7408 23.4975C20.6236 23.7496 20.4052 23.9769 20.0856 24.1793C19.766 24.3817 19.3097 24.5433 18.7166 24.6641C18.1236 24.7848 17.353 24.8452 16.4048 24.8452ZM22.3707 31.4716C21.8239 31.4716 21.293 31.4521 20.7781 31.413C20.2631 31.3775 19.8015 31.2692 19.3931 31.0881C18.9883 30.907 18.6651 30.6051 18.4237 30.1825C18.1857 29.7635 18.0668 29.1705 18.0668 28.4034V27.5724C18.0668 27.0504 17.946 26.6687 17.7045 26.4272C17.4631 26.1822 17.0298 26.0597 16.4048 26.0597V24.7173C17.353 24.7173 18.1236 24.7777 18.7166 24.8984C19.3097 25.0192 19.766 25.1808 20.0856 25.3832C20.4052 25.5856 20.6236 25.8146 20.7408 26.0703C20.8615 26.3224 20.9219 26.5817 20.9219 26.848V28.0199C20.9219 28.3146 20.9538 28.5614 21.0178 28.7603C21.0817 28.9556 21.2166 29.1012 21.4226 29.1971C21.6286 29.293 21.9446 29.3409 22.3707 29.3409V31.4716ZM16.4048 26.0597V23.5028H18.7486V26.0597H16.4048ZM31.795 24.7173V26.0597C31.1736 26.0597 30.7403 26.1822 30.4953 26.4272C30.2538 26.6687 30.1331 27.0504 30.1331 27.5724V28.4034C30.1331 29.1705 30.0123 29.7635 29.7709 30.1825C29.5329 30.6051 29.2098 30.907 28.8014 31.0881C28.3966 31.2692 27.9367 31.3775 27.4218 31.413C26.9104 31.4521 26.3795 31.4716 25.8291 31.4716V29.3409C26.2552 29.3409 26.5713 29.293 26.7773 29.1971C26.9832 29.1012 27.1182 28.9556 27.1821 28.7603C27.246 28.5614 27.278 28.3146 27.278 28.0199V26.848C27.278 26.5817 27.3366 26.3224 27.4537 26.0703C27.5745 25.8146 27.7947 25.5856 28.1143 25.3832C28.4339 25.1808 28.8902 25.0192 29.4832 24.8984C30.0763 24.7777 30.8469 24.7173 31.795 24.7173ZM25.8291 18.0909C26.3795 18.0909 26.9104 18.1104 27.4218 18.1495C27.9367 18.185 28.3966 18.2933 28.8014 18.4744C29.2098 18.6555 29.5329 18.9574 29.7709 19.38C30.0123 19.799 30.1331 20.392 30.1331 21.1591V21.9901C30.1331 22.5121 30.2538 22.8956 30.4953 23.1406C30.7403 23.3821 31.1736 23.5028 31.795 23.5028V24.8452C30.8469 24.8452 30.0763 24.7848 29.4832 24.6641C28.8902 24.5433 28.4339 24.3817 28.1143 24.1793C27.7947 23.9769 27.5745 23.7496 27.4537 23.4975C27.3366 23.2418 27.278 22.9808 27.278 22.7145V21.5426C27.278 21.2443 27.246 20.9975 27.1821 20.8022C27.1182 20.6069 26.9832 20.4613 26.7773 20.3654C26.5713 20.2695 26.2552 20.2216 25.8291 20.2216V18.0909ZM31.795 23.5028V26.0597H29.4513V23.5028H31.795Z" fill="white"/></svg>',
          link: '/css',
          status: false,
          isDisabled: false,
        },
        {
          id : "javascript",
          title: "Javascript Delivery",
          description: 'Minify and deliver Javascript files with best practices.',
          image: '<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#FDC20A"/><path d="M12.2358 26.8466V24.2898L20.1619 21.1151V23.7997L15.1122 25.5469L15.1974 25.419V25.7173L15.1122 25.5895L20.1619 27.3366V30.0213L12.2358 26.8466ZM27.4941 18.5795L23.9785 31.6406H21.4856L25.0012 18.5795H27.4941ZM36.744 26.8466L28.8178 30.0213V27.3366L33.8675 25.5895L33.7823 25.7173V25.419L33.8675 25.5469L28.8178 23.7997V21.1151L36.744 24.2898V26.8466Z" fill="white"/></svg>',
          link: '/javascript',
          status: false,
          isDisabled: false
        },
        {
          id : "image-delivery",
          title: "Image Delivery",
          description: 'Optimize all your images on-the-fly with modern formats (AVIF, WEBP).',
          image: '<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#0EBFE6"/><circle cx="21" cy="28" r="7.5" stroke="white" stroke-width="3"/><circle cx="33" cy="16" r="3.75" stroke="white" stroke-width="2.5"/></svg>',
          link: '/image',
          status: false,
          isDisabled: false
        },
        {
          id : "font",
          title: "Font Delivery",
          description: 'Optimize and host your fonts locally for faster page load times.',
          image: '<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="9" fill="#3476D8"/><path d="M20 31C20 33.4148 21.7909 34 24 34C27.7587 34 29 31.5 26.5 26.5C23 31 22.5 24 23 22C21.5 25 20 27.8177 20 31Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M24 34C29.0495 34 32 31.0956 32 26.125C32 21.1544 24 16 24 16C24 16 16 21.1544 16 26.125C16 31.0956 18.9505 34 24 34Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          link: '/font',
          status: false,
          isDisabled: true
        },
        {
          id : "cdn",
          title: "Cloud Delivery (CDN)",
          description: 'Load resource files faster by using 112 edge locations with only 27ms latency.',
          image: '<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#09B42F"/><path d="M20 28V34H17.5M24 26V36.5M28 28V34C28 34 28.9379 34 30.5 34" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><rect x="30" y="33" width="2" height="2" rx="0.5" stroke="white"/><rect x="16" y="33" width="2" height="2" rx="0.5" stroke="white"/><rect x="23" y="36" width="2" height="2" rx="0.5" stroke="white"/><path d="M32 29.6073C33.4937 29.0221 35 27.6889 35 25C35 21 31.6667 20 30 20C30 18 30 14 24 14C18 14 18 18 18 20C16.3333 20 13 21 13 25C13 27.6889 14.5063 29.0221 16 29.6073" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          link: '/cdn',
          status: false,
          isDisabled: true
        },

      ],
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/'
    }
  }

}
</script>