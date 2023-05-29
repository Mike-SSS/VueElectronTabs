import axios, { isCancel, AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from '@/store/toastStore';



// const authStore = useAuthStore();

// const token = "Bearer " + authStore.token;
// console.log(process.env, authStore.token);

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});
// Add an interceptor to update the Authorization header before each request
instance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const toastStore = useToastStore();
    console.log("Error axios: ", error);
    // If there was an error, show a toast with the error message
    if (error.response && error.response.data) {
      const msg = error.response.data as string;
      toastStore.addToast(msg.substring(0,300) + "...");
    } else if (error.message) {
      toastStore.addToast(error.message);
    } else {
      toastStore.addToast("An unknown error occurred");
    }

    // Then throw the error to allow any individual request handlers to catch it as well
    return Promise.reject(error);
  }
);

const noAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

export { instance as axiosInstance, noAuthInstance };
