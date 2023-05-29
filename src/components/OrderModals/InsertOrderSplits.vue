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
                  v-model.number="form.split"
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
                <v-radio-group v-model="form.capacity">
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
import { ref, watchEffect, watch } from "vue";
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
  qty: number;
  split: number;
  dealer: string;
  capacity: Capacity;
  principal: string;
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
    qty:
      props.type == BuySell.Sell ? Number(item.qtyBid) : Number(item.qtyOffer),
    split: item.contractDisplay.strike,
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
  if (!valid.value || !props.item || !form.value || props.type == "None") {
    console.error("Not ready to trade, something is not set");
    return;
  }
  console.log(
    `Trade ${form.value.qty} @ ${form.value.split} for ${props.item.contractDisplay.contractDisplay} `
  );
  const payload: IInsertOrderFutures = {
    contractName: props.item.contract,
    buyOrSell: props.type,
    dealerCode: form.value.dealer,
    memeberCode: "BVG4", // bvgm
    value: Number(form.value.split),
    qty: Number(form.value.qty),
    principal: form.value.principal,
    orderType: form.value.type,
    timeout_secs: 0,
    principalAgency: form.value.capacity,
    userRef: form.value.ref ? form.value.ref : "Default",
  };
  try {
    if (props.socket) {
      props.socket.invoke("InsertTrade", payload);
    }
  } catch (err) {
    console.error(err);
  }
}
</script>
