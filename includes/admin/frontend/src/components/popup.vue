<template>
  <div class="popup-confirmation">
    <div class="">
      <div class="max-w-sm w-full">
        <div class="flex max-w-sm w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <div class="-mx-3 py-2 px-4">
            <div class="mx-3 text-center">
              <span class="text-black-font font-semibold text-base">Unsaved Changes</span>
              <p class="text-sm text-gray-font">Are you sure you want to discard these changes? Your settings will be lost.</p>
            </div>
            <div class="flex justify-center mt-2">
              <button
                  class="disabled:opacity-50 flex mb-3 mr-6 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent rounded-lg"
                  @click="handleYesClick"
              >
                Yes
              </button>
              <button
                  class="disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent rounded-lg"
                  @click="handleCancelClick"
              >
                Cancel
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
  name: "popup",
  methods: {
    handleYesClick() {
      this.$emit("confirm");
    },
    handleCancelClick() {
      this.$emit("cancel");

    },
  },
};
</script>

<style scoped>

</style>
