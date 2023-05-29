<template>
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col>
        <div class="text-h2">UI confirmation dialogs</div>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" title="Accept">Accept</v-btn>
      </v-col></v-row
    ><v-divider class="my-3"></v-divider
    ><v-row dense>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Insert Order or Double"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Cancel All Active Orders"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Suspend All Active Orders"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Delete Active Order"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Suspend Active Order"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Reduce Active Order"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Resubmit Active Order"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Edit Suspend Order"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Insert Unmatched Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Delete Unmatched Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Accept Unmatched Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Edit Unmatched Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Split Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Assign Deal To Member"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Tripartite Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Cumulate Deal"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Correct Deal Principle"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Excercise Option"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Abandon Option"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Sub Account Change"
        ></v-checkbox>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          density="compact"
          hide-details
          color="primary"
          label="Delete Silo Cert. Auction Bid"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { reactive } from "vue";

const storeLayout = useAuthStore();
</script>

<style></style>
