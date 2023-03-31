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
          @newComp="onNewComp($event, col)"
          v-for="(col, index) in currentLayout.columns"
          class="grid-item"
          :class="`bg-` + col.color"
          :style="col.grid"
          :key="col.component"
          :is="
            col.component
              ? componentRegistry[col.component]
              : componentRegistry['Placeholder']
          "
          v-bind="col.props"
        >
        </component>
      </keep-alive>
    </div>
    <v-row v-else justify="center">
      <v-col cols="10">
        <v-card min-height="400">
          <v-card-text>
            <div class="text-h4 mb-4">Welcome!</div>
            <div class="text-h6 mb-4">Select Layout to continue</div>
            <div class="text-body-1 mb-4">
              In tincidunt vitae ipsum sit amet sollicitudin. Phasellus luctus
              condimentum eros vitae laoreet. Quisque non mollis dui, ut rhoncus
              ex. Aenean facilisis ante felis, gravida rutrum tellus finibus ut.
              Phasellus nulla enim, dignissim mollis metus nec, imperdiet
              gravida ipsum.
            </div>
            <div class="text-body-1">
              Etiam efficitur libero eget nisl laoreet, at gravida lacus
              elementum. Proin vel efficitur nisl. Donec porta, ex sit amet
              sodales auctor, libero ipsum suscipit enim, nec congue lectus
              nulla sit amet ante. Vestibulum nulla ligula, fermentum non
              iaculis iaculis, cursus ut nulla. Morbi ullamcorper nunc eu lorem
              consequat auctor. Praesent ligula nunc, dignissim vel lorem nec,
              tincidunt viverra ipsum. Interdum et malesuada fames ac ante ipsum
              primis in faucibus.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- <TestSocketConnection />
  <LayoutTest /> -->
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useLayoutStore } from "@/store/layout";
import TestSocketConnection from "@/components/TestSocketConnection.vue";
import LayoutTest from "@/components/LayoutTest.vue";
import componentRegistry, {
  ComponentRegistry,
} from "@/models/componentRegistry";
import { COLUMN } from "@/models/layout";

const storeLayout = useLayoutStore();

const currentLayout = computed(() => storeLayout.currentLayout);

const onNewComp = (event: keyof ComponentRegistry, item: COLUMN) => {
  console.log("On New Comp ", event, item.id);
  storeLayout.changeColumnComponent(event, item.id);
};
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
  /* padding: 10px;
  font-size: 20px; */
  overflow-y: auto;
  text-align: center;
}

/* @media screen and (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
} */
</style>
