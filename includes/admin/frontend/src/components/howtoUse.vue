<template>
  <div class="popup-confirmation">
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div class="bg-white p-6 rounded-3xl shadow-lg max-w-xl min-w-xl">
        <!-- Close Button -->
        <div class="flex justify-end">
          <button class="text-gray-500" @click="cancel">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 15L8.50002 8.50003M15 2L8.50002 8.50003M8.50002 8.50003L2 2M8.50002 8.50003L15 15" stroke="#CACACA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="-mt-[26px] text-center">
          <p class="text-[24px] font-semibold">Access Titan</p>
        </div>

        <div class="mt-4 text-center">
          <img src="../assets/titan-access-3.gif" alt="Welcome" class="w-[450px]	mx-auto rounded-md">
        </div>

        <div class="mt-4 text-left ">
          <p class="text-black pb-3 text-lg">Access Titan</p>
          <ul class="list-disc pl-4 pr-4">
            <li class="text-black mb-0.5">Open the required page with the WordPress admin bar.</li>
            <li class="text-black mb-0.5">Hover the RapidLoad Navigation button.</li>
            <li class="text-black">Click Titan Optimizer. Voila, now the page is being analyzed.</li>
          </ul>
        </div>

        <div class="flex justify-center mt-4">

          <button
              class="text-[14px] bg-purple font-semibold text-white py-3 px-12 border rounded-full"
              @click="gotoHome"
          >
            Go to Home
          </button>

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
    gotoHome() {
      this.$emit("goto");

    },
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
