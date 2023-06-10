<template>
  <v-dialog v-model="open" width="300">
    <v-card>
      <v-card-title class="bg-primary">Sub Account</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.qty"
                density="compact"
                variant="outlined"
                label="Qty"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="form.price"
                density="compact"
                variant="outlined"
                label="Price"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="form.refNo"
                density="compact"
                variant="outlined"
                label="Ref No"
                type="string"
              ></v-text-field>
              <v-text-field
                v-model="form.refNo2"
                density="compact"
                variant="outlined"
                label="Ref No 2"
                type="string"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.principle"
                :items="principles"
                density="compact"
                variant="outlined"
                label="Principle"
              ></v-select>
              <v-select
                v-model="form.dealer"
                :items="dealers"
                density="compact"
                variant="outlined"
                label="Dealer"
              ></v-select>
              <v-select
                v-model="form.clientSubAcc"
                :items="clientSubAccs"
                density="compact"
                variant="outlined"
                label="Client Sub Acc"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="border: 1px solid black">
              <v-data-table :items-per-page="-1">
                <template #bottom></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submitForm" density="compact" variant="tonal">Ok</v-btn>
        <v-btn @click="cancel" density="compact" variant="tonal">Cancel</v-btn>
        <v-btn @click="handleEnter" density="compact" variant="tonal"
          >Enter</v-btn
        >
        <v-btn @click="handleDelete" density="compact" variant="tonal"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watchEffect } from "vue";
import { Deal as MainModel } from "@/models/marketData";
import { useToastStore } from "@/store/toastStore";

const props = defineProps({
  modelValue: Boolean,
  item: Object as PropType<MainModel>,
});

const emit = defineEmits(["update:modelValue"]);

// reactive form data
const form = ref({
  qty: props.item?.quantity,
  price: props.item?.dealtPrice,
  refNo: props.item?.userRef,
  refNo2: props.item?.exchangeRef,
  principle: props.item?.principal,
  dealer: props.item?.dealer,
  clientSubAcc: props.item?.subAccount,
});

// List of options to select from
const principles = ref(["Principle 1", "Principle 2", "Principle 3"]);
const dealers = ref(["Dealer 1", "Dealer 2", "Dealer 3"]);
const clientSubAccs = ref([
  "Client Sub Acc 1",
  "Client Sub Acc 2",
  "Client Sub Acc 3",
]);

const open = ref(props.modelValue);

// sync open status with parent
watchEffect(() => {
  open.value = props.modelValue;
});
watchEffect(() => {
  emit("update:modelValue", open.value);
});

async function submitForm() {
  // submit form data to your API
  // no changes to the item prop
  useToastStore().addToast("Not implemented");
  // close the dialog after submit
  open.value = false;
}

function cancel() {
  // reset form data
  form.value = {
    qty: props.item?.quantity,
    price: props.item?.dealtPrice,
    refNo: props.item?.userRef,
    refNo2: props.item?.exchangeRef,
    principle: props.item?.principal,
    dealer: props.item?.dealer,
    clientSubAcc: props.item?.subAccount,
  };

  // close the dialog
  open.value = false;
}

// Add functionality for 'Enter' and 'Delete' buttons
function handleEnter() {
  // your logic here
}

function handleDelete() {
  // your logic here
}
</script>
