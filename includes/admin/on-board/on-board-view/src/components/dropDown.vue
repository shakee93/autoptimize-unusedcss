<template>
  <div class="custom-select text-sm" :tabindex="tabindex" @blur="open = false">
    <div class="selected p-6 pl-2 pt-1 pb-1 hover:bg-purple hover:text-white transition duration-300 bg-transparent text-black-font border border-gray-button-border hover:border-transparent" :class="{ open: open }" @click="open = !open">
      {{ selected }}
    </div>
    <div class="items border border-gray-button-border bg-white" :class="{ selectHide: !open }">
      <div class="hover:bg-purple hover:text-white transition duration-300 bg-transparent text-black-font rounded-md"
          v-for="option in options"
          @click="
          selected = option;
          open = false;
          $emit('input', option);"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropDown",
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default ? this.default : this.options.length > 0 ? this.options[0] : null,
      open: false,
    };
  },
  mounted() {
    this.$emit("input", this.selected);
  },
  methods:{
    triggerClick(){
      if(this.selected){
        console.log(this.selected)
      }

    }
  }
}
</script>

<style scoped>

</style>