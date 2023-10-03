<template>
  <div class="popup-confirmation">
    <div class="">
      <div class="max-w-lg w-full">
        <div class="flex max-w-lg w-full mx-auto bg-white shadow-md rounded-[20px] overflow-hidden mt-4">
          <div class="-mx-3 py-2 px-4">
            <div class="mx-3 text-left p-5">
              <div class="flex pb-4">
                <div class="min-w-[245px]">
                <span class="text-black-font font-semibold text-base">🎉 Welcome to RapidLoad 2.0!</span><br>
                </div>
                <div class="ml-[180px] hover:cursor-pointer" @click="cancel">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 17L9.00002 9.00003M9.00002 9.00003L17 1M9.00002 9.00003L1 1M9.00002 9.00003L17 17" stroke="#8D8D8D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </div>
              </div>

              <hr class="border-gray-border-line border-b-0 mt-1 -ml-[40px] -mr-[40px] pt-2 pb-2">
              <p class="text-sm text-gray-font">Hello 👋</p><br>
              <p class="text-sm text-gray-font">We're thrilled to have you on board with RapidLoad 2.0. Let's get Start to Analyze by clicking the button below</p><br>

            </div>
            <hr class="border-gray-border-line border-b-0 mt-1 -ml-[40px] -mr-[40px] pt-2">
            <div class="flex justify-center">

              <button
                  class="flex mb-3 cursor-pointer transition duration-300 font-semibold text-gray-l py-2 px-4"
                  @click="getStarted"
              >
                Get Started
              </button>

<!--              <button-->
<!--                  class="flex mb-3 mr-6 cursor-pointer transition duration-300 font-semibold text-arrow-message-tc py-2 px-4"-->
<!--                  @click="cancel"-->
<!--              >-->
<!--                Close-->
<!--              </button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "popupModel",
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
