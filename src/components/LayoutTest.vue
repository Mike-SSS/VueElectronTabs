<template>
  <v-card>
    <v-card-title>Dynamic Layout</v-card-title>
    <v-card-actions>
      <v-menu offset-y>
        <template #activator="props">
          <v-btn v-bind="props.props">{{
            state.selectedLayout?.name || "Select Layout"
          }}</v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(layout, index) in state.layoutOptions"
            :key="index"
            @click="setSelectedLayout(layout)"
          >
            <v-list-item-title>{{ layout.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
    <v-card-text>
      <div class="grid-container">
        <div class="panel panel-1"></div>
        <div class="panel panel-2"></div>
        <div class="panel panel-3a"></div>
        <div class="panel panel-3b"></div>
        <div class="panel panel-4"></div>
        <div class="panel panel-5"></div>
        <div class="panel panel-6"></div>
        <!-- <div class="panel panel-7"></div> -->
        <!-- <div class="panel panel-8"></div> -->
      </div>
    </v-card-text>
    <v-card-text v-if="state.selectedLayout">
      <v-container fluid>
        <keep-alive
          ><draggable
            v-model="state.selectedLayout.columns"
            :options="state.dragOptions"
            :component-data="{
              class: 'v-row v-masonry no-gutters dense',
              gutter: 0,
              'no-gutters': true,
              'fit-rows': false,
              'flex-direction': 'column',
              'origin-left': true,
              'horizontal-order': false,
              'transition-duration': '0.1s',
              'item-selector': '.item',
            }"
            item-key="id"
            @change="redrawVueMasonry()"
            v-masonry
          >
            <template #item="{ element }">
              <v-col
                v-masonry-tile
                class="item pa-0"
                :key="element"
                :cols="element.width"
              >
                <v-card
                  class="column-card"
                  :color="element.color"
                  :height="element.height * 50"
                >
                  <v-card-title class="black" color="white">
                    {{ element.content }}
                  </v-card-title>
                  <v-card-text class="fill-height">
                    <component :is="element.component" />
                  </v-card-text>
                  <div
                    class="resize-handle top"
                    @mousedown="startResize($event, 'up', element)"
                  ></div>
                  <div
                    class="resize-handle right"
                    @mousedown="startResize($event, 'right', element)"
                  ></div>
                  <div
                    class="resize-handle bottom"
                    @mousedown="startResize($event, 'down', element)"
                  ></div>
                  <div
                    class="resize-handle left"
                    @mousedown="startResize($event, 'left', element)"
                  ></div>
                </v-card>
              </v-col>
            </template> </draggable
        ></keep-alive>
        <v-row :no-gutters="true"></v-row>
      </v-container>
      <v-container fluid>
        <v-row><v-btn @click="addCard">Add</v-btn></v-row>
        <v-row
          :style="{
            'max-width': '100%',
          }"
          v-masonry
          origin-left="true"
          class="d-flex flex-row"
          horizontal-order="false"
          :fit-width="false"
          transition-duration="0.1s"
          item-selector=".item"
        >
          <v-col
            v-masonry-tile
            v-for="card in state.selectedLayout.columns"
            class="column-card item"
            :key="card.id"
            :cols="card.width"
            height="auto"
          >
            <v-card :color="card.color" width="100%" :height="card.height * 50">
              <v-card-title>New </v-card-title>
              <v-card-text>
                <component :is="card.component" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineComponent, reactive, markRaw, ref, inject } from "vue";
import Column1 from "@/components/Column1.vue";
// import Masonry from "vue-masonry-css";
import draggable from "vuedraggable";
import { createPinia } from "pinia";
import { detailed } from "yargs-parser";
const redrawVueMasonry: Function | undefined = inject("redrawVueMasonry");

