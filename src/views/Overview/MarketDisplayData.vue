<template>
  <v-container fluid>
    <div class="text-h4">Market Display Data ({{ marketData.length }})</div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

const marketData = ref(appStore.getMarketDisplayData);

onMounted(() => {
  console.log("Mounted marketDisplayData");
});
</script>
