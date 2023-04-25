<template>
  <v-container fluid class="loginWrapper">
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
                    v-model="credentials.username"
                    variant="underlined"
                    label="EMAIL"
                  ></v-text-field>
                </v-col>
                <v-col cols="11">
                  <v-text-field
                    v-model="credentials.password"
                    append-inner-icon="mdi-eye"
                    variant="underlined"
                    label="PASSWORD"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense justify="end">
                <v-col cols="auto">
                  <v-btn size="small" variant="text"
                    >Forgot your password?</v-btn
                  >
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
                    :disabled="
                      credentials.password == null ||
                      credentials.username == null
                    "
                    size="x-large"
                    variant="elevated"
                    @click="submitLogin"
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
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { noAuthInstance, axiosInstance } from "@/plugins/axios";
import { Ref } from "vue";
import router from "@/router";

const authStore = useAuthStore();

onMounted(() => {
  console.log("Mounted Login");
});

const credentials: Ref<{
  username: string | null;
  password: string | null;
}> = ref({
  username: null,
  password: null,
});
/**
 * Gets the user profile object from HQ
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if call is successful, false otherwise.
 */
async function getHQAccessProfile(): Promise<unknown> {
  try {
    // Make call to backend to login - all call need /api/{controller}
    const res = await axiosInstance.get("/api/authenticate/getHQAccess");
    if (res && res.data) {
      // Assign data to the store 
      console.log("Data for hq: ", res.data);
      authStore.setHQ(res.data);
      return res.data;
    }
  } catch (err) {
    return Promise.reject(err);
  }
  return false
}

/**
 * Performs user authentication using the provided credentials.
 * Talks to server and then to HQ.
 *
 * Triggers by onClick on button
 *
 * Token should be stored in the auth store to allow boolean to be returned.
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
async function submitLogin(): Promise<boolean> {
  // Checking if credentials are not null
  if (
    credentials.value.username == null ||
    credentials.value.password == null
  ) {
    // give visual cue
    return false;
  }
  try {
    // Make call to backend to login - all call need /api/{controller}
    const res = await noAuthInstance.post("/api/authenticate/login", {
      email: credentials.value.username,
      password: credentials.value.password,
    });
    if (res && res.data) {
      // Assign data to the store
      authStore.setLoginResponse(res.data);
      if (authStore.token != null) {
        // Get HQ access data model
      const hq = await getHQAccessProfile();
      if (hq) {
        router.push({
          name: "Trading"
        })
      }
      console.log("HQ ", hq);
      } else {
        return false;
      }
      
    }
  } catch (err) {
    return Promise.reject(err);
  }

  return false;
}
</script>

<style scoped>
.loginWrapper {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url("@/assets/loginBG.jpg");
  background-size: cover;
  height: 100vh;
}
</style>
