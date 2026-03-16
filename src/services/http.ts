import { ENV } from "@/config/env";
import { clearAuthTokens, getAccessToken } from "@/storage/authStorage";
import axios from "axios";

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await clearAuthTokens();
    }
    return Promise.reject(error);
  },
);
