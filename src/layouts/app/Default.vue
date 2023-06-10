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
  <v-dialog
    persistent
    scrollable
    max-height="80%"
    class="initDialog"
    content-class="text-center align-center justify-center"
    v-model="state.initializing"
    scrim="rgba(0,0,0,1)"
  >
    <v-card
      :max-width="$vuetify.display.mdAndUp ? 600 : ''"
      :width="$vuetify.display.mdAndUp ? '50%' : '90%'"
    >
      <v-card-title>
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="6">
              <v-img
                content-class="text-center align-center"
                class="align-center align-content-center"
                width="auto"
                height="auto"
                cover
                src="@/assets/BvgLogo.png"
              ></v-img
            ></v-col>
          </v-row>
          <v-row align="center" dense justify="center">
            <v-col cols="11" class="text-h4 text-wrap">{{
              errorCount == 0
                ? " Preparing Your Trading Experience..."
                : "We have encountered atleast 1 error. The error will be reported to our Support team if you have internet access"
            }}</v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-text class="text-left align-center align-content-center">
        <v-container class="pa-0">
          <v-row>
            <v-col cols="auto">
              <v-progress-circular
                :width="35"
                :size="70"
                color="green"
                :model-value="progress"
                :max="100"
              >
              </v-progress-circular
            ></v-col>
            <v-col cols="9">
              <v-container>
                <v-row
                  justify="space-between"
                  v-for="(item, index) in loaders"
                  :key="index"
                >
                  <v-col cols="auto"
                    ><v-icon
                      v-if="item.status == LoaderStatus.Success"
                      color="success"
                      >mdi-check</v-icon
                    >
                    <v-icon
                      v-else-if="item.status == LoaderStatus.Error"
                      color="error"
                      >mdi-alert</v-icon
                    >
                    <v-icon
                      v-else-if="item.status == LoaderStatus.NotStarted"
                      color="grey"
                      >mdi-minus-circle-outline</v-icon
                    ></v-col
                  >
                  <v-col> {{ item.text[item.status] }}</v-col>
                </v-row>
                <v-row v-if="errorCount > 0" justify="center">
                  <v-col cols="auto"
                    ><v-btn
                      :size="25"
                      variant="flat"
                      class="pa-1"
                      @click="state.showError = !state.showError"
                      ><template v-if="state.showError == false">
                        <v-icon size="20">mdi-eye</v-icon>
                        Show errors
                      </template>
                      <template v-else>
                        <v-icon size="20">mdi-eye-off</v-icon> Hide errors
                      </template>
                    </v-btn></v-col
                  >
                </v-row>
              </v-container>

              <!-- <div>
                <v-progress-linear
                  color="green"
                  v-if="loaders.userProfile.status == LoaderStatus.Loading"
                  indeterminate
                />
              </div>
              <div>
                <v-icon
                  v-if="loaders.userPref.status == LoaderStatus.Success"
                  color="success"
                  >mdi-check</v-icon
                >
                <v-icon
                  v-else-if="loaders.userPref.status == LoaderStatus.Error"
                  color="error"
                  >mdi-alert</v-icon
                >
                <span class="ml-3 align-center align-content-center"
                  >Checking for layout and user preferences...
                  <v-btn
                    :size="25"
                    variant="flat"
                    class="pa-1"
                    v-if="loaders.userPref.status == LoaderStatus.Error"
                    @click="state.showError = !state.showError"
                    icon
                    ><v-icon size="20">mdi-eye</v-icon></v-btn
                  ></span
                >
                <v-progress-linear
                  color="green"
                  v-if="loaders.userPref.status == LoaderStatus.Loading"
                  indeterminate
                />
              </div>
              <div>
                <v-icon
                  v-if="loaders.marketData.status == LoaderStatus.Success"
                  color="success"
                  >mdi-check</v-icon
                >
                <v-icon
                  v-else-if="loaders.marketData.status == LoaderStatus.Error"
                  color="error"
                  >mdi-alert</v-icon
                >
                <div class="d-flex">
                  <span class="ml-3">Pulling market data... </span>
                  <v-btn
                    v-if="loaders.marketData.status == LoaderStatus.Error"
                    @click="state.showError = !state.showError"
                    icon
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                </div>

                <v-progress-linear
                  color="green"
                  v-if="loaders.marketData.status == LoaderStatus.Loading"
                  indeterminate
                /></div -->
            </v-col>
          </v-row>
        </v-container>

        <div
          v-show="state.showError == true"
          style="
            max-height: 250px;
            overflow-y: scroll;
            max-width: 100%;
            overflow-x: scroll;
          "
          class="mt-5"
        >
          <template v-for="i in loaders">
            <div v-if="i.errorMessage" :key="i.errorMessage">
              {{ i.errorMessage }}
            </div></template
          >
        </div>
      </v-card-text>
      <v-card-actions class="justify-end" v-if="errorCount > 0">
        <v-btn color="error" disabled variant="tonal">Report error(s)</v-btn>
        <v-btn
          color="primary"
          @click="state.initializing = false"
          variant="outlined"
          >Continue anyway</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
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
import { UserPreferences } from "@/models/UI";
import { UserLayout } from "@/models/UI";
import { VTab } from "vuetify/lib/components/index.mjs";

