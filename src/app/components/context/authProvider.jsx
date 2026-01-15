import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import localStorageService from "../../services/localStorage.service";
import authService from "../../services/auth.service";
import profileService from "../../services/profile.service";
import { useLocation, useNavigate } from "react-router-dom";
import {
  calculateExpire,
  getTimeUntilExpiry,
  isTokenExpired,
  isTokenValid,
} from "../../utils/authUtils";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [authData, setAuthData] = useState(() => {
    const token = localStorageService.getAccessToken();
    const refreshToken = localStorageService.getRefreshToken();
    const id = localStorageService.getId();
    const expiresAt = localStorageService.getTokenExpiresDate();

    return {
      token,
      refreshToken,
      profileId: id,
      expiresAt,
      isValid: token && id && isTokenValid(expiresAt),
    };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // refs for cleanup and timeouts
  const logoutTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // update localstourage subscription
  useEffect(() => {
    const unsubscribe = localStorageService.subscribeToAuthChanges(() => {
      if (!isMountedRef.current) return;

      const token = localStorageService.getAccessToken();
      const refreshToken = localStorageService.getRefreshToken();
      const profileId = localStorageService.getId();
      const expiresAt = localStorageService.getTokenExpiresDate();

      setAuthData({
        token,
        refreshToken,
        profileId,
        expiresAt,
        isValid: token && profileId && isTokenValid(expiresAt),
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    if (!authData.expiresAt || !authData.isValid) return;

    const checkInterval = 60 * 1000; // check every minute

    refreshTimerRef.current = setTimeout(async () => {
      if (isTokenExpired(authData.expiresAt)) {
        try {
          const refreshToken = localStorageService.getRefreshToken();
          if (refreshToken) {
            const newTokens = await authService.refreshToken(refreshToken);

            const expiresAt = calculateExpire(newTokens.expiresIn);

            localStorageService.setAuthData({
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              profileId: newTokens.profileId,
              expiresAt,
            });

            if (isMountedRef.current) {
              setAuthData({
                token: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                profileId: newTokens.profileId,
                expiresAt,
                isValid: true,
              });
            }
          }
        } catch (refreshError) {
          console.error("Proactive refresh failed:", refreshError);
          handleLogout({ auto: true });
        }
      }
    }, checkInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [authData.expiresAt, authData.isValid]);

  const handleLogout = useCallback(
    async (options = {}) => {
      const { auto = false, redirect = true } = options;

      // Clear timers
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      try {
        const token = localStorageService.getAccessToken();
        const refreshToken = localStorageService.getRefreshToken();

        if (token && refreshToken && !isTokenExpired(authData.expiresAt)) {
          try {
            await authService.logout();
            console.log("Server logout successful");
          } catch (serverError) {
            console.warn(
              "Server logout failed, clearing local session:",
              serverError
            );
          }
        }
      } catch (error) {
        console.error("Error during logout process:", error);
      } finally {
        localStorageService.removeAuthData();

        if (isMountedRef.current) {
          setAuthData({
            token: null,
            refreshToken: null,
            profileId: null,
            expiresAt: null,
            isValid: false,
          });
          setError(null);
        }

        if (redirect && !location.pathname.startsWith("/auth")) {
          navigate("/auth/login", {
            replace: true,
            state: {
              from: location.pathname,
              message: auto
                ? "Twoja sesja wygasła. Zaloguj się ponownie."
                : "Zostałeś wylogowany.",
              messageType: auto ? "warning" : "info",
            },
          });
        }

        window.dispatchEvent(new Event("auth-logout"));
      }
    },
    [navigate, location.pathname, authData.expiresAt]
  );

  // auto-logout
  useEffect(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    if (authData.expiresAt && !authData.isValid) {
      console.log("Token is invalid, logging out immediately");
      handleLogout({ auto: true });
      return;
    }

    if (!authData.expiresAt || !authData.isValid) return;

    const timeUntilExpiry = getTimeUntilExpiry(authData.expiresAt);

    if (timeUntilExpiry <= 0) {
      console.log("Token already expired, logging out");
      handleLogout({ auto: true });
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      console.log("Auto-logout timer fired");
      handleLogout({ auto: true });
    }, timeUntilExpiry);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [authData.expiresAt, authData.isValid, handleLogout]);

  const register = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.register(credentials);
      return { success: true, data };
    } catch (err) {
      console.error("Registration error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.";

      setError(errorMessage);
      return {
        success: false,
        error: new Error(errorMessage),
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials, options = {}) => {
      const { redirect = "/profile" } = options;

      setIsLoading(true);
      setError(null);

      try {
        const data = await authService.login(credentials);

        const expiresAt = calculateExpire(data.expiresIn);

        localStorageService.setAuthData({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          profileId: data.profileId,
          expiresAt,
        });

        setAuthData({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          profileId: data.profileId,
          expiresAt,
          isValid: true,
        });

        // fetching liked cars after auth is set
        try {
          const likedCars = await profileService.getLikedCarsByProfileId(
            data.profileId
          );
          localStorageService.setLikedAds(likedCars);
        } catch (likedCarsError) {
          console.warn(
            "Could not fetch liked cars during login:",
            likedCarsError
          );
          localStorageService.setLikedAds([]);
        }

        if (redirect) {
          const redirectTo = location.state?.from || redirect;
          navigate(redirectTo, { replace: true });
        }

        return { success: true, data };
      } catch (err) {
        console.error("Login error:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Wystąpił błąd podczas logowania. Sprawdź dane i spróbuj ponownie.";

        setError(errorMessage);
        return {
          success: false,
          error: new Error(errorMessage),
        };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, location.state]
  );

  // get auth headers
  const getAuthHeaders = useCallback(() => {
    if (!authData.token || !authData.isValid) return {};

    return {
      Authorization: `Bearer ${authData.token}`,
    };
  }, [authData.token, authData.isValid]);

  // Clears any auth errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    token: authData.token,
    profileId: authData.profileId,
    expiresAt: authData.expiresAt,
    isValid: authData.isValid,

    // loading & Error
    isLoading,
    error,

    // computed values
    isAuthenticated: authData.isValid,
    timeUntilExpiry: getTimeUntilExpiry(authData.expiresAt),

    // methods
    login,
    register,
    logout: handleLogout,
    getAuthHeaders,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
