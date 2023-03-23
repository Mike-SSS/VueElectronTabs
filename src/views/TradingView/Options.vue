<template>
  <v-container
    fluid
    :class="props.class"
    :style="props.style"
  >
    <v-row justify="center">
      <v-col cols="auto"><div class="text-h4">Test reactivity</div></v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto"
        ><div class="text-h5">Counter: {{ count }}</div></v-col
      >
      <v-col cols="auto">
        <v-btn color="primary" @click="decrease">Decrease</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="increase">Increase</v-btn>
      </v-col>
    </v-row>
  </v-container>
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
