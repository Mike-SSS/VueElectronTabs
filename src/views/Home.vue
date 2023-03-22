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

    <!-- <div class="grid-container" v-if="currentLayout">
        <div
          v-for="(col, index) in currentLayout.columns"
          class="grid-item"
          :class="`bg-` + col.color"
          :style="col.grid"
          :key="col.id"
        >
          Item {{ index }}
          <keep-alive
            ><component
              v-if="col.component != null"
              :key="col.component"
              :is="componentRegistry[col.component]"
              v-bind="col.props"
            />
            <div v-else class="text-h5">
              No component loaded yet
            </div></keep-alive
          >
        </div>
    </div> -->
    <div class="grid-container" v-if="currentLayout">
      <keep-alive>
        <component
          v-for="(col, index) in currentLayout.columns"
          class="grid-item"
          :class="`bg-` + col.color"
          :style="col.grid"
          :key="col.component"
          :is="col.component ? componentRegistry[col.component] : null"
            v-bind="col.props"
        >
          Item {{ index }}
        </component>
      </keep-alive>
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
import componentRegistry from "@/models/componentRegistry";

const storeLayout = useLayoutStore();

const currentLayout = computed(() => storeLayout.currentLayout);
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
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

/* @media screen and (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
} */
</style>
