<template>
  <v-container fluid class="fill-height">
    <!-- <v-row
      :style="{
        width: '100%',
      }"
      v-if="currentLayout"
    >
      <v-col
        v-for="(col, index) in currentLayout.columns"
        :cols="col.width"
        :class="`bg-` + col.color"
        :style="styles[index]"
        height="auto"
      >
        <v-card width="100%" :color="col.color" :height="col.height * 10">{{
          col.color
        }}</v-card>
      </v-col>
    </v-row> -->
    <div class="grid-container" v-if="currentLayout">
      <div
        v-for="(col, index) in currentLayout.columns"
        class="grid-item"
        :class="`bg-` + col.color"
        :style="col.grid"
      >
        Item {{ index }}
      </div>
      <!-- <div class="grid-item item2">Item 2</div>
      <div class="grid-item item3">Item 3</div>
      <div class="grid-item item4">Item 4</div>
      <div class="grid-item item5">Item 5</div>
      <div class="grid-item item6">Item 6</div> -->
    </div>
  </v-container>
  <!-- <TestSocketConnection />
  <LayoutTest /> -->
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useLayoutStore } from "@/store/layout";
import TestSocketConnection from "@/components/TestSocketConnection.vue";
import LayoutTest from "@/components/LayoutTest.vue";

const storeLayout = useLayoutStore();

const currentLayout = computed(() => storeLayout.currentLayout);
</script>

<style>
.grid-container {
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  /* grid-template-columns: 1fr; */
  /* grid-auto-rows: minmax(100px, max-content); */
  /* grid-auto-rows: minmax(15%, max-content); */
  /* grid-template-rows:  1fr 1fr 1fr 1fr; */
  /* grid-auto-rows: 5%; */
  grid-gap: 10px;
  width: 100%;
  height: 100%;
}

.grid-item {
  background-color: lightgray;
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
