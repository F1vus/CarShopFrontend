import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import localStorageService from "../../services/localStorage.service";
import authService from "../../services/auth.service";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // load profile data from local storage
  useEffect(() => {
    const loadUser = () => {
      try {
        const authData = localStorageService.getAllAuthData();

        if (authData.isValid) {
          setProfile({
            token: authData.token,
            userId: authData.userId,
            expiresAt: authData.expiresAt,
          });
        } else {
          // Token expired or invalid, clear storage
          if (authData.token) {
            localStorageService.removeAuthData();
          }
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err);
        localStorageService.removeAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const unsubscribe = localStorageService.subscribeToAuthChanges(() => {
      const authData = localStorageService.getAllAuthData();
      if (authData.isValid) {
        setProfile({
          userId: authData.userId,
          token: authData.token,
          expiresAt: authData.expiresAt,
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = authService.register(credentials);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(credentials);

      const { accessToken, profileId, expiresIn } = data;

      console.log(data);

      const expiresAt = Date.now() + expiresIn * 1000;

      localStorageService.setAuthData({
        accessToken: accessToken,
        profileId: profileId,
        expiresAt: expiresAt,
      });

      setProfile({
        accessToken: accessToken,
        userId: profileId,
        expiresAt: expiresAt,
      });

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = authService.logout();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return localStorageService.hasValidToken();
  }, []);

  // Get current user's token
  const getToken = useCallback(() => {
    return localStorageService.getAccessToken();
  }, []);

  // Get current user ID
  const getUserId = useCallback(() => {
    return localStorageService.getUserId();
  }, []);
  
  // Clears any auth errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    profile,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
    getUserId,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
