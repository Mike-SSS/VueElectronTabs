<template>
  <v-dialog v-model="open" min-width="300" width="auto" max-width="500">
    <v-card>
      <v-form v-model="valid" ref="splitsForm">
        <v-card-title class="bg-primary">Splits</v-card-title>
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
          <v-btn @click="submitForm" density="compact" variant="tonal"
            >Ok</v-btn
          >
          <v-btn @click="cancel" density="compact" variant="tonal"
            >Cancel</v-btn
          >
          <v-btn @click="handleEnter" density="compact" variant="tonal"
            >Enter</v-btn
          >
          <v-btn @click="handleDelete" density="compact" variant="tonal"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watchEffect, watch } from "vue";
import { Deal as MainModel } from "@/models/marketData";
import { computed } from "vue";
import { Ref } from "vue";
import { useAuthStore } from "@/store/authStore";

const props = defineProps({
  modelValue: Boolean,
  item: {
    type: Object as PropType<MainModel> | PropType<null>,
    required: false,
  },
});

interface FormModel {
  branch: null | string;
  qty: number;
  price: number;
  dealer: string | null;
  principal: string | null;
  ref: string | null;
  ref2: string | null;
}
const emit = defineEmits(["update:modelValue"]);
const authStore = useAuthStore();
// reactive form data
const form: Ref<FormModel | null> = ref(null);
const valid = ref(false);
const splitsForm = ref();

const convertItemToForm = (item: MainModel): FormModel => {
  // Conversion logic goes here. Example:
  return {
    branch: null,
    qty: item.quantity,
    price: Number(item.dealtPrice),
    dealer: "BDA",
    principal: "BVGM",
    ref: null,
    ref2: null,
  };
};
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      form.value = convertItemToForm(newItem);
      if (splitsForm.value) {
        console.log("Trade form ", splitsForm.value);
        splitsForm.value.validate();
      }
    } else {
      form.value = null;
    }
  },
  { immediate: true }
);
// List of options to select from
const hq = computed(() => authStore.getHQ);
const branches = computed(() => {
  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    return hq.value.masterDealerCodes.map((e) => e.branch);
  } else {
    if (!hq.value.clientCodes) return [];
    return hq.value.clientCodes.map((e) => e.branch);
  }
});
const clients = computed(() => {
  if (!form.value || !form.value.branch) return [];

  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    const branch = hq.value.masterDealerCodes.find(
      (e) => form.value && form.value.branch && e.branch == form.value.branch
    );
    if (!branch) return [];
    return branch.clientCodes;
  } else {
    if (!hq.value.clientCodes) return [];
    const branch = hq.value.clientCodes.find(
      (e) => form.value && form.value.branch && e.branch == form.value.branch
    );
    if (!branch) return [];
    const _dealer = branch.codesPerDealer.find(
      (e) =>
        form.value && form.value.branch && e.dealerCode == form.value.dealer
    );
    if (!_dealer) return [];
    return _dealer.clientCodes;
  }
});
const dealers = computed(() => {
  // if (!form.value.branch) return [];
  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    const branch = hq.value.masterDealerCodes.find((e) => e.dealers);
    if (!branch) return [];
    return branch.dealers;
  } else {
    if (!hq.value.clientCodes) return [];
    const branch = hq.value.clientCodes.find(
      (e) => form.value && form.value.branch && e.branch == form.value.branch
    );
    if (!branch) return [];
    const _dealers = branch.codesPerDealer.map((e) => e.dealerCode);
    return _dealers;
  }
});

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

  // close the dialog after submit
  open.value = false;
}

function cancel() {
  // reset form data
  // form.value = {
  //   qty: props.item?.quantity,
  //   price: props.item?.dealtPrice,
  //   refNo: props.item?.exchangeRef,
  //   refNo2: props.item?.userRef,
  //   principle: props.item?.principal,
  //   dealer: props.item?.dealer,
  //   clientSubAcc: props.item?.subAccount,
  // };

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
