import apiClient from "../utils/apiClient";

const PROFILE_ENDPOINT = "/v1/profiles";

const profileService = {
  getProfileData: async () => {
    try {
      const response = await apiClient.get(PROFILE_ENDPOINT);
      return response.data;
    } catch (err) {
      console.error("Caught an error while getting profile data! " + err);
      throw err;
    }
  },

  getProfileId: async () => {
    try {
      const response = await apiClient.get(PROFILE_ENDPOINT);
      return response.data.id;
    } catch (err) {
      console.error("Caught an error while getting profile Id! " + err);
      throw err;
    }
  },

  getProfileCars: async (profileId) => {
    try {
      const response = await apiClient.get(
        `${PROFILE_ENDPOINT}/${profileId}/cars`
      );
      return response.data;
    } catch (err) {
      console.error("Caught an error while getting profile cars data! " + err);
      throw err;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch(PROFILE_ENDPOINT, profileData);
      return response.data;
    } catch (err) {
      console.error("Caught an error while updating profile data! " + err);
      throw err;
    }
  },

  addLikedCar: async (carId) => {
    try {
      const response = await apiClient.post(
        `${PROFILE_ENDPOINT}/liked-cars/${carId}`
      );
      return response.data;
    } catch (err) {
      console.error("Caught an error while adding liked car! " + err);
      throw err;
    }
  },

  removeLikedCar: async (carId) => {
    try {
      const response = await apiClient.delete(
        `${PROFILE_ENDPOINT}/liked-cars/${carId}`
      );
      return response.data;
    } catch (err) {
      console.error("Caught an error while removing liked car! " + err);
      throw err;
    }
  },

  getLikedCarsByProfileId: async (profileId) => {
    try {
      const response = await apiClient.get(
        `${PROFILE_ENDPOINT}/liked-cars/${profileId}`
      );
      return response.data;
    } catch (err) {
      console.error("Caught an error while getting liked cars! " + err);
      throw err;
    }
  },
};

export default profileService;
