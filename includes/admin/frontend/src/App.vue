<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="rapidload-wrapper mt-12 ml-8">

    <header >

      <RouterLink to="/">
        <img alt="RapidLoad Logo" class="logo ml-4" src="@/assets/logo.svg" width="200" />
      </RouterLink>

      <div class="wrapper mb-8">

        <nav>

        </nav>
      </div>
    </header>

    <RouterView />

  </div>

</template>

<style>

</style>