enum LoaderStatus {
  Loading = "loading",
  NotStarted = "notStarted",
  Success = "success",
  Error = "error",
}

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
interface ILoaders {
  userProfile: {
    text: {
      [LoaderStatus.Error]: string;
      [LoaderStatus.Success]: string;
      [LoaderStatus.NotStarted]: string;
      [LoaderStatus.Loading]: string;
    };
    status: LoaderStatus;
    errorMessage: null | string;
  };
  marketData: {
    text: {
      [LoaderStatus.Error]: string;
      [LoaderStatus.Success]: string;
      [LoaderStatus.NotStarted]: string;
      [LoaderStatus.Loading]: string;
    };
    status: LoaderStatus;
    errorMessage: null | string;
  };
  members: {
    text: {
      [LoaderStatus.Error]: string;
      [LoaderStatus.Success]: string;
      [LoaderStatus.NotStarted]: string;
      [LoaderStatus.Loading]: string;
    };
    status: LoaderStatus;
    errorMessage: null | string;
  };
  layout: {
    text: {
      [LoaderStatus.Error]: string;
      [LoaderStatus.Success]: string;
      [LoaderStatus.NotStarted]: string;
      [LoaderStatus.Loading]: string;
    };
    status: LoaderStatus;
    errorMessage: null | string;
  };
  userPref: {
    text: {
      [LoaderStatus.Error]: string;
      [LoaderStatus.Success]: string;
      [LoaderStatus.NotStarted]: string;
      [LoaderStatus.Loading]: string;
    };
    status: LoaderStatus;
    errorMessage: null | string;
  };
}

const loaders = reactive<ILoaders>({
  userProfile: {
    status: LoaderStatus.NotStarted,
    errorMessage: null,
    text: {
      success: "Loaded your profile.",
      error: "Error has occured loading your profile",
      loading: "Loading your profile...",
      notStarted: "User profile waiting",
    },
  },
  marketData: {
    status: LoaderStatus.NotStarted,
    errorMessage: null,
    text: {
      success: "Loaded market data...",
      error: "Error has occured loading market data",
      loading: "Loading market data...",
      notStarted: "Market data waiting",
    },
  },
  members: {
    status: LoaderStatus.NotStarted,
    errorMessage: null,
    text: {
      success: "Loaded members...",
      error: "Error has occured loading members",
      loading: "Loading members...",
      notStarted: "Members waiting",
    },
  },
  layout: {
    status: LoaderStatus.NotStarted,
    errorMessage: null,
    text: {
      success: "Loaded your saved layouts.",
      error: "Error has occured loading layouts",
      loading: "Loading your saved layouts...",
      notStarted: "Layouts waiting",
    },
  },
  userPref: {
    status: LoaderStatus.NotStarted,
    errorMessage: null,
    text: {
      success: "Loaded your preferences.",
      error: "Error loading your preferences",
      loading: "Loading your preferences...",
      notStarted: "User preferences waiting",
    },
  },
});
const state = reactive<{
  showError: boolean;
  initializing: boolean;
  isLayoutManagerOpen: boolean;
  isLayoutConfiguratorOpen: boolean;
  isUserConfigurationOpen: boolean;
  userConfigTab: null | string;
  lm_mode: "configure" | "change";
}>({
  showError: false,
  initializing: false,
  userConfigTab: null,
  isUserConfigurationOpen: false,
  isLayoutManagerOpen: false,
  isLayoutConfiguratorOpen: false,
  lm_mode: "change",
});
const step = ref(0);
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
// The computed property that calculates the progress
const progress = computed(() => {
  let loaded = 0;
  for (const loader in loaders) {
    if (loaders[loader as keyof ILoaders].status === LoaderStatus.Success) {
      loaded++;
    }
  }
  return (loaded / Object.keys(loaders).length) * 100; // return progress in percentage
});

