<template>
  <v-dialog v-model="open" width="300">
    <v-card>
      <v-card-title class="bg-primary"
        >Correct Principal {{ item?.member }}</v-card-title
      >
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.principal"
                :items="clients"
                density="compact"
                variant="outlined"
                label="Principal"
              ></v-select>
              <v-text-field
                v-model="form.ref"
                density="compact"
                variant="outlined"
                label="Ref"
                type="string"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="submitForm"
          density="compact"
          :disabled="clients.length == 0"
          variant="tonal"
          >Ok</v-btn
        >
        <v-btn @click="cancel" density="compact" variant="tonal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { PropType, computed, ref, watchEffect } from "vue";
import { Deal as MainModel } from "@/models/marketData";
import { useAuthStore } from "@/store/authStore";
import { isTemplateElement } from "@babel/types";
import { useToastStore } from "@/store/toastStore";

const props = defineProps({
  modelValue: Boolean,
  item: Object as PropType<MainModel>,
});

const emit = defineEmits(["update:modelValue"]);

// reactive form data
const form = ref({
  principal: props.item?.principal,
  ref: props.item?.userRef,
});

const open = ref(props.modelValue);
const authStore = useAuthStore();
const hq = computed(() => authStore.getHQ);
const clients = computed(() => {
  if (!props.item) return [];

  if (!hq.value) return [];
  if (hq.value.setup == "Dealer") {
    if (!hq.value.masterDealerCodes) return [];
    const branch = hq.value.masterDealerCodes.find(
      (e) => props.item?.member && e.branch == props.item.member
    );
    console.log("Test ", branch);
    if (!branch) return [];
    return branch.clientCodes;
  } else {
    if (!hq.value.clientCodes) return [];
    const branch = hq.value.clientCodes.find(
      (e) => props.item?.member && e.branch == props.item.member
    );
    if (!branch) return [];
    const _dealer = branch.codesPerDealer.find(
      (e) => props.item && e.dealerCode == props.item.dealer
    );
    if (!_dealer) return [];
    return _dealer.clientCodes;
  }
});

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
    principal: props.item?.principal,
    ref: props.item?.userRef,
  };

  // close the dialog
  open.value = false;
}
</script>
