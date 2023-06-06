<template>
  <v-dialog min-width="400" max-width="500" v-model="open">
    <v-card v-if="item">
      <v-form
        validate-on="input"
        v-model="valid"
        @submit.prevent="enterTrade"
        ref="tradeForm"
      >
        <v-card-title
          :class="{
            'bg-primary': type == BuySell.Buy,
            'bg-error': type == BuySell.Sell,
          }"
        >
          <!-- <template v-if="props.type == 'None'"
            >Something went wrong with loading
            {{ tradeModal.item?.contractDisplay.contractDisplay }}</template
          > -->
          {{ type }} for
          {{ item ? item.contractDisplay.contractDisplay : "Empty" }}
        </v-card-title>
        <v-card-text>
          <v-container v-if="form">
            <v-row>
              <v-col cols="6"
                ><v-text-field
                  type="number"
                  class="my-2"
                  label="QTY"
                  :rules="[
                    (msg: number) => !!msg || 'Qty Required',
                    (msg: number) => msg >= 0 || 'Qty cannot be less or equal to 0',
                  ]"
                  v-model.number="form.qty"
                ></v-text-field>
                <v-text-field
                  type="number"
                  class="my-2"
                  label="Strike"
                  v-model.number="form.strike"
                  :rules="[
                    (msg: number) => !!msg || 'Strike Required',
                    (msg: number) => msg >= 0 || 'Strike cannot be less or equal to 0',
                  ]"
                ></v-text-field
                ><v-text-field
                  type="number"
                  class="my-2"
                  label="Volatility"
                  v-model.number="form.volatility"
                  :rules="[
                    (msg: number) => !!msg || 'Volatility Required',
                    (msg: number) => msg >= 0 || 'Volatitility cannot be less or equal to 0',
                  ]"
                ></v-text-field
                ><v-text-field
                  type="number"
                  class="my-2"
                  label="Premium"
                  v-model.number="form.premium"
                  :rules="[
                    (msg: number) => !!msg || 'Premium Required',
                    (msg: number) => msg >= 0 || 'Premium cannot be less or equal to 0',
                  ]"
                ></v-text-field
              ></v-col>
              <v-col cols="6"
                ><v-select v-model="form.dealer" label="Dealer"></v-select>
                <!-- <v-select
                  v-model="form.principal"
                  :items="authStore.getHQ?.client"
                  label="Principal"
                ></v-select> -->
                <v-text-field v-model="form.ref" label="Ref"></v-text-field>
                <v-select
                  :items="
                    Object.entries(MitsOrderType)
                      .filter(([key]) => isNaN(Number(key)))
                      .map(([text, value]) => ({ text, value }))
                  "
                  :return-object="false"
                  item-title="text"
                  item-value="value"
                  v-model="form.type"
                  label="Type"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="auto">
                <v-radio-group v-model="form.capacity" hide-details inline>
                  <v-radio
                    label="Principal"
                    :value="Capacity.PrincipalCapacity"
                  ></v-radio>
                  <v-radio
                    label="Agency"
                    :value="Capacity.AgencyCapacity"
                  ></v-radio>
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
import { MarketDisplayItemContract as MainModel } from "@/models/marketData";
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
  strike: number;
  volatility: number;
  premium: number;
  dealer: string | null;
  capacity: Capacity;
  principal: string | null;
  ref: string | null;
  type: MitsOrderType;
}
const props = defineProps({
  modelValue: Boolean,
  socket: {
    type: Object as PropType<HubConnection>,
    required: false,
  },
  type: {
    type: String as PropType<BuySell | "None">,
    required: true,
  },
  item: {
    type: Object as PropType<MainModel>,
    required: false,
  },
});

const authStore = useAuthStore();

const tradeForm = ref();
const form: Ref<FormModel | null> = ref(null);
const valid = ref(false);
// Function to convert ItemModel to FormModel
const convertItemToForm = (item: MainModel): FormModel => {
  // Conversion logic goes here. Example:
  return {
    branch: null,
    qty:
      props.type == BuySell.Sell ? Number(item.qtyBid) : Number(item.qtyOffer),
    strike: item.contractDisplay.strike,
    volatility: item.contractDisplay.strike,
    premium: item.contractDisplay.strike,
    dealer: "BDA",
    capacity: Capacity.PrincipalCapacity,
    principal: "BVGM",
    ref: null,
    type: MitsOrderType.Normal,
  };
};

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      form.value = convertItemToForm(newItem);
      if (tradeForm.value) {
        console.log("Trade form ", tradeForm.value);
        tradeForm.value.validate();
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
function enterTrade() {
  if (
    !valid.value ||
    !props.item ||
    !form.value ||
    props.type == "None" ||
    !form.value.branch ||
    !form.value.principal ||
    !form.value.dealer
  ) {
    console.error("Not ready to trade, something is not set");
    return;
  }
  console.log(
    `Trade ${form.value.qty} @ ${form.value.strike} for ${props.item.contractDisplay.contractDisplay} `
  );
  const payload: IInsertOrderFutures = {
    contractName: props.item.contract,
    buyOrSell: props.type == BuySell.Buy ? true : false,
    dealerCode: form.value.dealer,
    memeberCode: form.value.branch, // bvgm
    value: Number(form.value.strike),
    qty: Number(form.value.qty),
    principal: form.value.principal,
    orderType: form.value.type,
    timeout_secs: 0,
    principalAgency:
      form.value.capacity == Capacity.PrincipalCapacity ? true : false,
    userRef: form.value.ref ? form.value.ref : "Default",
  };
  try {
    if (props.socket) {
      props.socket.invoke("InsertTrade", payload);
    }
    open.value = false;
  } catch (err) {
    console.error(err);
  }
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
