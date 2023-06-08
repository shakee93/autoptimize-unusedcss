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
              <p class="text-sm text-gray-font">Hey {{ this.default }} 👋</p><br>
              <p class="text-sm text-gray-font">We're thrilled to have you on board with RapidLoad 2.0. Here's a quick guide to help you navigate:</p><br>
              <p class="text-sm text-gray-font">🔄 <b class="text-purple">Job Queue & Statuses</b><br> Now operate in the background. Access them via 'CSS Delivery -> Legacy Dashboard' button on the top right.</p><br>
              <p class="text-sm text-gray-font">📑 <b class="text-purple">Unused & Critical CSS Settings</b><br> Improved and moved to 'CSS delivery' section.</p><br>
              <p class="text-sm text-gray-font">⚙ <b class="text-purple">Rules</b><br> Now called 'Group by page'. Access and modify them via 'CSS delivery -> Group by pages -> Settings'.</p><br>
              <p class="text-sm text-gray-font">Enjoy exploring the new features, and don't hesitate to share your feedback with us. Happy optimizing with RapidLoad 2.0!</p>
            </div>
            <hr class="border-gray-border-line border-b-0 mt-1 -ml-[40px] -mr-[40px] pt-2">
            <div class="flex justify-center">

              <button
                  class="flex mb-3 cursor-pointer transition duration-300 font-semibold text-gray-l py-2 px-4"
                  @click="doNotRemind"
              >
                Don't show again
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
    default: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    doNotRemind() {
      this.$emit("dont");

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
