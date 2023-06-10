<template>
  <v-dialog v-model="open" min-width="300" width="auto" max-width="500">
    <v-card v-if="form">
      <v-form v-model="valid" ref="splitsForm">
        <v-card-title class="bg-primary">Splits</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="form.qty"
                  class="mb-2"
                  density="compact"
                  :rules="[
                    // (msg: number) => !!msg || 'QTY must be larger than 0',
                    (msg: number) => (msg &&  msg >= 0) || 'QTY must be larger than 0',
                    // (msg: number) => (item && msg <= item?.quantity) || 'Qty must be smaller than original',
                    (msg: number) => (item && msg + splitsSum <= item.quantity) || `Not available`,
                  ]"
                  variant="outlined"
                  label="Qty"
                  type="number"
                  persistent-hint
                  :hint="`Original (${item?.quantity})`"
                >
                </v-text-field>
                <v-text-field
                  v-model="form.price"
                  density="compact"
                  variant="outlined"
                  label="Price"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model="form.ref"
                  density="compact"
                  variant="outlined"
                  label="Ref No"
                  type="string"
                ></v-text-field>
                <v-text-field
                  v-model="form.ref2"
                  density="compact"
                  variant="outlined"
                  label="Ref No 2"
                  type="string"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="form.branch"
                  :items="branches"
                  density="compact"
                  variant="outlined"
                  label="Branch"
                ></v-select>
                <v-select
                  v-model="form.dealer"
                  :items="dealers"
                  :disabled="form.branch == null"
                  density="compact"
                  variant="outlined"
                  label="Dealer"
                ></v-select>
                <v-combobox
                  v-model="form.principal"
                  :items="clients"
                  :disabled="form.dealer == null"
                  :readonly="form.dealer == null"
                  density="compact"
                  variant="outlined"
                  label="Principal"
                ></v-combobox>

                <v-select
                  density="compact"
                  variant="outlined"
                  label="Client Sub Acc"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="border: 1px solid black">
                <v-data-table
                  show-select
                  density="compact"
                  v-model="selectedSplits"
                  return-object
                  :height="200"
                  :headers="headers"
                  :items="splits"
                  :items-per-page="-1"
                >
                  <template #bottom></template>
                  <!-- <template #headers></template> -->
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="px-5">
          <v-btn
            :disabled="!valid"
            @click="handleEnter"
            density="compact"
            variant="tonal"
            >Split</v-btn
          >
          <v-btn
            @click="handleDelete"
            :disabled="selectedSplits.length == 0"
            density="compact"
            variant="tonal"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn @click="submitForm" density="compact" variant="tonal"
            >Ok</v-btn
          >
          <v-btn @click="cancel" density="compact" variant="tonal"
            >Cancel</v-btn
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
import { useToastStore } from "@/store/toastStore";

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
const splits: Ref<FormModel[]> = ref([]);
const emit = defineEmits(["update:modelValue"]);
const authStore = useAuthStore();
// reactive form data
const form: Ref<FormModel | null> = ref(null);
const valid = ref(false);
const splitsForm = ref();

const headers = ref([
  {
    title: "QTY",
    key: "qty",
  },
  { title: "Price", key: "price" },
  { title: "Ref", key: "ref" },
  { title: "Ref2", key: "ref2" },
  { title: "Branch", key: "branch" },
  { title: "Dealer", key: "dealer" },
  { title: "Principal", key: "principal" },
]);
const selectedSplits: Ref<FormModel[]> = ref([]);
const splitsSum = computed(() =>
  splits.value.map((e) => e.qty).reduce((sum, num) => sum + num, 0)
);
const totalSum = computed(() => {
  return (props.item ? props.item.quantity : 0) + splitsSum.value;
});
const convertItemToForm = (item: MainModel): FormModel => {
  // Conversion logic goes here. Example:
  const diff = item.quantity - splitsSum.value;
  return {
    branch: item.member,
    qty: diff,
    price: Number(item.dealtPrice),
    dealer: item.dealer,
    principal: item.principal,
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
  useToastStore().addToast("Not implemented");
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
  if (form.value) {
    splits.value.push(form.value);
  }
  if (props.item) form.value = convertItemToForm(props.item);
}

function handleDelete() {
  // your logic here
  splits.value = splits.value.filter(
    (e) => selectedSplits.value.find((a) => a == e) == null
  );
  selectedSplits.value.splice(0);
}
</script>
