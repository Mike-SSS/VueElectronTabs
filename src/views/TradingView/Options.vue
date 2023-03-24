<template>
  <v-container
    fluid
    :class="props.class"
    :style="props.style"
  >
    <v-row justify="center">
      <v-col cols="auto"><div class="text-h4">Options</div></v-col>
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
  console.log("Mounted ");
});
</script>
