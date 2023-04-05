<script setup>

</script>

<template>

  <main>
    <div class="flex">

      <div class="ml-4 mt-12">
        <div v-for="(step, index) in steps" :key="index" class="ml-2">
          <div class="flex">
            <button class="w-8 h-8 rounded-full border-[3px] transition duration-300 border-gray-button-border"
                    :class="count===index + 1? 'bg-white border-purple' : 'bg-gray-lite-background'
              && count>index + 1? 'bg-purple border-purple text-white' : 'bg-gray-lite-background'">
              {{ index + 1 }}
            </button>
            <h4 :class="count===index + 1? '' : 'opacity-50' && count>index + 1? '' : 'opacity-50'" class="text-black mt-1 ml-2 font-medium text-base">{{ step }}</h4>

          </div>

          <div v-if="index!==3"
               class="mt-5 mb-5 border-2 border-l-2 border-gray-button-border max-w-[45px] -ml-[6px] rotate-90 transition duration-300"
               :class="count===index +2? 'bg-white border-purple' : 'bg-gray-lite-background'
              && count>index + 2? 'bg-purple border-purple text-white' : 'bg-gray-lite-background'">

          </div>
        </div>
      </div>

      <div class="ml-20 -mt-20">

        <div class="ml-4 mb-4 min-h-[58px]">
        <div v-if="!loading && !error" :class="!loading? 'enter-from':'rl-Hide'">
          <h1 class="text-3xl font-bold">{{this.heading}}</h1>
          <h5 class="text-sm font-normal">{{this.subheading}}</h5>
        </div>
        </div>

        <div class="w-[770px] h-[505px] drop-shadow-sm rounded-[40px] border border-gray-border-line bg-white">

          <div v-if="count===1 &&!error" class="m-12 mt-11 mb-1 transition duration-300">
            <div class="max-h-[356px] min-h-[356px] grid h-screen place-items-center">
<!--              <div class="mt-16" v-if="loading">-->
<!--                <span v-html="loading_svg"></span>-->
<!--                <h4 class="mt-5 text-black font-medium text-base opacity-80">{{ this.message }}</h4>-->
<!--              </div>-->
              <div v-if="!loading" class="content grid place-content-center place-items-center">
                <span v-html="image1"></span>
                <h4 class="mt-10 text-black font-medium text-base opacity-80">Analyze & connect with RapidLoad.io engine to start automatic optimization <br> and witness the impact of RapidLoad on your website's page speed scores...</h4>
              </div>
            </div>
            <div class="flex justify-end">
              <div class="mr-2.5">
                <button @click="next('analyze')"
                        class="text-[13px] min-w-[190px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  Analyze Website
                </button>
              </div>
            </div>
          </div>

            <div v-if="loading&&!error"  :class="loading? 'enter-from block':'hidden'" class="m-12 mt-11 mb-1 transition duration-300 ">
              <h4 class="text-black font-medium text-base">{{ this.loading_header }}</h4>
              <div class="max-h-[356px] min-h-[356px] grid h-screen place-items-center">
                <div class="mt-1">
                  <span v-html="loading_svg"></span>
                  <h4 class="mt-5 text-black font-medium text-base opacity-80">{{ this.message }}</h4>
                </div>
              </div>
            </div>

          <div v-if="error&&!loading" class="m-12 mt-11 mb-1 transition duration-300">
            <h4 class="text-black font-medium text-base">Something Went Wrong....</h4>
            <div class="max-h-[356px] min-h-[356px] grid h-screen place-items-center">
              <div v-if="!loading" class="content grid place-content-center place-items-center">
                <span v-html="imageerror"></span>
              </div>
            </div>
            <div class="flex justify-end">
              <div v-if="count!==2" class="mr-2.5 flex">
                <a :href="support">
                <button class="text-[13px] min-w-[220px] mr-3 justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  Contact Support Team
                </button>
                </a>
                <button @click="dashboard"
                        class="text-[13px] min-w-[120px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  Dashboard
                </button>
              </div>
              <div v-if="count===2" class="mr-2.5 flex">
                <a :href="license_information.connect_link">
                <button @click="next ('connect')"
                        class="text-[13px] min-w-[120px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  Connect
                </button>
                </a>
              </div>
            </div>
          </div>

          <div v-if="count===2 && !loading && !error" :class="!loading? 'enter-from block':'hidden'" class="m-12 mt-11 mb-1 transition duration-300">
            <div class="max-h-[356px] min-h-[356px] grid h-screen place-items-center">
              <div  class="content grid place-content-center place-items-center">
                <h1 class="text-purple font-semibold text-[64px] -mb-[13px]">{{ stats.reduction }}%</h1>
                <h4 class="text-black text-base font-bold pb-2.5">CSS reduction by RapidLoad</h4>
                <div
                    class="min-w-[595px]  min-h-[225px] pt-1 pb-2.5 pl-7 pr-7 bg-gray-lite-background m-2.5 mb-1 rounded-[38px] border border-gray-border-line">
                  <div class="grid grid-cols-3 gap-3 m-7">
                    <div class="text-center">
                      <h4 class="text-black text-base pb-2.5 font-medium">CSS Before</h4>
                      <span
                          class="bg-light-red text-base	text-red-font font-bold transition duration-300 py-2 px-4 rounded-full">
                  {{ stats.before }}
                </span>
                      <h4 class="text-black text-base pb-2.5 mt-8 font-medium">Requests Before</h4>
                      <span
                          class="bg-light-red text-base	text-red-font font-bold transition duration-300 py-2 px-4 rounded-full">
                  {{ stats.beforeFileCount }}
                </span>
                    </div>
                    <div class="pl-5">
                      <svg class="mt-[35px]" width="105" height="21" viewBox="0 0 105 21" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10.5H101M93.1636 2L102.5 10.5L97.8318 14.75L93.1636 19" stroke="#565A63"
                              stroke-width="3"/>
                      </svg>
                      <svg class="mt-[70px]" width="105" height="21" viewBox="0 0 105 21" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10.5H101M93.1636 2L102.5 10.5L97.8318 14.75L93.1636 19" stroke="#565A63"
                              stroke-width="3"/>
                      </svg>
                    </div>
                    <div class="text-center">
                      <h4 class="text-black text-base pb-2.5 font-medium">CSS After</h4>
                      <span
                          class="bg-light-green text-base	text-dark-green font-bold transition duration-300 py-2 px-4 rounded-full">
                 {{ stats.after }}
                </span>
                      <h4 class="text-black text-base pb-2.5 mt-8 font-medium">Requests After</h4>
                      <span
                          class="bg-light-green text-base	text-dark-green font-bold transition duration-300 py-2 px-4 rounded-full">
                  {{ stats.afterFileCount }}
                </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end pl-6">
              <div :class="{disableBlock: loading}" class="mr-2.5 transition duration-300">
                <a :href="license_information.connect_link">
                  <button @click="next ('connect')"
                          class="text-[13px] min-w-[190px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                    Connect
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div v-if="count===3 && !loading &&!error" :class="!loading? 'enter-from block':'hidden'" class="m-12 mt-11 mb-1 transition duration-300">
            <div class="max-h-[356px] min-h-[356px]">
              <div v-for="item in items" :key="item.id"
                   class="max-w-[655px] max-h-[64px] grid grid-cols-2 gap-4 bg-gray-lite-background m-2.5 rounded-xl border border-gray-border-line">
                <div class="col-start-1 col-end-3 m-3 ml-6">
                  <h4 class="text-black font-medium leading-3 text-sm">{{ item.title }}</h4>
                  <p class="mt-1 leading-4 text-xm text-black leading-db-lh text-[11px]">{{ item.description }}</p>
                </div>
                <div :class="{'cursor-not-allowed': item.id==='css' || item.id==='cdn'}" class="col-end-7 col-span-2 mr-7 pt-3.5">
                  <label :class="{'disableBlock cursor-not-allowed': item.id==='css' || item.id==='cdn'}" :for="'toggle'+item.title" class="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" v-model="item.status" value=""
                           :id="'toggle'+item.title" class="sr-only peer">
                    <div :class="item.id==='cdn' ? 'bg-[red]': 'bg-gray'"
                        class="w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple"></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <div :class="{disableBlock: loading}" class="mr-2.5 transition duration-300">
                <button @click="next"
                        class="text-[13px] min-w-[190px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  Save and Run First Job
                </button>
              </div>
            </div>
          </div>

          <div v-if="count===4 && !loading &&!error" :class="!loading? 'enter-from block':'hidden'" class="m-12 mt-11 mb-1 transition duration-300">
            <div class="content grid place-content-center place-items-center max-h-[356px] min-h-[356px]">
              <span v-html="image2"></span>
              <h4 class="mt-4 text-black font-medium text-base opacity-80">{{this.stats.reduction}}% Optimized by RapidLoad</h4>
              <div class="w-[645px] h-[22px] bg-orange-progress-bar rounded-full mt-2.5">
                <div id="progress" style="transition: width 2s;" :class="!stats.reduction? 'w-[30%]':''" class=" h-[22px] transition duration-300 bg-green-progress-bar rounded-full"></div>
              </div>
              <div class="flex">
              <div :class="stats.after ? 'rl-Show' : 'rl-Hide'" class="px-2 mt-4 mr-[245px]" >
                <div class="arrow-top-copied arrow-top font-medium text-xs relative bg-purple-lite rounded-full leading-arw-mbox text-center text-purple pl-2.5 pr-2 pt-[7px] pb-[6px]">
                  RapidLoad <span class="p-0.5 pl-1 pr-1 bg-green-progress-bar rounded-full text-white ml-1">{{this.stats.after}}</span></div>
              </div>
              <div :class="stats.before? 'rl-Show' : 'rl-Hide'" class="px-2 mt-4" >
                <div class="arrow-top-copied arrow-top arrow-top-right font-medium text-xs relative bg-purple-lite rounded-full leading-arw-mbox text-center text-purple pl-2 pr-2.5 pt-[7px] pb-[6px]">
                  <span class="p-0.5 pl-1 pr-1 bg-red-progress-bar rounded-full text-white mr-1">{{this.stats.before}}</span> Without RapidLoad </div>
              </div>
              </div>

            </div>
            <div class="flex justify-end">
              <div class="mr-2.5">
                <button @click="dashboard"
                        class="text-[13px] min-w-[190px] justify-center disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-4 rounded-full">
                  To Dashboard
                </button>
              </div>
            </div>
          </div>

          <div v-if="!loading &&!error" class="dotstyle dotstyle-dotmove place-content-center place-items-center flex">
            <ul>
              <li :class="count === 1? 'current': ''"><a :class="count === 1? '': 'dotstyle-bg'"></a>
              </li>
              <li :class="count === 2? 'current': ''"><a :class="count === 2? '': 'dotstyle-bg'"></a>
              </li>
              <li :class="count === 3? 'current': ''"><a :class="count === 3? '': 'dotstyle-bg'"></a>
              </li>
              <li :class="count === 4? 'current': ''"><a :class="count === 4? '': 'dotstyle-bg'"></a>
              </li>
              <!--          <li @click="count =5" :class=" count === 5? 'current': ''"><a :class="count === 5? '': 'dotstyle-bg'" ></a></li>-->
              <!--          <li @click="count =6" :class="count === 6? 'current': ''"><a :class="count === 6? '': 'dotstyle-bg'" ></a></li>-->
              <li :class="count === 5? 'current': ''"><a :class="count === 7? '': ''"></a></li>
            </ul>
          </div>

        </div>
        <div class="mt-10 ml-4 mb-4 min-h-[58px]">
          <div class="grid place-content-center place-items-center">
            <span v-html="image3"></span>
            <h4 class="mt-2 text-black font-medium text-base opacity-50">Any question or feedback?</h4>
            <a :href="support">
            <button class="text-[13px] min-w-[190px] justify-center flex mb-3 cursor-pointer transition duration-300 bg-gray-support font-semibold hover:text-white text-gray-font py-1 px-2 hover:bg-purple hover:border-transparent mt-2 rounded-full">
              Reach out anytime
            </button>
            </a>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>

import config from "../config";
import axios from 'axios';
// import messageBox from "../components/messageBox.vue";

