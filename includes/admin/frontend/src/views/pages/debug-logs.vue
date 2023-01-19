<template>
  <main>

    <div class="min-w-[1100px] max-w-[1100px] mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
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
            <p class="text-sm text-gray-font">Set of options that applies for overall RapidLoad plugin</p>
          </div>
        </div>
      </div>



      <div>
        <div class="p-4 pl-32 pr-32">
         <div :class="loading? '': '-mb-[25px]'" class="flex justify-center">
           <svg :class="loading? 'rl-Show': 'rl-Hide'" style="top:80.5%;" width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div v-if="!loading && !table">
            <p class="text-sm text-gray-font">No Logs found...</p>
          </div>
          <div v-if="!loading && table">
          <div class="overflow-auto max-w-[900px]">
            <table  class="table-auto border border-gray-border-line">
              <thead>
              <tr>
                <th class="p-0.5">Date</th>
                <th class="p-0.5">Url</th>
                <th class="p-0.5">Log</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(logs, index) in paginated" :key="index">
                <td class="border border-gray-border-line p-0.5 min-w-[125px]">{{filterDate(logs.time)}}</td>
<!--                <td class="border border-gray-border-line p-0.5 min-w-[250px]">{{ logs.url.length < 35? logs.url : logs.url.substring(0,35)+".." }}</td>-->
<!--                <td class="border border-gray-border-line p-0.5 min-w-[350px]">{{ logs.log.length < 35? logs.log : logs.log.substring(0,35)+".." }}</td>-->
                <td class="border border-gray-border-line p-0.5">{{ logs.url}}</td>
                <td class="border border-gray-border-line p-0.5">{{ logs.log}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-center mt-3">
            <svg @click="prev" class="cursor-pointer" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M2.30928 19.1134C2.41237 20.4536 3.4433 21.5876 4.8866 21.6907C6.94845 21.8969 9.83505 22 12 22C14.1649 22 17.0515 21.8969 19.1134 21.6907C19.8351 21.6907 20.4536 21.3814 20.866 20.866C21.2784 20.3505 21.5876 19.8351 21.6907 19.1134C21.8969 17.0515 22 14.1649 22 12C22 9.83505 21.7938 6.94845 21.6907 4.8866C21.5876 3.54639 20.5567 2.41237 19.1134 2.30928C17.0515 2.10309 14.1649 2 12 2C9.83505 2 6.94845 2.20619 4.8866 2.30928C3.54639 2.41237 2.41237 3.4433 2.30928 4.8866C2.10309 6.94846 2 9.83505 2 12C2 14.165 2.10309 17.0515 2.30928 19.1134ZM7.05155 12.0347L10.7629 7.36083C10.866 7.15464 11.0722 7.05155 11.3814 7.05155C11.5876 7.05155 11.6907 7.15464 11.8969 7.25773C12.2062 7.56701 12.3093 7.97938 12 8.28866L9.52577 11.1753L16.1237 11.1753C16.5361 11.1753 16.9485 11.4845 16.9485 12C16.9485 12.5155 16.6392 12.8247 16.1237 12.8247L9.62887 12.8247L12.1031 15.7113C12.4124 16.0206 12.3093 16.5361 12 16.7423C11.6907 17.0515 11.1753 16.9485 10.9691 16.6392L7.05155 12.0347Z"
                  fill="#7F54B3"/>
            </svg>
            <span class="mr-2 ml-2">{{ current }}</span>
            <svg @click="next()" class="cursor-pointer" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M21.6907 4.88654C21.5876 3.54633 20.5567 2.41231 19.1134 2.30922C17.0515 2.10303 14.1649 1.99994 12 1.99994C9.83505 1.99994 6.94845 2.10303 4.8866 2.30922C4.16495 2.30922 3.54639 2.6185 3.13402 3.13396C2.72165 3.64942 2.41237 4.16489 2.30928 4.88654C2.10309 6.94839 2 9.83499 2 11.9999C2 14.1649 2.20619 17.0515 2.30928 19.1133C2.41237 20.4535 3.4433 21.5876 4.8866 21.6907C6.94845 21.8968 9.83505 21.9999 12 21.9999C14.1649 21.9999 17.0515 21.7938 19.1134 21.6907C20.4536 21.5876 21.5876 20.5566 21.6907 19.1133C21.8969 17.0515 22 14.1649 22 11.9999C22 9.83499 21.8969 6.94839 21.6907 4.88654ZM16.9485 11.9653L13.2371 16.6391C13.134 16.8453 12.9278 16.9484 12.6186 16.9484C12.4124 16.9484 12.3093 16.8453 12.1031 16.7422C11.7938 16.4329 11.6907 16.0206 12 15.7113L14.4742 12.8247H7.87629C7.46392 12.8247 7.05155 12.5154 7.05155 11.9999C7.05155 11.4845 7.36082 11.1752 7.87629 11.1752H14.3711L11.8969 8.2886C11.5876 7.97932 11.6907 7.46386 12 7.25767C12.3093 6.94839 12.8247 7.05148 13.0309 7.36076L16.9485 11.9653Z"
                  fill="#7F54B3"/>
            </svg>
          </div>
          </div>
          <button @click="clearLogs" :disabled="loading" :class="!table? 'hidden': 'block'"
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

            Clear Logs
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
import messageBox from "../../components/messageBox.vue";
import axios from "axios";


export default {
  name: "general-settings",

  components: {
    Vue3TagsInput,
    messageBox,
  },

  mounted() {

    axios.get(window.uucss_global.ajax_url + '?action=uucss_logs')
        .then(response => {
          this.debug_log = response.data.data;
          this.table = this.debug_log? this.debug_log.length > 0: false;
          this.loading = false;
        })
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });

  },

  methods:{

    filterDate(date){
      const dateFormat= new Date(date);
      return dateFormat.getDate()+
          "/"+(dateFormat.getMonth()+1)+
          "/"+dateFormat.getFullYear()+
          " "+dateFormat.getHours()+
          ":"+dateFormat.getMinutes()+
          ":"+dateFormat.getSeconds();
    },
    prev() {
      if(this.current < 2){
        return;
      }
      this.current--;
    },
    next() {
      if(this.paginated.length < 10){
        return;
      }
      this.current++;
    },

    dataSaved(){
      this.saved = true;
      setTimeout(() => this.saved = false, 2000)
    },

    getLog(){
      axios.get(window.uucss_global.ajax_url + '?action=uucss_logs')
          .then(response => {
            this.debug_log = response.data.data;

          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
    },
    clearLogs(){
      this.loading = true;
      axios.post(window.uucss_global.ajax_url + '?action=clear_uucss_logs')
          .then(response => {
            response.data;

          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          }).finally(()=>{
              this.loading = false;
              this.table = false;
              this.debug_log = null;
              this.dataSaved();
          });

    }
  },

  computed: {
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      if(this.debug_log){
        return this.debug_log.slice(this.indexStart, this.indexEnd);
      }
    },

  },
  data() {
    return {
      general_config:[],
      id: 'general',
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/',
      focus: null,
      saved: false,
      back: '/settings',
      loading : true,
      uucss_enable_debug: false,
      debug_log: null,
      table: false,
      current: 1,
      pageSize: 10,


    }
  },


}
</script>

<style scoped>

</style>