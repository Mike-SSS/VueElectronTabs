<template>
  <v-dialog min-width="400" max-width="500" v-model="open">
    <v-card v-if="items">
      <v-card-title class="bg-error">
        Suspend
        {{ items ? `${items.length} orders` : "Empty" }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              You are about to suspend {{ items.length }} orders? Are you sure?
            </v-col>
            <v-col
              cols="4"
              :key="i"
              v-for="i in items.map((e) => e.contractDisplay.contractDisplay)"
            >
              <div
                class="pa-1 py-2"
                style="border: 1px solid red; border-radius: 1rem"
              >
                {{ i }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="closeModal" color="primary" variant="outlined"
          >Cancel</v-btn
        >
        <v-btn
          :disabled="props.items.length == 0"
          color="error"
          @click="suspendAll"
          variant="elevated"
          >Suspend All</v-btn
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

const props = defineProps({
  modelValue: Boolean,
  socket: {
    type: Object as PropType<HubConnection> | PropType<null>,
    default: null,
    required: true,
  },
  items: {
    type: Array<MainModel>,
    required: true,
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
function suspendAll() {
  try {
    toastStore.addToast(
      `Suspend trades ${props.items.map((e) => e.activeOrderSeq)}`
    );
    // if (props.item)
    //   props.socket.invoke("DeleteTrade", props.item?.activeOrderSeq);
    open.value = false;
  } catch (err) {
    console.error(err);
  }
}
</script>
