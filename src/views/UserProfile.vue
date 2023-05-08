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
            <div class="text-left"><pre>{{ token ? token : "No token detected. Login not valid" }}</pre></div>
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

const token = computed(() => storeLayout.getHQ);
</script>

<style></style>
