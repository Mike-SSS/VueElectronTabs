<template>
  <v-dialog v-model="open" width="300">
    <v-card>
      <v-card-title class="bg-primary">Correct Principal</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.principal"
                :items="principles"
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
        <v-btn @click="submitForm" density="compact" variant="tonal">Ok</v-btn>
        <v-btn @click="cancel" density="compact" variant="tonal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { PropType, computed, ref, watchEffect } from "vue";
import { Deal as MainModel } from "@/models/marketData";
import { useAuthStore } from "@/store/authStore";

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

// List of principles to select from
const principles = ref(['Principal 1', 'Principal 2', 'Principal 3']);

const open = ref(props.modelValue);
const authStore = useAuthStore();
const hq = computed(() => authStore.getHQ);
// const dealers = computed(() => {
//   // if (!form.value.branch) return [];
//   if (!hq.value) return [];
//   if (hq.value.setup == "Dealer") {
//     if (!hq.value.masterDealerCodes) return [];
//     const branch = hq.value.masterDealerCodes.find((e) => e.dealers);
//     if (!branch) return [];
//     return branch.dealers;
//   } else {
//     if (!hq.value.clientCodes) return [];
//     const branch = hq.value.clientCodes.find(
//       (e) => form.value && form.value.branch && e.branch == form.value.branch
//     );
//     if (!branch) return [];
//     const _dealers = branch.codesPerDealer.map((e) => e.dealerCode);
//     return _dealers;
//   }
// });

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
  form.value = {
    principal: props.item?.principal,
    ref: props.item?.userRef,
  };

  // close the dialog
  open.value = false;
}
</script>
