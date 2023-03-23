<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-img
          :width="300"
          aspect-ratio="16/9"
          cover
          src="@/assets/BvgLogo.png"
        ></v-img>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="11" sm="6">
        <v-card color="primary" width="100%" height="100%" min-height="200px">
          <v-card-title>LOGIN</v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-row justify="center">
                <v-col cols="11">
                  <v-text-field
                    variant="underlined"
                    label="EMAIL"
                  ></v-text-field>
                </v-col>
                <v-col cols="11">
                  <v-text-field
                    append-inner-icon="mdi-eye"
                    variant="underlined"
                    label="PASSWORD"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense justify="end">
                <v-col cols="auto">
                  <v-btn size="small" variant="text">Forgot your password?</v-btn>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="auto">
                  <v-switch hide-details label="Remember me"></v-switch>
                </v-col>
              </v-row>
              <v-row dense justify="center">
                <v-col cols="10">
                  <v-btn
                    class="text-white"
                    color="light-green"
                    block
                    size="x-large"
                    variant="elevated"
                    @click="goToDash"
                    >Login</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import router from "@/router/index";

onMounted(() => {
  console.log("Mounted Login");
});

async function goToDash() {
  console.log("Go to trading");
  await router.push({
    name: 'Trading',
  }).catch(e => {
    console.error(e);
  });
}
</script>
