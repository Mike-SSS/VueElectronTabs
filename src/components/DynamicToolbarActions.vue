<template>
  <!-- <v-col class="flex-grow-1 text-end" ref="actionsCol">
    <div
      v-for="(button, index) in buttons"
      :key="button.id"
    >
      <v-tooltip :text="button.tooltip" v-if="index < cutoffIndex">
        <template v-slot:activator="{ props }">
          <v-btn
            :color="button.color"
            :variant="button.variant"
            :density="button.density"
            :icon="button.icon"
            v-bind="props"
            ref="el => buttonRefs[index] = el"
            @click="button.action"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>

    <v-menu
      :open-on-hover="true"
      v-if="buttons && buttons.length > cutoffIndex"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          density="compact"
          color="transparent"
          variant="flat"
          icon
          v-bind="props"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list density="compact" active-color="primary" color="pink">
        <template v-for="(button, i) in buttons">
          <v-list-item
            :key="button.id"
            v-if="i >= cutoffIndex"
            @click="button.action"
            :prepend-icon="button.icon"
          >
            <v-list-item-title>{{ button.tooltip }}</v-list-item-title>
            <v-list-item-action
              v-if="button.textField"
              class="d-flex align-center"
            >
              <v-text-field
                :density="button.textField.density"
                :variant="button.textField.variant"
                :single-line="button.textField.singleLine"
                :label="button.textField.label"
                :hide-details="button.textField.hideDetails"
                :placeholder="button.textField.placeholder"
                :type="button.textField.type"
              ></v-text-field>
              <v-btn density="compact" variant="text" icon="mdi-sync"></v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </v-col> -->
  <v-col ref="actionCol" class="text-end" v-resize="onResize">
    <v-tooltip :text="button.tooltip" v-for="(button, index) in visibleButtons">
      <template v-slot:activator="{ props }">
        <v-btn
          color="white"
          variant="tonal"
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
          v-for="(button, index) in overflowButtons"
          :key="button.id"
          @click="button.action"
        >
          <v-list-item-title>{{ button.tooltip }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-col>
</template>

<script setup lang="ts">
import {
  nextTick,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  reactive,
} from "vue";

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
let actionButtons = ref(props.buttons);

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
// const cutoffIndex = ref(0);

// const buttonRefs: Ref<(HTMLElement | null)[]> = ref([]);

// watchEffect(() => {
//   buttonRefs.value = new Array(props.buttons.length).fill(null);
// });

// watchEffect(() => {
//   if (!actionsCol.value) return;
//   const totalWidth = actionsCol.value.clientWidth;
//   nextTick(() => {
//     if (!actionsCol.value) return;
//     const totalWidth = actionsCol.value.clientWidth;
//     console.log("Actions : ", (actionsCol.value as any).$el);
//     let currentWidth = 0;
//     console.log('Total width:', totalWidth);
//     for (let i = 0; i < buttonRefs.length; i++) {
//       const button = buttonRefs[i];
//       if (button) {
//         const buttonWidth = button.offsetWidth;
//         console.log(`Button ${i} width:`, buttonWidth);
//         if (currentWidth + buttonWidth > totalWidth) {
//           cutoffIndex.value = i;
//           break;
//         }
//         currentWidth += buttonWidth;
//       }
//     }
//     console.log('Cutoff index:', cutoffIndex.value);
//   });
// });
</script>
