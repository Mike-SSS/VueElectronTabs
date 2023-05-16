<template>
  <v-dialog width="1000" v-model="open" scrollable>
    <v-card min-height="250">
      <v-card-title class="d-flex justify-space-between align-center"
        ><div>Layout Manager</div>
        <v-btn @click="open = false" density="compact" icon flat
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-subtitle>
        <div class="text-subtitle-1">
          Some data may lost when switching layouts and panel is not transfered
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row v-if="currentLayout">
            <v-col class="d-flex"
              ><div class="text-h4">Current Layout:</div>
              <v-spacer></v-spacer>
              <div style="width: 200px">
                <v-select
                  v-if="currentLayout"
                  density="compact"
                  disabled
                  v-model="currentLayout"
                  label="Current Layout"
                  :return-object="true"
                  :single-line="true"
                  item-title="name"
                  item-value="name"
                  :items="layoutOptions"
                  hide-details="auto"
                >
                  <template #item="{ item }">
                    <v-list-item :title="item.title" :value="item">
                      <template v-slot:append>
                        <v-container>
                          <v-row>
                            <v-col
                              ><div>{{ item.raw.name }}</div></v-col
                            >
                            <v-col
                              cols="4"
                              class="grid-container-mini"
                              v-if="item.raw"
                            >
                              <div
                                v-for="(col, index) in item.raw.columns"
                                :key="col.id"
                                :class="`bg-` + col.color"
                                class="text-center align-center"
                                :style="col.grid"
                              ></div>
                            </v-col>
                          </v-row>
                        </v-container>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </v-col>
            <v-col cols="12">
              <div>
                <div class="grid-container-mini" v-if="currentLayout">
                  <div
                    v-for="(col, index) in currentLayout.columns"
                    :key="col.id"
                    :class="`bg-` + col.color"
                    class="text-center align-center"
                    :style="col.grid"
                  >
                    <v-select
                      v-if="currentLayout != null"
                      hide-details="auto"
                      :value="col.component"
                      :menu-props="{
                        closeOnContentClick: true,
                      }"
                      variant="filled"
                      :hide-no-data="false"
                      density="compact"
                      placeholder="-- Swap current component --"
                      :items="
                        currentLayout.columns.filter(
                          (e) => e.component != null && col.id != e.id
                        )
                      "
                      item-value="component"
                      item-title="id"
                    >
                      <template #selection="{ item }">
                        {{ item.raw.component }}
                      </template>
                      <template #no-data></template>
                      <template #prepend-item>
                        <v-list-item
                          title="None"
                          active-class="bg-amber"
                          active-color="primary"
                          :value="null"
                          @click="col.component = null"
                        >
                        </v-list-item>
                      </template>
                      <template #item="{ item, index }">
                        <v-list-item
                          :subtitle="item.raw.component?.toString()"
                          :title="item.raw.id"
                          :value="item"
                          active-class="bg-amber"
                          active-color="primary"
                          @click="onSwapComponents(item.raw, col)"
                        >
                          <template v-slot:prepend>
                            <v-avatar icon="mdi-sync" :color="item.raw.color">
                            </v-avatar>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex"
              ><div class="text-h4">Switch to:</div>
              <v-spacer></v-spacer>
              <div style="width: 200px">
                <v-select
                  density="compact"
                  v-model="state.changeToLayout"
                  placeholder="-- Presets --"
                  :return-object="false"
                  :menu-props="{
                    closeOnContentClick: true,
                  }"
                  item-title="name"
                  item-value="name"
                  :items="layoutOptions"
                  hide-details="auto"
                >
                  <template #item="{ item }">
                    <v-list-item
                      active-class="bg-amber"
                      active-color="primary"
                      density="compact"
                      :title="item.title"
                      :value="item"
                      @click="state.changeToLayout = item.raw"
                    >
                      <template v-slot:append>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="4"
                              class="grid-container-mini"
                              v-if="item.raw"
                            >
                              <div
                                v-for="(col, index) in item.raw.columns"
                                :key="col.id"
                                :class="`bg-` + col.color"
                                class="text-center align-center"
                                :style="col.grid"
                              ></div>
                            </v-col>
                          </v-row>
                        </v-container>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </v-col>
            <v-col cols="12">
              <div>
                <div class="grid-container-mini" v-if="state.changeToLayout">
                  <div
                    v-for="(col, index) in state.changeToLayout.columns"
                    :key="col.id"
                    :class="`bg-` + col.color"
                    class="text-center align-center pa-2"
                    :style="col.grid"
                  >
                    <v-select
                      hide-details="auto"
                      v-model="col.component"
                      :menu-props="{
                        closeOnBack: true,
                      }"
                      variant="filled"
                      active-class="bg-amber"
                      active-color="primary"
                      density="compact"
                      placeholder="-- Current component --"
                      :items="
                        currentLayout
                          ? currentLayout.columns.filter(
                              (e) => e.component != null
                            )
                          : []
                      "
                      item-value="component"
                      item-title="component"
                    >
                      <template #no-data></template>
                      <template #prepend-item>
                        <v-list-item
                          active-class="bg-amber"
                          active-color="primary"
                        >
                          <Placeholder
                            class="bg-transparent"
                            :style="{}"
                          ></Placeholder>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item
                          title="None"
                          active-class="bg-amber"
                          active-color="primary"
                          :value="null"
                          @click="col.component = null"
                        >
                        </v-list-item>
                      </template>
                    </v-select>
                    <!-- <div>{{ col.id }}</div>
                    <div>{{ col.component ? col.component : "None" }}</div> -->
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- <v-row align="center" justify="space-between">
            <v-col cols="5">
              <v-select
                v-model="currentLayout"
                item-title="name"
                item-value="name"
                :return-object="true"
                readonly
                :single-line="false"
                label="Current Layout"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="2" class="text-center"
              ><v-icon>mdi-arrow-right</v-icon></v-col
            >
            <v-col cols="5"
              ><v-select
                v-model="state.changeToLayout"
                label="New Layout"
                :return-object="true"
                :single-line="false"
                item-title="name"
                item-value="name"
                :items="layoutOptions"
                hide-details="auto"
              ></v-select
            ></v-col>
          </v-row> -->
          <!-- <v-row
            dense
            v-if="currentLayout"
            v-for="(largestColumnIndex, rowIndex) in largestLayoutSize"
            align="center"
          >
            <v-col cols="5">
              <v-card
                class="comparison-card"
                v-if="currentLayout.columns[rowIndex]"
              >
                <v-card-title>{{
                  currentLayout.columns[rowIndex].id
                }}</v-card-title>
                <v-card-text class="text-subtitle-1">
                  <div v-if="currentLayout && currentLayout.columns[rowIndex]">
                    Component:
                    {{
                      currentLayout.columns[rowIndex].component
                        ? currentLayout.columns[rowIndex].component
                        : "None"
                    }}
                  </div>
                  <div v-else>Component: Empty {{ rowIndex }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="2" class="text-center"
              ><v-icon>mdi-arrow-right</v-icon></v-col
            >
            <v-col cols="5">
              <v-card
                class="comparison-card"
                v-if="
                  state.changeToLayout && state.changeToLayout.columns[rowIndex]
                "
              >
                <v-card-title>{{
                  state.changeToLayout.columns[rowIndex].id
                }}</v-card-title>
                <v-card-text class="text-subtitle-1 pb-1">
                  <v-container>
                    <v-row>
                      <v-col cols="9">
                        <v-select
                          v-model="
                            state.changeToLayout.columns[rowIndex].component
                          "
                          :items="
                            currentLayout.columns.filter(
                              (e) => e.component != null
                            )
                          "
                          item-value="component"
                          item-title="component"
                        ></v-select>
                        <div
                          v-if="
                            state.changeToLayout &&
                            state.changeToLayout.columns[rowIndex]
                          "
                        >
                          Component:
                          {{
                            state.changeToLayout.columns[rowIndex].component
                              ? state.changeToLayout.columns[rowIndex].component
                              : "None"
                          }}
                        </div>
                        <div v-else>Empty</div></v-col
                      >
                      <v-col cols="3"
                        ><v-btn size="small" icon
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                        <v-btn size="small" icon
                          ><v-icon>mdi-sync</v-icon></v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row> -->
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="tonal" color="primary">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useLayoutStore } from "@/store/layout";
import { reactive } from "vue";
import { ref } from "vue";

import UserProfile from "@/views/preferences/UserProfile.vue";
import Flags from "@/views/preferences/Flags.vue";
import { watchEffect } from "vue";
import { COLUMN, LAYOUT } from "@/models/layout";

const storeLayout = useLayoutStore();
const layoutOptions = computed(() => storeLayout.layoutOptions);
const currentLayout = computed(() => storeLayout.currentLayout);

const props = defineProps({
  modelValue: Boolean,
});
const state = reactive<{
  changeToLayout: LAYOUT | undefined;
}>({
  changeToLayout: undefined,
});
const emit = defineEmits(['update:modelValue']);
const open = ref(props.modelValue);

const tab = ref(null);
watchEffect(() => {
  open.value = props.modelValue
})

watchEffect(() => {
  emit('update:modelValue', open.value)
})

function onSwapComponents(selected: COLUMN, current: COLUMN) {
  // Your custom function to handle the value change
  console.log("Value changed to:", selected, current);
  const currentCol = current.component;
  current.component = selected.component;
  selected.component = currentCol;
  // Add your complex swapping logic here
}
</script>

<style></style>
