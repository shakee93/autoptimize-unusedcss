<template>
  <div class="popup-confirmation">
    <div class="">
      <div class="max-w-lg w-full">
        <div class="flex max-w-lg w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <div class="-mx-3 py-2 px-4">
            <div class="mx-3 text-left p-3">
              <span class="text-black-font font-semibold text-base">Welcome to RapidLoad 2.0!</span><br><br>
              <p class="text-sm text-gray-font">Hey {{ this.default }},</p><br>
              <p class="text-sm text-gray-font">We're thrilled to have you on board with RapidLoad 2.0. Here's a quick guide to help you navigate:</p><br>
              <p class="text-sm text-gray-font">1. <b>Job Queue & Statuses:</b> Now operate in the background. Access them via 'CSS Delivery -> Legacy Dashboard' button on the top right.</p><br>
              <p class="text-sm text-gray-font">2. <b>Unused & Critical CSS Settings:</b> Improved and moved to 'CSS delivery' section.</p><br>
              <p class="text-sm text-gray-font">3. <b>Rules:</b> Now called 'Group by page'. Access and modify them via 'CSS delivery -> Group by pages -> Settings'.</p><br>
              <p class="text-sm text-gray-font">Enjoy exploring the new features, and don't hesitate to share your feedback with us. Happy optimizing with RapidLoad 2.0!</p>
            </div>
            <div class="flex justify-end mt-2">

              <button
                  class="flex mb-3 mr-2 cursor-pointer transition duration-300 font-semibold text-purple-p py-2 px-4"
                  @click="doNotRemind"
              >
                Don't Remind Me
              </button>

              <button
                  class="flex mb-3 mr-6 cursor-pointer transition duration-300 font-semibold text-arrow-message-tc py-2 px-4"
                  @click="cancel"
              >
                Close
              </button>
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
