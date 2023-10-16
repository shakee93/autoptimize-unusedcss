<template>
  <div class="w-72 h-56 drop-shadow-sm rounded-xl border border-gray-border-line bg-white">

    <div class="pl-4 pr-4 pb-2 pt-2 grid grid-cols-2 gap-4 items-center">
      <div class="col-start-1 col-end-3" >
        <h4 class="heading-margin text-gray-h text-base font-semibold">Performance</h4>
      </div>
<!--      <div class="col-end-7 col-span-2">-->
<!--        <svg class="heading-margin"  width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--          <circle cx="11.5" cy="11.5" r="11.5" fill="#09B42F"/>-->
<!--          <path d="M7 11.3455L10.4068 15L16 9" stroke="white" stroke-width="2.5"/>-->
<!--        </svg>-->
<!--      </div>-->
    </div>

    <hr class="border-gray-border-line border-b-0">

    <div class="p-2 pl-4 pr-4 pb-1 flex justify-center items-center">

<!--      <circle-progress :transition="500" :percent="80" :viewport="true" :show-percent="true" :fill-color="'#0EBFE6'" :background="'#0EBFE6'"/>-->

      <div class="performance-circle">
        <svg width="155" height="155">
          <rect width="100%" height="100%" :fill="this.performanceColor" fill-opacity="0.1" rx="50%" ry="50%"/>
          <circle class="inner-circle" cx="77.5" cy="77.5" r="72" stroke-width="10" />
          <circle ref="progressBar" class="progress-bar animate-progress" cx="77.5" cy="77.5" r="72" stroke-width="10" :stroke="this.performanceColor" />
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="text-[28px] text-black">{{ progress }}</text>
        </svg>
      </div>


    </div>

  </div>




</template>

<script>

import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";


export default {
  name: "performanceWidget",

  components: {
    CircleProgress,

  },

  props: {
    score: {
      type: Number,
      required: false,
      default: null,
    },
  },
  mounted(){
    //this.animateProgressBar();
  },
  methods: {
    getStarted() {
      this.$emit("start");

    },
    cancel() {
      this.$emit("cancel");

    },

    animateProgressBar() {
      const progressBar = this.$refs.progressBar;
      const radius = progressBar.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      let progress = 0;
      let performance = this.score;
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
      }, 10);
    },
  },
  data(){
    return{
      performanceScore: this.score ? this.score : null,
      back: '/',
      progress: 0,
      performanceColor: '#09B42F',
    }
  }
};
</script>

<style scoped>

</style>
