<template>
  <v-col ref="actionCol" class="text-end" v-resize="onResize">
    <v-tooltip
      :text="button.tooltip"
      v-for="(button, index) in visibleButtons"
      :key="`${index}-${button.id}`"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="white"
          variant="tonal"
          :disabled="button.disabled"
          density="compact"
          @click="button.action"
          :icon="button.icon"
          v-bind="props"
        ></v-btn
      ></template>
    </v-tooltip>
    <v-menu :open-on-hover="true">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="overflowButtons.length != 0"
          density="compact"
          color="transparent"
          variant="flat"
          icon
          v-bind="props"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item
          v-for="button in overflowButtons"
          :key="button.id"
          @click="button.action"
          :disabled="button.disabled"
        >
          <v-list-item-title>{{ button.tooltip }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-col>
</template>

<!-- <script setup lang="ts">
import { ActionButton } from "@/models/UI";
import { ref, Ref, onMounted, computed } from "vue";

const props = defineProps({
  buttons: {
    type: Array<ActionButton>,
    required: true,
  },
});

interface ButtonRef {
  clientWidth: number;
}
const buttonSize = 50; // Define your button size here
let actionButtons = computed(() => props.buttons);

const actionCol: Ref<HTMLElement | null> = ref(null);
const visibleButtons = ref<ActionButton[]>([]);
const overflowButtons = ref<ActionButton[]>([]);

const recalculateVisibleButtons = () => {
  const availableWidth = (actionCol.value as any).$el.clientWidth || 0;
  const maxVisibleButtons = Math.floor(availableWidth / buttonSize);
  console.log("RecalculateVisible: ", maxVisibleButtons, availableWidth);

  visibleButtons.value = actionButtons.value.slice(0, maxVisibleButtons);
  overflowButtons.value = actionButtons.value.slice(maxVisibleButtons);
};

const onResize = () => {
  console.log(" ----------- Resize col --------------");
  recalculateVisibleButtons();
};

onMounted(() => {
  recalculateVisibleButtons();
});
</script> -->
<script setup lang="ts">
import { ActionButton } from "@/models/UI";
import { ref, Ref, onMounted, computed, watch, reactive } from "vue";

const props = defineProps({
  buttons: {
    type: Array<ActionButton>,
    required: true,
  },
});

interface ButtonRef {
  clientWidth: number;
}
const buttonSize = 50; // Define your button size here
let actionButtons = computed(() => props.buttons);

const actionCol: Ref<HTMLElement | null> = ref(null);
const visibleButtons = reactive<ActionButton[]>([]);
const overflowButtons = reactive<ActionButton[]>([]);

const recalculateVisibleButtons = () => {
  const availableWidth = (actionCol.value as any).$el.clientWidth || 0;
  const maxVisibleButtons = Math.floor(availableWidth / buttonSize);
  console.log("RecalculateVisible: ", maxVisibleButtons, availableWidth);

  visibleButtons.splice(
    0,
    visibleButtons.length,
    ...actionButtons.value.slice(0, maxVisibleButtons)
  );
  overflowButtons.splice(
    0,
    overflowButtons.length,
    ...actionButtons.value.slice(maxVisibleButtons)
  );
};

const onResize = () => {
  console.log(" ----------- Resize col --------------");
  recalculateVisibleButtons();
};

onMounted(() => {
  recalculateVisibleButtons();
});

watch(actionButtons, () => {
  recalculateVisibleButtons();
});
</script>
