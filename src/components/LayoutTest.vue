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
    <v-card-text v-if="state.selectedLayout">
      <v-container fluid>
        <keep-alive
          ><draggable
            v-model="state.selectedLayout.columns"
            :options="state.dragOptions"
            :component-data="{ class: 'v-row' }"
            item-key="id"
            :draggable="false"
          >
            <template #item="{ element }">
              <v-col :key="element" :cols="element.width">
                <v-card
                  class="column-card"
                  :color="element.color"
                  :height="element.height * 50"
                >
                  <v-card-title class="black" color="white">
                    toolbar for the window
                  </v-card-title>
                  <v-card-text>
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
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineComponent, reactive, markRaw } from "vue";
import Column1 from "@/components/Column1.vue";
import draggable from "vuedraggable";
import { createPinia } from "pinia";
import { detailed } from "yargs-parser";
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
          width: 6,
          height: 6,
          color: "primary",
          content: "Column 1",
          component: markRaw(Column1),
          id: "first",
        },
        {
          width: 6,
          height: 6,
          color: "secondary",
          content: "Column 2",
          component: markRaw(Column1),
          id: "second",
        },
        {
          width: 12,
          height: 6,
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
  // state.resizeOptions.startWidth = parseInt(
  //   window.getComputedStyle(this.$el).getPropertyValue("width"),
  //   10
  // );
  // state.resizeOptions.startHeight = parseInt(
  //   window.getComputedStyle(this.$el).getPropertyValue("height"),
  //   10
  // );
  window.addEventListener("mousemove", handleResize);
  window.addEventListener("mouseup", stopResize);
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
      console.log("Right increase");
      console.log("Deltas ", deltaX, event);
      state.resizeOptions.element.width += deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
    } else if (
      state.resizeOptions.resizeHandle === "down" &&
      deltaY % DRAG_THRESHOLD == 0
    ) {
      console.log("Down increase");
      console.log("Deltas ", deltaY, event);
      state.resizeOptions.element.height += deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
    } else if (
      state.resizeOptions.resizeHandle === "left" &&
      deltaX % DRAG_THRESHOLD == 0
    ) {
      console.log("Left increase");
      console.log("Deltas ", deltaX, event);
      state.resizeOptions.element.width += deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
    } else if (
      state.resizeOptions.resizeHandle === "up" &&
      deltaY % DRAG_THRESHOLD == 0
    ) {
      console.log("Up increase");
      console.log("Deltas ", deltaY, event);
    }
    state.resizeOptions.startX = event.clientX;
    state.resizeOptions.startY = event.clientY;
  }
  if (state.resizeOptions.element.width > 12) {
    state.resizeOptions.element.width = 12;
  } else if (state.resizeOptions.element.width < 1) {
    state.resizeOptions.element.width = 1;
  }
  if (state.resizeOptions.element.height > 12) {
    state.resizeOptions.element.height = 12;
  } else if (state.resizeOptions.element.height < 1) {
    state.resizeOptions.element.height = 1;
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
</style>
