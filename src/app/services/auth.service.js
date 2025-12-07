import { jwtDecode } from "jwt-decode";
import apiClient from "../utils/apiClient";
import localStorageService from "./localStorage.service";

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
      
      const tokenString = response.data;

      let decodedToken;
      try {
        decodedToken = jwtDecode(tokenString);

        if (decodedToken) {
          // get user profile id
          const userProfileId = decodedToken.user_profile_id;
          
          // Calculate expiresIn in seconds
          const expiresIn = decodedToken.exp - decodedToken.iat;
          
          return {
            accessToken: tokenString,
            userId: userProfileId,
            expiresIn: expiresIn
          };
        }
      } catch (err) {
        console.error("Failed to decode JWT:", err);
        throw new Error("Invalid token format");
      }
      throw new Error("No token data received");
    } catch (err) {
      console.error("Caught an error while login request!\n", err);
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
