<template>
  <div class="popup-confirmation">
    <div class="">
      <div class="max-w-sm w-full">

          <div class="flex max-w-sm w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
            <div class="flex justify-center items-center w-12 bg-message-green">
              <svg
                  class="h-6 w-6 fill-current text-white"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                ></path>
              </svg>

            </div>

            <div class="-mx-3 py-2 px-4">
              <div class="mx-3">
                <span class="text-message-green font-semibold text-base">Do you want to save changes?</span>
<!--                <p class="text-gray-font text-sm">{{notification.text}}</p>-->
              </div>
              <div class="flex ml-[40px]">
                <button class="disabled:opacity-50 flex mb-3 mr-6 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
                  Yes
                </button>
                <button class="disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
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
  name: "popup"
}
</script>

<style scoped>

</style>