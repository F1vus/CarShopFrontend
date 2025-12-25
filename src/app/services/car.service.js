import axios from "axios";
import config from "@/config";

const carEndpoint = "/api/v1/cars";
const lookupEndpoint = "/api/v1/lookups/metadata";

const carService = {
  getAll: async () => {
    const request = {
      method: "GET",
      baseURL: config.apiEndpoint + carEndpoint,
      allowAbsoluteUrls: true,
    };
    try {
      const response = await axios.request(request);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getById: async (id) => {
    const request = {
      method: "GET",
      baseURL: `${config.apiEndpoint}`,
      url: carEndpoint + `/${id}`,
      allowAbsoluteUrls: true,
    };

    try {
      const response = await axios.request(request);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getMetadata: async () => {
    try {
      const response = await axios.get(config.apiEndpoint + lookupEndpoint);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch metadata", err);
      throw err;
    }
  },

  createCar: async (body) => {
    try {
      const response = await axios.post(config.apiEndpoint + carEndpoint, body);
      return response.data;
    } catch (err) {
      console.error(
        "Failed to create car",
        err.response?.status,
        err.response?.data
      );
      throw err;
    }
  },

  deleteById: async (carId) => {
    const url = `${config.apiEndpoint}${carEndpoint}/${carId}`;
    try {
      await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error:", err.response?.status, err.response?.data);
      throw err;
    }
  },
  updateCar: async (carId, body) => {
    const url = `${config.apiEndpoint}${carEndpoint}/${carId}`;
    try {
      const response = await axios.patch(url, body);
      return response.data;
    } catch (err) {
      console.error("Error:", err.response?.status, err.response?.data);
      throw err;
    }
  },
  findSuggestion: async (queryParam) => {
    const url = `${config.apiEndpoint}${carEndpoint}/suggestions`;

    try {
      const response = await axios.get(url, {
        params: { query: queryParam },
      });
      return response.data;
    } catch (err) {
      console.error("Error:", err.response?.status, err.response?.data);
      throw err;
    }
  },
};

export default carService;
