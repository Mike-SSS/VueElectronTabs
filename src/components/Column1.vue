<template>
  <v-container class="counter">
    <v-row>
      <v-col>
        <div class="value">{{ count }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="buttons">
        <v-btn color="blue" @click="increment">+</v-btn>
        <v-btn color="purple" @click="decrement">-</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const random = Math.random();

function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}
</script>

<style>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  font-size: 3rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}
</style>
