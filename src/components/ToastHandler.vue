<template>
  <v-snackbar
    :content-props="{
      style: {
        transform: `translateX(0)`,
        right: 0,
      },
    }"
    position="absolute"
    v-if="toastStore.currentToast"
    :key="toastStore.currentToast.id"
    :model-value="toastStore.currentToast.showing"
    color="error"
    timeout="-1"
    @update:modelValue="toastStore.removeToast(toastStore.currentToast.id)"
  >
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="toastStore.removeToast(toastStore.currentToast.id)"
      >
        Close
      </v-btn>
    </template>
    <div class="text-break">{{ toastStore.currentToast.message }}</div>
  </v-snackbar>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useToastStore } from "@/store/toastStore";

const toastStore = useToastStore();

const toasts = computed(() => toastStore.getToasts);
</script>
