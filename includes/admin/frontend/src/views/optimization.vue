<template>
  <main>
    <div class="flex ml-4 mt-12">


       <div class="w-[285px] h-[384px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white">

         <div class="content grid place-content-center place-items-center mt-[30px]">
           <div class="performance-circle">
             <svg width="155" height="155">
               <circle class="inner-circle" cx="77.5" cy="77.5" r="62" stroke-width="23" />
               <circle ref="progressBar" class="progress-bar" cx="77.5" cy="77.5" r="62" stroke-width="23" :stroke="this.performanceColor" />
               <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="text-[28px] text-black">{{ progress }}%</text>
             </svg>
           </div>
           <div class="flex mb-2 mt-3">
             <svg class="mr-2 mt-1" height="12.5" width="12.5">
               <circle cx="6.25" cy="6.25" r="5" :fill="this.performanceColor" />
             </svg>
             <h1 class="text-base font-bold">Performance</h1>
           </div>
           <div class="grid grid-cols-3 gap-3">
             <div class="flex">
               <svg class="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"/>
               </svg>
               <p class="text-xm font-normal">0-49</p>
             </div>
             <div class="flex">
               <svg class="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <rect width="9" height="9" fill="#FFAA33"/>
               </svg>
               <p class="text-xm font-normal">50-89</p>
             </div>
             <div class="flex">
               <svg class="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="4.5" cy="4.5" r="4.5" fill="#09B42F"/>
               </svg>
               <p class="text-xm font-normal">89-100</p>
             </div>
           </div>
           <div class="mt-2 ml-[26px] mr-[26px] border-t-2 border-gray-border-line content grid place-content-center place-items-center">
             <p class="mt-1.5 text-xm font-normal text-center">Values are estimated and may vary. The
               performance score is calculated directly
               from these metrics.</p>
             <button class=" text-xs bg-transparent mb-3 text-black-b transition duration-300 hover:bg-purple font-medium hover:text-white py-1 px-3 border border-gray-button-border hover:border-transparent mt-3 rounded-full">
               27 data points
             </button>
           </div>

         </div>

       </div>

        <div class="ml-8 w-[675px] h-[440px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white flex">
          <div class="m-4 w-[215px] h-[405px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
            <div @click="selected('FirstContent')" :class="performanceSelect==='FirstContent'? 'bg-performance-green-bg text-white':''" class="content p-2 pt-1.5 pb-1 pl-5 pr-5 rounded-t-xl transition duration-300  hover:bg-performance-green-bg hover:text-white">
              <div :class="performanceSelect==='FirstContent'? 'rl-Show':'rl-Hide'" class="before:top-[35px] transition duration-300 arrow-top-performance arrow-top"></div>
              <p class="mb-0 mt-2 text-sm font-normal">First Contentful Paint</p>
              <div class="actions pb-1 flex justify-between pt-1 pb-1.5">
                <div class="mt-1" >
                  <p class="text-xl font-normal text-center">0.98 s</p>
                </div>
                <div class="">
                  <div class="performance-circle">
                    <svg width="35" height="35">
                      <circle class="inner-circle" cx="17.5" cy="17.5" r="14" stroke-width="5px"/>
                      <circle ref="FirstContentfulPaint" class="progress-bar" cx="17.5" cy="17.5" r="14" stroke-width="5px" :stroke="this.performanceColor" />
                      <text x="50%" y="50%" text-anchor="middle" dy=".4em" class="text-[10px]" >{{ progress }}</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div @click="selected('LargestContentful')" :class="performanceSelect==='LargestContentful'? 'bg-performance-green-bg text-white':''" class="group content p-2 pb-1 pt-0 pl-5 pr-5 transition duration-300  hover:bg-performance-green-bg hover:text-white">
              <div :class="performanceSelect==='LargestContentful'? 'rl-Show':'rl-Hide'" class="before:top-[115px] transition duration-300 arrow-top-performance arrow-top"></div>
              <hr :class="performanceSelect==='LargestContentful'? 'border-performance-green-bg':''" class="border-gray-border-line border-b-0 border-2 group-hover:border-performance-green-bg transition duration-300">
              <p class="mb-0 mt-2 text-sm font-normal">Largest Contentful Paint</p>
              <div class="actions pb-1 flex justify-between pt-1 pb-1.5">
                <div class="mt-1" >
                  <p class="text-xl font-normal text-center">1.75 s</p>
                </div>
                <div class="">
                  <div class="performance-circle">
                    <svg width="35" height="35">
                      <circle class="inner-circle" cx="17.5" cy="17.5" r="14" stroke-width="5px"/>
                      <circle ref="FirstContentfulPaint" class="progress-bar" cx="17.5" cy="17.5" r="14" stroke-width="5px" :stroke="this.performanceColor" />
                      <text x="50%" y="50%" text-anchor="middle" dy=".4em" class="text-[10px] text-black" >{{ progress }}</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div @click="selected('CumulativeLayout')" :class="performanceSelect==='CumulativeLayout'? 'bg-performance-green-bg text-white':''" class="group content p-2 pb-1 pt-0 pl-5 pr-5 hover:bg-performance-green-bg hover:text-white transition duration-300">
              <div :class="performanceSelect==='CumulativeLayout'? 'rl-Show':'rl-Hide'" class="before:top-[195px] transition duration-300 arrow-top-performance arrow-top"></div>
              <hr :class="performanceSelect==='CumulativeLayout'? 'border-performance-green-bg':''" class="border-gray-border-line border-b-0 border-2 group-hover:border-performance-green-bg transition duration-300">
              <p class="mb-0 mt-2 text-sm font-normal">Cumulative Layout Shift</p>
              <div class="actions pb-1 flex justify-between pt-1 pb-1.5">
                <div class="mt-1" >
                  <p class="text-xl font-normal text-center">0.01</p>
                </div>
                <div class="">
                  <div class="performance-circle">
                    <svg width="35" height="35">
                      <circle class="inner-circle" cx="17.5" cy="17.5" r="14" stroke-width="5px"/>
                      <circle ref="FirstContentfulPaint" class="progress-bar" cx="17.5" cy="17.5" r="14" stroke-width="5px" :stroke="this.performanceColor" />
                      <text x="50%" y="50%" text-anchor="middle" dy=".4em" class="text-[10px] text-black" >{{ progress }}</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div @click="selected('FirstInput')" :class="performanceSelect==='FirstInput'? 'bg-performance-green-bg text-white':''" class="group content p-2 pb-1 pt-0 pl-5 pr-5 hover:bg-performance-green-bg hover:text-white transition duration-300">
              <div :class="performanceSelect==='FirstInput'? 'rl-Show':'rl-Hide'" class="before:top-[275px] transition duration-300 arrow-top-performance arrow-top"></div>
              <hr :class="performanceSelect==='FirstInput'? 'border-performance-green-bg':''" class="border-gray-border-line border-b-0 border-2 group-hover:border-performance-green-bg transition duration-300">
              <p class="mb-0 mt-2 text-sm font-normal">First Input Delay</p>
              <div class="actions pb-1 flex justify-between pt-1 pb-1.5">
                <div class="mt-1" >
                  <p class="text-xl font-normal text-center">26 ms</p>
                </div>
                <div class="">
                  <div class="performance-circle">
                    <svg width="35" height="35">
                      <circle class="inner-circle" cx="17.5" cy="17.5" r="14" stroke-width="5px"/>
                      <circle ref="FirstContentfulPaint" class="progress-bar" cx="17.5" cy="17.5" r="14" stroke-width="5px" :stroke="this.performanceColor" />
                      <text x="50%" y="50%" text-anchor="middle" dy=".4em" class="text-[10px] text-black" >{{ progress }}</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div @click="selected('Interaction')" :class="performanceSelect==='Interaction'? 'bg-performance-green-bg text-white':''" class="group content p-2 pb-1 pt-0 pl-5 pr-5 hover:bg-performance-green-bg hover:text-white rounded-b-xl transition duration-300">
              <div :class="performanceSelect==='Interaction'? 'rl-Show':'rl-Hide'" class="before:top-[355px] transition duration-300 arrow-top-performance arrow-top"></div>
              <hr :class="performanceSelect==='Interaction'? 'border-performance-green-bg':''" class="border-gray-border-line border-b-0 border-2 group-hover:border-performance-green-bg transition duration-300">
              <p class="mb-0 mt-2 text-sm font-normal">Interaction To Next Paint</p>
              <div class="actions pb-1 flex justify-between pt-1 pb-1.5">
                <div class="mt-1" >
                  <p class="text-xl font-normal text-center">48 ms</p>
                </div>
                <div class="">
                  <div class="performance-circle">
                    <svg width="35" height="35">
                      <circle class="inner-circle" cx="17.5" cy="17.5" r="14" stroke-width="5px"/>
                      <circle ref="FirstContentfulPaint" class="progress-bar" cx="17.5" cy="17.5" r="14" stroke-width="5px" :stroke="this.performanceColor" />
                      <text x="50%" y="50%" text-anchor="middle" dy=".4em" class="text-[10px] text-black" >{{ progress }}</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="m-4 ml-0 w-[410px] h-[405px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
            <div>

            </div>
            <div class="p-4 pb-1">
              <h2 class="text-xm font-bold">{{ this.select.status }}</h2>
              <h3 class="mt-1 text-xm font-medium">{{ this.select.heading }}</h3>
              <p class="mt-1 text-xsm font-normal">{{ this.select.content }}</p>
              <hr class="mt-2 mb-1 border-gray-border-line border-b-0 border-2">
            </div>
            <div class="pl-4 pr-4 pb-1 mt-1 flex justify-between">
              <div>
                <h2 class="text-xss font-semibold pr-2">{{ this.select.fcp_by_last_day }}</h2>
              </div>
              <div class="flex">
                <h2 class="text-xss font-semibold pr-2">{{ this.select.fcp }}</h2>
                <h2 class="text-xss font-semibold pr-2">{{ this.select.production }}</h2>
              </div>

            </div>

            <div class="p-2">
              <line-chart :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

    </div>

  </main>
