<template>
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
    <v-icon color="white">mdi-circle</v-icon>
  </v-navigation-drawer>
  <v-main>
    <!-- <div class="side-app-bars">
      <v-app-bar order="4" collapse color="green">
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
      <v-app-bar
        order="5"
        collapse
        color="purple"
      >
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
      <v-app-bar
        :height="50"
        order="5"
        collapse
        :absolute="false"
        color="blue"
      >
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
    </div> -->

    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
//
</script>
<style scoped>
.side-app-bars {
  position: fixed;
  top: 200;
  right: 50;
  z-index: 1100;
}

.side-app-bar {
  width: 60px; /* Adjust the width as needed */
}

.custom-main {
  padding-top: 0 !important; /* Remove padding affected by side app-bars */
}
</style>
