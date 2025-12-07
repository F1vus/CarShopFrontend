import apiClient from "../utils/apiClient";

const authService = {
  register: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/register", credentials);
      return response.data;
    } catch (err) {
      console.error("Caught an error while registration request!\n" + err);
      throw err;
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (err) {
      console.error("Caught an error while login request!\n" + err);
      throw err;
    }
  },

  verify: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/verify", credentials);
      return response.data;
    } catch (err) {
      console.error("Caught an error while verify request!\n" + err);
      throw err;
    }
  },

  resetVerify: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/reset-verify", credentials);
      return response.data;
    } catch (err) {
      console.error("Caught an error while resetting verification request!");
      throw err;
    }
  },
};

export default authService;