const errorCount = computed(() => {
  let errors = 0;
  for (const loader in loaders) {
    if (loaders[loader as keyof ILoaders].status === LoaderStatus.Error) {
      errors++;
    }
  }
  return errors;
});

const configureSelectedLayout = () => {
  console.log("Configure selected layout");
  state.isLayoutConfiguratorOpen = true;
};

const authLoaders = computed(() => authStore.loaders);
const currentPreferences = computed(() => authStore.getUserPref);
const currentLayoutsSaved = computed(() => authStore.getUserLayouts);
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
async function loadUserProfile() {
  try {
    loaders.userProfile.status = LoaderStatus.Loading;
    await authStore.loadHQAccess();
    const res = await Promise.all([loadUserPref(), loadUserLayouts()]);
    console.log("Res - ", res);
    loaders.userProfile.status = LoaderStatus.Success;
    return Promise.resolve();
  } catch (err) {
    loaders.userProfile.status = LoaderStatus.Error;
    const message =
      JSON.stringify(err) || "An error occurred while loading user profile.";
    loaders.userProfile.errorMessage = message;
    return Promise.reject(err);
  }
}
async function loadUserLayouts() {
  try {
    loaders.layout.status = LoaderStatus.Loading;
    await authStore.loadUserLayouts();
    loaders.layout.status = LoaderStatus.Success;
  } catch (err) {
    loaders.layout.status = LoaderStatus.Error;
    const message =
      JSON.stringify(err) ||
      "An error occurred while setting up user preferences.";
    loaders.layout.errorMessage = message;
  }
}
async function loadUserPref() {
  try {
    loaders.userPref.status = LoaderStatus.Loading;

    // call GET api for user pref
    await authStore.loadUserPreference();
    if (authStore.getUserPref != null)
      loaders.userPref.status = LoaderStatus.Success;
    else {
      loaders.userPref.status = LoaderStatus.Error;
      if (loaders.userPref.errorMessage == null) {
        loaders.userPref.errorMessage = "No userpref returned";
      }
    }
    return Promise.resolve();
  } catch (err) {
    loaders.userPref.status = LoaderStatus.Error;
    const message =
      JSON.stringify(err) ||
      "An error occurred while setting up user preferences.";
    loaders.userPref.errorMessage = message;
    // return Promise.reject(err);
  }
}
async function loadMembers() {
  try {
    loaders.members.status = LoaderStatus.Loading;
    const res = await authStore.loadMembers();
    loaders.members.status = LoaderStatus.Success;
    return Promise.resolve(res);
  } catch (err) {
    loaders.members.status = LoaderStatus.Error;
    const message =
      JSON.stringify(err) ||
      "An error occurred while setting up user preferences.";
    loaders.members.errorMessage = message;
    return Promise.reject(err);
  }
}
async function loadMarketData() {
  try {
    loaders.marketData.status = LoaderStatus.Loading;
    console.log(
      "Load market display :",
      marketDisplayStore().customActions.customActions?.loadMarketDisplay
    );
    const res =
      await marketDisplayStore().customActions.customActions?.loadMarketDisplay();
    console.log(
      "Load market display :",
      marketDisplayStore().getData.value.length
    );
    loaders.marketData.status = LoaderStatus.Success;
    return res;
  } catch (err) {
    loaders.marketData.status = LoaderStatus.Error;
    const message =
      JSON.stringify(err) || "An error occurred while getting market data.";
    loaders.marketData.errorMessage = message;
    return Promise.reject(err);
  }
}
onMounted(async () => {
  try {
    state.initializing = true;
    if (!axiosInstance) {
      throw new Error("Axios instance not found");
    }
    const delay = new Promise((resolve) => setTimeout(resolve, 2500));
    const promises = [
      loadUserProfile(),
      loadMembers(),
      loadMarketData(),
      delay,
      // Add other loader functions here...
    ];
    await Promise.allSettled(promises);

    let hasError = false;
    for (const loader in loaders) {
      if (loaders[loader as keyof ILoaders].status === LoaderStatus.Error) {
        console.error(
          `Error loading ${loader}: ${
            loaders[loader as keyof ILoaders].errorMessage
          }`
        );
        hasError = true;
      }
    }

    if (hasError) {
      console.error("One or more loaders have failed.");
    } else {
      console.log("All loaders completed successfully.");
    }
    state.initializing = hasError;
  } catch (err) {
    return Promise.reject(err);
  }
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
.initDialog .v-overlay__scrim {
  opacity: 0.95;
}
</style>
