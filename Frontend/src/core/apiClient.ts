import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./api.constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...((config.headers as Record<string, string | undefined>) ?? {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
