<template>
  <v-dialog min-width="400" max-width="500" v-model="open">
    <v-card v-if="item">
      <v-card-title class="bg-error">
        Re-submit
        {{ item ? item.contractDisplay.contractDisplay : "Empty" }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              You are about to resubmit this order suspended order? Are you
              sure?
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="closeModal" color="primary" variant="outlined"
          >Cancel</v-btn
        >
        <v-btn
          :disabled="!props.item"
          color="error"
          @click="confirmFunc"
          variant="elevated"
          >Re-submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { HubConnection } from "@microsoft/signalr";
import { PropType } from "vue";
import { ref, watchEffect, watch, computed } from "vue";
import { ActiveOrder as MainModel } from "@/models/marketData";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Ref } from "vue";
import {
  Capacity,
  MitsOrderType,
  BuySell,
  IInsertOrderFutures,
} from "@/models/trading";
import { ExtractPropTypes } from "vue";
import { NullLiteral } from "@babel/types";

const props = defineProps({
  modelValue: Boolean,
  confirmFunc: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
  item: {
    type: Object as PropType<MainModel>,
    default: null,
    required: false,
  },
});

const authStore = useAuthStore();
const toastStore = useToastStore();

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
</script>
