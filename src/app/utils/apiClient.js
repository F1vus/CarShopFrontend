import axios from "axios";
import config from "@/config";
import localStorageService from "../services/localStorage.service";

const apiClient = axios.create({
  baseURL: config.apiEndpoint + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - token expired or invalid");

      localStorageService.removeAuthData();

      window.dispatchEvent(new Event("auth-expired"));

      // Prevent multiple redirects
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
