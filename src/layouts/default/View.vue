<template>
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
