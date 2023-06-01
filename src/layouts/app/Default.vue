<template>
  <v-app-bar
    :extension-height="0"
    :height="75"
    class="white--text"
    color="#252525"
  >
    <v-menu v-model="drawer" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          ref="hamburgerTrigger"
          v-bind="props"
          class="rounded-0 ml-0 py-auto align-center"
          style="border-right: 1px solid grey; width: 60px"
        >
          <v-icon color="white" size="30">mdi-leaf</v-icon>
        </v-app-bar-nav-icon>
      </template>

      <v-card min-width="300">
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-account"
            title="BVG"
            subtitle="Online Trader"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item @click="goToTrading">Trading</v-list-item>
          <!-- <v-list-item @click="goToProfile">Profile</v-list-item> -->
          <v-list-item
            @click="
              state.isUserConfigurationOpen = true;
              drawer = false;
            "
            >Prefences</v-list-item
          >
          <!-- <v-list-group value="Config">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Config"></v-list-item>
            </template>

            <v-list-item
              @click="state.isUserConfigurationOpen = true; drawer = false"
              prepend-icon="mdi-cog"
              value="config"
              >Config</v-list-item
            >
          </v-list-group> -->
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-app-bar-title class="text-white text-left">BVG Trader</v-app-bar-title>
    <v-spacer></v-spacer>
    <template v-if="$route.name == 'Trading'">
      <!-- <v-btn color="white" variant="text" @click="openLayoutManager"
        >Layout Manager</v-btn
      > -->
      <v-menu offset-y>
        <template #activator="props">
          <v-btn color="primary" variant="elevated" v-bind="props.props">{{
            currentLayout?.name || "Select Layout"
          }}</v-btn>
        </template>
        <v-list min-width="300" lines="one" select-strategy="classic">
          <v-list-item
            prepend-icon="mdi-wrench"
            key="layout_manager"
            active-class="bg-amber"
            color="primary"
            :disabled="!currentLayout"
            select-strategy="classic"
            @click="openLayoutManager"
            >Layout Manager</v-list-item
          >
          <!-- <v-list-item
            prepend-icon="mdi-cog"
            key="configure_current"
            active-class="bg-amber"
            color="primary"
            select-strategy="classic"
            @click="configureSelectedLayout"
            >Configure Current</v-list-item
          > -->
          <v-divider></v-divider>
          <v-list-item
            v-for="(layout, index) in layoutOptions"
            :key="index"
            :value="layout.name"
            :active="currentLayout == layout"
            active-class="bg-amber"
            color="primary"
            select-strategy="classic"
            @click="setSelectedLayout(layout)"
          >
            <template v-slot:prepend="{ isActive }">
              <v-list-item-action start>
                <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
              </v-list-item-action>
            </template>
            <v-list-item-title>
              <v-container>
                <v-row>
                  <v-col
                    ><div>{{ layout.name }}</div></v-col
                  >
                  <v-col cols="4" class="grid-container-mini" v-if="layout">
                    <div
                      v-for="col in layout.columns"
                      :key="col.id"
                      :class="`bg-` + col.color"
                      class="text-center align-center"
                      :style="col.grid"
                    ></div>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template #extension>
      <v-container fluid v-if="false">
        <v-row dense>
          <v-col cols="12">
            <v-tabs height="40" density="compact" v-model="currentToolbar">
              <v-tab value="main">
                <div class="text-h5 text-white">Main</div>
              </v-tab>
              <v-tab value="admin">
                <div class="text-h5 text-white">Admin</div>
              </v-tab>
              <v-tab value="trading">
                <div class="text-h5 text-white">Trading</div>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-window v-model="currentToolbar">
              <v-window-item value="trading">
                <v-container fluid>
                  <v-row class="text-white">
                    <v-col cols="4"
                      >Market info + clock
                      <v-container fluid>
                        <v-row>
                          <v-col cols="auto">
                            <AnalogClock></AnalogClock>
                          </v-col>
                          <!-- <v-col cols="4">
                            <div class="text-body-1">Market Open: 9:00</div>
                            <div class="text-body-1">Market Closed: 17:00</div>
                            <div class="text-body-1">Market Offline: 03:00</div>
                          </v-col>
                          <v-col cols="4">
                            <div class="text-body-1">Current Trading Date: 2023/03/15</div>
                            <div class="text-body-1">Previous Trading Date: 2023/03/14</div>
                            <div class="text-body-1">Next Trading Date: 2023/03/15</div>
                          </v-col> -->
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col cols="2">Contracts</v-col>
                    <v-col cols="2">Views</v-col>
                    <v-col cols="2">Trade History</v-col>
                    <v-col cols="2">Preferences</v-col>
                  </v-row>
                </v-container>
              </v-window-item>
              <v-window-item value="main">
                <v-container fluid>
                  <v-row class="text-white">
                    <v-col cols="2">Main bar content</v-col>
                  </v-row>
                </v-container>
              </v-window-item>
              <v-window-item value="admin">
                <v-container fluid>
                  <v-row class="text-white">
                    <v-col cols="2">Admin bar content</v-col>
                  </v-row>
                </v-container>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-app-bar>
  <PreferencesModal v-model="state.isUserConfigurationOpen"></PreferencesModal>
  <LayoutConfigurationModal
    v-model="state.isLayoutManagerOpen"
  ></LayoutConfigurationModal>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, markRaw, inject, ref } from "vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useAuthStore } from "@/store/authStore";
