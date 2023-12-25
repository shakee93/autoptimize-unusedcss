<template>
  <div class="popup-confirmation z-50">
    <div class="">
      <div class="max-w-sm w-full">
        <div class="flex max-w-sm w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <div class="-mx-3 py-2 px-4">
            <div class="mx-3 text-left p-2">
              <span class="text-black-font font-semibold text-base">Attention Required</span>
              <hr class="border-gray-border-line border-b-0 mt-[8px] -ml-[25px] -mr-[25px] pt-2 pb-2">
              <p class="text-sm text-gray-font">Are you sure you want to do these changes? "Delaying only selected Javascript (Legacy)" option is deprecated from version 2.2.</p>
            </div>
            <div class="flex justify-start mb-2 pb-2">
              <div class="mr-[100px] ml-2">
              <button
                  class="flex mb-3 cursor-pointer transition duration-300 font-semibold text-arrow-message-tc py-2 px-4 rounded-lg"
                  @click="handleCancelClick"
              >
                Cancel
              </button>
              </div>
              <button
                  class="flex mb-3 cursor-pointer transition duration-300 font-semibold text-gray-font py-2 px-4 rounded-lg"
                  @click="handleDontSave"
              >
                Don't Save
              </button>

              <button
                  class="flex mb-3 mr-6 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent rounded-lg"
                  @click="handleYesClick"
              >
                Save
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
  name: "legacyPopup",
  methods: {
    handleYesClick() {
      this.$emit("confirm");

    },
    handleDontSave() {
      this.$emit("dontsave");

    },
    handleCancelClick() {
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
