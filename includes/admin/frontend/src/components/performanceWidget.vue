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

    <div class="p-2 pl-4 pr-4 pb-1 pt-6">

      <circle-progress :transition="500" :percent="80" :viewport="true" :show-percent="true" :fill-color="'#0EBFE6'" :background="'#0EBFE6'"/>





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
    // default: {
    //   type: String,
    //   required: false,
    //   default: null,
    // },
  },
  methods: {
    getStarted() {
      this.$emit("start");

    },
    cancel() {
      this.$emit("cancel");

    },
  },
  data(){
    return{
      name: this.default ? this.default : null,
      back: '/',
    }
  }
};
</script>

<style scoped>

</style>
