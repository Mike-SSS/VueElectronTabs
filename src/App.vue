<template>
  <v-app>
    <v-app-bar :height="75" class="white--text" color="#252525">
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
        <v-list lines="one" select-strategy="classic">
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
    </v-app-bar>
    <v-dialog width="1000" v-model="state.isLayoutManagerOpen">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center"
          ><div>Layout Manager</div>
          <v-btn icon flat><v-icon>mdi-close</v-icon></v-btn></v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row align="center" justify="space-between">
              <v-col cols="5">
                <v-select label="Current Layout" hide-details="auto"></v-select>
              </v-col>
              <v-col cols="2" class="text-center">
                <v-icon>mdi-arrow-right</v-icon></v-col
              >
              <v-col cols="5"
                ><v-select label="New Layout" hide-details="auto"></v-select
              ></v-col>
            </v-row>
            <v-row v-if="currentLayout">
              <template
                v-for="(largestColumnIndex, rowIndex) in largestLayoutSize"
              >
                <v-col cols="6">
                  <v-card class="comparison-card">
                    <v-card-title
                      >Current Layout - Column {{ rowIndex }}</v-card-title
                    >
                    <v-card-text>
                      <div v-if="currentLayout.columns[rowIndex - 1]">
                        Component:
                        {{ currentLayout.columns[rowIndex - 1].component }}
                      </div>
                      <div v-else>Empty</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card class="comparison-card">
                    <v-card-title
                      >New Layout - Column {{ rowIndex }}</v-card-title
                    >
                    <v-card-text>
                      <div v-if="selectedLayout[rowIndex - 1]">
                        Component: {{ selectedLayout[rowIndex - 1].component }}
                      </div>
                      <div v-else>Empty</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- <v-menu>
      <template> </template>
    </v-menu> -->
    <!-- <v-navigation-drawer
      :rail="rail"
      rail-width="60"
      permanent
      @click="rail = true"
    >
      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          :title="item.title"
        >
          <template v-slot:prepend>
            <v-avatar size="30" color="grey-lighten-1">
              <v-icon size="20" color="white">mdi-pencil</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-navigation-drawer
      color="primary"
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
    <router-view />
    <!-- <v-footer app class="bg-grey-lighten-1">
      <v-row justify="center" no-gutters>
        <v-col cols="auto" v-for="link in links" :key="link">
          <v-btn color="white" variant="text" class="mx-2" rounded="xl">
            {{ link }}
          </v-btn>
        </v-col>

        <v-col class="text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>BVG</strong>
        </v-col>
      </v-row>
    </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
// import { useAppStore } from "pinia";
import { onMounted, computed, reactive, markRaw, inject, ref } from "vue";
import { useAppStore } from "@/store/app";
import { useLayoutStore } from "@/store/layout";
import { AxiosInstance } from "axios";
import { axiosSymbol } from "@/models/symbols";

// Inject the Axios instance with the defined symbol
const axios = inject<AxiosInstance>(axiosSymbol);

const appStore = useAppStore();
const storeLayout = useLayoutStore();
let rail = true;
const setSelectedLayout = (layout: any) => {
  storeLayout.setCurrentLayout(layout);
};
const state = reactive<{
  isLayoutManagerOpen: boolean;
}>({
  isLayoutManagerOpen: false,
});
let isLayoutManagerOpen = ref(false);
onMounted(async () => {
  // Do something after the component is mounted
  console.log("Trust mounted");
  if (!axios) {
    throw new Error("Axios instance not found");
  }
  const temp = await GetMarketDisplay();
  if (temp) appStore.setMarketDisplayData(temp);
  console.log("App store market data: ", appStore.getMarketDisplayData);

  // Get instruments
});
function openLayoutManager() {
  state.isLayoutManagerOpen = true;
}

const GetMarketDisplay = async () => {
  try {
    const res = await axios?.get("/MarketSubscription/GetMarketDisplay");
    if (res) return Promise.resolve(res.data);
  } catch (err) {
    console.error(err);
  }
};
const tabs = [
  { title: "Tab 1", url: "https://www.example.com/tab1" },
  { title: "Tab 2", url: "https://www.example.com/tab2" },
  { title: "Tab 3", url: "https://www.example.com/tab3" },
];
const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
const drawer = computed({
  get() {
    return appStore.drawer;
  },
  set(newVal) {
    appStore.drawer = newVal;
  },
});
const items = computed(() => appStore.items);
const layoutOptions = computed(() => storeLayout.layoutOptions);
const currentLayout = computed(() => storeLayout.currentLayout);
function openNewWindow(tab: { title: string; url: string }) {
  window.open(tab.url);
}
function toggleDrawer() {
  console.log("Toggle drawer");
  appStore.toggleDrawer();
}
</script>
