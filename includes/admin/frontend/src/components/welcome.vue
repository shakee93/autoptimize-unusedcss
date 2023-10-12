<template>
  <div class="popup-confirmation">
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div class="bg-white p-4 pt-6 pl-12 pr-12 rounded-3xl shadow-lg max-w-xl">
        <!-- Close Button -->
        <div class="flex justify-end">
          <button class="text-gray-500" @click="cancel">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 17L9.00002 9.00003M9.00002 9.00003L17 1M9.00002 9.00003L1 1M9.00002 9.00003L17 17" stroke="#8D8D8D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="-mt-2 text-center">
          <p class="text-[24px] font-semibold">Welcome to <span class="text-gray-font">RapidLoad</span></p>
        </div>

        <div class="mt-4 mb-2 text-center">
          <img src="../assets/welcome.svg" alt="Welcome" class="w-52 h-52	mx-auto rounded-full">
        </div>

        <div class="mt-4 text-left text-base">
          <p class="text-black pb-3">Get ready for an exhilarating journey as we guide you through our arsenal of powerful tools, including the groundbreaking Titan Optimizer, your key to lightning-fast websites. </p>

          <p class="text-black">Stay with us as we embark on your first run job and unveil more exciting features to turbocharge your web experience!</p>

        </div>

        <div class="flex justify-end mt-4 -mr-2">

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
