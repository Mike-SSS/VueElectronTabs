<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-card min-height="400">
          <v-card-title class="bg-primary">
            <div class="text-h4 mb-4">User Profile Screen</div>
          </v-card-title>
          <v-card-subtitle class="bg-primary"
            ><div class="text-h6 mb-4">
              View information about your user profile
            </div></v-card-subtitle
          >
          <v-card-text class="text-body-1">
            <v-container>
              <v-row justify="start">
                <v-col class="text-left">
                  <div class="mb-3">Username: {{ hq?.username }}</div>
                  <div class="mb-3">Admin?: {{ hq?.admin }}</div>
                  <div class="mb-3">Trading System: {{ hq?.tradingSystem }}</div>
                  <div class="mb-3">Default Codes: {{ hq?.defaultCode }}</div>
                </v-col>
              </v-row>
              <v-row justify="start">
                <v-col class="text-left">
                  <div class="mb-3">Unique Code: {{ hq?.uniqueCode }}</div>
                  <div class="mb-3">Setup: {{ hq?.setup }}</div>
                  <div class="mb-3">Clients: {{ hq?.client }}</div>
                  <div class="mb-3">Branches: {{ hq?.branch }}</div>
                  <div class="mb-3">Safex: {{ hq?.safexCodes }}</div>
                </v-col>
              </v-row>
            </v-container>
            <div class="text-left">
              <pre>{{ hq ? hq : "No token detected. Login not valid" }}</pre>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";

const storeLayout = useAuthStore();

const hq = computed(() => storeLayout.getHQ);
</script>

<style></style>