const DEFAULT_ROW_HEIGHT = 50;
const DRAG_THRESHOLD = 30;
const pinia = createPinia();
interface Column {
  width: number;
  color: string;
  content: string;
  height: number;
  id: string;
  component: string | typeof Column1 | null;
}
type DIRECTION = "left" | "right" | "up" | "down";
interface Layout {
  name: string;
  columns: Column[];
}
const layoutContainer = ref(null);
const state = reactive<{
  layoutOptions: Layout[];
  selectedLayout: Layout | null;
  dragOptions: {
    animation: number;
    group: string;
    ghostClass: string;
  };
  resizeOptions: {
    startX: null | number;
    startY: null | number;
    startHeight: null | number;
    startWidth: null | number;
    element: Column | null;
    resizeHandle: DIRECTION;
  };
}>({
  layoutOptions: [
    {
      name: "Layout 1",
      columns: [
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-1",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-2",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-3",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-4",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-5",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-6",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-7",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-8",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-9",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-10",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-11",
        },
        {
          width: 1,
          height: 1,
          color: "grey",
          content: "Dummy",
          component: null,
          id: "dummy-12",
        },
        {
          width: 7,
          height: 2,
          color: "primary",
          content: "Column 1",
          component: markRaw(Column1),
          id: "first",
        },
        {
          width: 6,
          height: 2,
          color: "secondary",
          content: "Column 2",
          component: markRaw(Column1),
          id: "second",
        },
        {
          width: 12,
          height: 4,
          color: "error",
          content: "Column 3",
          component: markRaw(Column1),
          id: "third",
        },
        {
          width: 6,
          height: 6,
          color: "success",
          content: "Column 4",
          component: markRaw(Column1),
          id: "forth",
        },
        {
          width: 6,
          height: 6,
          color: "warning",
          content: "Column 5",
          component: markRaw(Column1),
          id: "fifth",
        },
        {
          width: 3,
          height: 7,
          color: "purple",
          content: "Column 6",
          component: markRaw(Column1),
          id: "sixth",
        },
      ],
    },
    {
      name: "Layout 2",
      columns: [
        {
          width: 12,
          height: 6,
          color: "primary",
          content: "Column 1",
          component: Column1,
          id: "first",
        },
        {
          width: 12,
          height: 6,
          color: "secondary",
          content: "Column 2",
          component: Column1,
          id: "second",
        },
        {
          width: 12,
          height: 6,
          color: "error",
          content: "Column 3",
          component: Column1,
          id: "third",
        },
      ],
    },
    {
      name: "Layout 3",
      columns: [
        {
          width: 4,
          height: 6,
          color: "primary",
          content: "Column 1",
          component: Column1,
          id: "first",
        },
        {
          width: 8,
          height: 6,
          color: "secondary",
          content: "Column 2",
          component: Column1,
          id: "second",
        },
        {
          width: 6,
          height: 6,
          color: "warning",
          content: "Column 3",
          component: Column1,
          id: "third",
        },
        {
          width: 6,
          height: 6,
          color: "success",
          content: "Column 4",
          component: Column1,
          id: "forth",
        },
      ],
    },
  ],
  selectedLayout: null,
  dragOptions: {
    animation: 200,
    group: "layout",
    ghostClass: "ghost",
  },
  resizeOptions: {
    resizeHandle: "right",
    startX: null,
    startY: null,
    startHeight: null,
    startWidth: null,
    element: null,
  },
});
const startResize = (
  event: MouseEvent,
  direction: DIRECTION,
  element: Column
) => {
  event.preventDefault();
  console.log("Start resizeing ", event, direction, element);
  state.resizeOptions.element = element;
  state.resizeOptions.resizeHandle = direction;
  state.resizeOptions.startX = event.clientX;
  state.resizeOptions.startY = event.clientY;
  window.addEventListener("mousemove", handleResize);
  window.addEventListener("mouseup", stopResize);
};
const addCard = () => {
  state.selectedLayout?.columns.push({
    id: Math.random().toString(),
    color: "yellow",
    component: null,
    content: "Newly added",
    height: 3,
    width: 3,
  });
};
const handleResize = (event: MouseEvent) => {
  if (!state.resizeOptions.element) return;
  if (!state.resizeOptions.startX) state.resizeOptions.startX = event.clientX;
  if (!state.resizeOptions.startY) state.resizeOptions.startY = event.clientY;
  const deltaX = event.clientX - state.resizeOptions.startX;
  const deltaY = event.clientY - state.resizeOptions.startY;

  if (deltaX % DRAG_THRESHOLD == 0 || deltaY % DRAG_THRESHOLD == 0) {
    if (
      state.resizeOptions.resizeHandle === "right" &&
      deltaX % DRAG_THRESHOLD == 0
    ) {
      console.log("Right increase", layoutContainer.value);

      console.log("Deltas ", deltaX, event);
      state.resizeOptions.element.width += deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
      redrawVueMasonry();
    } else if (
      state.resizeOptions.resizeHandle === "down" &&
      deltaY % DRAG_THRESHOLD == 0
    ) {
      console.log("Down increase");
      console.log("Deltas ", deltaY, event);
      state.resizeOptions.element.height +=
        deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
      redrawVueMasonry();
    } else if (
      state.resizeOptions.resizeHandle === "left" &&
      deltaX % DRAG_THRESHOLD == 0
    ) {
      console.log("Left increase");
      console.log("Deltas ", deltaX, event);
      state.resizeOptions.element.width += deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
      redrawVueMasonry();
    } else if (
      state.resizeOptions.resizeHandle === "up" &&
      deltaY % DRAG_THRESHOLD == 0
    ) {
      console.log("Up increase");
      console.log("Deltas ", deltaY, event);
      state.resizeOptions.element.height +=
        deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
      redrawVueMasonry();
    }
    state.resizeOptions.startX = event.clientX;
    state.resizeOptions.startY = event.clientY;
  }
  if (state.resizeOptions.element.width > 12) {
    state.resizeOptions.element.width = 12;
    redrawVueMasonry();
  } else if (state.resizeOptions.element.width < 1) {
    state.resizeOptions.element.width = 1;
    redrawVueMasonry();
  }
  // if (state.resizeOptions.element.height > 12) {
  //   state.resizeOptions.element.height = 12;
  //   redrawVueMasonry();
  // } else
  if (state.resizeOptions.element.height < 1) {
    state.resizeOptions.element.height = 1;
    redrawVueMasonry();
  }
};
const stopResize = () => {
  console.log("Stop resizeing ", event);
  state.resizeOptions.element = null;
  // state.layoutOptions.resizeHandle = null;
  // state.layoutOptions.startX = null;
  // state.layoutOptions.startY = null;
  // state.layoutOptions.startWidth = null;
  // state.layoutOptions.startHeight = null;
  redrawVueMasonry();
  window.removeEventListener("mousemove", handleResize);
  window.removeEventListener("mouseup", stopResize);
};
const setSelectedLayout = (layout: Layout) => {
  state.selectedLayout = layout;
};
</script>

