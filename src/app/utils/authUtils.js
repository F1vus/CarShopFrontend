export const TOKEN_KEY = "jwt-token";
export const PROFILE_ID_KEY = "profile-id";
export const EXPIRES_KEY = "token-expires";

export function isTokenExpired(expiresAt) {
  if (!expiresAt) return true;
  return Date.now() > expiresAt;
}

export function isTokenValid(expiredAt) {
  if(!expiredAt) return true;
  const buffer = 5 * 60 * 1000;
  return Date.now() < expiredAt - buffer;
}

export function getTimeUntilExpiry(expiresAt) {
  if(!expiresAt) return 0;
  return Math.max(expiresAt - Date.now(), 0)
}

export function calculateExpire(expiresIn = 3600) {
  return Date.now() + expiresIn * 1000;
}
