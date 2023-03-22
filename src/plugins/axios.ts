import axios, { isCancel, AxiosError } from "axios";

const instance = axios.create({
  baseURL: "https://localhost:63125/api",
  headers: { "Content-Type": "application/json" },
});

export { instance };
