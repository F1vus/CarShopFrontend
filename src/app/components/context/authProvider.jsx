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
            localStorageService.clearAll();
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

  const isAuthenticated = useCallback(() => {
    return localStorageService.hasValidToken();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    profile,
    isLoading,
    error,
    login,
    isAuthenticated,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