</template>

<script>
import LineChart from '../components/LineChart.vue';

export default {
  name: "optimization",

  components: {
    LineChart
  },

  mounted(){
    this.animateProgressBar();

  },
  methods:{


    animateProgressBar() {
      const progressBar = this.$refs.progressBar;
      const radius = progressBar.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      let progress = 0;
      let performance = 85;
      progressBar.style.strokeDasharray = circumference;
      progressBar.style.strokeDashoffset = circumference;

      if(performance < 50){
        this.performanceColor = '#FF3333';
      }else if(performance < 90){
        this.performanceColor = '#FFAA33';
      }else if(performance < 101){
        this.performanceColor = '#09B42F';
      }

      const interval = setInterval(() => {
        if (progress >= performance) {
          clearInterval(interval);
        } else {
          progress += 1;
          const offset = circumference - progress / 100 * circumference;
          progressBar.style.strokeDashoffset = offset;
          this.progress = progress;
        }
      }, 20);
    },

    selected(value){
      this.performanceSelect = value;
      if(value === 'FirstContent'){
          this.select.status = 'Good';
          this.select.heading = 'First Content Paint Loading time 0.934s.';
          this.select.content = 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More.';
        this.select.fcp_by_last_day = 'FCP by Last Day';
        this.select.fcp = 'FCP';
        this.select.production = 'Production Deployments';
      }
      else if(value === 'LargestContentful')
      {
        this.select.status = 'Good 1';
        this.select.heading = 'First Content Paint Loading time 0.934s. 1';
        this.select.content = 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More. 1';
        this.select.fcp_by_last_day = 'FCP by Last Day';
        this.select.fcp = 'FCP';
        this.select.production = 'Production Deployments';
      }
      else if(value === 'CumulativeLayout')
      {
        this.select.status = 'Good 2';
        this.select.heading = 'First Content Paint Loading time 0.934s. 2';
        this.select.content = 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More. 2';
        this.select.fcp_by_last_day = '';
        this.select.fcp = '';
        this.select.production = '';
      }
      else if(value === 'FirstInput')
      {
        this.select.status = 'Good 3';
        this.select.heading = 'First Content Paint Loading time 0.934s. 3';
        this.select.content = 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More. 3';
        this.select.fcp_by_last_day = '';
        this.select.fcp = '';
        this.select.production = '';
      }
      else if(value === 'Interaction')
      {
        this.select.status = 'Good 4';
        this.select.heading = 'First Content Paint Loading time 0.934s. 4';
        this.select.content = 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More. 4';
        this.select.fcp_by_last_day = '';
        this.select.fcp = '';
        this.select.production = '';
      }
    }

  },

  data() {
    return {
      progress: 0,
      performanceColor: '#09B42F',
      performanceSelect: 'FirstContent',
      select:{
        status: 'good',
        heading: 'First Content Paint Loading time 0.934s.',
        content: 'When the browser renders the first bit of content from the DOM, providing the first feedback to the user that the page is actually loading. Learn More.',
        fcp_by_last_day:'',
        fcp:'',
        production: '',
      },

      chartData: {
        labels: ['','12:00', '16:00', '20:00', '00:00', '04:00', '08:00'],
        datasets: [
          {
            label: 'Sales',
            borderColor: '#3e95cd',
            data: [0, 0.5, 1.5, 1, 0.5, 3],
          }
        ]
      },
      chartOptions: {
        scales: {
          // yAxes: [{
          //   ticks: {
          //     beginAtZero: true,
          //     callback: function(value, index, values) {
          //       return value + 's';
          //     }
          //   }
          // }]
        },

        title: {
          display: true,
          text: 'Sales by Month'
        }
      }
    };
  },
}
</script>

<style scoped>

</style>