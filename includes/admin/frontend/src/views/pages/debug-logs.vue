<template>
  <main>

    <div class="min-w-[1100px] max-w-[1100px] mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mb-6 pr-8 border-t-0">
        <div class="flex-initial w-28 pl-8">
          <RouterLink :to="back">
            <button
                class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
              <img :src="base+'/arrow-left.svg'" alt="Back">
            </button>
          </RouterLink>
        </div>
        <div class="flex mt-3">
          <div>
            <h1 class="font-medium text-base text-black-font">Debug Logs</h1>
<!--            <p class="text-sm text-gray-font">Set of options that applies for overall RapidLoad plugin</p>-->
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
          <div v-if="!loading && table" class="">
            <div class="flex mb-3 mt-1">
              <div>
                <button @click="clearLogs" :disabled="loading" :class="!table? 'hidden': 'block'"
                        class="disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mb-5 rounded-lg">
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

              <div class="pl-5">
                <h1 class="font-medium text-base text-black-font pt-1.5">Filter By:</h1>
              </div>
              <div class="pl-5 flex">
                <h1 class="pr-1 font-medium text-base text-black-font pt-1.5">Date</h1>
                <date-picker class="max-w-[100px]" v-model="selectedDate" @update:selectedDate="updateSelectedDate"></date-picker>

              </div>
              <div class="pl-5 flex">

                <h1 class="pr-1 font-medium text-base text-black-font pt-1.5">Url</h1>
                <input :class="focus==='cdn-endpoint'? 'cdn-endpoint': ''"
                       ref="cdn_url"
                       v-model="searchUrl"
                       @focus="focus='cdn-endpoint'"
                       @blur="focus=''"
                       style="padding-left:15px"
                       class="min-w-[445px] cdn resize-none text-xs z-50 appearance-none border gray-border rounded-l-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                       type="text" placeholder="">
              </div>

            </div>
          </div>
          <div v-if="!loading && table" class="overflow-auto max-w-[900px] min-h-[450px] max-h-[450px] min-w-[900px]">


            <div class="table-container">
              <table :class="{'scroll-table': shouldEnableScroll}">
                <thead>
                <tr>
                  <th class="date-column">Date</th>
                  <th class="url-column">Url</th>
                  <th class="log-column">Log</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(logs, index) in paginated" :key="index">
                  <td>{{ filterDate(logs.time) }}</td>
                  <td>{{ logs.url }}</td>
                  <td>{{ logs.log }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>


            <div v-if="!loading && table" class="flex justify-center mt-3">
              <div class="flex">
                <div class="pr-2"><svg @click="prev" class="cursor-pointer" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M2.30928 19.1134C2.41237 20.4536 3.4433 21.5876 4.8866 21.6907C6.94845 21.8969 9.83505 22 12 22C14.1649 22 17.0515 21.8969 19.1134 21.6907C19.8351 21.6907 20.4536 21.3814 20.866 20.866C21.2784 20.3505 21.5876 19.8351 21.6907 19.1134C21.8969 17.0515 22 14.1649 22 12C22 9.83505 21.7938 6.94845 21.6907 4.8866C21.5876 3.54639 20.5567 2.41237 19.1134 2.30928C17.0515 2.10309 14.1649 2 12 2C9.83505 2 6.94845 2.20619 4.8866 2.30928C3.54639 2.41237 2.41237 3.4433 2.30928 4.8866C2.10309 6.94846 2 9.83505 2 12C2 14.165 2.10309 17.0515 2.30928 19.1134ZM7.05155 12.0347L10.7629 7.36083C10.866 7.15464 11.0722 7.05155 11.3814 7.05155C11.5876 7.05155 11.6907 7.15464 11.8969 7.25773C12.2062 7.56701 12.3093 7.97938 12 8.28866L9.52577 11.1753L16.1237 11.1753C16.5361 11.1753 16.9485 11.4845 16.9485 12C16.9485 12.5155 16.6392 12.8247 16.1237 12.8247L9.62887 12.8247L12.1031 15.7113C12.4124 16.0206 12.3093 16.5361 12 16.7423C11.6907 17.0515 11.1753 16.9485 10.9691 16.6392L7.05155 12.0347Z"
                      fill="#7F54B3"/>
                </svg></div>

<!--                <div><span class="mr-2 ml-2">{{ current }}</span></div>-->
                <div v-for="pageNumber in pageNumbers" :key="pageNumber">
                  <button v-if="pageNumber === '...'" disabled>...</button>
                  <button v-else-if="pageNumber === current" :class="{ 'current-page': true }" disabled>{{ pageNumber }}</button>
                  <button :class="{ 'current-page': pageNumber === current, 'page': pageNumber !== current }" v-else @click="goToPage(pageNumber)">{{ pageNumber }}</button>
                </div>
                <div><svg @click="next()" class="cursor-pointer" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M21.6907 4.88654C21.5876 3.54633 20.5567 2.41231 19.1134 2.30922C17.0515 2.10303 14.1649 1.99994 12 1.99994C9.83505 1.99994 6.94845 2.10303 4.8866 2.30922C4.16495 2.30922 3.54639 2.6185 3.13402 3.13396C2.72165 3.64942 2.41237 4.16489 2.30928 4.88654C2.10309 6.94839 2 9.83499 2 11.9999C2 14.1649 2.20619 17.0515 2.30928 19.1133C2.41237 20.4535 3.4433 21.5876 4.8866 21.6907C6.94845 21.8968 9.83505 21.9999 12 21.9999C14.1649 21.9999 17.0515 21.7938 19.1134 21.6907C20.4536 21.5876 21.5876 20.5566 21.6907 19.1133C21.8969 17.0515 22 14.1649 22 11.9999C22 9.83499 21.8969 6.94839 21.6907 4.88654ZM16.9485 11.9653L13.2371 16.6391C13.134 16.8453 12.9278 16.9484 12.6186 16.9484C12.4124 16.9484 12.3093 16.8453 12.1031 16.7422C11.7938 16.4329 11.6907 16.0206 12 15.7113L14.4742 12.8247H7.87629C7.46392 12.8247 7.05155 12.5154 7.05155 11.9999C7.05155 11.4845 7.36082 11.1752 7.87629 11.1752H14.3711L11.8969 8.2886C11.5876 7.97932 11.6907 7.46386 12 7.25767C12.3093 6.94839 12.8247 7.05148 13.0309 7.36076L16.9485 11.9653Z"
                      fill="#7F54B3"/>
                </svg></div>
              </div>

            </div>

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
import DatePicker from '../../components/calander.vue';

export default {
  name: "general-settings",

  components: {
    Vue3TagsInput,
    messageBox,
    DatePicker,
  },

  mounted() {

    axios.get(window.uucss_global.ajax_url + '?action=uucss_logs&nonce='+window.uucss_global.nonce)
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
    updateSelectedDate(selectedDate) {
      this.selectedDate = selectedDate;
    },
    date(){
        console.log("this log date"+ this.selectedDate);

    },
    filterDate(date){
      const dateFormat= new Date(date*1000);
      return (dateFormat.getMonth()+1)+
          "/"+dateFormat.getDate()+
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
    goToPage(pageNumber) {
      this.current = pageNumber;
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

      axios.post(window.uucss_global.ajax_url + '?action=clear_uucss_logs&nonce='+window.uucss_global.nonce)
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
    pageNumbers() {
      const pageCount = Math.ceil(this.filteredLogs.length / this.pageSize);
      let startPage = 1;
      let endPage = pageCount;
      if (pageCount > 10) {
        if (this.current <= 6) {
          endPage = 10;
        } else if (this.current + 4 >= pageCount) {
          startPage = pageCount - 9;
        } else {
          startPage = this.current - 5;
          endPage = this.current + 4;
        }
      }
      const pageNumbers = [];
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < pageCount) {
        pageNumbers.push('...');
        pageNumbers.push(pageCount);
      }
      return pageNumbers;
    },
    filteredLogs() {
      return this.debug_log.filter(log => {
        const urlMatch = log.url.toLowerCase().includes(this.searchUrl.toLowerCase());
        const selectedDate = this.selectedDate;
        const dateMatch = selectedDate ? this.filterDate(log.time).startsWith(selectedDate) : true;
        return urlMatch && dateMatch;
      });
    },
    shouldEnableScroll() {
      return this.paginated.length > this.maxEntriesBeforeScroll;
    },
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      const filteredLogs = this.debug_log.filter(log => {
        console.log('');
        const urlMatch = log.url.toLowerCase().includes(this.searchUrl.toLowerCase());

        const selectedDate = this.selectedDate;
        const dateMatch = selectedDate ? this.filterDate(log.time).startsWith(selectedDate) : true;
        return urlMatch && dateMatch;
      });
      if (filteredLogs.length > 0) {
        return filteredLogs.slice(this.indexStart, this.indexEnd);
      } else {
        return [];
      }
    },
    formattedDate() {
      if (!this.selectedDate) {
        return '';
      }
      return new Date(this.selectedDate).toLocaleDateString();
    }

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
      searchUrl: '',
      selectedDate: null,
      maxEntriesBeforeScroll: 10,
    }
  },


}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  max-width: 850px;
}

.scroll-table {
  overflow-y: scroll;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.date-column {
  width: 125px;
  max-width: 125px;
}

.url-column {
  width: 250px;
  max-width: 250px;
  word-wrap: break-word;
}

.log-column {
  width: 350px;
  max-width: 350px;
  word-wrap: break-word;
}
</style>