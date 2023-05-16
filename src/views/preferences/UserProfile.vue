<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <div class="text-h2 mb-4">User Profile Information</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row justify="start">
      <v-col class="text-left">
        <div class="mb-3">Username: <br />{{ hq?.username }}</div>
        <div v-if="hq?.admin" class="mb-3">Admin: <br />{{ hq?.admin }}</div>
        <div class="mb-3">Trading System: <br />{{ hq?.tradingSystem }}</div>
        <div class="mb-3">Default Codes: <br />{{ hq?.defaultCode }}</div>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col class="text-left">
        <div class="mb-3">Unique Code: <br />{{ hq?.uniqueCode }}</div>
        <div class="mb-3">Setup: <br />{{ hq?.setup }}</div>
        <div class="mb-3">
          Clients: ({{ hq?.client.length }})
          <v-btn
            class="ml-3"
            v-if="hq?.client && hq.client?.length > 1"
            @click="state.client = !state.client"
            density="compact"
            variant="tonal"
            size="small"
          >
            {{ state.client ? "Hide" : "View all" }}
          </v-btn>

          <div class="text-body-1" v-if="hq?.client.length == 1">
            {{ hq?.client.toString() }}
          </div>
          <div class="text-body-1 mt-2" v-else-if="state.client">
            <!-- <v-chip-group column selected-class="text-primary"> -->
            <v-chip
              class="ma-1 py-1 px-3"
              size="auto"
              density="comfortable"
              v-for="tag in hq?.client"
              :key="tag"
            >
              <span>{{ tag }}</span>
            </v-chip>
            <!-- </v-chip-group> -->
          </div>
        </div>
        <div class="mb-3">
          Branches: ({{ hq?.branch.length }})
          <v-btn
            class="ml-3"
            v-if="hq?.branch && hq.branch?.length > 1"
            @click="state.branches = !state.branches"
            density="compact"
            variant="tonal"
            size="small"
          >
            {{ state.branches ? "Hide" : "View all" }}
          </v-btn>

          <div class="text-body-1" v-if="hq?.branch.length == 1">
            {{ hq?.branch.toString() }}
          </div>
          <div class="text-body-1 mt-2" v-else-if="state.branches">
            <v-chip
              class="ma-1 py-1 px-3"
              size="auto"
              density="comfortable"
              v-for="tag in hq?.branch"
              :key="tag"
            >
              <span>{{ tag }}</span>
            </v-chip>
          </div>
        </div>
        <div class="mb-3">
          Safex: ({{ hq?.safexCodes.length }})
          <v-btn
            v-if="hq?.safexCodes && hq.safexCodes?.length > 1"
            class="ml-3"
            @click="state.safex = !state.safex"
            density="compact"
            variant="tonal"
            size="small"
          >
            {{ state.safex ? "Hide" : "View all" }}
          </v-btn>
          <div class="text-body-1" v-if="hq?.safexCodes.length == 1">
            {{ hq.safexCodes.toString() }}
          </div>
          <div class="text-body-1 mt-2" v-else-if="state.safex">
            <v-chip
              class="ma-1 py-1 px-3"
              size="auto"
              density="comfortable"
              v-for="tag in hq?.safexCodes"
              :key="tag"
            >
              <span>{{ tag }}</span>
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>
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

const storeLayout = useAuthStore();

const state = reactive({
  safex: false,
  client: false,
  branches: false,
});

const hq = computed(() => storeLayout.getHQ);
const formattedClients = computed(() => {
  if (!hq.value) {
    return [];
  }
  let newArray = [];
  for (let i = 0; i < hq.value.client.length; i += 2) {
    newArray.push(hq.value.client.slice(i, i + 2).join("\t,\t"));
  }
  return newArray;
  // return ["asdasd"];
});
const formattedSafex = computed(() => {
  if (!hq.value) {
    return [];
  }
  let newArray = [];
  for (let i = 0; i < hq.value.safexCodes.length; i += 5) {
    newArray.push(hq.value.safexCodes.slice(i, i + 5).join("\t,\t"));
  }
  return newArray;
  // return ["asdasd"];
});
</script>

<style></style>
