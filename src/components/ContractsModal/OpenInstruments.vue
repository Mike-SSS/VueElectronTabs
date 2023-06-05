<template>
  <v-dialog v-model="open" scrollable width="auto" key="Futures_addInstruments">
    <v-card height="80vh" width="80vw">
      <v-card-title class="bg-primary"
        ><v-row justify="space-between">
          <v-col cols="10"
            >Instrument List ({{ items ? items.length : -2 }})</v-col
          >
          <v-col cols="2" sm="auto"
            ><v-btn icon size="20" color="error" flat></v-btn
            ><v-btn
              @click="open = false"
              size="small"
              icon
              color="transparent"
              flat
            >
              <v-icon icon="mdi-close"></v-icon> </v-btn
          ></v-col> </v-row
      ></v-card-title>
      <v-card-subtitle>
        <v-container fluid
          ><v-row align="center">
            <v-col cols="4"
              ><v-text-field
                hide-details
                label="Search"
                append-inner-icon="mdi-magnify"
                variant="outlined"
              ></v-text-field
            ></v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"
              ><v-btn
                @click="subToSelected"
                :disabled="selectedInstruments.length == 0"
                color="primary"
              >
                Add ({{ selectedInstruments.length }})</v-btn
              ></v-col
            >
            <v-col cols="auto"
              ><v-btn @click="open = false" color="primary"> Done</v-btn></v-col
            >
          </v-row></v-container
        >
      </v-card-subtitle>
      <v-card-text>
        <v-data-table
          density="compact"
          :items="notSelectedData"
          v-model="selectedInstruments"
          :headers="headers"
          multi-sort
          :group-by="[{ key: 'contractDisplay.instrument' }]"
          height="60vh"
          show-select
          return-object
          fixed-header
          item-value="contract"
          :items-per-page="-1"
        >
          <!-- :group-by="[{ key: 'contractDisplay.instrument' }]" -->
          <!-- { item, columns, toggleGroup, isGroupOpen } -->
          <!-- "index", "item", "columns", "isExpanded", "toggleExpand", "isSelected", "toggleSelect", "toggleGroup", "isGroupOpen" -->
          <template v-slot:group-header="{ item, columns, toggleGroup }">
            <tr :id="'group_' + item.value">
              <td :colspan="columns.length">
                <v-btn
                  :size="25"
                  variant="text"
                  icon="$expand"
                  @click="toggleGroup(item)"
                ></v-btn>
                {{ item.value }} ({{ item.items.length }})
              </td>
            </tr>
          </template>
          <template
            v-slot:item.data-table-select="{ item, toggleSelect, isSelected }"
          >
            <v-checkbox-btn
              style="font-size: 0.7rem"
              color="primary"
              :model-value="isSelected([item])"
              @click.stop.prevent="() => toggleSelect(item)"
            ></v-checkbox-btn>
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="open = false"
          >Close Instruments</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
import { DataTableHeaderCustom } from "@/views/TradingView/Futures.vue";
import { computed } from "vue";
import { Ref } from "vue";
import { PropType } from "vue";
import { ref, watchEffect } from "vue";

const props = defineProps({
  modelValue: Boolean,
  items: {
    type: Array<MainModel>,
    required: true,
  },
  currentSubscriptions: {
    type: Array<MainModel>,
    required: true,
  },
  headers: {
    type: Array<DataTableHeaderCustom>,
    required: true,
  },
  subscribeToSelected: {
    required: true,
    type: Function as PropType<(list: MainModel[]) => Promise<void>>,
  },
});

const selectedInstruments: Ref<MainModel[]> = ref([]);
const emit = defineEmits(["update:modelValue"]);

const open = ref(props.modelValue);

// sync open status with parent
watchEffect(() => {
  open.value = props.modelValue;
});
watchEffect(() => {
  emit("update:modelValue", open.value);
});
const notSelectedData = computed(() =>
  props.items.filter(
    (x) =>
      props.currentSubscriptions.findIndex((e) => e.contract == x.contract) ==
      -1
  )
);

function subToSelected() {
  props.subscribeToSelected(selectedInstruments.value);
}
// async function subscribeToSelected() {
//   console.log("Subscribing to : ", selectedInstruments.value);
//   await props.subscribe(selectedInstruments.value.map((e) => e.contract));
//   selectedInstruments.value.forEach((e) => {
//     const found = props.items.findIndex(
//       (match) => e.contract == match.contract
//     );
//     if (found == -1) return;
//     console.log("Subscribe to index: ", found);
//     props.currentSubscriptions.push(props.items[found]);
//   });
//   selectedInstruments.value.splice(0);
// }

async function submitForm() {
  // submit form data to your API
  // no changes to the item prop

  // close the dialog after submit
  open.value = false;
}

function cancel() {
  // reset form data

  // close the dialog
  open.value = false;
  selectedInstruments.value.splice(0);
}
</script>
