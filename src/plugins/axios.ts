import axios, { isCancel, AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();

const token = "Bearer " + authStore.token;
console.log(process.env, authStore.token);

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});
// Add an interceptor to update the Authorization header before each request
instance.interceptors.request.use((config) => {
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const noAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

export { instance as axiosInstance, noAuthInstance };