<style scoped>
.column-card {
  /* height: 200px;
  display: flex;
  justify-content: center;
  align-items: center; */
}
.column-content {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.resize-handle {
  position: absolute;
  background-color: #000;
  opacity: 0.2;
}
.resize-handle.top {
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  cursor: ns-resize;
}
.resize-handle.right {
  top: 0;
  bottom: 0;
  right: 0;
  width: 5px;
  cursor: ew-resize;
}
.resize-handle.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  cursor: ns-resize;
}
.resize-handle.left {
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  cursor: ew-resize;
}

/* .item {
  grid-row-end: span 1;
  grid-column-end: span 1;
}

.item:first-child {
  grid-column-start: 1;
}

.item[colspan="2"] {
  grid-column-end: span 2;
}

.item[colspan="3"] {
  grid-column-end: span 3;
}

.item[colspan="4"] {
  grid-column-end: span 4;
}

.item[rowspan="2"] {
  grid-row-end: span 2;
}

.item[rowspan="3"] {
  grid-row-end: span 3;
} */

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: minmax(100px, max-content);
  grid-gap: 10px;
  width: 100%;
}

.panel {
  background-color: #ccc;
  padding: 10px;
}

.panel-1 {
  grid-row: 1 / 4;
  grid-column: 1 / 2;
  height: 100%;
}

.panel-2 {
  grid-row: 1 / 2;
  grid-column: 2 / 4;
  height: 100%;
}

.panel-3a {
  background-color: gold;
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  height: 100%;
}
.panel-3b {
  background-color: red;
  grid-row: 3 / 6;
  grid-column: 2 / 3;
  height: 100%;
}

.panel-4 {
  background-color: yellowgreen;
  grid-row: 2 / 5;
  grid-column: 3 / 4;
  height: 100%;
}

.panel-5 {
  background-color: green;
  grid-row: 4 / 6;
  grid-column: 1 / 2;
  height: 100%;
}

.panel-6 {
  background-color: blue;
  grid-row: 6 / 7;
  grid-column: 1 / 4;
  height: 100%;
}

.panel-7 {
  grid-row: 4 / 5;
  grid-column: 3 / 4;
  height: 100%;
}

.panel-8 {
  grid-row: 4 / 5;
  grid-column: 3 / 4;
  height: 100%;
}
</style>
