<template>
  <v-card>
    <v-card-title>Dynamic Layout</v-card-title>
    <v-card-actions>
      <v-menu offset-y>
        <template #activator="props">
          <v-btn v-bind="props.props" v-on="props.props.on">{{
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
        <draggable
          v-model="state.selectedLayout.columns"
          :options="state.dragOptions"
          :component-data="{ class: 'v-row' }"
        >
          <template #item="{ element }"
            ><v-col :key="element" :cols="element.width">
              <v-card class="column-card" :color="element.color">
                <div class="column-content">
                  <div class="mb-6">{{ element.content }}</div>
                  <component :is="element.component"></component>
                </div>
              </v-card> </v-col
          ></template>
        </draggable>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from "vue";
import Column1 from "@/components/Column1.vue";
import draggable from "vuedraggable";
import { createPinia } from "pinia";

const pinia = createPinia();
interface Column {
  width: number;
  color: string;
  content: string;
  component: string | typeof Column1 | null;
}

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
}>({
  layoutOptions: [
    {
      name: "Layout 1",
      columns: [
        {
          width: 6,
          color: "primary",
          content: "Column 1",
          component: Column1,
        },
        { width: 6, color: "secondary", content: "Column 2", component: null },
        { width: 12, color: "error", content: "Column 3", component: null },
        { width: 6, color: "success", content: "Column 4", component: null },
        { width: 6, color: "warning", content: "Column 5", component: null },
      ],
    },
    {
      name: "Layout 2",
      columns: [
        {
          width: 12,
          color: "primary",
          content: "Column 1",
          component: Column1,
        },
        { width: 12, color: "secondary", content: "Column 2", component: null },
        { width: 12, color: "error", content: "Column 3", component: null },
      ],
    },
    {
      name: "Layout 3",
      columns: [
        { width: 4, color: "primary", content: "Column 1", component: Column1 },
        { width: 8, color: "secondary", content: "Column 2", component: null },
        { width: 6, color: "warning", content: "Column 3", component: null },
        { width: 6, color: "success", content: "Column 4", component: null },
      ],
    },
  ],
  selectedLayout: null,
  dragOptions: {
    animation: 200,
    group: "layout",
    ghostClass: "ghost",
  },
});

const setSelectedLayout = (layout: Layout) => {
  state.selectedLayout = layout;
};
</script>

<style scoped>
.column-card {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.column-content {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
</style>
