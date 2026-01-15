import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PROFILE_ID_KEY,
  EXPIRES_KEY,
  LIKED_ADS,
} from "../utils/authUtils";
class LocalStorageService {
  constructor() {
    this.storage = typeof window !== "undefined" ? window.localStorage : null;
  }

  // Set all auth data at once
  setAuthData({ accessToken, refreshToken, profileId, expiresAt }) {
    if (!this.storage) return;

    try {
      this.storage.setItem(TOKEN_KEY, accessToken || "");
      this.storage.setItem(REFRESH_TOKEN_KEY, refreshToken || "");
      this.storage.setItem(PROFILE_ID_KEY, profileId?.toString() || "");
      this.storage.setItem(EXPIRES_KEY, expiresAt?.toString() || "");
      this.storage.setItem(LIKED_ADS, []);

      // Notify other tabs
      this.dispatchStorageEvent();
    } catch (error) {
      console.error("Failed to set auth data:", error);
      this.handleStorageError(error);
    }
  }

  // Get token with validation
  getAccessToken() {
    const token = this.getSafeItem(TOKEN_KEY);
    if (token && token.split(".").length === 3) {
      return token;
    }
    return null;
  }

  getRefreshToken() {
    const token = this.getSafeItem(REFRESH_TOKEN_KEY);
    if (token && token.split(".").length === 3) {
      return token;
    }
    return null;
  }

  getId() {
    return this.getSafeItem(PROFILE_ID_KEY);
  }

  getTokenExpiresDate() {
    const value = this.getSafeItem(EXPIRES_KEY);
    return value ? parseInt(value, 10) : null;
  }

  // Check if token exists and is valid
  hasValidToken() {
    const token = this.getAccessToken();
    const expiresAt = this.getTokenExpiresDate();

    if (!token || !expiresAt) return false;

    const buffer = 5 * 60 * 1000;
    return Date.now() < expiresAt - buffer;
  }

  // Get time until expiry in milliseconds
  getTimeUntilExpiry() {
    const expiresAt = this.getTokenExpiresDate();
    if (!expiresAt) return 0;

    return Math.max(expiresAt - Date.now(), 0);
  }

  updateAccessToken(accessToken, expiresIn) {
    if (!this.storage) return;

    try {
      this.storage.setItem(TOKEN_KEY, accessToken || "");

      if (expiresIn) {
        const expiresAt = Date.now() + expiresIn * 1000;
        this.storage.setItem(EXPIRES_KEY, expiresAt.toString());
      }
      this.dispatchStorageEvent();
    } catch (error) {
      console.error("Failed to update access token:", error);
    }
  }

  setLikedAds(favoriteAds) {
    if (!this.storage) return;

    try {
      let favoritesIds = favoriteAds.map((ad) => ad.id);
      this.storage.setItem(LIKED_ADS, JSON.stringify(favoritesIds || []));
      this.dispatchStorageEvent();
    } catch (error) {
      console.error("Failed to set favorite ads:", error);
      this.handleStorageError(error);
    }
  }

  getLikedAds() {
    const data = this.getSafeItem(LIKED_ADS);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse favorite ads:", error);
        return [];
      }
    }
  }

  // Remove all auth data
  removeAuthData() {
    if (!this.storage) return;

    try {
      this.storage.removeItem(TOKEN_KEY);
      this.storage.removeItem(REFRESH_TOKEN_KEY);
      this.storage.removeItem(PROFILE_ID_KEY);
      this.storage.removeItem(EXPIRES_KEY);
      this.storage.removeItem(LIKED_ADS);

      this.dispatchStorageEvent();
    } catch (error) {
      console.error("Failed to remove auth data:", error);
    }
  }

  // Clear all localStorage (use with caution)
  clearAll() {
    if (!this.storage) return;
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }

  // Safe getter with error handling
  getSafeItem(key) {
    if (!this.storage) return null;

    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  // Handle storage errors
  handleStorageError(error) {
    if (error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded");
      // Optionally clear only auth data or old data
      this.removeAuthData();
    }
  }

  // Dispatch custom event for cross-tab communication
  dispatchStorageEvent() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-storage-changed"));
    }
  }

  // Subscribe to auth changes in other tabs
  subscribeToAuthChanges(callback) {
    if (typeof window === "undefined") return () => {};

    const handleStorageChange = () => {
      callback();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-storage-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-storage-changed", handleStorageChange);
    };
  }

  // Get all auth data in one object
  getAllAuthData() {
    return {
      token: this.getAccessToken(),
      profileId: this.getId(),
      expiresAt: this.getTokenExpiresDate(),
      isValid: this.hasValidToken(),
      timeUntilExpiry: this.getTimeUntilExpiry(),
    };
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
