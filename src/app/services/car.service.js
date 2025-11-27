import axios from "axios";
import config from "@/config";

const carEndpoint = "/api/v1/cars";

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
  deleteById: async (id) => {
    const url = `${config.apiEndpoint}${carEndpoint}/${id}`;
    console.log("Url" + url);
    

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
};

export default carService;
