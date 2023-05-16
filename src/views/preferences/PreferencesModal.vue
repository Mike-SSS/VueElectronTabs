<template>
  <v-dialog width="700" v-model="open" scrollable>
    <v-card max-height="70vh">
      <v-card-title class="pa-0 text-end">
        <v-tabs
          v-model="tab"
          bg-color="primary"
          color="secondary"
          centered
          stacked
        >
          <v-tab value="tab-profile">
            <v-icon>mdi-account</v-icon>
            Profile
          </v-tab>
          <v-tab value="tab-flags">
            <v-icon>mdi-phone</v-icon>
            Flags
          </v-tab>

          <v-tab value="tab-defaults">
            <v-icon>mdi-heart</v-icon>
            Defaults
          </v-tab>

          <v-tab value="tab-3">
            <v-icon>mdi-account-box</v-icon>
            Sub Account
          </v-tab>
          <v-tab value="tab-4">
            <v-icon>mdi-account-box</v-icon>
            Ref Number
          </v-tab>
        </v-tabs>
        <v-btn size="small" variant="tonal" @click="open = false">Close</v-btn>
      </v-card-title>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="tab-profile">
            <UserProfile></UserProfile>
          </v-window-item>
          <v-window-item value="tab-flags">
            <Flags></Flags>
          </v-window-item>
          <v-window-item value="tab-defaults">
            <v-card>
              <v-text-field label="Example" v-for="i in 5"></v-text-field>
            </v-card>
          </v-window-item>
          <!-- <v-window-item v-for="i in 3" :key="i" :value="'tab-' + i">
          <v-card>
            <v-card-text>Lorem ipsum</v-card-text>
          </v-card>
        </v-window-item> -->
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { reactive } from "vue";
import { ref } from "vue";

import UserProfile from "@/views/preferences/UserProfile.vue";
import Flags from "@/views/preferences/Flags.vue";
import { watchEffect } from "vue";

const storeLayout = useAuthStore();

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);
const open = ref(props.modelValue);

const tab = ref(null);
watchEffect(() => {
  open.value = props.modelValue
})

watchEffect(() => {
  emit('update:modelValue', open.value)
})
</script>

<style></style>
