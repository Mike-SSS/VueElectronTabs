<template>
  <div class="clock">
    <div class="clock-face">
      <div
        class="red-zone"
        :style="{ background: redZoneGradient }"
      ></div>
      <div
        v-for="n in 12"
        :key="n"
        class="hour-tick"
        :style="{ transform: `rotate(${n * 30 - 90}deg)` }"
      >
        <div class="tick-line"></div>
      </div>
      <div
        class="hand hour-hand"
        :style="{
          transform: `rotate(${hourRotation}deg)`,
          backgroundColor: hourHandColor,
        }"
      ></div>
      <div
        class="hand minute-hand"
        :style="{
          transform: `rotate(${minuteRotation}deg)`,
          backgroundColor: minuteHandColor,
        }"
      ></div>
      <div
        class="hand second-hand"
        :style="{
          transform: `rotate(${secondRotation}deg)`,
          backgroundColor: secondHandColor,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const currentTime = ref(new Date());

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

const hourRotation = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  return (360 / 12) * ((hours % 12) + minutes / 60) + 90;
});

const minuteRotation = computed(() => {
  const minutes = currentTime.value.getMinutes();
  const seconds = currentTime.value.getSeconds();
  return (360 / 60) * (minutes + seconds / 60) + 90;
});

const secondRotation = computed(() => {
  const seconds = currentTime.value.getSeconds();
  return (360 / 60) * seconds + 90;
});

const offLimitsStartHour = ref(17); // 22 = 10 PM, 17 = 5pm
const offLimitsEndHour = ref(9); // 10 AM

const redZoneGradient = computed(() => {
  const startDeg = (360 / 12) * (offLimitsStartHour.value % 12);
  const endDeg = (360 / 12) * (offLimitsEndHour.value % 12);
  return `conic-gradient(transparent ${startDeg}deg, rgba(255, 0, 0, 0.2) ${startDeg}deg ${endDeg}deg, transparent ${endDeg}deg)`;
});

const isMorning = computed(() => {
  const hours = currentTime.value.getHours();
  return hours >= 6 && hours < 18;
});

const hourHandColor = computed(() => (isMorning.value ? "orange" : "blue"));
const minuteHandColor = computed(() => (isMorning.value ? "green" : "red"));
const secondHandColor = computed(() => (isMorning.value ? "yellow" : "purple"));
</script>

<style scoped>
.clock {
  width: 50px;
  height: 50px;
  border: 2px solid currentColor;
  border-radius: 50%;
  position: relative;
}

.clock-face {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
}

.hand {
  width: 50%;
  height: 2px;
  background-color: currentColor;
  position: absolute;
  top: 50%;
  transform-origin: 100%;
  transition: transform 0.5s cubic-bezier(0.1, 2.7, 0.58, 1);
}

.hour-hand {
  height: 3px;
}
/* .red-zone {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.2);
  clip-path: polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0);
} */
.red-zone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.hour-tick {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.tick-line {
  position: absolute;
  width: 2px;
  height: 3px;
  background-color: currentColor;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
