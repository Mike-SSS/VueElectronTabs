import axios, { isCancel, AxiosError } from "axios";

console.log(process.env);
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

export { instance };
