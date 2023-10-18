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

        <div class="mt-4 text-left pl-4 pr-4">
          <div class="">
<!--            <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 8 8">-->
<!--              <circle cx="4" cy="4" r="4" fill="black" />-->
<!--            </svg>-->
            <p class="text-black mb-0.5">1. &nbsp;Get to Your Page</p>
            <p class="text-black mb-1 pl-5">a. &nbsp;Open up the page you want to analyze, ensure the WordPress admin bar is visible.</p>
          </div>

          <div class="mt-2">
            <p class="text-black mb-0.5">2. &nbsp;Find RapidLoad</p>
            <p class="text-black mb-1 pl-5">a. &nbsp;Just slide your cursor over to the RapidLoad Button in the admin bar.</p>
          </div>

          <div class="mt-2">
            <p class="text-black mb-0.5">3. &nbsp;Let It Analyze</p>
            <p class="text-black mb-1 pl-5">a. &nbsp;Click "Titan Optimizer" – and watch your page get checked and ready to be tweaked.</p>
        </div>


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
