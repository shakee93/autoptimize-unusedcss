<template>
  <div class="popup-confirmation">
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div class="bg-white p-4 pt-6 pl-12 pr-12 rounded-3xl shadow-lg max-w-xl">
        <!-- Close Button -->
        <div class="flex justify-end">
          <button class="text-gray-500" @click="cancel">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 15L8.50002 8.50003M15 2L8.50002 8.50003M8.50002 8.50003L2 2M8.50002 8.50003L15 15" stroke="#CACACA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="-mt-[26px] text-center">
          <p class="text-[24px] font-semibold">Welcome to <span class="text-gray-font">RapidLoad</span></p>
        </div>

        <div class="mt-4 mb-2 text-center">
          <img src="../assets/welcome.svg" alt="Welcome" class="w-52 h-52	mx-auto rounded-full">
        </div>

        <div class="mt-4 text-left text-base">
          <p class="text-black pb-3">Get ready for an exhilarating journey as we guide you through our robust collection of tools, including the all-new Titan Optimizer, your key to lightning-fast websites.</p>
          <p class="text-black">Stay with us as we embark on your first run job and unveil more exciting features to turbocharge your web experience!</p>
        </div>

        <div class="flex justify-end mt-4">

          <button
              class="text-[14px] bg-purple font-semibold text-white py-3 px-12 border rounded-full"
              @click="getStarted"
          >
            Get Started
          </button>

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
