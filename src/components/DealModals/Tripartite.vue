<template>
  <v-dialog v-model="open" width="300">
    <v-card>
      <v-card-title class="bg-primary">Tripartite</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="form.tripartite"
                :items="tripartites"
                density="compact"
                variant="outlined"
                label="Tripartite"
              ></v-select>
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
import { PropType, ref, watchEffect } from "vue";
import { Deal as MainModel } from "@/models/marketData";

const props = defineProps({
  modelValue: Boolean,
  item: Object as PropType<MainModel>,
});

const emit = defineEmits(["update:modelValue"]);

// reactive form data
const form = ref({
  tripartite: props.item?.portfolio,
  price: props.item?.dealtRate,
  ref: props.item?.userRef,
});

// List of options to select from
const tripartites = ref(["Tripartite 1", "Tripartite 2", "Tripartite 3"]);

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
  form.value = {
    tripartite: props.item?.portfolio,
    price: props.item?.dealtRate,
    ref: props.item?.userRef,
  };

  // close the dialog
  open.value = false;
}
</script>
