import axios from "axios";
import config from "@/config.json";

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
    return response;
  } catch (e) {
    console.error(e);
  }
  }
};

export default carService;
