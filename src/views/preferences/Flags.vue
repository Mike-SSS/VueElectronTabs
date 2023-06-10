<template>
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col>
        <div class="text-h2">UI confirmation dialogs</div>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" title="Accept" @click="acceptChanges"
          >Accept</v-btn
        >
      </v-col></v-row
    ><v-divider class="my-3"></v-divider
    ><v-row dense>
      <!-- <v-col cols="6">
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
      </v-col> -->
      <v-col cols="6" v-for="(value, key) in localFlags" :key="key">
        <v-checkbox
          v-model="localFlags[key]"
          density="compact"
          hide-details
          color="primary"
          :label="convertCamelCaseToRegular(key)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { reactive } from "vue";
import { IUserFlags, IUserPref, UserPreferences } from "@/models/UI";
import { Ref } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";
import { watch } from "vue";

const authStore = useAuthStore();

const userPrefs = computed(
  (e) =>
    authStore.getUserPref &&
    (authStore.getUserPref.userPreferenceJson as IUserPref)
);

const flags = computed(() => userPrefs.value?.flags);

const localFlags: Ref<Partial<IUserFlags>> = ref({});

onMounted(() => {
  // Initialize localFlags with values from the store
  localFlags.value = {
    ...flags.value,
  };
});

// Watch for changes in the store and update localFlags accordingly
watch(
  () => flags.value,
  (newFlags) => {
    localFlags.value = { ...newFlags };
  },
  { deep: true }
);

const convertCamelCaseToRegular = (text: string) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

async function acceptChanges() {
  // Update the store when the user accepts the changes
  if (!authStore.getUserPref) return;
  let temp = authStore.getUserPref.userPreferenceJson;
  if (typeof temp == "string") {
    temp = JSON.parse(temp) as IUserPref;
  }
  temp.flags = {
    ...temp.flags,
    ...(localFlags.value as IUserFlags),
  };
  await authStore.updateUserPreference(temp);
}
</script>

<style></style>
