import axios from "axios";
import config from "@/config";
import localStorageService from "../services/localStorage.service";
import authService from "../services/auth.service";

const apiClient = axios.create({
  baseURL: config.apiEndpoint + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

export const refreshClient = axios.create({
  baseURL: config.apiEndpoint + "/api",
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();

    if (token && !config.headers["Authorization"]) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details
    console.error("API Error:", {
      url: originalRequest?.url,
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.message,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorageService.getRefreshToken();

        if (!token) return new Error("No refresh token available");

        const newTokens = await authService.refreshToken(token);

        localStorageService.updateAccessToken(
          newTokens.accessToken,
          newTokens.expiresIn
        );

        if (newTokens.refreshToken) {
          localStorageService.setAuthData({
            ...localStorageService.getAllAuthData(),
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresAt: Date.now() + newTokens.expiresIn * 1000,
          });
        }

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        processQueue(null, newTokens.accessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);

        processQueue(err, null);
        isRefreshing = false;

        localStorageService.removeAuthData();
        window.dispatchEvent(new Event("auth-expired"));

        if (!window.location.pathname.startsWith("/CarShopFrontend/auth")) {
          setTimeout(() => {
            window.location.href = "/CarShopFrontend/auth/login";
          }, 100);
        }

        return Promise.reject(err);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn("403 Forbidden - token might be invalid");

      localStorageService.removeAuthData();
      window.dispatchEvent(new Event("auth-expired"));

      if (!window.location.pathname.startsWith("/CarShopFrontend/auth")) {
        setTimeout(() => {
          window.location.href = "/CarShopFrontend/auth/login";
        }, 100);
      }
    }

    if (!error.response) {
      console.error("Network error or server unreachable:", error.message);

      window.dispatchEvent(
        new CustomEvent("network-error", {
          detail: { message: "Błąd połączenia z serwerem" },
        })
      );
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.status);
    }

    return Promise.reject(error);
  }
);

refreshClient.interceptors.request.use(
  (config) => {
    if (config.url === "/auth/refresh") {
      const refreshToken = localStorageService.getRefreshToken();
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.removeAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

export default apiClient;
