import axios from "axios";
import config from "@/config";

const apiClient = axios.create({
  baseURL: config.apiEndpoint,
});

export default apiClient;
