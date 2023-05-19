<template>
  <v-app>
    <ToastHandler></ToastHandler>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { onMounted, onUnmounted, Ref, ref } from "vue";
import ToastHandler from "@/components/ToastHandler.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();
let intervalId: Ref<NodeJS.Timer | null> = ref(null);

onMounted(() => {
  const token = localStorage.getItem("jwt");

  if (token) {
    authStore.setToken(token);
  }
  // intervalId.value = setInterval(() => {
  //   const randomToast = `Random toast ${Math.floor(Math.random() * 1000)}`;
  //   toastStore.addToast(randomToast);
  // }, 2000);
});
onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<style>
#app {
  background: var(--v-background-base);
}
</style>
