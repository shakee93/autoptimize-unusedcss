<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="rapidload-wrapper mt-12 ml-8 container rounded-lg bg-white">

    <header class="bg-w-color">
      <RouterLink to="/">
        <img alt="RapidLoad Logo" class="logo ml-4" src="@/assets/logo.svg" width="200" />
      </RouterLink>
      <div class="wrapper pb-8" >
        <nav>
        </nav>
      </div>
    </header>

    <router-view v-slot="{ Component, route }">
      <transition name="route" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>

  </div>

</template>

<style>

</style>
