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
        <div class="-mt-2 text-center">
          <p class="text-[24px] font-semibold">How to <span class="text-gray-font">Access</span></p>
        </div>

        <div class="mt-4 mb-2 text-center">
          <img src="../assets/titan-access-3.gif" alt="Welcome" class="w-250 h-250	mx-auto rounded-md">
        </div>

<!--        <div class="mt-4 text-left text-base">-->
<!--          <p class="text-black pb-3">Get ready for an exhilarating journey as we guide you through our arsenal of powerful tools, including the groundbreaking Titan Optimizer, your key to lightning-fast websites. </p>-->

<!--          <p class="text-black">Stay with us as we embark on your first run job and unveil more exciting features to turbocharge your web experience!</p>-->

<!--        </div>-->

<!--        <div class="flex justify-end mt-4 -mr-2">-->

<!--          <button-->
<!--              class="text-[14px] bg-purple font-semibold text-white py-3 px-12 border rounded-full"-->
<!--              @click="getStarted"-->
<!--          >-->
<!--            Get Started-->
<!--          </button>-->

<!--        </div>-->
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
