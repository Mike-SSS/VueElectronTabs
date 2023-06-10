<template>
  <v-dialog min-width="400" max-width="500" v-model="open">
    <v-card v-if="items">
      <v-card-title class="bg-error">
        Delete
        {{ items ? `${items.length} orders` : "Empty" }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              You are about to delete {{ items.length }} orders? Are you sure?
            </v-col>
            <v-col
              cols="4"
              :key="i"
              v-for="i in items.map((e) => e.contractDisplay.contractDisplay)"
            >
              <div class="pa-1 py-2" style="border: 1px solid red; border-radius: 1rem">{{ i }}</div>
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
          @click="confirmFunc"
          variant="elevated"
          >Delete All</v-btn
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
  confirmFunc: {
    type: Function as PropType<() => Promise<void>>,
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
// async function deleteAll() {
//   try {
//     const success = await props.confirmFunc();
//     if (success) {
//       open.value = false;
//       toastStore.addToast(`Suspend trade delete);
//     } else {
//       throw "Socket confirmation wasnt successfull in response";
//     }
//   } catch (err) {
//     console.error(err);
//     toastStore.addToast(`Error Suspend trade ${props.item?.activeOrderSeq}`);
//     return Promise.reject(err);
//   }
// }
</script>
