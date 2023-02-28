<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-menu v-model="drawer" :close-on-content-click="false" location="end">
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon
            ref="hamburgerTrigger"
            v-bind="props"
            class="rounded-0 ml-0 py-auto align-center"
            style="border-right: 1px solid grey; width: 60px"
          >
            <v-icon size="30">mdi-leaf</v-icon>
          </v-app-bar-nav-icon>
        </template>

        <v-card min-width="300">
          <v-list>
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

      <v-app-bar-title>My App</v-app-bar-title>
    </v-app-bar> -->
    <v-menu>
      <template> </template>
    </v-menu>
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
    <v-navigation-drawer rail-width="60" rail permanent location="left">
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="My Account"
          value="account"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer rail-width="60" rail permanent location="right">
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="My Account"
          value="account"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
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
import { onMounted, computed } from "vue";
import { useAppStore } from "./store/app";

const store = useAppStore();
let rail = true;

onMounted(() => {
  // Do something after the component is mounted
  console.log("Trust mounted");
});
const tabs = [
  { title: "Tab 1", url: "https://www.example.com/tab1" },
  { title: "Tab 2", url: "https://www.example.com/tab2" },
  { title: "Tab 3", url: "https://www.example.com/tab3" },
];
const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
const drawer = computed({
  get() {
    return store.drawer;
  },
  set(newVal) {
    store.drawer = newVal;
  },
});
const items = computed(() => store.items);
function openNewWindow(tab: { title: string; url: string }) {
  window.open(tab.url);
}
function toggleDrawer() {
  console.log("Toggle drawer");
  store.toggleDrawer();
}
</script>