import { useMarketDisplayStore } from "@/store/marketDisplay";

import PreferencesModal from "@/views/preferences/PreferencesModal.vue";
import LayoutConfigurationModal from "@/views/preferences/LayoutConfigurationModal.vue";

import { AxiosInstance } from "axios";
import { axiosSymbol } from "@/models/symbols";
import { COLUMN, LAYOUT } from "@/models/layout";

import AnalogClock from "@/components/AnalogClock.vue";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { getMarketDisplay } from "@/utils/api";
import Placeholder from "@/views/TradingView/Placeholder.vue";

// Inject the Axios instance with the defined symbol
const axios = inject<AxiosInstance>(axiosSymbol);
const currentToolbar = ref(null);
const storeLayout = useLayoutStore();
const marketDisplayStore = useMarketDisplayStore();
const appStore = useAppStore();
const authStore = useAuthStore();
const admins = [
  ["Management", "mdi-account-multiple-outline"],
  ["Settings", "mdi-cog-outline"],
];
const state = reactive<{
  isLayoutManagerOpen: boolean;
  isLayoutConfiguratorOpen: boolean;
  isUserConfigurationOpen: boolean;
  userConfigTab: null | string;
  lm_mode: "configure" | "change";
}>({
  userConfigTab: null,
  isUserConfigurationOpen: false,
  isLayoutManagerOpen: false,
  isLayoutConfiguratorOpen: false,
  lm_mode: "change",
});
const logout = () => {
  authStore.logout();
  router.push({
    name: "Login",
  });
};
const goToProfile = async () => {
  await router.push({
    name: "UserProfile",
  });
};
const goToTrading = async () => {
  await router.push({
    name: "Trading",
  });
};

const configureSelectedLayout = () => {
  console.log("Configure selected layout");
  state.isLayoutConfiguratorOpen = true;
};
const layoutOptions = computed(() => storeLayout.layoutOptions);
const currentLayout = computed(() => storeLayout.currentLayout);
const drawer = computed({
  get() {
    return appStore.drawer;
  },
  set(newVal) {
    appStore.drawer = newVal;
  },
});
function openLayoutManager() {
  state.isLayoutManagerOpen = true;
}
const setSelectedLayout = (layout: LAYOUT) => {
  storeLayout.setCurrentLayout(layout);
};

onMounted(async () => {
  // Do something after the component is mounted
  console.log("Mounted Default Layout", marketDisplayStore);
  if (!axiosInstance) {
    throw new Error("Axios instance not found");
  }
  await authStore.loadHQAccess();
  // const res = await marketDisplayStore().customActions?.loadMarketDisplay();
  
  console.log("Load market display :", marketDisplayStore().customActions.customActions?.loadMarketDisplay);
  const res = await marketDisplayStore().customActions.customActions?.loadMarketDisplay();
  console.log("Load market display :", marketDisplayStore().getData.value.length);
});
</script>
<style>
.grid-container-mini {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-gap: 2px;
  width: 100%;
  height: 100%;
}
</style>
