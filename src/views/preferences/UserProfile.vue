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
          no-data-text="No Branches loaded"
          label="Branch"
          :items="branches"          
        ></v-select>
        <v-select
          v-model="selected.dealer"
          label="Dealer"
          :items="dealers"
          no-data-text="Be sure to select a branch"
        ></v-select>
        <v-select
          v-model="selected.client"
          label="Client"
          :items="clients"
          no-data-text="Be sure to select a dealer"
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
const branches = computed(() => {
  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    return hq.value.masterDealerCodes.map((e) => e.branch);
  } else {
    if (!hq.value.clientCodes) return [];
    return hq.value.clientCodes.map((e) => e.branch);
  }
});
const clients = computed(() => {
  if (!selected.branch) return [];

  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    const branch = hq.value.masterDealerCodes.find(
      (e) => e.branch == selected.branch
    );
    if (!branch) return [];
    return branch.clientCodes;
  } else {
    if (!hq.value.clientCodes) return [];
    const branch = hq.value.clientCodes.find(
      (e) => e.branch == selected.branch
    );
    if (!branch) return [];
    const _dealer = branch.codesPerDealer.find(
      (e) => e.dealerCode == selected.dealer
    );
    if (!_dealer) return [];
    return _dealer.clientCodes;
  }
});
const dealers = computed(() => {
  if (!selected.branch) return [];
  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    const branch = hq.value.masterDealerCodes.find((e) => e.dealers);
    if (!branch) return [];
    return branch.dealers;
  } else {
    if (!hq.value.clientCodes) return [];
    const branch = hq.value.clientCodes.find(
      (e) => e.branch == selected.branch
    );
    if (!branch) return [];
    const _dealers = branch.codesPerDealer.map((e) => e.dealerCode);
    return _dealers;
  }
});
const hq = computed(() => authStore.getHQ);
</script>

<style></style>
