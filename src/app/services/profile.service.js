import axios from "axios";
import config from "@/config";

const authEndpoint = "/api/v1/profiles";

const profileService = {
  getProfileData: async (qvtToken) => {
    const request = {
      method: "GET",
      url: config.apiEndpoint + authEndpoint,
      headers: {
        Authorization: `Bearer ${qvtToken}`,
        "Content-Type": "application/json",
      },
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
  getProfileId: async (qvtToken) => {
    const request = {
      method: "GET",
      url: config.apiEndpoint + authEndpoint,
      headers: {
        Authorization: `Bearer ${qvtToken}`,
        "Content-Type": "application/json",
      },
      allowAbsoluteUrls: true,
    };

    try {
      const response = await axios.request(request);
      return response.data?.id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getProfileCars: async (profileId) => {
    const request = {
      method: "GET",
      url: config.apiEndpoint + authEndpoint + `/${profileId}` + "/cars",
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
  updateProfile: async (qvtToken, profileData) => {
    const request = {
      method: "PATCH",
      url: config.apiEndpoint + authEndpoint,
      headers: {
        Authorization: `Bearer ${qvtToken}`,
        "Content-Type": "application/json",
      },
      data: profileData,
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
};

export default profileService;
