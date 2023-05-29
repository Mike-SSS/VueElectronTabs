<template>
  <v-btn
    flat
    elevation="0"
    @click="closeComponent"
    icon
    color="transparent"
    size="20"
    class="mr-2"
    ><v-icon color="white" size="18">mdi-close</v-icon></v-btn
  >
</template>


<script lang="ts" setup>
import {
} from "vue";

const props = defineProps({
    closeComponent: Function
})
</script>