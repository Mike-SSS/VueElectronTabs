<template>
  <v-container fluid :class="props.class" :style="props.style">
    <div class="text-h4">Options</div>
    <v-sheet class="pa-4" rounded elevation="1">
      <div class="text-h5">Counter: {{ count }}</div>
      <v-row>
        <v-col>
          <v-btn color="primary" @click="decrease">Decrease</v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="increase">Increase</v-btn>
        </v-col>
      </v-row>
    </v-sheet></v-container
  >
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useLayoutStore } from "@/store/layout";

const props = defineProps({
  class: String,
  style: {
    type: Object,
    required: true,
  },
  initialValue: {
    type: Number,
    default: 0,
  },
});
onMounted(() => {
  console.log("Mounted ", count);
});

const count = ref(props.initialValue);
const increase = () => {
  count.value++;
};

const decrease = () => {
  count.value--;
};
</script>
