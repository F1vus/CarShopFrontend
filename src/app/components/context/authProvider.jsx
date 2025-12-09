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
    const id = localStorageService.getId();
    const expiresAt = localStorageService.getTokenExpiresDate();

    return {
      token,
      id,
      expiresAt,
      isValid: token && id && isTokenValid(expiresAt),
    };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // refs for cleanup and timeouts
  const logoutTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // update localstourage subscription
  useEffect(() => {
    const unsubscribe = localStorageService.subscribeToAuthChanges(() => {
      if (!isMountedRef.current) return;

      const token = localStorageService.getAccessToken();
      const profileId = localStorageService.getId();
      const expiresAt = localStorageService.getTokenExpiresDate();

      setAuthData({
        token,
        profileId,
        expiresAt,
        isValid: token && profileId && isTokenValid(expiresAt),
      });
    });

    return unsubscribe;
  }, []);

  // auto-logout
  useEffect(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    if (!authData.expiresAt || !authData.isValid) return;

    const timeUntilExpiry = getTimeUntilExpiry(authData.expiresAt);

    if (timeUntilExpiry <= 0) {
      handleLogout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      handleLogout({ auto: true });
    }, timeUntilExpiry);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [authData.expiresAt, authData.isValid]);

  const handleLogout = useCallback(async (options = {}) => {
    const { auto = false, redirect = true } = options;

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    try {
      const token = localStorageService.getAccessToken();
      
      if (token && !isTokenExpired(authData.expiresAt)) {
        try {
          await authService.logout();
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

      setAuthData({
        token: null,
        userId: null,
        expiresAt: null,
        isValid: false,
      });
      setError(null);

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

    [navigate, location.pathname, authData.expiresAt];
  });

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
          profileId: data.profileId,
          expiresAt,
        });

        setAuthData({
          token: data.accessToken,
          userId: data.userId,
          expiresAt,
          isValid: true,
        });

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
    userId: authData.userId,
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
