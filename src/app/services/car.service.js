import axios from "axios";
import config from "@/config";

const carEndpoint = "/cars";

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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  },
  deleteById: async (id) => {
    const url = `${config.apiEndpoint}${"/delete"}/${id}`;
    console.log("DELETE:", url);

    try {
      await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("Error:", e.response?.status, e.response?.data);
    }
  },
};

export default carService;
