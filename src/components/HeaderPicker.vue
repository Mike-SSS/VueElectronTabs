<template>
  <v-dialog v-model="open" scrollable width="auto" key="Futures_addInstruments">
    <v-card height="80vh" min-width="300" color="white">
      <v-card-title class="bg-primary"
        ><v-row justify="space-between" align="center">
          <v-col cols="10" sm="9">Instrument Headers</v-col>
          <v-col cols="2" sm="auto"
            ><v-btn
              @click="closeModal"
              size="small"
              icon
              color="transparent"
              flat
            >
              <v-icon icon="mdi-close"></v-icon> </v-btn
          ></v-col> </v-row
      ></v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            lines="one"
            v-for="header in props.tableHeaders"
            :key="header.title"
            :title="header.title"
            :id="header.title"
          >
            <template v-slot:prepend>
              <v-list-item-action>
                <v-checkbox-btn
                  @change="updateHeader($event, header)"
                  :model-value="props.selectedHeaders.find((e: any) => e.key == header.key) != null"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { DataTableHeaderCustom } from "@/views/TradingView/Futures.vue";
import { ref, watchEffect, computed, reactive } from "vue";

const props = defineProps({
  modelValue: Boolean,
  tableHeaders: {
    type: Array as () => DataTableHeaderCustom[],
    required: true,
  },
  selectedHeaders: {
    type: Array as () => DataTableHeaderCustom[],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "update:selectedHeaders"]);
const open = ref(props.modelValue);

watchEffect(() => {
  open.value = props.modelValue;
});

watchEffect(() => {
  emit("update:modelValue", open.value);
});

const localSelectedHeaders = computed({
  get: () => props.selectedHeaders,
  set: (newValue) => emit("update:selectedHeaders", newValue),
});

function closeModal(): void {
  open.value = false;
}

function updateHeader(e: Event, header: DataTableHeaderCustom) {
  console.log("Update header ", e.target, (e?.target as any).value, header);
  const foundSelected = localSelectedHeaders.value.findIndex(
    (item) => item.key === header.key
  );
  if (foundSelected != -1) {
    localSelectedHeaders.value = localSelectedHeaders.value.filter(
      (_, index) => index !== foundSelected
    );
  } else {
    localSelectedHeaders.value = [...localSelectedHeaders.value, header];
  }
}
</script>
