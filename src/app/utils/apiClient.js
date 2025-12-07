import axios from "axios";
import config from "@/config";
import localStorageService from "../services/localStorage.service";

const apiClient = axios.create({
  baseURL: config.apiEndpoint + "/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");

    if (token) {
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
    console.log(`${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // if token expired
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - token expired or invalid");
      
      localStorageService.clearAll();
      window.dispatchEvent(new Event("auth-expired"));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
