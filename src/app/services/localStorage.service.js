const TOKEN_KEY = "jwt-token";
const USERID_KEY = "user-id";
const EXPIRES_KEY = "token-expires";

class LocalStorageService {
  constructor() {
    this.storage = typeof window !== "undefined" ? window.localStorage : null;
  }

  // Set all auth data at once
  setAuthData({ accessToken, userId, expiresAt }) {
    console.log("local:", accessToken, userId, expiresAt);
    
    if (!this.storage) return;

    try {
      this.storage.setItem(TOKEN_KEY, accessToken || "");
      this.storage.setItem(USERID_KEY, userId?.toString() || "");
      this.storage.setItem(EXPIRES_KEY, expiresAt?.toString() || "");

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
    // Simple validation - ensure it's a JWT format (optional)
    if (token && token.split(".").length === 3) {
      return token;
    }
    return null;
  }

  getUserId() {
    return this.getSafeItem(USERID_KEY);
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

    // Add 5-minute buffer for safety
    const buffer = 5 * 60 * 1000;
    return Date.now() < expiresAt - buffer;
  }

  // Get time until expiry in milliseconds
  getTimeUntilExpiry() {
    const expiresAt = this.getTokenExpiresDate();
    if (!expiresAt) return 0;

    return Math.max(expiresAt - Date.now(), 0);
  }

  // Remove all auth data
  removeAuthData() {
    if (!this.storage) return;

    try {
      this.storage.removeItem(TOKEN_KEY);
      this.storage.removeItem(USERID_KEY);
      this.storage.removeItem(EXPIRES_KEY);

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
      userId: this.getUserId(),
      expiresAt: this.getTokenExpiresDate(),
      isValid: this.hasValidToken(),
      timeUntilExpiry: this.getTimeUntilExpiry(),
    };
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
