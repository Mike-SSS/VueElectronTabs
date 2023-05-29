<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <div class="text-h2 mb-4">User Profile Information</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row justify="start">
      <v-col class="text-left" cols="6">
        <div v-if="hq?.admin" class="mb-3">Admin: <br />{{ hq?.admin }}</div>
        <div class="mb-3">Setup: <br />{{ hq?.setup }}</div>
        <div class="mb-3">Trading System: <br />{{ hq?.tradingSystem }}</div>
      </v-col>
      <v-col class="text-left" cols="6">
        <v-select
          v-model="selected.branch"
          label="Branch"
          :items="branches"
        ></v-select>
        <v-select
          v-model="selected.client"
          label="Client"
          :items="clients"
        ></v-select>
        <v-select
          v-model="selected.dealer"
          label="Dealer"
          :items="dealers"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="start"> </v-row>
    <!-- <v-row
      ><v-col
        ><div class="text-left">
          <pre>{{ hq ? hq : "No token detected. Login not valid" }}</pre>
        </div></v-col
      ></v-row
    > -->
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { reactive } from "vue";

const authStore = useAuthStore();

const selected = reactive<{
  client: string | null;
  branch: string | null;
  dealer: string | null;
}>({
  client: null,
  branch: null,
  dealer: null,
});
const branches = computed(() => hq.value?.clientCodes.map((e) => e.branch));
const clients = computed(() => {
  if (
    selected.branch &&
    hq.value &&
    hq.value.clientCodes.find((e) => e.branch == selected.branch)
  ) {
    return hq.value.clientCodes
      .find((e) => e.branch == selected.branch)
      ?.clientCodes.splice(0, 50);
  } else {
    return [];
  }
});
const dealers = computed(() => hq.value?.dealer);
const hq = computed(() => authStore.getHQ);
</script>

<style></style>
