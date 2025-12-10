import { jwtDecode } from "jwt-decode";
import apiClient, { refreshClient } from "../utils/apiClient";
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

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      let decodedToken;
      try {
        decodedToken = jwtDecode(accessToken);

        if (decodedToken) {
          // get user profile id
          const userProfileId = decodedToken.user_profile_id;

          // Calculate expiresIn in seconds
          const expiresIn = decodedToken.exp - decodedToken.iat;

          return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profileId: userProfileId,
            expiresIn: expiresIn,
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

  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (err) {
      console.error("Failed to logout", err);
      throw err;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await refreshClient.post(
        "/auth/refresh-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const decodedToken = jwtDecode(newAccessToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || refreshToken,
        expiresIn: decodedToken.exp - decodedToken.iat,
        profileId: decodedToken.user_profile_id,
      };
    } catch (err) {
      console.error("Refresh token error:", err);
      throw err;
    }
  },
};

export default authService;
