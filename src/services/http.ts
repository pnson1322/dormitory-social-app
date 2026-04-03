import { ENV } from "@/config/env";
import {
  clearAuthTokens,
  getAccessToken,
  getAuthTokens,
  setAuthTokens,
} from "@/storage/authStorage";
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  meta: unknown;
  data: {
    token: string;
    refreshToken: string;
  };
};

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token?: string) {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
      return;
    }

    if (token) {
      item.resolve(token);
      return;
    }

    item.reject(new Error("No token returned after refresh"));
  });

  failedQueue = [];
}

function isAuthRoute(url?: string) {
  if (!url) return false;

  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/refresh-token")
  );
}

function setAuthorizationHeader(
  headers: InternalAxiosRequestConfig["headers"],
  token: string,
) {
  const normalizedHeaders =
    headers instanceof AxiosHeaders ? headers : new AxiosHeaders(headers);

  normalizedHeaders.set("Authorization", `Bearer ${token}`);
  return normalizedHeaders;
}

async function refreshAccessToken(): Promise<string> {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken || !refreshToken) {
    throw new Error("Missing access token or refresh token");
  }

  const response = await refreshClient.post<RefreshResponse>(
    "/api/auth/refresh-token",
    {
      accessToken,
      refreshToken,
    },
  );

  const newAccessToken = response.data?.data?.token;
  const newRefreshToken = response.data?.data?.refreshToken;

  if (!newAccessToken || !newRefreshToken) {
    throw new Error("Refresh API did not return token or refreshToken");
  }

  await setAuthTokens(newAccessToken, newRefreshToken);

  return newAccessToken;
}

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isAuthRoute(config.url)) {
      return config;
    }

    const token = await getAccessToken();

    if (token) {
      config.headers = setAuthorizationHeader(config.headers, token);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers = setAuthorizationHeader(
              originalRequest.headers,
              newToken,
            );
            resolve(http(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();

      processQueue(null, newAccessToken);

      originalRequest.headers = setAuthorizationHeader(
        originalRequest.headers,
        newAccessToken,
      );

      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      await clearAuthTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
