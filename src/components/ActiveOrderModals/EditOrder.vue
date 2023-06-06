<template>
  <v-dialog min-width="400" max-width="500" v-model="open">
    <v-card v-if="item">
      <v-form
        validate-on="input"
        v-model="valid"
        @submit.prevent="editTrade"
        ref="editForm"
      >
        <v-card-title>
          {{ item ? item.contractDisplay.contractDisplay : "Empty" }}
        </v-card-title>
        <v-card-text>
          <v-container v-if="form">
            <v-row>
              <v-col cols="6"
                ><v-text-field
                  type="number"
                  label="QTY"
                  :rules="[
                    (msg: number) => !!msg || 'Qty Required',
                    (msg: number) => msg >= 0 || 'Qty cannot be less or equal to 0',
                  ]"
                  v-model.number="form.qty"
                ></v-text-field>
                <v-text-field
                  type="number"
                  label="Strike"
                  v-model.number="form.price"
                  :rules="[
                    (msg: number) => !!msg || 'Strike Required',
                    (msg: number) => msg >= 0 || 'Strike cannot be less or equal to 0',
                  ]"
                ></v-text-field
                ><v-text-field
                  type="number"
                  label="Ref No"
                  v-model.number="form.ref"
                ></v-text-field
                ><v-text-field
                  type="number"
                  label="Ref No 2"
                  v-model.number="form.ref2"
                ></v-text-field
              ></v-col>
              <v-col cols="6"
                ><v-select
                  v-model="form.branch"
                  :items="branches"
                  label="Branch"
                ></v-select
                ><v-select
                  :items="dealers"
                  v-model="form.dealer"
                  label="Dealer"
                ></v-select>
                <v-select
                  v-model="form.principal"
                  :items="clients"
                  label="Principal"
                ></v-select>
                <v-text-field v-model="form.ref" label="Ref"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-radio-group hide-details inline v-model="form.capacity">
                  <v-radio label="Buy" :value="BuySell.Buy"></v-radio>
                  <v-radio label="Sell" :value="BuySell.Sell"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="closeModal" color="primary" variant="outlined"
            >Cancel</v-btn
          >
          <v-btn
            type="submit"
            :disabled="valid == false || !props.item"
            color="primary"
            variant="elevated"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { HubConnection } from "@microsoft/signalr";
import { PropType } from "vue";
import { ref, watchEffect, watch, computed } from "vue";
import { ActiveOrder as MainModel } from "@/models/marketData";
import { useAuthStore } from "@/store/authStore";
import { Ref } from "vue";
import {
  Capacity,
  MitsOrderType,
  BuySell,
  IInsertOrderFutures,
} from "@/models/trading";

interface FormModel {
  branch: null | string;
  qty: number;
  price: number;
  dealer: string | null;
  capacity: BuySell;
  principal: string | null;
  ref: string | null;
  ref2: string | null;
  type: MitsOrderType;
}
const props = defineProps({
  modelValue: Boolean,
  socket: {
    type: null as unknown as Object as PropType<HubConnection | null>,
    default: null,
    required: true,
  },
  item: {
    type: Object as PropType<MainModel> | PropType<null>,
    required: false,
  },
});

const authStore = useAuthStore();

const editForm = ref();
const form: Ref<FormModel | null> = ref(null);
const valid = ref(false);
// Function to convert ItemModel to FormModel
const convertItemToForm = (item: MainModel): FormModel => {
  // Conversion logic goes here. Example:
  return {
    branch: null,
    qty: item.quantity,
    price: Number(item.rate),
    dealer: "BDA",
    capacity: item.buySell as BuySell,
    principal: "BVGM",
    ref: null,
    ref2: null,
    type: MitsOrderType.Normal,
  };
};

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      form.value = convertItemToForm(newItem);
      if (editForm.value) {
        console.log("Trade form ", editForm.value);
        editForm.value.validate();
      }
    } else {
      form.value = null;
    }
  },
  { immediate: true }
);

const emit = defineEmits(["update:modelValue"]);
const open = ref(props.modelValue);
watchEffect(() => {
  open.value = props.modelValue;
});

watchEffect(() => {
  emit("update:modelValue", open.value);
});

function closeModal(): void {
  open.value = false;
}
function editTrade() {
  if (
    !valid.value ||
    !props.item ||
    !form.value ||
    !form.value.branch ||
    !form.value.principal ||
    !form.value.dealer
  ) {
    console.error("Not ready to trade, something is not set");
    return;
  }
  console.log(
    `Edit ${form.value.qty} @ ${form.value.price} for ${props.item.contractDisplay.contractDisplay} `
  );
  // const payload: IInsertOrderFutures = {
  //   contractName: props.item.contract,
  //   buyOrSell: props.type == BuySell.Buy ? true : false,
  //   dealerCode: form.value.dealer,
  //   memeberCode: form.value.branch, // bvgm
  //   value: Number(form.value.strike),
  //   qty: Number(form.value.qty),
  //   principal: form.value.principal,
  //   orderType: form.value.type,
  //   timeout_secs: 0,
  //   principalAgency:
  //     form.value.capacity == Capacity.PrincipalCapacity ? true : false,
  //   userRef: form.value.ref ? form.value.ref : "Default",
  // };
  // try {
  //   if (props.socket) {
  //     props.socket.invoke("InsertTrade", payload);
  //   }
  //   open.value = false;
  // } catch (err) {
  //   console.error(err);
  // }
}

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
</script>
