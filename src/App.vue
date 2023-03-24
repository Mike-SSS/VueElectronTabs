<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, inject } from "vue";
</script>

<style>
#app {
  background: var(--v-background-base);
}
</style>
