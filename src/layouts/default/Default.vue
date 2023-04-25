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
            prepend-icon="mdi-leaf"
            title="BVG"
            subtitle="Online Trader"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>Menu Items</v-list-item>
          <v-list-item>Menu Items</v-list-item>
          <v-list-item>Menu Items</v-list-item>
          <v-list-item>Menu Items</v-list-item>
          <v-list-item>Menu Items</v-list-item>
          <v-list-item>Menu Items</v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-app-bar-title class="text-white text-left">BVG Trader</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn color="white" variant="text" @click="openLayoutManager"
      >Layout Manager</v-btn
    >
    <v-menu offset-y>
      <template #activator="props">
        <v-btn color="primary" variant="elevated" v-bind="props.props">{{
          currentLayout?.name || "Select Layout"
        }}</v-btn>
      </template>
      <v-list min-width="250" lines="one" select-strategy="classic">
        <v-list-item
          prepend-icon="mdi-cog"
          key="configure_current"
          active-class="bg-amber"
          active-color="primary"
          select-strategy="classic"
          @click="configureSelectedLayout"
          >Configure Current</v-list-item
        >
        <v-divider></v-divider>
        <v-list-item
          v-for="(layout, index) in layoutOptions"
          :key="index"
          :value="layout.name"
          :active="currentLayout == layout"
          active-class="bg-amber"
          active-color="primary"
          select-strategy="classic"
          @click="setSelectedLayout(layout)"
        >
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ layout.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
  <!-- <v-app-bar floating order="3" collapse  color="blue">
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-app-bar floating order="4" collapse  color="blue">
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-app-bar floating order="5" collapse  color="blue">
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar> -->
  <v-dialog width="1000" v-model="state.isLayoutConfiguratorOpen" scrollable>
    <v-card min-height="250">
      <v-card-title class="d-flex justify-space-between align-center"
        ><div>Layout Configurator</div>
        <v-btn density="compact" icon flat
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-subtitle>
        <div class="text-subtitle-1">
          Change the order in which components are ordered on screen.
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <div>
                <div class="grid-container" v-if="currentLayout">
                  <div
                    v-for="(col, index) in currentLayout.columns"
                    :key="col.id"
                    :class="`bg-` + col.color"
                    class="text-center align-center"
                    :style="col.grid"
                  >
                    {{ col.id }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col><div class="text-h6">Swap order below</div></v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-list v-if="currentLayout">
                <draggable
                  :options="state.dragOptions"
                  v-model="currentLayout.columns"
                  @start="onStart"
                  @end="onEnd"
                  item-key="id"
                >
                  <template #item="{ element }">
                    <v-list-item :class="'bg-' + element.color">
                      {{ element.component }}</v-list-item
                    >
                  </template>
                </draggable>
              </v-list></v-col
            >
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog width="1000" v-model="state.isLayoutManagerOpen" scrollable>
    <v-card min-height="250">
      <v-card-title class="d-flex justify-space-between align-center"
        ><div>Layout Manager</div>
        <v-btn density="compact" icon flat
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-subtitle>
        <div class="text-subtitle-1">
          Some data may lost when switching layouts and panel is not transfered
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row align="center" justify="space-between">
            <v-col cols="5">
              <v-select
                v-model="currentLayout"
                item-title="name"
                item-value="name"
                readonly
                :single-line="false"
                label="Current Layout"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="2" class="text-center"
              ><v-icon>mdi-arrow-right</v-icon></v-col
            >
            <v-col cols="5"
              ><v-select
                v-model="state.changeToLayout"
                label="New Layout"
                :single-line="false"
                item-title="name"
                item-value="name"
                :items="layoutOptions"
                hide-details="auto"
              ></v-select
            ></v-col>
          </v-row>
          <v-row
            dense
            v-if="currentLayout"
            v-for="(largestColumnIndex, rowIndex) in largestLayoutSize"
            align="center"
          >
            <v-col cols="5">
              <v-card
                class="comparison-card"
                v-if="currentLayout.columns[rowIndex]"
              >
                <v-card-title>Panel {{ rowIndex }}</v-card-title>
                <v-card-text class="text-subtitle-1">
                  <div v-if="currentLayout && currentLayout.columns[rowIndex]">
                    Component:
                    {{
                      currentLayout.columns[rowIndex].component
                        ? currentLayout.columns[rowIndex].component
                        : "None"
                    }}
                  </div>
                  <div v-else>Component: Empty {{ rowIndex }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="2" class="text-center"
              ><v-icon>mdi-arrow-right</v-icon></v-col
            >
            <v-col cols="5">
              <v-card
                class="comparison-card"
                v-if="
                  state.changeToLayout && state.changeToLayout.columns[rowIndex]
                "
              >
                <v-card-title>Panel {{ rowIndex }}</v-card-title>
                <v-card-text class="text-subtitle-1">
                  <div
                    v-if="
                      state.changeToLayout &&
                      state.changeToLayout.columns[rowIndex]
                    "
                  >
                    Component:
                    {{
                      state.changeToLayout.columns[rowIndex].component
                        ? state.changeToLayout.columns[rowIndex].component
                        : "None"
                    }}
                  </div>
                  <div v-else>Empty</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="tonal" color="primary">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-navigation-drawer
    color="primary"
    permanent
    rail-width="60"
    :rail="true"
    width="200"
    location="left"
  >
    <v-list density="compact">
      <v-list-item
        prepend-icon="mdi-fire"
        title="Home"
        value="home"
        :to="{
          name: 'Login',
        }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cash"
        title="My Account"
        value="account"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cart-variant"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-gantt"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-timeline-variant-shimmer"
        title="Users"
        value="users"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Users"
        value="users"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <default-view />
</template>

<script lang="ts" setup>
import { onMounted, computed, reactive, markRaw, inject, ref } from "vue";
import DefaultView from "./View.vue";
import { useLayoutStore } from "@/store/layout";
import { useAppStore } from "@/store/app";
import { useMarketDisplayStore } from "@/store/marketDisplay";

import draggable from "vuedraggable";

import { AxiosInstance } from "axios";
import { axiosSymbol } from "@/models/symbols";
import { LAYOUT } from "@/models/layout";

import AnalogClock from "@/components/AnalogClock.vue";
import { axiosInstance } from "@/plugins/axios";

// Inject the Axios instance with the defined symbol
const axios = inject<AxiosInstance>(axiosSymbol);
const currentToolbar = ref(null);
const storeLayout = useLayoutStore();
const marketDisplayStore = useMarketDisplayStore();
const appStore = useAppStore();

const state = reactive<{
  isLayoutManagerOpen: boolean;
  isLayoutConfiguratorOpen: boolean;
  lm_mode: "configure" | "change";
  changeToLayout: LAYOUT | null;
  dragOptions: {
    animation: number;
    group: string;
    ghostClass: string;
  };
}>({
  dragOptions: {
    animation: 200,
    group: "layout",
    ghostClass: "ghost",
  },
  isLayoutManagerOpen: false,
  isLayoutConfiguratorOpen: false,
  lm_mode: "change",
  changeToLayout: null,
});
const draggedData: any = ref(null);
const onStart = (event: any) => {
  console.log("on start");
  if (currentLayout.value) {
    draggedData.value = {
      component: currentLayout.value.columns[event.oldIndex].component,
    };
  }
};
const onEnd = (event: any) => {
  console.log("onEnd", event);
  if (currentLayout.value && event.oldIndex !== event.newIndex) {
    // Revert item positions
    const movedItem = currentLayout.value.columns.splice(event.newIndex, 1)[0];
    currentLayout.value.columns.splice(event.oldIndex, 0, movedItem);

    // Swap components
    const targetComponent =
      currentLayout.value.columns[event.newIndex].component;
    currentLayout.value.columns[event.newIndex].component =
      draggedData.value.component;
    currentLayout.value.columns[event.oldIndex].component = targetComponent;
  }
};
// const currentColumns = computed({
//   get() {
//     return currentLayout.value?.columns;
//   },
//   set(value) {
//     console.log("SEt", value);
//   },
// });
const largestLayoutSize = computed(() => {
  // if (currentLayout.value?.columns.length > state.changeToLayout)
  if (currentLayout.value && state.changeToLayout != null) {
    if (
      currentLayout.value.columns.length > state.changeToLayout.columns.length
    ) {
      return currentLayout.value.columns.length;
    } else {
      return state.changeToLayout.columns.length;
    }
  }
});
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
  console.log("Mounted Default Layout");
  if (!axiosInstance) {
    throw new Error("Axios instance not found");
  }
  const temp = await GetMarketDisplay();
  if (temp) marketDisplayStore.setData(temp);
  console.log("App store market data: ", marketDisplayStore.getData);

  // Get instruments
  // const pub = await PublishAll();
});

const GetMarketDisplay = async () => {
  try {
    const res = await axiosInstance.get("/api/MarketSubscription/GetMarketDisplay");
    if (res) return Promise.resolve(res.data);
  } catch (err) {
    console.error(err);
  }
};

// const PublishAll = async () => {
//   try {
//     const res = await axios?.get("/api/Download/publishall");

//     if (res) {
//       console.log("Publish All : ", res.data);
//       return Promise.resolve(res.data);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };
</script>
