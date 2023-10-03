<template>
  <div class="popup-confirmation">
    <div class="">
      <div class="max-w-lg w-full">
        <div class="flex max-w-lg w-full mx-auto bg-white shadow-md rounded-[20px] overflow-hidden mt-4">
          <div class="-mx-3 py-2 px-4">
            <div class="mx-3 text-left p-5">
              <div class="flex pb-4">
                <div class="min-w-[245px]">
                <span class="text-black-font font-semibold text-base">How to Fix</span><br>
                </div>
                <div class="ml-[180px] hover:cursor-pointer" @click="cancel">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 17L9.00002 9.00003M9.00002 9.00003L17 1M9.00002 9.00003L1 1M9.00002 9.00003L17 17" stroke="#8D8D8D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </div>
              </div>

              <hr class="border-gray-border-line border-b-0 mt-1 -ml-[40px] -mr-[40px] pt-2 pb-2">
              <p class="text-sm text-gray-font">Gif Image Here</p><br>

            </div>
            <hr class="border-gray-border-line border-b-0 mt-1 -ml-[40px] -mr-[40px] pt-2">
            <div class="flex justify-center">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "howtoFix",
  props: {
    // default: {
    //   type: String,
    //   required: false,
    //   default: null,
    // },
  },
  methods: {
    cancel() {
      this.$emit("cancel");

    },
  },
  data(){
    return{
      back: '/',
    }
  }
};
</script>

<style scoped>

</style>