export default {

  components: {
    // messageBox,
  },

  mounted() {

    if (window.location.href.indexOf("nonce") > -1) {
      this.count = 3;
      this.heading = 'Recommended Settings';
      this.subheading= 'Recommended options are already enabled for you... Go on and tweak it yourself.';
      this.update_license();
      this.items[0].status = true;
      // setTimeout(()=>{
      //   this.update(false, 'css');
      // },3000)

      const activeModules = [];

      // Object.keys(window.uucss_global.active_modules).forEach((a) => {
      //   activeModules.push(window.uucss_global.active_modules[a])
      // });
      //
      // this.items_data = activeModules
      //
      // if (this.items_data) {
      //   Object.keys(this.items_data).map((key) => {
      //     this.items.map((val) => {
      //       if (val.id === this.items_data[key].id) {
      //         val.status = this.items_data[key].status === 'on';
      //
      //       }
      //     })
      //   });
      //
      //   this.items[0].status = true;
      // }



    }

  },
  methods: {

    next(step, localData) {
      this.loading = true;
      this.count++;
      if (this.count === 5) {
        this.count = 1;
      }
      if(step === "connect"){
        this.error= false;
        this.loading = true;
      }

      if (step === "analyze" && !localData) {
        this.message = 'Connecting your domain with RapidLoad....';
        axios.post(window.uucss_global.api_url + '/preview', {
          // url: 'https://rapidload.io/'
          url: uucss_global.home_url,
          //nonce: window.uucss.nonce
        }).then((response) => {
          //console.log(response.data);
          this.error= false;
          localStorage.clear();
          this.stats.after = response.data?.data?.stats.after;
          this.stats.before = response.data?.data?.stats.before;
          this.stats.beforeFileCount = response.data?.data?.stats.beforeFileCount;
          this.stats.afterFileCount = response.data?.data?.stats.afterFileCount;
          this.stats.reduction = response.data?.data?.stats.reduction;
          this.loading = !response.data?.data;
          const optimizeData = [];
          optimizeData.push(response.data?.data);
          localStorage.setItem('rapidLoadOptimize', JSON.stringify(optimizeData));
        }).catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
          this.error= true;
          this.loading=false;
        });
      }

      if (this.count === 1) {
        this.heading = 'Analyze & Connect';
        this.subheading= 'Catch a glimpse of how RapidLoad can impact your page speed.';
      }

      if (this.count === 2) {
        this.loading_header = 'Connecting your website with RapidLoad';
        this.heading = 'Pagespeed results';
        this.subheading= 'Look at the results with how much CSS you can save.';
      }

      if (this.count === 3) {
        this.message = 'Connecting your RapidLoad License....';
        this.loading_header = 'Connecting your RapidLoad License';
        this.heading = 'Recommended Settings';
        this.subheading= 'Recommended options are already enabled for you... Go on and tweak it yourself.';
      }
      if (this.count === 4) {
        this.loading = true;

        this.saveRun();
        this.message = 'Waiting for your First Job....';
        this.loading_header = 'Running First Job';
        this.heading = 'Congratulations';
        this.subheading= 'First RapidLoad job is a success. Your page speed has increased by ' + this.stats.reduction +'%';
      }
    },

    progress(){
      let i = 100;
      const intervalId = setInterval(() => {
        if (this.stats.reduction > i) {
          clearInterval(intervalId);
        } else {
          document.getElementById("progress").style.width = i + '%';
          i--;
        }
      }, 50);
    },


      disconnect_license(){
        axios.post(window.uucss_global.ajax_url + '?action=uucss_license', {disconnect:true, nonce: window.uucss_global.nonce},{
          headers: {
            'Content-Type':'multipart/form-data'
          }
        })
      },
      update_license(){
        axios.post(window.uucss_global.ajax_url + '?action=uucss_license&nonce='+ window.uucss_global.nonce).then((response)=>{
          if(response.data?.data){
            //console.log(response.data.data)
            if(response.data?.data?.licensedDomain){
              this.error= false;
              const licenseData = []
              licenseData.push(response.data?.data)
              localStorage.setItem('rapidLoadLicense', JSON.stringify(licenseData))
              this.license_information.name = response.data?.data?.name
              this.license_information.exp_date = new Date(response.data?.data?.next_billing * 1000)
              this.license_information.license = response.data?.data?.plan
              this.license_information.licensed_domain = response.data?.data?.licensedDomain
            }
          }
        }).catch(error =>{
          this.errorMessage = error.message;
          console.error("There was an error!", error);
          this.error= true;
          this.loading=false;
        });
      },


    update(toggle, module) {
    //  console.log(module + " : " + toggle);
      if(!this.license_information.licensed_domain){
        return;
      }
      if (module === 'css' && toggle) {
        toggle = "on";
      } else if (!toggle) {
        toggle = "on";
      } else {
        toggle = "off";
      }

      // if (this.axios_request) {
      //   this.axios_request.cancel("");
      //   this.axios_request = null;
      // }
      // this.axios_request = axios.CancelToken.source();
      // const cancelToken = this.axios_request.token;

      axios.post(window.uucss_global.ajax_url + '?action=activate_module&module=' + module + '&active=' + toggle + '&onboard=1&nonce='+window.uucss_global.nonce)
          .then(response => {
            response.data
            window.uucss_global.active_modules = response.data.data
            // this.error= false;

            this.items.map((item) => {
              item.status = response.data.data[item.id].status === "on";
            })
          })
          .catch(error =>{
            this.errorMessage = error.message;
            console.error("There was an error!", error);
            // this.error= true;
            this.loading=false;
          });
    },

    dashboard(){
      window.location.href = '/wp-admin/options-general.php?page=rapidload';
    },
    saveRun(){
      Promise.all(this.items.map((item, index) => {
        return new Promise(resolve => {
          setTimeout(() => {
            this.update(item.status, item.id);
           // console.log(item.id + ': ' + item.status);
            resolve();
          }, index * 5000);
        });
      })).then(() => {
        this.runFirstJob();
      });
    },
    runFirstJob(){

      axios.get(window.uucss_global.ajax_url + '?action=run_first_job&nonce='+ window.uucss_global.nonce)
          .then(response => {
           response.data.data;
            this.rapidloadConfigured();
            this.error= false;
          })
          .catch(error =>{
            this.errorMessage = error.message;
            console.error("There was an error!", error);
            this.error= true;
            this.loading=false;
          });
    },
    rapidloadConfigured(){
     // console.log("rapidload config");
      axios.get(window.uucss_global.ajax_url + '?action=rapidload_configured&nonce='+ window.uucss_global.nonce)
          .then(response => {
           // console.log(response.data?.data);
            if(response.data?.data?.uucss_first_job_done){
              const data = response.data?.data?.uucss_first_job.meta.stats;
              this.stats.reduction  = data.reduction;
              this.stats.before  = data.before;
              this.stats.after  = data.after;
              this.loading = false;
              this.subheading= 'You have successfully completed your optimization. Your page speed increased by '+ this.stats.reduction + '%' ;
              this.progress();
              this.error= false;
            }else{
              setTimeout(() =>{
                this.rapidloadConfigured();
                this.rapidload_config ++;
                if(this.rapidload_config > 10){
                  this.error= true;
                  this.loading=false;
                }
              }, 3000);
            }
          })
          .catch(error =>{
            this.errorMessage = error.message;
            console.error("There was an error!", error);
            this.error= true;
            this.loading=false;
          });
    },

  },

  data() {
    return {
      count: 1,
      image1: '<svg width="396" height="244" viewBox="0 0 396 244" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_435_1141)"><path d="M330.25 231.067H315.639V244H330.25V231.067Z" fill="#F0F0F0"/><path d="M396 108.636C396.005 128.137 390.777 147.28 380.864 164.055C370.952 180.831 356.721 194.62 339.666 203.977C338.699 204.507 337.719 205.025 336.735 205.525C333.085 207.391 329.33 209.044 325.488 210.474C323.959 211.049 322.413 211.586 320.852 212.086C320.701 212.138 320.547 212.189 320.396 212.233C305.103 217.102 288.922 218.494 273.026 216.308C257.13 214.123 241.919 208.414 228.496 199.597C226.694 198.416 224.931 197.183 223.206 195.898C222.231 195.17 221.268 194.428 220.319 193.665C217.634 191.527 215.056 189.261 212.583 186.867C202.08 176.746 193.726 164.598 188.025 151.153C182.324 137.709 179.394 123.246 179.412 108.636C179.412 48.6362 227.895 0 287.706 0C347.517 0 396 48.6362 396 108.636Z" fill="#F2F2F2"/><path d="M313.568 159.333L311.131 168.593L320.4 212.233C295.484 220.104 268.575 218.716 244.594 208.323L251.827 177.883L252.068 161.372L252.854 106.912L253.052 106.808H253.09L271.526 97.3241L303.327 96.5266L327.061 108.123L326.881 108.8L313.568 159.333Z" fill="#3F3D56"/><path d="M326.571 238.892C325.247 237.309 324.603 235.262 324.782 233.203C324.961 231.144 325.948 229.241 327.525 227.912C327.875 227.615 328.25 227.351 328.647 227.123L323.49 199.916L336.735 205.451L339.605 230.455C340.445 232.177 340.626 234.148 340.114 235.995C339.603 237.841 338.435 239.436 336.831 240.477C335.226 241.519 333.297 241.934 331.408 241.645C329.52 241.356 327.802 240.382 326.58 238.909L326.571 238.892Z" fill="#9E616A"/><path d="M322.304 108.959L325.699 107.847C325.699 107.847 336.477 114.788 335.454 131.557C335.454 131.557 335.858 140.24 335.454 146.016C335.024 152.647 340.942 218.496 340.942 218.496H321.737L313.503 158.867L322.304 108.959Z" fill="#3F3D56"/><path d="M311.131 66.7465C311.131 71.1213 309.838 75.3979 307.415 79.0354C304.992 82.673 301.548 85.5081 297.519 87.1823C293.49 88.8564 289.056 89.2945 284.779 88.441C280.502 87.5875 276.573 85.4808 273.489 82.3873C270.406 79.2939 268.305 75.3526 267.455 71.0618C266.604 66.771 267.041 62.3235 268.709 58.2817C270.378 54.2399 273.205 50.7853 276.831 48.3548C280.457 45.9243 284.72 44.627 289.081 44.627C291.97 44.6196 294.831 45.1832 297.503 46.2854C300.174 47.3877 302.603 49.0071 304.651 51.0511C306.699 53.0951 308.325 55.5238 309.436 58.1983C310.548 60.8729 311.124 63.7409 311.131 66.6387V66.7465Z" fill="#9E616A"/><path d="M267.117 37.0354C269.695 31.4657 274.697 32.5649 279.072 34.4488C284.607 33.2159 289.872 29.53 295.832 31.7114C301.711 40.2902 321.444 37.764 317.242 51.7314C317.242 55.0767 323.516 53.1282 322.398 58.629C325.725 69.1693 310.392 89.1333 301.591 84.9258C303.769 80.9252 308.741 71.8377 301.199 70.9324C284.977 86.0768 299.523 42.0965 279.141 54.8871C272.411 61.056 263.172 43.2346 267.117 37.0354Z" fill="#2F2E41"/><path d="M300.86 214.474L265.66 207.478L274.685 161.781C287.139 166.509 298.87 168.841 309.88 168.778C300.263 182.918 295.892 198.119 300.86 214.474Z" fill="#E4E4E4"/><path d="M295.742 217.156L260.546 210.163C257.654 189.471 260.28 173.861 269.571 164.467C282.025 169.192 293.756 171.524 304.766 171.464C298.952 185.999 295.892 201.495 295.742 217.156Z" fill="#7F54B3"/><path d="M272.42 204.425C272.295 203.41 271.972 202.429 271.469 201.538C270.966 200.648 270.293 199.865 269.488 199.236C268.684 198.607 267.763 198.143 266.78 197.87C265.796 197.598 264.769 197.523 263.757 197.649C263.303 197.704 262.856 197.8 262.42 197.937L246.09 175.62L241.083 189.117L257.371 208.241C258.05 210.038 259.364 211.522 261.063 212.411C262.763 213.299 264.728 213.53 266.586 213.059C268.444 212.587 270.064 211.447 271.138 209.855C272.213 208.263 272.666 206.331 272.411 204.425H272.42Z" fill="#9E616A"/><path d="M257.766 108.106L254.805 106.101C254.805 106.101 237.186 107.748 233.559 124.155C233.559 124.155 230.907 134.015 229.691 139.675C229.064 142.585 220.714 170.714 220.714 170.714L249.029 201.753L256.765 190.113L249.029 170.714L257.766 108.106Z" fill="#3F3D56"/><path d="M14.6111 53.68H0V66.6129H14.6111V53.68Z" fill="#7F54B3"/><path d="M45.982 105.411H31.3708V118.344H45.982V105.411Z" fill="#7F54B3"/><path d="M68.7581 193.786H54.147V206.719H68.7581V193.786Z" fill="#7F54B3"/><path d="M54.2546 23.9905C54.0401 23.9905 53.8278 24.0328 53.6297 24.1152C53.4315 24.1975 53.2515 24.3181 53.0999 24.4703C52.9482 24.6224 52.828 24.803 52.7459 25.0017C52.6638 25.2005 52.6216 25.4135 52.6216 25.6286C52.6216 25.8437 52.6638 26.0568 52.7459 26.2555C52.828 26.4543 52.9482 26.6349 53.0999 26.787C53.2515 26.9391 53.4315 27.0598 53.6297 27.1421C53.8278 27.2244 54.0401 27.2668 54.2546 27.2668H173.486C173.919 27.2668 174.334 27.0942 174.64 26.787C174.947 26.4798 175.119 26.0631 175.119 25.6286C175.119 25.1942 174.947 24.7775 174.64 24.4703C174.334 24.163 173.919 23.9905 173.486 23.9905H54.2546Z" fill="#E4E4E4"/><path d="M54.2546 33.8194C54.0401 33.8194 53.8278 33.8618 53.6297 33.9441C53.4315 34.0265 53.2515 34.1471 53.0999 34.2992C52.9482 34.4514 52.828 34.6319 52.7459 34.8307C52.6638 35.0294 52.6216 35.2425 52.6216 35.4576C52.6216 35.6727 52.6638 35.8857 52.7459 36.0845C52.828 36.2832 52.9482 36.4638 53.0999 36.616C53.2515 36.7681 53.4315 36.8887 53.6297 36.9711C53.8278 37.0534 54.0401 37.0958 54.2546 37.0958H129.626C129.841 37.0958 130.053 37.0534 130.251 36.9711C130.45 36.8887 130.63 36.7681 130.781 36.616C130.933 36.4638 131.053 36.2832 131.135 36.0845C131.217 35.8857 131.259 35.6727 131.259 35.4576C131.259 35.2425 131.217 35.0294 131.135 34.8307C131.053 34.6319 130.933 34.4514 130.781 34.2992C130.63 34.1471 130.45 34.0265 130.251 33.9441C130.053 33.8618 129.841 33.8194 129.626 33.8194H54.2546Z" fill="#E4E4E4"/><path d="M38.7839 141.68C38.3508 141.68 37.9354 141.852 37.6292 142.159C37.3229 142.467 37.1509 142.883 37.1509 143.318C37.1509 143.752 37.3229 144.169 37.6292 144.476C37.9354 144.783 38.3508 144.956 38.7839 144.956H158.015C158.448 144.956 158.863 144.783 159.17 144.476C159.476 144.169 159.648 143.752 159.648 143.318C159.648 142.883 159.476 142.467 159.17 142.159C158.863 141.852 158.448 141.68 158.015 141.68H38.7839Z" fill="#E4E4E4"/><path d="M38.7839 151.508C38.3508 151.508 37.9354 151.681 37.6292 151.988C37.3229 152.295 37.1509 152.712 37.1509 153.147C37.1509 153.581 37.3229 153.998 37.6292 154.305C37.9354 154.612 38.3508 154.785 38.7839 154.785H114.156C114.589 154.785 115.004 154.612 115.31 154.305C115.617 153.998 115.789 153.581 115.789 153.147C115.789 152.712 115.617 152.295 115.31 151.988C115.004 151.681 114.589 151.508 114.156 151.508H38.7839Z" fill="#E4E4E4"/><path d="M106.683 225.743C106.249 225.743 105.834 225.916 105.528 226.223C105.222 226.53 105.05 226.947 105.05 227.381C105.05 227.816 105.222 228.232 105.528 228.54C105.834 228.847 106.249 229.019 106.683 229.019H225.914C226.347 229.019 226.762 228.847 227.068 228.54C227.375 228.232 227.547 227.816 227.547 227.381C227.547 226.947 227.375 226.53 227.068 226.223C226.762 225.916 226.347 225.743 225.914 225.743H106.683Z" fill="#E4E4E4"/><path d="M106.683 235.572C106.249 235.572 105.834 235.745 105.528 236.052C105.222 236.359 105.05 236.776 105.05 237.21C105.05 237.645 105.222 238.061 105.528 238.369C105.834 238.676 106.249 238.848 106.683 238.848H182.054C182.488 238.848 182.903 238.676 183.209 238.369C183.515 238.061 183.687 237.645 183.687 237.21C183.687 236.776 183.515 236.359 183.209 236.052C182.903 235.745 182.488 235.572 182.054 235.572H106.683Z" fill="#E4E4E4"/><path d="M6.87575 60.2025C10.3756 59.4311 13.6865 57.9659 16.614 55.8931C19.5415 53.8203 22.0267 51.1815 23.9235 48.1318C24.9967 46.3962 25.8621 44.5398 26.5019 42.6009C26.5589 42.4385 26.5493 42.2601 26.4751 42.1049C26.401 41.9496 26.2684 41.8303 26.1066 41.7731C25.9447 41.716 25.7669 41.7257 25.6121 41.8C25.4574 41.8744 25.3385 42.0074 25.2815 42.1698C24.1831 45.4133 22.4489 48.4036 20.181 50.9645C17.913 53.5254 15.1571 55.6052 12.0756 57.0813C10.34 57.9127 8.51231 58.5349 6.6308 58.9351C5.81859 59.1075 6.05495 60.3749 6.87145 60.2025H6.87575Z" fill="#3F3D56"/><path d="M19.4328 45.0753L26.4031 41.1394C26.5106 41.0791 26.8329 40.8463 26.9231 40.8765C26.8329 40.8765 26.9231 40.9196 26.9231 41.0015C26.9231 41.0834 26.9231 41.2257 26.9231 41.3377C26.9489 42.0146 26.9618 42.7 26.979 43.3811L27.0864 47.2955C27.1122 48.1189 28.3971 48.218 28.3756 47.386L28.2467 42.7862C28.2209 41.7343 28.4831 39.3935 26.7813 39.5961C26.1668 39.6694 25.5995 40.1005 25.0623 40.3979L22.9394 41.5964L18.8483 43.9071C18.1264 44.3382 18.6764 45.4849 19.4027 45.0753H19.4328Z" fill="#3F3D56"/><path d="M38.8098 111.83C35.3443 112.743 32.0958 114.342 29.2552 116.533C26.4147 118.723 24.0394 121.462 22.2692 124.587C21.266 126.355 20.4741 128.236 19.9099 130.191C19.87 130.354 19.8951 130.527 19.9798 130.672C20.0646 130.817 20.2024 130.923 20.364 130.968C20.5256 131.013 20.6982 130.993 20.8453 130.912C20.9924 130.831 21.1023 130.696 21.1518 130.536C22.1254 127.251 23.7444 124.195 25.9135 121.547C28.0826 118.899 30.7579 116.714 33.7819 115.12C35.4846 114.222 37.2879 113.532 39.1536 113.063C39.9572 112.856 39.6134 111.611 38.8098 111.813V111.83Z" fill="#3F3D56"/><path d="M26.8543 127.453L20.116 131.622C20.0042 131.691 19.8882 131.769 19.7679 131.833C19.6475 131.898 19.5272 131.894 19.6046 131.971C19.5014 131.868 19.5272 131.488 19.5186 131.372L19.3854 129.419L19.1233 125.509C19.0674 124.681 17.7782 124.677 17.834 125.509L18.1435 130.096C18.2122 131.144 18.0188 133.303 19.6132 133.217C20.3265 133.178 21.0012 132.592 21.5814 132.234L23.5066 131.053L27.5032 128.579C28.2122 128.147 27.5633 127.027 26.8543 127.462V127.453Z" fill="#3F3D56"/><path d="M60.9757 199.731C64.2803 200.597 67.3784 202.119 70.0872 204.206C72.7959 206.293 75.0605 208.904 76.7471 211.883C77.699 213.561 78.4478 215.347 78.9774 217.203C79.0269 217.364 79.1369 217.499 79.284 217.58C79.4311 217.66 79.6037 217.68 79.7653 217.635C79.9269 217.591 80.0646 217.484 80.1494 217.339C80.2342 217.194 80.2593 217.022 80.2194 216.858C79.2024 213.413 77.5092 210.206 75.2391 207.426C72.9691 204.646 70.168 202.349 67.0006 200.671C65.1994 199.719 63.2925 198.984 61.3195 198.481C60.5158 198.278 60.1721 199.524 60.9757 199.731Z" fill="#3F3D56"/><path d="M72.6258 215.22L76.6224 217.695L78.5476 218.884C79.1278 219.246 79.8025 219.828 80.5158 219.867C82.1102 219.953 81.9168 217.794 81.9855 216.746L82.295 212.159C82.3508 211.327 81.0616 211.332 81.0057 212.159L80.7436 216.069L80.6147 217.936C80.6147 218.083 80.6448 218.501 80.5244 218.621C80.6104 218.535 80.5244 218.578 80.4256 218.518L79.9959 218.272L73.2576 214.104C72.5485 213.672 71.8996 214.785 72.6086 215.22H72.6258Z" fill="#3F3D56"/><path d="M83.8009 239.878C87.8846 239.878 91.1951 236.557 91.1951 232.459C91.1951 228.362 87.8846 225.041 83.8009 225.041C79.7172 225.041 76.4067 228.362 76.4067 232.459C76.4067 236.557 79.7172 239.878 83.8009 239.878Z" fill="#5CC871"/><path d="M29.2222 37.226H21.2849L29.2222 21.8446L37.1595 37.226H29.2222Z" fill="#EB483F"/><path d="M25.4405 141.68H12.3765V154.785H25.4405V141.68Z" fill="#F4AD4E"/></g><defs><clipPath id="clip0_435_1141"><rect width="396" height="244" fill="white"/></clipPath></defs></svg>',
      image2: '<svg width="277" height="231" viewBox="0 0 277 231" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_440_1196)"><path d="M69.8703 219.665C69.5645 219.68 69.2616 219.6 69.0028 219.435C68.744 219.271 68.5417 219.031 68.4235 218.747C68.3053 218.463 68.2769 218.149 68.3422 217.848C68.4074 217.547 68.5632 217.274 68.7883 217.065C68.8254 216.916 68.8543 216.808 68.8915 216.65C68.5988 215.903 68.0909 215.26 67.4329 214.805C66.7749 214.35 65.9968 214.103 65.1982 214.095C64.3996 214.088 63.617 214.32 62.9505 214.763C62.2841 215.205 61.7643 215.838 61.4576 216.579C59.69 220.733 57.402 225.052 58.5377 229.638C51.0212 213.614 53.5818 193.678 64.6913 179.971C67.7599 178.273 70.2503 175.249 70.8863 171.739C69.3664 172.254 67.4708 171.012 68.6148 169.401L70.1057 167.561C64.3238 161.376 57.4515 171.095 63.8075 179.444C61.7279 182.064 59.9283 184.897 58.4386 187.896C58.7808 184.713 58.369 181.493 57.2368 178.501C56.0845 175.71 53.9328 173.363 52.033 170.95C49.7285 168.014 44.9791 169.368 44.6693 173.097C46.7963 173.799 47.073 176.894 44.6404 177.317C45.2764 184.253 49.7822 190.608 55.9854 193.665C53.696 200.133 52.802 207.017 53.3629 213.859C52.2684 205.864 43.7318 203.92 37.7682 200.742C37.3884 200.498 36.9462 200.37 36.4955 200.375C36.0447 200.379 35.6049 200.514 35.2294 200.765C34.854 201.016 34.5591 201.371 34.3808 201.787C34.2024 202.204 34.1481 202.663 34.2247 203.11C35.0483 203.446 35.8368 203.864 36.5788 204.356C36.932 204.589 37.2042 204.927 37.3572 205.323C37.5102 205.719 37.5365 206.153 37.4323 206.564C37.3281 206.976 37.0988 207.345 36.7762 207.619C36.4536 207.893 36.054 208.059 35.633 208.094C38.6396 215.57 46.4163 220.604 54.3995 220.575C55.1637 223.927 56.2709 227.191 57.7035 230.315H69.5523C69.5936 230.182 69.6349 230.045 69.6721 229.899C68.5752 229.97 67.4739 229.904 66.3929 229.704C69.2838 226.249 71.5388 224.483 69.8497 219.661L69.8703 219.665Z" fill="#F2F2F2"/><path d="M175.519 219.665C175.824 219.68 176.127 219.6 176.386 219.435C176.645 219.271 176.847 219.031 176.965 218.747C177.084 218.463 177.112 218.149 177.047 217.848C176.982 217.547 176.826 217.274 176.601 217.065C176.564 216.916 176.535 216.808 176.497 216.65C176.79 215.903 177.298 215.26 177.956 214.805C178.614 214.35 179.392 214.103 180.191 214.095C180.989 214.088 181.772 214.32 182.438 214.763C183.105 215.205 183.625 215.838 183.931 216.579C185.699 220.733 187.991 225.052 186.851 229.638C194.368 213.614 191.807 193.678 180.702 179.971C177.629 178.273 175.139 175.249 174.507 171.739C176.027 172.254 177.922 171.012 176.782 169.401C176.287 168.786 175.783 168.176 175.292 167.561C181.073 161.376 187.946 171.095 181.59 179.444C183.666 182.066 185.466 184.899 186.959 187.896C186.612 184.713 187.024 181.492 188.16 178.501C189.309 175.71 191.464 173.363 193.36 170.95C195.669 168.014 200.414 169.368 200.728 173.097C198.597 173.799 198.32 176.894 200.757 177.317C200.117 184.253 195.611 190.608 189.408 193.665C191.699 200.132 192.593 207.017 192.03 213.859C193.129 205.864 201.661 203.92 207.625 200.742C208.004 200.496 208.447 200.367 208.899 200.37C209.35 200.373 209.791 200.509 210.167 200.76C210.543 201.011 210.838 201.367 211.016 201.785C211.194 202.202 211.247 202.663 211.168 203.11C210.346 203.445 209.559 203.863 208.818 204.356C208.465 204.589 208.193 204.926 208.04 205.322C207.887 205.717 207.86 206.151 207.964 206.563C208.068 206.974 208.296 207.343 208.618 207.617C208.94 207.892 209.339 208.058 209.76 208.094C206.754 215.57 198.981 220.604 190.994 220.575C190.233 223.929 189.126 227.193 187.69 230.315H175.808C175.766 230.182 175.729 230.045 175.688 229.899C176.785 229.97 177.886 229.904 178.967 229.704C176.076 226.249 173.821 224.483 175.51 219.661L175.519 219.665Z" fill="#F2F2F2"/><path d="M179.909 221.435L174.804 222.602L167.899 203.359L175.428 201.64L179.909 221.435Z" fill="#FFB6B6"/><path d="M181.301 226.747L165.607 230.34L165.562 230.14C165.194 228.511 165.485 226.801 166.37 225.386C167.255 223.972 168.662 222.969 170.282 222.598L172.653 219.757L178.493 220.741L179.864 220.425L181.301 226.747Z" fill="#2F2E41"/><path d="M262.227 127.655L265.031 132.095L249.329 145.095L245.187 138.537L262.227 127.655Z" fill="#FFB6B6"/><path d="M266.737 124.557L275.364 138.217L275.191 138.329C273.788 139.224 272.09 139.521 270.469 139.157C268.848 138.792 267.437 137.796 266.547 136.385L263.074 135.094L262.016 129.233L261.265 128.041L266.737 124.557Z" fill="#2F2E41"/><path d="M99.5569 80.1524L98.3179 72.8051L117.481 64.1037L121.611 56.7355C121.477 56.0885 121.524 55.4169 121.746 54.7948C121.967 54.1728 122.356 53.6246 122.868 53.2108C123.381 52.797 123.997 52.5337 124.649 52.45C125.301 52.3663 125.963 52.4654 126.562 52.7365C127.162 53.0076 127.675 53.44 128.045 53.986C128.415 54.532 128.628 55.1704 128.66 55.8304C128.692 56.4905 128.542 57.1467 128.227 57.7264C127.911 58.3061 127.443 58.7868 126.872 59.1154L120.054 69.6983L99.5569 80.1524Z" fill="#A0616A"/><path d="M93.7373 74.1466L102.365 69.7108L104.649 78.3374L98.6561 82.8065L93.7373 74.1466Z" fill="#7F54B3"/><path d="M74.3721 220.766H79.5882L82.0703 200.526H74.3721V220.766Z" fill="#A0616A"/><path d="M81.3229 221.24V217.68L79.9518 217.767L74.3681 218.1L73.0754 218.178L72.0884 230.09L72.0347 230.73H75.7516L75.8714 230.099L76.4083 227.212L77.8001 230.099L78.1057 230.73H87.9267C88.511 230.726 89.0701 230.49 89.4828 230.074C89.8956 229.658 90.1289 229.096 90.1321 228.508C90.5327 226.556 82.3637 222.353 81.3229 221.24Z" fill="#2F2E41"/><path d="M12.4395 140.443L11.2212 145.548L30.2148 152.692L32.0072 145.162L12.4395 140.443Z" fill="#A0616A"/><path d="M10.7709 147.134L14.2112 147.965L14.4507 146.603L15.4295 141.066L15.6525 139.783L4.36536 136.045L3.75826 135.845L2.88684 139.463L3.47329 139.729L6.13298 140.925L3.02313 141.61L2.33755 141.76L0.0578208 151.379C-0.0747466 151.954 0.0246813 152.558 0.334323 153.06C0.643965 153.561 1.13858 153.919 1.7098 154.054C3.47742 154.901 9.45346 147.895 10.7709 147.134Z" fill="#2F2E41"/><path d="M82.4379 89.78L75.7226 86.6235L62.3291 102.921L54.1725 104.998C53.5871 104.697 52.9304 104.565 52.2749 104.616C51.6195 104.667 50.9908 104.899 50.4585 105.287C49.9261 105.675 49.5109 106.204 49.2586 106.814C49.0064 107.425 48.927 108.094 49.0292 108.747C49.1314 109.4 49.4112 110.012 49.8377 110.515C50.2642 111.018 50.8208 111.393 51.4459 111.598C52.071 111.802 52.7402 111.829 53.3796 111.676C54.0189 111.522 54.6035 111.193 55.0687 110.726L67.0125 106.909L82.4379 89.78Z" fill="#A0616A"/><path d="M177.65 29.4393C176.226 29.4393 174.834 29.0145 173.65 28.2187C172.466 27.4229 171.543 26.2917 170.998 24.9684C170.454 23.6451 170.312 22.1891 170.59 20.7846C170.869 19.38 171.555 18.0901 172.562 17.078C173.57 16.0659 174.853 15.3771 176.25 15.0987C177.647 14.8203 179.095 14.9648 180.41 15.514C181.725 16.0632 182.849 16.9924 183.639 18.184C184.429 19.3756 184.85 20.7761 184.848 22.2083C184.848 23.1584 184.661 24.0991 184.299 24.9768C183.937 25.8544 183.407 26.6517 182.738 27.3231C182.07 27.9946 181.276 28.5271 180.403 28.8902C179.53 29.2533 178.594 29.4399 177.65 29.4393ZM177.65 15.7954C176.389 15.7954 175.158 16.1712 174.11 16.8752C173.062 17.5792 172.245 18.5798 171.763 19.7506C171.28 20.9214 171.154 22.2098 171.399 23.4529C171.645 24.6959 172.251 25.8378 173.142 26.7343C174.033 27.6307 175.168 28.2414 176.404 28.4892C177.64 28.7369 178.921 28.6106 180.085 28.1262C181.25 27.6418 182.246 26.821 182.946 25.7676C183.647 24.7143 184.021 23.4756 184.022 22.2083C184.021 20.5085 183.349 18.8787 182.155 17.6764C180.96 16.4741 179.34 15.7976 177.65 15.7954Z" fill="#E6E6E6"/><path d="M177.142 24.9287H177.097C176.969 24.9222 176.844 24.888 176.731 24.8285C176.617 24.769 176.518 24.6856 176.44 24.584L175.308 23.1179C175.166 22.9317 175.102 22.6965 175.13 22.4633C175.159 22.23 175.278 22.0175 175.461 21.8718L175.502 21.8386C175.688 21.6961 175.921 21.6325 176.153 21.6612C176.385 21.6899 176.596 21.8088 176.741 21.9923C176.847 22.1281 177.002 22.2161 177.173 22.2371C177.343 22.2582 177.515 22.2104 177.65 22.1044C177.675 22.0845 177.699 22.0622 177.72 22.038L180.025 19.5958C180.186 19.4293 180.406 19.3323 180.637 19.3253C180.868 19.3183 181.093 19.4019 181.264 19.5584L181.301 19.5958C181.467 19.7581 181.563 19.9793 181.569 20.212C181.575 20.4448 181.491 20.6708 181.334 20.8418L177.761 24.6339C177.683 24.7218 177.588 24.7932 177.481 24.8438C177.375 24.8945 177.26 24.9233 177.142 24.9287Z" fill="#E6E6E6"/><path d="M141.72 117.076C140.295 117.076 138.903 116.651 137.719 115.856C136.535 115.06 135.613 113.929 135.068 112.605C134.524 111.282 134.381 109.826 134.66 108.421C134.938 107.017 135.625 105.727 136.632 104.715C137.64 103.703 138.923 103.014 140.32 102.736C141.717 102.457 143.165 102.602 144.48 103.151C145.795 103.7 146.919 104.629 147.709 105.821C148.499 107.013 148.92 108.413 148.918 109.845C148.915 111.763 148.155 113.602 146.805 114.958C145.456 116.313 143.627 117.075 141.72 117.076ZM141.72 103.432C140.459 103.432 139.227 103.808 138.18 104.512C137.132 105.216 136.315 106.217 135.832 107.388C135.35 108.558 135.224 109.847 135.469 111.09C135.715 112.333 136.321 113.475 137.212 114.371C138.103 115.268 139.238 115.878 140.474 116.126C141.71 116.374 142.991 116.247 144.155 115.763C145.32 115.279 146.315 114.458 147.016 113.405C147.717 112.351 148.091 111.112 148.092 109.845C148.09 108.146 147.418 106.517 146.223 105.316C145.029 104.115 143.409 103.439 141.72 103.436V103.432Z" fill="#E6E6E6"/><path d="M141.211 112.566H141.166C141.038 112.559 140.913 112.525 140.8 112.465C140.687 112.406 140.588 112.322 140.509 112.221L139.378 110.755C139.235 110.569 139.171 110.333 139.2 110.1C139.228 109.867 139.347 109.654 139.53 109.509L139.572 109.475C139.757 109.333 139.991 109.269 140.222 109.298C140.454 109.327 140.665 109.446 140.811 109.629C140.917 109.765 141.072 109.853 141.242 109.874C141.412 109.895 141.584 109.847 141.719 109.741C141.745 109.721 141.768 109.699 141.79 109.675L144.094 107.233C144.255 107.066 144.475 106.969 144.706 106.962C144.937 106.955 145.162 107.039 145.333 107.195L145.37 107.233C145.536 107.395 145.632 107.616 145.639 107.849C145.645 108.082 145.56 108.308 145.403 108.479L141.831 112.271C141.752 112.359 141.657 112.43 141.551 112.481C141.444 112.531 141.329 112.56 141.211 112.566Z" fill="#E6E6E6"/><path d="M62.8372 53.9652C61.414 53.9652 60.0227 53.5409 58.8392 52.746C57.6557 51.9511 56.733 50.8212 56.1878 49.4991C55.6426 48.177 55.4993 46.722 55.7761 45.3181C56.0528 43.9141 56.7372 42.6241 57.7427 41.6112C58.7482 40.5983 60.0297 39.9078 61.4252 39.6271C62.8208 39.3463 64.2678 39.4879 65.5834 40.0339C66.8989 40.5799 68.024 41.5059 68.8165 42.6948C69.609 43.8836 70.0332 45.2821 70.0357 46.7134C70.0379 47.6653 69.8532 48.6082 69.4924 49.4882C69.1316 50.3682 68.6016 51.168 67.9329 51.8417C67.2642 52.5153 66.4698 53.0497 65.5954 53.4141C64.721 53.7785 63.7837 53.9658 62.8372 53.9652ZM62.8372 40.3213C61.5761 40.3213 60.3434 40.6976 59.2951 41.4025C58.2468 42.1074 57.43 43.1093 56.9482 44.2813C56.4663 45.4533 56.3411 46.7428 56.5883 47.9864C56.8356 49.23 57.4441 50.3719 58.337 51.2675C59.2299 52.1631 60.3669 52.7722 61.6041 53.0176C62.8413 53.263 64.1232 53.1337 65.2873 52.6461C66.4514 52.1585 67.4455 51.3344 68.1438 50.2784C68.842 49.2223 69.213 47.9816 69.2097 46.7134C69.2075 45.0143 68.5354 43.3855 67.3408 42.1841C66.1462 40.9828 64.5266 40.3069 62.8372 40.3047V40.3213Z" fill="#E6E6E6"/><path d="M62.329 49.4546H62.2836C62.1559 49.4481 62.0311 49.4139 61.9178 49.3544C61.8045 49.2949 61.7052 49.2115 61.6269 49.1099L60.4953 47.6437C60.3526 47.4576 60.2886 47.2224 60.3172 46.9891C60.3458 46.7559 60.4647 46.5434 60.6481 46.3977L60.6894 46.3645C60.8749 46.222 61.1085 46.1583 61.3401 46.187C61.5717 46.2158 61.7829 46.3346 61.9284 46.5181C62.0343 46.6539 62.1894 46.742 62.3597 46.763C62.53 46.784 62.7016 46.7363 62.837 46.6303C62.8623 46.6103 62.8858 46.5881 62.9072 46.5638L65.2117 44.1216C65.3731 43.9551 65.5926 43.8582 65.8237 43.8512C66.0548 43.8442 66.2796 43.9278 66.4507 44.0843L66.4879 44.1216C66.6538 44.284 66.7501 44.5051 66.7563 44.7379C66.7625 44.9706 66.678 45.1966 66.5209 45.3677L62.9485 49.1597C62.8698 49.2477 62.7745 49.3191 62.6682 49.3697C62.5618 49.4203 62.4465 49.4492 62.329 49.4546Z" fill="#E6E6E6"/><path d="M120.458 143.99C103.769 143.99 84.5898 125.366 67.6198 134.213C16.235 161.011 23.3096 116.171 8.56152 99.499L9.04886 98.5188C25.3374 113.205 45.6733 125.159 67.8594 133.079C87.9062 140.236 108.106 143.554 126.265 142.678L126.298 143.853C124.361 143.945 122.424 143.99 120.458 143.99Z" fill="#F2F2F2"/><path d="M97.566 32.54C99.4934 32.54 101.056 30.4331 101.056 27.8342C101.056 25.2353 99.4934 23.1284 97.566 23.1284C95.6386 23.1284 94.0762 25.2353 94.0762 27.8342C94.0762 30.4331 95.6386 32.54 97.566 32.54Z" fill="#E6E6E6"/><path d="M137.862 91.4497C136.263 92.5213 134.632 89.9752 136.259 88.9577C137.887 87.9401 139.485 90.428 137.862 91.4497Z" fill="#E6E6E6"/><path d="M128.681 18.286C131.19 18.286 133.224 16.2405 133.224 13.7173C133.224 11.194 131.19 9.14851 128.681 9.14851C126.172 9.14851 124.138 11.194 124.138 13.7173C124.138 16.2405 126.172 18.286 128.681 18.286Z" fill="#5CC871"/><path opacity="0.3" d="M125.546 83.9279L151.396 7.99946L123.019 83.0183C122.874 83.1959 122.774 83.4059 122.727 83.6305C122.68 83.8551 122.688 84.0877 122.749 84.3089C122.81 84.5301 122.923 84.7332 123.078 84.9013C123.233 85.0694 123.427 85.1976 123.642 85.2749C123.856 85.3522 124.087 85.3765 124.313 85.3457C124.539 85.3149 124.754 85.2299 124.941 85.0979C125.128 84.9659 125.28 84.7907 125.386 84.5871C125.491 84.3835 125.546 84.1574 125.546 83.9279Z" fill="#F0F0F0"/><path d="M118.476 118.783C120.917 118.783 122.895 116.794 122.895 114.339C122.895 111.885 120.917 109.895 118.476 109.895C116.036 109.895 114.057 111.885 114.057 114.339C114.057 116.794 116.036 118.783 118.476 118.783Z" fill="#F2F2F2"/><path d="M75.6691 116.034C75.6691 116.034 64.6463 123.252 67.562 128.045C67.6611 128.212 54.3999 145.826 54.3999 145.826L29.3641 144.227L28.4927 152.654L50.7944 159.15C50.7944 159.15 56.2501 163.179 60.4626 158.735C64.6752 154.291 78.7046 140.701 78.7046 140.701L79.3819 168.147L72.3115 206.179L82.8304 205.511L93.0645 167.357L96.8434 124.137L75.6691 116.034Z" fill="#2F2E41"/><path d="M83.5158 72.7303L78.8778 76.2607L73.5956 87.5953L78.6755 94.5315C78.6755 94.5315 82.9458 101.979 76.1108 109.189C69.2757 116.399 64.0224 124.1 69.5029 123.826C74.9833 123.551 97.1405 134.89 97.2892 125.599C97.4378 116.308 97.7269 109.189 97.7269 109.189L103.542 94.3654C103.542 94.3654 107.003 85.5228 104.57 82.8729C102.138 80.2231 98.8875 76.8463 98.8875 76.8463L92.961 70.8903H87.6168L83.5158 72.7303Z" fill="#7F54B3"/><path d="M92.164 50.9457C102.559 56.8975 94.0266 72.5932 83.4374 67.0028C73.0423 61.0551 81.5789 45.3594 92.164 50.9457Z" fill="#A0616A"/><path d="M97.7227 54.2476C96.9958 55.1988 95.476 54.7502 92.4942 55.4314C92.5008 54.4158 92.3843 53.4032 92.1473 52.416C91.9236 53.6379 91.4373 54.796 90.7224 55.8093C88.1371 56.1001 91.3089 64.004 89.9832 69.8188C88.2734 57.5538 84.6844 60.7685 86.4975 63.1982C87.658 64.7558 86.8857 69.4283 83.4 67.09C77.6553 69.8395 69.4656 56.1914 78.5391 49.791C78.378 46.3313 82.2065 45.7872 84.5647 46.8504C90.2847 42.56 96.8182 48.0549 97.7227 54.2476Z" fill="#2F2E41"/><path d="M71.0516 45.2971C68.7388 59.6097 56.3324 42.6638 50.501 56.748C48.6673 61.8484 51.8143 65.4951 53.8049 69.7315C54.2592 73.2079 49.7576 74.9731 49.2867 78.1754C49.1546 85.5186 60.9332 85.0701 64.2248 80.4349C67.6072 75.5878 63.5681 69.0836 65.6001 63.8794C68.458 56.6525 80.0838 56.5985 81.0956 48.192C79.1339 45.3843 73.86 42.1654 71.0516 45.2971Z" fill="#2F2E41"/><path d="M80.4269 46.7134C80.3525 46.7466 80.2782 46.7757 80.208 46.813C80.146 46.8463 80.08 46.8753 80.018 46.9127H79.9974C79.9148 46.8338 79.8322 46.7507 79.7413 46.6718C79.7115 46.8087 79.7115 46.9503 79.7413 47.0872V47.1329C79.8198 47.2159 79.9065 47.299 79.9932 47.3821L80.2286 47.1993C80.2755 47.1559 80.3252 47.1157 80.3773 47.0789C80.3773 46.975 80.3773 46.8546 80.4062 46.7217L80.4269 46.7134ZM82.8264 42.2568C81.0505 41.8414 80.4764 44.1839 80.303 45.3095C79.6587 41.2226 76.9742 42.5101 77.9035 45.3095C78.1982 46.1364 78.6642 46.891 79.2705 47.5233C79.3531 47.6188 79.444 47.7143 79.5389 47.8099C79.4316 48.3706 79.9726 48.2252 80.7077 47.7102C81.2492 47.3234 81.7501 46.8823 82.2028 46.3935C83.6648 44.8485 84.8046 42.7842 82.8264 42.2692V42.2568ZM82.8842 44.5577C82.3346 45.2682 81.7193 45.9246 81.0464 46.5182C80.8357 46.7092 80.6334 46.892 80.4021 47.0706C80.4021 47.1038 80.4021 47.137 80.4021 47.1661C80.4021 47.1952 80.3649 47.2408 80.3443 47.2782C80.1213 47.6936 79.8693 47.461 79.7743 47.1246L79.7454 47.0872C79.4253 46.7581 79.1478 46.3897 78.9195 45.9907C77.2675 43.1207 79.923 41.1686 79.7909 46.5265C79.7663 46.5762 79.7496 46.6294 79.7413 46.6843C79.7115 46.8211 79.7115 46.9628 79.7413 47.0996V47.1453C79.8198 47.2284 79.9065 47.3115 79.9932 47.3945L80.2286 47.2118C80.2755 47.1684 80.3252 47.1281 80.3773 47.0913C80.3773 46.9875 80.3773 46.867 80.4062 46.7341C80.5095 45.6584 80.7944 43.7271 81.3148 43.2037C82.4629 42.3191 83.9497 43.2743 82.8594 44.5827L82.8842 44.5577ZM80.4269 46.7134C80.3525 46.7466 80.2782 46.7757 80.208 46.813C80.146 46.8463 80.08 46.8753 80.018 46.9127H79.9974C79.9148 46.8338 79.8322 46.7507 79.7413 46.6718C79.7115 46.8087 79.7115 46.9503 79.7413 47.0872V47.1329C79.8198 47.2159 79.9065 47.299 79.9932 47.3821L80.2286 47.1993C80.2755 47.1559 80.3252 47.1157 80.3773 47.0789C80.3773 46.975 80.3773 46.8546 80.4062 46.7217L80.4269 46.7134Z" fill="#2F2E41"/><path d="M176.51 125.595L172.669 135.663L154.658 171.382L170.484 212.945L178.653 210.773L171.921 171.378L191.233 147.778L214.171 163.424C214.171 163.424 224.343 171.411 228.213 163.839C232.082 156.268 257.122 140.165 257.122 140.165L250.927 133.52L222.092 147.101L202.19 118.929L176.51 125.595Z" fill="#2F2E41"/><path d="M195.879 78.0965L189.561 71.2683L178.719 69.7689L165.438 79.1099L165.57 89.4602L172.136 113.853C172.136 113.853 169.634 131.376 176.621 131.202C183.609 131.028 187.417 127.522 190.25 128.236C193.083 128.951 205.188 131.974 205.944 128.805C206.7 125.636 210.784 127.904 210.607 124.897C210.429 121.89 199.576 100.213 199.576 100.213L202.273 78.5368L195.879 78.0965Z" fill="#7F54B3"/><path d="M235.895 46.6635C235.946 47.1725 235.897 47.6866 235.751 48.1766C235.604 48.6665 235.363 49.1226 235.042 49.5188C234.72 49.915 234.323 50.2435 233.875 50.4854C233.427 50.7274 232.936 50.8782 232.43 50.9291C232.203 50.9478 231.975 50.9478 231.748 50.9291L217.231 78.732L213.329 72.7095L228.196 46.4725C228.329 45.5218 228.805 44.6535 229.533 44.0326C230.261 43.4117 231.19 43.0817 232.145 43.1053C233.099 43.1289 234.011 43.5045 234.708 44.1606C235.405 44.8167 235.837 45.7075 235.924 46.6635H235.895Z" fill="#FFB6B6"/><path d="M190.143 83.2633C190.143 83.2633 189.565 88.2059 195.099 89.4311C200.633 90.6564 215.992 81.847 218.47 80.5013C219.255 80.086 220.324 78.0093 221.419 75.376C221.91 74.1923 222.41 72.884 222.889 71.5715C223.166 70.8073 224.5 70.5996 224.76 69.8437C225.02 69.0878 224.215 67.7877 224.45 67.0775C225.569 63.7133 226.362 61.0385 226.362 61.0385L222.695 54.1106C217.561 56.8394 214.931 62.8327 212.994 69.7689L190.143 83.2633Z" fill="#7F54B3"/><path d="M125.501 53.0473C125.578 53.5527 125.753 54.0379 126.017 54.4752C126.28 54.9124 126.627 55.2931 127.037 55.5955C127.447 55.898 127.913 56.1161 128.406 56.2376C128.9 56.3591 129.413 56.3815 129.916 56.3036C130.142 56.2668 130.364 56.2112 130.581 56.1374L151.569 79.3965L153.845 72.5849L132.935 50.9249C132.569 50.0386 131.893 49.3181 131.034 48.9004C130.175 48.4827 129.194 48.3969 128.276 48.6594C127.359 48.9219 126.569 49.5144 126.057 50.3241C125.545 51.1339 125.347 52.1045 125.501 53.0515V53.0473Z" fill="#FFB6B6"/><path d="M178.905 76.9709C178.905 76.9709 180.694 81.6103 175.643 84.1896C170.592 86.7688 153.548 82.1128 150.776 81.4275C149.909 81.2157 148.364 79.4837 146.646 77.2077C145.874 76.1818 145.069 75.0479 144.276 73.885C143.817 73.2163 142.475 73.3492 142.033 72.6805C141.591 72.0118 142.054 70.5539 141.649 69.9268C139.725 66.9488 138.292 64.5606 138.292 64.5606L140.121 56.9307C145.767 58.2806 149.81 63.435 153.407 69.6485L178.905 76.9709Z" fill="#7F54B3"/><path d="M184.357 68.0328C190.054 68.0328 194.673 63.3877 194.673 57.6576C194.673 51.9275 190.054 47.2824 184.357 47.2824C178.659 47.2824 174.04 51.9275 174.04 57.6576C174.04 63.3877 178.659 68.0328 184.357 68.0328Z" fill="#FFB6B6"/><path d="M196.131 51.7182C195.045 50.0319 193.009 48.9064 191.035 49.2262C190.851 47.9593 190.325 46.7673 189.514 45.7801C188.704 44.7929 187.639 44.0483 186.437 43.6272C185.235 43.2062 183.941 43.1249 182.696 43.3923C181.451 43.6596 180.302 44.2653 179.376 45.1434C179.071 44.9282 178.717 44.7956 178.346 44.7585C177.976 44.7214 177.602 44.781 177.261 44.9316C176.583 45.244 175.993 45.7206 175.543 46.3188C174.411 47.739 173.682 49.4416 173.436 51.2453C173.189 53.049 173.434 54.8862 174.143 56.5611C173.9 55.6806 174.779 54.8499 175.667 54.6547C176.555 54.4595 177.489 54.6547 178.389 54.5135C179.541 54.3473 180.578 53.6828 181.734 53.5249C182.713 53.4596 183.695 53.5866 184.625 53.8988C185.556 54.2095 186.537 54.3419 187.516 54.2892C188.491 54.1729 189.742 57.8819 189.726 60.4944C189.726 60.9886 189.825 61.6241 190.304 61.7404C190.898 61.8691 191.241 61.0468 191.807 60.8225C192.067 60.7491 192.344 60.7794 192.582 60.9071C192.82 61.0348 193 61.25 193.083 61.5078C193.154 61.7706 193.162 62.0467 193.106 62.3132C193.05 62.5798 192.932 62.829 192.761 63.0404C192.413 63.4571 192.002 63.8159 191.543 64.1037L191.774 64.2947C191.993 64.5301 192.288 64.6809 192.606 64.7211C192.924 64.7613 193.246 64.6883 193.517 64.5149C194.044 64.1502 194.47 63.6572 194.756 63.0819C195.856 61.3811 196.641 59.4941 197.073 57.5122C197.44 55.5518 197.217 53.4087 196.131 51.7182Z" fill="#2F2E41"/><path d="M272.441 92.6334C259.138 102.768 232.665 99.5655 224.447 116.927C199.576 169.484 178.294 129.445 156.521 125.117L156.319 124.041C178.121 125.861 201.509 123.041 223.947 115.884C244.229 109.417 262.322 99.7939 276.269 88.0564L277 88.9701C275.527 90.2244 274.007 91.4455 272.441 92.6334Z" fill="#F2F2F2"/><path d="M216.19 230.294C215.872 231.237 34.9475 231.237 34.6089 230.294C34.9228 229.347 215.848 229.347 216.19 230.294Z" fill="#CCCCCC"/></g><defs><clipPath id="clip0_440_1196"><rect width="277" height="231" fill="white"/></clipPath></defs></svg>',
      image3: '<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3571 0C12.732 0 12.1324 0.243131 11.6904 0.675907C11.2483 1.10868 11 1.69565 11 2.30769V5.38462C11.0001 5.86178 11.1512 6.32719 11.4326 6.71677C11.7141 7.10635 12.1119 7.40095 12.5714 7.56V9.23077C12.5715 9.37693 12.6141 9.52006 12.6942 9.64338C12.7744 9.76671 12.8887 9.86512 13.0239 9.92711C13.1591 9.9891 13.3096 10.0121 13.4576 9.99339C13.6057 9.9747 13.7453 9.91508 13.86 9.82154L16.4686 7.69231H19.6429C20.268 7.69231 20.8676 7.44918 21.3096 7.0164C21.7517 6.58362 22 5.99665 22 5.38462V2.30769C22 1.69565 21.7517 1.10868 21.3096 0.675907C20.8676 0.243131 20.268 0 19.6429 0H13.3571ZM12.5714 2.30769C12.5714 2.10368 12.6542 1.90802 12.8016 1.76376C12.9489 1.61951 13.1488 1.53846 13.3571 1.53846H19.6429C19.8512 1.53846 20.0511 1.61951 20.1984 1.76376C20.3458 1.90802 20.4286 2.10368 20.4286 2.30769V5.38462C20.4286 5.58863 20.3458 5.78429 20.1984 5.92854C20.0511 6.0728 19.8512 6.15385 19.6429 6.15385H16.1857C16.0019 6.15393 15.824 6.21708 15.6829 6.33231L14.1429 7.58769V6.92308C14.1429 6.71906 14.0601 6.52341 13.9127 6.37915C13.7654 6.23489 13.5655 6.15385 13.3571 6.15385C13.1488 6.15385 12.9489 6.0728 12.8016 5.92854C12.6542 5.78429 12.5714 5.58863 12.5714 5.38462V2.30769ZM3.14286 7.69231C3.14286 6.87626 3.47398 6.09363 4.06338 5.51659C4.65278 4.93956 5.45218 4.61538 6.28571 4.61538C7.11925 4.61538 7.91865 4.93956 8.50805 5.51659C9.09745 6.09363 9.42857 6.87626 9.42857 7.69231C9.42857 8.50836 9.09745 9.29099 8.50805 9.86802C7.91865 10.4451 7.11925 10.7692 6.28571 10.7692C5.45218 10.7692 4.65278 10.4451 4.06338 9.86802C3.47398 9.29099 3.14286 8.50836 3.14286 7.69231ZM6.28571 6.15385C5.86895 6.15385 5.46925 6.31593 5.17455 6.60445C4.87985 6.89297 4.71429 7.28428 4.71429 7.69231C4.71429 8.10033 4.87985 8.49165 5.17455 8.78016C5.46925 9.06868 5.86895 9.23077 6.28571 9.23077C6.70248 9.23077 7.10218 9.06868 7.39688 8.78016C7.69158 8.49165 7.85714 8.10033 7.85714 7.69231C7.85714 7.28428 7.69158 6.89297 7.39688 6.60445C7.10218 6.31593 6.70248 6.15385 6.28571 6.15385ZM2.35714 12.3077H10.2143C10.8394 12.3077 11.439 12.5508 11.881 12.9836C12.3231 13.4164 12.5714 14.0033 12.5714 14.6154C12.5714 16.3323 11.8501 17.7077 10.6669 18.6385C9.50243 19.5538 7.94043 20 6.28571 20C4.631 20 3.069 19.5538 1.90457 18.6385C0.722857 17.7077 0 16.3323 0 14.6154C0 14.0033 0.248341 13.4164 0.690391 12.9836C1.13244 12.5508 1.73199 12.3077 2.35714 12.3077ZM10.2143 13.8462H2.35714C2.14876 13.8462 1.94891 13.9272 1.80156 14.0715C1.65421 14.2157 1.57143 14.4114 1.57143 14.6154C1.57143 15.8723 2.08214 16.8046 2.88829 17.4385C3.71486 18.0877 4.90286 18.4615 6.28571 18.4615C7.66857 18.4615 8.85657 18.0877 9.68314 17.4385C10.4893 16.8046 11 15.8723 11 14.6154C11 14.4114 10.9172 14.2157 10.7699 14.0715C10.6225 13.9272 10.4227 13.8462 10.2143 13.8462Z" fill="#AEAEAE"/></svg>',
      imageerror: '<svg width="311" height="339" viewBox="0 0 341 369" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M186.33 284.32C264.947 284.32 328.678 220.673 328.678 142.16C328.678 63.6471 264.947 0 186.33 0C107.713 0 43.9819 63.6471 43.9819 142.16C43.9819 220.673 107.713 284.32 186.33 284.32Z" fill="#F2F2F2"/><path d="M279.35 63.5747H18.5894C18.3341 63.5557 18.0955 63.441 17.9213 63.2536C17.7472 63.0663 17.6504 62.8201 17.6504 62.5644C17.6504 62.3088 17.7472 62.0626 17.9213 61.8752C18.0955 61.6879 18.3341 61.5732 18.5894 61.5542H279.35C279.605 61.5732 279.844 61.6879 280.018 61.8752C280.192 62.0626 280.289 62.3088 280.289 62.5644C280.289 62.8201 280.192 63.0663 280.018 63.2536C279.844 63.441 279.605 63.5557 279.35 63.5747Z" fill="#CACACA"/><path d="M190.483 97.6481H118.396C112.982 97.6481 108.594 102.031 108.594 107.437V107.443C108.594 112.849 112.982 117.231 118.396 117.231H190.483C195.897 117.231 200.285 112.849 200.285 107.443V107.437C200.285 102.031 195.897 97.6481 190.483 97.6481Z" fill="white"/><path d="M71.8302 136.815H237.061C239.66 136.815 242.153 137.846 243.992 139.682C245.83 141.518 246.863 144.008 246.863 146.604C246.863 149.2 245.83 151.69 243.992 153.525C242.153 155.361 239.66 156.393 237.061 156.393H71.8302C69.2306 156.393 66.7374 155.361 64.8992 153.525C63.061 151.69 62.0283 149.2 62.0283 146.604C62.0283 144.008 63.061 141.518 64.8992 139.682C66.7374 137.846 69.2306 136.815 71.8302 136.815Z" fill="white"/><path d="M71.8302 175.976H237.061C239.66 175.976 242.153 177.007 243.992 178.843C245.83 180.679 246.863 183.169 246.863 185.765C246.863 188.361 245.83 190.851 243.992 192.687C242.153 194.522 239.66 195.554 237.061 195.554H71.8302C69.2306 195.554 66.7374 194.522 64.8992 192.687C63.061 190.851 62.0283 188.361 62.0283 185.765C62.0283 183.169 63.061 180.679 64.8992 178.843C66.7374 177.007 69.2306 175.976 71.8302 175.976Z" fill="white"/><path d="M51.3573 368.138L50.9706 368.099C44.4523 367.427 38.1586 365.346 32.527 361.999C26.8954 358.653 22.0609 354.123 18.3594 348.723C16.3086 345.677 14.648 342.386 13.4164 338.928L13.2987 338.598L13.6518 338.57C17.8213 338.234 22.1086 337.529 24.0141 337.188L11.7351 333.012L11.6567 332.648C11.3009 330.979 11.454 329.241 12.0962 327.659C12.7385 326.077 13.8405 324.723 15.2602 323.772C16.683 322.775 18.3722 322.226 20.1101 322.196C21.8481 322.166 23.5553 322.656 25.0116 323.604C26.351 324.46 27.7521 325.283 29.1027 326.123C33.7487 328.921 38.5571 331.831 42.1607 335.805C44.8579 338.839 46.8428 342.435 47.9704 346.333C49.098 350.23 49.3399 354.33 48.6784 358.332L51.3573 368.138Z" fill="#F2F2F2"/><path d="M96.0005 362.038H102.053L104.934 338.721H96.0005V362.038Z" fill="#A0616A"/><path d="M95.7881 368.345H114.4V368.11C114.401 367.16 114.214 366.219 113.85 365.341C113.487 364.463 112.954 363.665 112.281 362.993C111.609 362.321 110.81 361.788 109.931 361.424C109.052 361.061 108.11 360.873 107.159 360.873L103.763 358.299L97.4189 360.873H95.7937L95.7881 368.345Z" fill="#2F2E41"/><path d="M47.4907 345.297L52.3328 348.924L68.6468 331.994L61.5014 326.643L47.4907 345.297Z" fill="#A0616A"/><path d="M43.5288 350.211L58.4193 361.366L58.565 361.181C59.7176 359.646 60.2121 357.716 59.9399 355.816C59.6677 353.916 58.651 352.202 57.1135 351.051L55.9423 346.948L49.318 345.208L48.0178 344.234L43.5288 350.211Z" fill="#2F2E41"/><path d="M67.6097 252.614C67.6097 252.614 67.9459 261.72 68.3662 269.018C68.4391 270.216 65.6258 271.514 65.6986 272.818C65.7491 273.68 66.259 274.525 66.3263 275.421C66.3935 276.316 65.6482 277.217 65.6986 278.219C65.7491 279.221 66.5841 280.284 66.6345 281.27C67.195 291.853 69.1284 304.519 67.195 308.062C66.2254 309.808 53.9185 333.992 53.9185 333.992C53.9185 333.992 60.7781 344.262 62.734 340.837C65.3231 336.314 85.2687 315.158 85.2687 311.117C85.2687 307.077 89.881 276.831 89.881 276.831L93.0979 294.741L94.5774 298.29L94.1122 300.372L95.065 303.17L95.1154 305.968L96.0457 311.134C96.0457 311.134 93.2436 351.364 94.824 352.484C96.4044 353.603 104.037 355.629 104.94 353.603C105.842 351.577 111.665 311.627 111.665 311.627C111.665 311.627 112.606 293.314 113.626 276.288C113.682 275.298 114.383 274.106 114.433 273.132C114.495 272.012 114.058 270.535 114.114 269.438C114.181 268.184 114.736 267.294 114.792 266.08C115.207 256.783 112.87 245.455 112.124 244.342C109.883 240.983 107.854 238.286 107.854 238.286C107.854 238.286 77.5909 228.351 69.4815 238.448L67.6097 252.614Z" fill="#2F2E41"/><path d="M97.8172 159.006L85.8129 156.611L80.2086 164.206C69.7566 174.47 69.5997 183.526 71.4659 198.05V218.434L70.1153 232.096C70.1153 232.096 65.3349 242.08 70.261 244.409C75.1872 246.737 107.585 246.535 110.679 245.606C113.773 244.677 111.094 243.536 110.281 239.215C108.757 231.088 109.777 235.006 109.878 232.42C111.385 195.302 107.877 180.067 107.524 176.06L101.438 165.001L97.8396 159.006H97.8172Z" fill="#3F3D56"/><path d="M161.089 188.933C160.791 189.496 160.386 189.995 159.895 190.401C159.405 190.808 158.839 191.114 158.23 191.302C157.621 191.49 156.981 191.557 156.347 191.498C155.712 191.439 155.095 191.256 154.532 190.959C154.28 190.824 154.04 190.669 153.814 190.494L127.883 206.932L127.962 197.977L153.147 183.381C153.944 182.495 155.038 181.931 156.222 181.795C157.406 181.659 158.599 181.961 159.576 182.643C160.553 183.326 161.246 184.341 161.525 185.499C161.804 186.657 161.648 187.876 161.089 188.927V188.933Z" fill="#A0616A"/><path d="M88.3344 169.372L85.3866 169.064C84.0458 168.925 82.6917 169.134 81.4562 169.673C80.2207 170.211 79.1459 171.06 78.3364 172.137C77.7024 172.967 77.2482 173.92 77.0026 174.935C76.6445 176.422 76.7332 177.982 77.2574 179.419C77.7817 180.857 78.7184 182.108 79.9504 183.017L90.1446 190.528C97.2956 200.177 110.746 206.585 126.516 211.796L151.029 196.589L142.348 186.118L125.536 195.117L100.552 175.797L91.0245 169.674L88.3344 169.372Z" fill="#3F3D56"/><path d="M93.7592 153.124C101.491 153.124 107.759 146.865 107.759 139.143C107.759 131.422 101.491 125.162 93.7592 125.162C86.0275 125.162 79.7598 131.422 79.7598 139.143C79.7598 146.865 86.0275 153.124 93.7592 153.124Z" fill="#A0616A"/><path d="M94.0847 153.124H93.7429C93.698 153.247 93.642 153.37 93.5859 153.494L94.0847 153.124Z" fill="#2F2E41"/><path d="M97.9233 139.529C97.9457 139.666 97.9794 139.801 98.0242 139.932C98.0074 139.794 97.9735 139.659 97.9233 139.529Z" fill="#2F2E41"/><path d="M107.938 125.756C107.378 127.547 106.845 125.28 104.951 125.688C102.67 126.175 100.019 126.007 98.1475 124.614C96.7788 123.606 95.1858 122.945 93.505 122.686C91.8242 122.428 90.1058 122.58 88.497 123.131C85.3026 124.25 79.9505 125.056 79.1154 128.336C78.8296 129.455 78.7119 130.714 77.9946 131.66C77.3781 132.489 76.4142 132.959 75.6016 133.597C72.8723 135.74 74.9571 141.846 76.2517 145.07C77.5463 148.294 80.5165 150.639 83.7782 151.842C86.9334 153.007 90.3576 153.214 93.7258 153.124C94.2862 151.607 94.062 149.856 93.5744 148.283C93.0533 146.604 92.2799 144.925 92.0613 143.167C91.8427 141.41 92.3191 139.389 93.8042 138.404C95.1717 137.498 97.3909 138.052 97.9065 139.524C97.6039 137.688 99.4645 135.914 101.387 135.606C103.444 135.27 105.506 136.015 107.551 136.384C109.597 136.753 108.874 128.117 107.91 125.75L107.938 125.756Z" fill="#2F2E41"/><path d="M157.682 188.519C173.504 188.519 186.331 175.709 186.331 159.907C186.331 144.106 173.504 131.296 157.682 131.296C141.859 131.296 129.033 144.106 129.033 159.907C129.033 175.709 141.859 188.519 157.682 188.519Z" fill="#F50057"/><path d="M165.208 147.986L157.681 155.503L150.155 147.986C149.57 147.402 148.776 147.074 147.949 147.074C147.122 147.074 146.329 147.402 145.744 147.986C145.159 148.57 144.831 149.363 144.831 150.189C144.831 151.015 145.159 151.807 145.744 152.391L153.271 159.907L145.744 167.424C145.159 168.008 144.831 168.8 144.831 169.626C144.831 170.452 145.159 171.245 145.744 171.829C146.329 172.413 147.122 172.741 147.949 172.741C148.776 172.741 149.57 172.413 150.155 171.829L157.681 164.312L165.208 171.823C165.792 172.407 166.586 172.735 167.413 172.735C168.24 172.735 169.033 172.407 169.618 171.823C170.203 171.239 170.532 170.447 170.532 169.621C170.532 168.795 170.203 168.003 169.618 167.418L162.092 159.902L169.618 152.385C170.203 151.801 170.532 151.009 170.532 150.183C170.532 149.357 170.203 148.565 169.618 147.981C169.033 147.396 168.24 147.068 167.413 147.068C166.586 147.068 165.792 147.396 165.208 147.981V147.986Z" fill="white"/><path d="M146.389 135.858C146.59 136.462 146.67 137.1 146.624 137.735C146.578 138.37 146.408 138.989 146.122 139.559C145.836 140.128 145.441 140.635 144.959 141.052C144.477 141.468 143.917 141.786 143.312 141.986C143.042 142.077 142.765 142.142 142.483 142.182L136.414 172.248L130.019 165.997L136.907 137.744C136.793 136.542 137.129 135.34 137.852 134.372C138.574 133.403 139.631 132.737 140.817 132.502C142.003 132.267 143.234 132.481 144.272 133.101C145.31 133.72 146.08 134.703 146.434 135.858H146.389Z" fill="#A0616A"/><path d="M81.895 174.745L79.6533 176.659C78.6236 177.528 77.8371 178.649 77.3705 179.913C76.904 181.176 76.7733 182.539 76.9912 183.867C77.1614 184.899 77.5429 185.884 78.1121 186.761C78.9379 188.055 80.1279 189.076 81.5328 189.696C82.9377 190.316 84.4947 190.508 86.0085 190.248L98.4892 188.099C110.415 189.627 124.353 184.371 139.03 176.608L145.016 148.417L131.437 147.404L126.298 165.751L95.0314 170.385L84.019 172.998L81.895 174.745Z" fill="#3F3D56"/><path d="M152.963 368.832L0.666907 369C0.490032 369 0.320402 368.93 0.195333 368.805C0.0702632 368.68 0 368.511 0 368.334C0 368.157 0.0702632 367.988 0.195333 367.863C0.320402 367.738 0.490032 367.668 0.666907 367.668L152.963 367.494C153.14 367.494 153.309 367.565 153.434 367.69C153.559 367.814 153.63 367.984 153.63 368.16C153.63 368.337 153.559 368.507 153.434 368.631C153.309 368.756 153.14 368.826 152.963 368.826V368.832Z" fill="#CACACA"/><path d="M31.8213 50.769C34.4398 50.769 36.5625 48.6015 36.5625 45.9277C36.5625 43.2539 34.4398 41.0864 31.8213 41.0864C29.2028 41.0864 27.0801 43.2539 27.0801 45.9277C27.0801 48.6015 29.2028 50.769 31.8213 50.769Z" fill="#3F3D56"/><path d="M48.1909 50.769C50.8094 50.769 52.9321 48.6015 52.9321 45.9277C52.9321 43.2539 50.8094 41.0864 48.1909 41.0864C45.5724 41.0864 43.4497 43.2539 43.4497 45.9277C43.4497 48.6015 45.5724 50.769 48.1909 50.769Z" fill="#3F3D56"/><path d="M64.5615 50.769C67.18 50.769 69.3027 48.6015 69.3027 45.9277C69.3027 43.2539 67.18 41.0864 64.5615 41.0864C61.943 41.0864 59.8203 43.2539 59.8203 45.9277C59.8203 48.6015 61.943 50.769 64.5615 50.769Z" fill="#3F3D56"/><path d="M83.2345 49.7505C83.1594 49.7509 83.0849 49.7363 83.0156 49.7074C82.9463 49.6786 82.8835 49.6361 82.8309 49.5826L79.6309 46.3196C79.5282 46.215 79.4707 46.0743 79.4707 45.9278C79.4707 45.7813 79.5282 45.6407 79.6309 45.536L82.8309 42.2731C82.9368 42.1797 83.0741 42.1296 83.2153 42.133C83.3566 42.1363 83.4913 42.1928 83.5926 42.2912C83.694 42.3895 83.7543 42.5224 83.7617 42.6633C83.7691 42.8042 83.7229 42.9427 83.6323 43.051L80.8302 45.9278L83.6323 48.799C83.6849 48.851 83.7266 48.9129 83.755 48.9811C83.7835 49.0493 83.7981 49.1225 83.7981 49.1964C83.7981 49.2703 83.7835 49.3434 83.755 49.4116C83.7266 49.4798 83.6849 49.5417 83.6323 49.5938C83.5257 49.6965 83.3826 49.7528 83.2345 49.7505Z" fill="#3F3D56"/><path d="M88.6034 49.7503C88.4932 49.7498 88.3856 49.717 88.294 49.6558C88.2025 49.5946 88.131 49.5078 88.0885 49.4063C88.0461 49.3048 88.0345 49.193 88.0553 49.085C88.0761 48.9769 88.1283 48.8774 88.2055 48.7988L91.0076 45.9277L88.2055 43.0509C88.1476 42.9998 88.101 42.9374 88.0684 42.8675C88.0359 42.7977 88.0181 42.7218 88.0163 42.6448C88.0144 42.5677 88.0286 42.4911 88.0578 42.4198C88.0869 42.3484 88.1306 42.2839 88.1859 42.2301C88.2413 42.1764 88.3071 42.1347 88.3794 42.1076C88.4516 42.0804 88.5287 42.0685 88.6057 42.0725C88.6828 42.0766 88.7582 42.0964 88.8273 42.1309C88.8963 42.1654 88.9574 42.2137 89.0069 42.2729L92.2013 45.5359C92.304 45.6405 92.3615 45.7812 92.3615 45.9277C92.3615 46.0742 92.304 46.2148 92.2013 46.3194L89.0069 49.5824C88.9543 49.636 88.8915 49.6784 88.8222 49.7073C88.7529 49.7361 88.6785 49.7507 88.6034 49.7503Z" fill="#3F3D56"/><path d="M255.896 41.6461H249.95C249.624 41.6461 249.312 41.7753 249.082 42.0051C248.852 42.235 248.723 42.5467 248.723 42.8718V48.8157C248.723 49.1408 248.852 49.4525 249.082 49.6824C249.312 49.9122 249.624 50.0414 249.95 50.0414H255.896C256.222 50.0414 256.535 49.9124 256.766 49.6827C256.997 49.453 257.128 49.1413 257.129 48.8157V42.8718C257.128 42.5462 256.997 42.2345 256.766 42.0048C256.535 41.7751 256.222 41.6461 255.896 41.6461Z" fill="#3F3D56"/><path d="M241.325 41.6461H235.379C235.053 41.6461 234.741 41.7753 234.511 42.0051C234.281 42.235 234.151 42.5467 234.151 42.8718V48.8157C234.151 49.1408 234.281 49.4525 234.511 49.6824C234.741 49.9122 235.053 50.0414 235.379 50.0414H241.325C241.651 50.0414 241.964 49.9124 242.195 49.6827C242.426 49.453 242.556 49.1413 242.558 48.8157V42.8718C242.556 42.5462 242.426 42.2345 242.195 42.0048C241.964 41.7751 241.651 41.6461 241.325 41.6461Z" fill="#3F3D56"/><path d="M269.627 41.9259H263.681C263.355 41.9259 263.043 42.055 262.813 42.2849C262.583 42.5148 262.454 42.8265 262.454 43.1516V49.0955C262.454 49.4205 262.583 49.7323 262.813 49.9622C263.043 50.192 263.355 50.3212 263.681 50.3212H269.627C269.953 50.3212 270.266 50.1922 270.497 49.9625C270.728 49.7328 270.859 49.4211 270.86 49.0955V43.1516C270.859 42.826 270.728 42.5143 270.497 42.2846C270.266 42.0549 269.953 41.9259 269.627 41.9259Z" fill="#3F3D56"/><path d="M180.003 44.2152H132.473C132.077 44.2152 131.696 44.3727 131.415 44.6529C131.135 44.9331 130.977 45.3132 130.977 45.7096C130.977 46.1059 131.135 46.486 131.415 46.7662C131.696 47.0465 132.077 47.2039 132.473 47.2039H180.003C180.4 47.2039 180.781 47.0465 181.061 46.7662C181.342 46.486 181.499 46.1059 181.499 45.7096C181.499 45.3132 181.342 44.9331 181.061 44.6529C180.781 44.3727 180.4 44.2152 180.003 44.2152Z" fill="#3F3D56"/><path d="M132.547 345.351L124.777 319.451H131.178L135.063 333.067C135.236 333.684 135.384 334.313 135.507 334.954C135.655 335.571 135.766 336.163 135.84 336.73C135.939 337.297 136.013 337.828 136.062 338.321C136.112 338.79 136.161 339.184 136.21 339.505H135.396C135.544 338.592 135.668 337.778 135.766 337.063C135.89 336.348 136.025 335.682 136.173 335.065C136.321 334.424 136.506 333.758 136.728 333.067L140.576 322.818H145.608L149.382 333.067C149.678 333.881 149.925 334.646 150.122 335.361C150.32 336.076 150.468 336.767 150.566 337.433C150.69 338.074 150.788 338.716 150.862 339.357L150.122 339.468C150.172 339.024 150.209 338.617 150.233 338.247C150.258 337.852 150.283 337.482 150.307 337.137C150.357 336.767 150.406 336.385 150.455 335.99C150.505 335.595 150.579 335.164 150.677 334.695C150.776 334.202 150.912 333.647 151.084 333.03L154.932 319.451H161.185L153.415 345.351H148.605L142.463 330.44L143.166 330.514L137.505 345.351H132.547ZM172.314 345.721C170.267 345.721 168.441 345.277 166.838 344.389C165.259 343.501 164.001 342.292 163.064 340.763C162.151 339.234 161.695 337.482 161.695 335.509C161.695 333.536 162.151 331.784 163.064 330.255C164.001 328.726 165.259 327.517 166.838 326.629C168.441 325.741 170.267 325.297 172.314 325.297C174.361 325.297 176.174 325.741 177.753 326.629C179.356 327.517 180.614 328.726 181.527 330.255C182.44 331.784 182.896 333.536 182.896 335.509C182.896 337.482 182.44 339.234 181.527 340.763C180.614 342.292 179.356 343.501 177.753 344.389C176.174 345.277 174.361 345.721 172.314 345.721ZM172.314 340.615C173.202 340.615 173.991 340.393 174.682 339.949C175.373 339.505 175.915 338.901 176.31 338.136C176.705 337.371 176.89 336.496 176.865 335.509C176.89 334.522 176.705 333.647 176.31 332.882C175.915 332.093 175.373 331.476 174.682 331.032C173.991 330.588 173.202 330.366 172.314 330.366C171.426 330.366 170.624 330.588 169.909 331.032C169.218 331.476 168.676 332.093 168.281 332.882C167.886 333.647 167.701 334.522 167.726 335.509C167.701 336.496 167.886 337.371 168.281 338.136C168.676 338.901 169.218 339.505 169.909 339.949C170.624 340.393 171.426 340.615 172.314 340.615ZM196.017 345.721C193.97 345.721 192.144 345.277 190.541 344.389C188.962 343.501 187.704 342.292 186.767 340.763C185.854 339.234 185.398 337.482 185.398 335.509C185.398 333.536 185.854 331.784 186.767 330.255C187.704 328.726 188.962 327.517 190.541 326.629C192.144 325.741 193.97 325.297 196.017 325.297C198.064 325.297 199.877 325.741 201.456 326.629C203.059 327.517 204.317 328.726 205.23 330.255C206.143 331.784 206.599 333.536 206.599 335.509C206.599 337.482 206.143 339.234 205.23 340.763C204.317 342.292 203.059 343.501 201.456 344.389C199.877 345.277 198.064 345.721 196.017 345.721ZM196.017 340.615C196.905 340.615 197.694 340.393 198.385 339.949C199.076 339.505 199.618 338.901 200.013 338.136C200.408 337.371 200.593 336.496 200.568 335.509C200.593 334.522 200.408 333.647 200.013 332.882C199.618 332.093 199.076 331.476 198.385 331.032C197.694 330.588 196.905 330.366 196.017 330.366C195.129 330.366 194.327 330.588 193.612 331.032C192.921 331.476 192.379 332.093 191.984 332.882C191.589 333.647 191.404 334.522 191.429 335.509C191.404 336.496 191.589 337.371 191.984 338.136C192.379 338.901 192.921 339.505 193.612 339.949C194.327 340.393 195.129 340.615 196.017 340.615ZM217.722 345.684C216.07 345.684 214.59 345.252 213.282 344.389C212 343.501 210.976 342.292 210.211 340.763C209.447 339.209 209.064 337.458 209.064 335.509C209.064 333.511 209.447 331.747 210.211 330.218C210.976 328.689 212.024 327.492 213.356 326.629C214.688 325.741 216.205 325.297 217.907 325.297C218.845 325.297 219.696 325.433 220.46 325.704C221.25 325.975 221.94 326.358 222.532 326.851C223.124 327.32 223.63 327.875 224.049 328.516C224.469 329.133 224.777 329.799 224.974 330.514L223.753 330.366V325.704H229.636V345.351H223.642V340.615L224.974 340.578C224.777 341.269 224.456 341.922 224.012 342.539C223.568 343.156 223.026 343.698 222.384 344.167C221.743 344.636 221.028 345.006 220.238 345.277C219.449 345.548 218.61 345.684 217.722 345.684ZM219.35 340.689C220.263 340.689 221.052 340.479 221.718 340.06C222.384 339.641 222.902 339.049 223.272 338.284C223.642 337.495 223.827 336.57 223.827 335.509C223.827 334.448 223.642 333.536 223.272 332.771C222.902 331.982 222.384 331.377 221.718 330.958C221.052 330.514 220.263 330.292 219.35 330.292C218.462 330.292 217.685 330.514 217.019 330.958C216.378 331.377 215.872 331.982 215.502 332.771C215.132 333.536 214.947 334.448 214.947 335.509C214.947 336.57 215.132 337.495 215.502 338.284C215.872 339.049 216.378 339.641 217.019 340.06C217.685 340.479 218.462 340.689 219.35 340.689ZM234.86 345.351V317.971H240.669V329.7L239.485 330.144C239.756 329.256 240.237 328.454 240.928 327.739C241.643 326.999 242.494 326.407 243.481 325.963C244.468 325.519 245.504 325.297 246.589 325.297C248.069 325.297 249.315 325.605 250.326 326.222C251.337 326.814 252.102 327.714 252.62 328.923C253.138 330.107 253.397 331.562 253.397 333.289V345.351H247.44V333.77C247.44 332.981 247.329 332.327 247.107 331.809C246.885 331.291 246.54 330.909 246.071 330.662C245.627 330.391 245.072 330.267 244.406 330.292C243.888 330.292 243.407 330.378 242.963 330.551C242.519 330.699 242.137 330.933 241.816 331.254C241.495 331.55 241.236 331.895 241.039 332.29C240.866 332.685 240.78 333.116 240.78 333.585V345.351H237.857C237.166 345.351 236.574 345.351 236.081 345.351C235.588 345.351 235.181 345.351 234.86 345.351ZM259.567 335.916C259.37 334.411 259.173 332.857 258.975 331.254C258.778 329.651 258.618 328.06 258.494 326.481C258.371 324.902 258.309 323.385 258.309 321.93V319.044H264.562V321.93C264.562 323.41 264.501 324.952 264.377 326.555C264.254 328.158 264.094 329.762 263.896 331.365C263.699 332.944 263.489 334.461 263.267 335.916H259.567ZM261.417 345.758C260.406 345.758 259.617 345.474 259.049 344.907C258.482 344.34 258.198 343.526 258.198 342.465C258.198 341.478 258.494 340.677 259.086 340.06C259.678 339.443 260.455 339.135 261.417 339.135C262.429 339.135 263.206 339.431 263.748 340.023C264.316 340.59 264.599 341.404 264.599 342.465C264.599 343.427 264.303 344.216 263.711 344.833C263.119 345.45 262.355 345.758 261.417 345.758ZM270.985 335.916C270.788 334.411 270.591 332.857 270.393 331.254C270.196 329.651 270.036 328.06 269.912 326.481C269.789 324.902 269.727 323.385 269.727 321.93V319.044H275.98V321.93C275.98 323.41 275.919 324.952 275.795 326.555C275.672 328.158 275.512 329.762 275.314 331.365C275.117 332.944 274.907 334.461 274.685 335.916H270.985ZM272.835 345.758C271.824 345.758 271.035 345.474 270.467 344.907C269.9 344.34 269.616 343.526 269.616 342.465C269.616 341.478 269.912 340.677 270.504 340.06C271.096 339.443 271.873 339.135 272.835 339.135C273.847 339.135 274.624 339.431 275.166 340.023C275.734 340.59 276.017 341.404 276.017 342.465C276.017 343.427 275.721 344.216 275.129 344.833C274.537 345.45 273.773 345.758 272.835 345.758ZM282.403 335.916C282.206 334.411 282.009 332.857 281.811 331.254C281.614 329.651 281.454 328.06 281.33 326.481C281.207 324.902 281.145 323.385 281.145 321.93V319.044H287.398V321.93C287.398 323.41 287.337 324.952 287.213 326.555C287.09 328.158 286.93 329.762 286.732 331.365C286.535 332.944 286.325 334.461 286.103 335.916H282.403ZM284.253 345.758C283.242 345.758 282.453 345.474 281.885 344.907C281.318 344.34 281.034 343.526 281.034 342.465C281.034 341.478 281.33 340.677 281.922 340.06C282.514 339.443 283.291 339.135 284.253 339.135C285.265 339.135 286.042 339.431 286.584 340.023C287.152 340.59 287.435 341.404 287.435 342.465C287.435 343.427 287.139 344.216 286.547 344.833C285.955 345.45 285.191 345.758 284.253 345.758ZM293.821 335.916C293.624 334.411 293.426 332.857 293.229 331.254C293.032 329.651 292.871 328.06 292.748 326.481C292.625 324.902 292.563 323.385 292.563 321.93V319.044H298.816V321.93C298.816 323.41 298.754 324.952 298.631 326.555C298.508 328.158 298.347 329.762 298.15 331.365C297.953 332.944 297.743 334.461 297.521 335.916H293.821ZM295.671 345.758C294.66 345.758 293.87 345.474 293.303 344.907C292.736 344.34 292.452 343.526 292.452 342.465C292.452 341.478 292.748 340.677 293.34 340.06C293.932 339.443 294.709 339.135 295.671 339.135C296.682 339.135 297.459 339.431 298.002 340.023C298.569 340.59 298.853 341.404 298.853 342.465C298.853 343.427 298.557 344.216 297.965 344.833C297.373 345.45 296.608 345.758 295.671 345.758Z" fill="#979797"/></svg>',
      steps: ['Analyze', 'Connect', 'Recommended Settings', 'Congratulations'],
      support: 'https://rapidload.zendesk.com/hc/en-us/requests/new',
      axios_request: null,
      heading: 'Analyze & Connect',
      subheading: 'Catch a glimpse of how RapidLoad can impact your page speed.',
      message: 'Please wait....',
      loading_header: '',
      percentage: 100,
      rapidload_config: 1,
      license_information:
          {
            name: '',
            key: '',
            exp_date: new Date(),
            license: '',
            status: true,
            link: window.uucss_global.app_url,
            licensed_domain: null,
            connect_link: window.uucss_global.onboard_activation_url,
            activation_nonce: null,
          },
      items_data: [],
      loading: false,
      license_loading: false,
      error: false,
      items: [
        {
          id: "css",
          title: "CSS Delivery",
          description: 'Deliver CSS files through RapidLoad by removing unused CSS and prioritizing critical CSS.',
          status: false,
          isDisabled: false,
        },
        {
          id: "javascript",
          title: "Javascript Delivery",
          description: 'Minify and deliver Javascript files with best practices',
          status: false,
          isDisabled: false
        },
        {
          id: "image-delivery",
          title: "Image Delivery",
          description: 'Optimize all your images on-the-fly with modern formats (AVIF, WEBP)',
          status: false,
          isDisabled: false
        },
        {
          id: "font",
          title: "Font Delivery",
          description: 'Locally host and optimize your fonts for faster page load times',
          status: false,
          isDisabled: true
        },
        {
          id: "cdn",
          title: "Cloud Delivery (CDN)",
          description: 'Load resource files faster by using 112 edge locations with only 27ms latency',
          status: false,
          isDisabled: true
        },
      ],
      stats: {
        reduction: null,
        after: null,
        before: null,
        beforeFileCount: null,
        afterFileCount: null,
      },
      loading_svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#fff;display:block;" width="60px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><defs>  <path id="path" d="M50 15A15 35 0 0 1 50 85A15 35 0 0 1 50 15" fill="none"></path>  <path id="patha" d="M0 0A15 35 0 0 1 0 70A15 35 0 0 1 0 0" fill="none"></path></defs><g transform="rotate(0 50 50)"><polygon fill="#e15b64" points="36.25 25 25 5.5 13.75 25 25 25">  <animateMotion dur="2.0408163265306123s" repeatCount="indefinite" begin="0s">    <mpath xlink:href="#patha"></mpath>  </animateMotion></polygon></g><g transform="rotate(0 25 25)"><circle cx="50" cy="15" r="9" fill="#f8b26a">  <animateMotion dur="2.0408163265306123s" repeatCount="indefinite" begin="-0.16666666666666666s">    <mpath xlink:href="#patha"></mpath>  </animateMotion></circle></g><g transform="rotate(0 20 20)"><rect width="15" height="15" fill="#01CC66" x="15" y="15" rx="3" ry="3">  <animateMotion dur="2.0408163265306123s" repeatCount="indefinite" begin="-0.3333333333333333s">    <mpath xlink:href="#patha"></mpath>  </animateMotion></rect></g></svg>',
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/'
    }
  }

}
</script>


