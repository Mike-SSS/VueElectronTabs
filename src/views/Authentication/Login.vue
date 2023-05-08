<template>
  <v-container fluid class="loginWrapper align-center d-flex">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4" xl="3">
        <v-card
          color="white"
          width="100%"
          height="100%"
          min-height="200px"
          rounded="lg"
        >
          <v-card-title class="text-center"
            ><v-img
              :width="300"
              class="ma-auto"
              aspect-ratio="16/9"
              cover
              src="@/assets/BvgLogo.png"
            ></v-img
          ></v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitLogin" v-model="valid">
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="12">
                    <div
                      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                    >
                      Account
                    </div>
                    <v-text-field
                      clearable
                      name="bvg-trader-username"
                      placeholder="Email address"
                      density="compact"
                      hide-details
                      prepend-inner-icon="mdi-email-outline"
                      v-model="credentials.username"
                      variant="outlined"
                      :rules="emailRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <div
                      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                    >
                      Password

                      <a
                        class="text-caption text-decoration-none text-blue"
                        href="#"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Forgot login password?</a
                      >
                    </div>
                    <v-text-field
                      clearable
                      name="bvg-trader-password"
                      placeholder="Enter your password"
                      prepend-inner-icon="mdi-lock-outline"
                      density="compact"
                      hide-details
                      v-model="credentials.password"
                      :append-inner-icon="
                        credentials.reveal ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="credentials.reveal ? 'text' : 'password'"
                      variant="outlined"
                      @click:append-inner="
                        credentials.reveal = !credentials.reveal
                      "
                      :rules="passwordRules"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="auto">
                    <v-switch
                      color="primary"
                      inset
                      density="compact"
                      hide-details
                      label="Remember me"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    ><v-card
                      class="mb-12"
                      color="surface-variant"
                      variant="tonal"
                    >
                      <v-card-text class="text-medium-emphasis text-caption">
                        Warning: After 3 consecutive failed login attempts, you
                        account will be temporarily locked for three hours. If
                        you must login now, you can also click "Forgot login
                        password?" below to reset the login password.
                      </v-card-text>
                    </v-card></v-col
                  >
                </v-row>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-btn
                      :loading="loading"
                      class="text-white"
                      color="primary"
                      block
                      :disabled="!valid"
                      size="x-large"
                      variant="elevated"
                      type="submit"
                      >Login</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
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

const loading = ref(false);

const passwordRules = [
  (value: string | undefined) => {
    if (value) return true;

    return "Password is requred.";
  },
  (value: string) => {
    if (value?.length > 5) return true;

    return "Password must be more than 5 characters.";
  },
];

const emailRules = [
  (value: string | undefined) => {
    if (value) return true;

    return "E-mail is requred.";
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true;

    return "E-mail must be valid.";
  },
];
const valid = ref(false);
const credentials: Ref<{
  username: string | null;
  password: string | null;
  reveal: boolean;
}> = ref({
  username: null,
  password: null,
  reveal: false,
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
  return false;
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
    loading.value = true;
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
          return (
            (await router.push({
              name: "Trading",
            })) == undefined
          );
        }
        console.log("HQ ", hq);
      } else {
        return false;
      }
    }
  } catch (err) {
    return Promise.reject(err);
  } finally {
    loading.value = false;
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
