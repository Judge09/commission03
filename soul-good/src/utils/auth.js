/**
 * Authentication Utility Functions
 * Handles token storage, retrieval, and validation for PWA persistent login
 */

const TOKEN_KEY = 'soulgood_access_token';
const REFRESH_TOKEN_KEY = 'soulgood_refresh_token';
const USER_KEY = 'soulgood_user';

/**
 * Store authentication tokens and user data in localStorage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 * @param {object} user - User object
 */
export const setAuthTokens = (accessToken, refreshToken, user) => {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieve access token from localStorage
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Retrieve refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Retrieve user data from localStorage
 * @returns {object|null} User object or null
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (err) {
    console.error('Failed to parse user data:', err);
    return null;
  }
};

/**
 * Check if user is authenticated (has valid access token)
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  // Check if token is expired
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) return true; // If no exp, assume valid (backend will validate)

    // Check if token expires in less than 5 minutes (300 seconds)
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
    return expiresIn > 0; // Token is still valid
  } catch (err) {
    console.error('Error checking token expiration:', err);
    return !!token; // If can't parse, assume valid if token exists
  }
};

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null
 */
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse JWT:', err);
    return null;
  }
};

/**
 * Check if access token is expiring soon (within 5 minutes)
 * @returns {boolean} True if token expires soon
 */
export const isTokenExpiringSoon = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) return false;

    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
    return expiresIn < 300; // Less than 5 minutes
  } catch (err) {
    return false;
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Refresh access token using refresh token
 * @returns {Promise<string|null>} New access token or null
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      return data.accessToken;
    }

    throw new Error('No access token in response');
  } catch (err) {
    console.error('Token refresh failed:', err);
    // Clear tokens on refresh failure
    clearAuthTokens();
    throw err;
  }
};

/**
 * Clear Service Worker caches (for logout)
 */
export const clearServiceWorkerCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          // Clear user-specific or all caches
          if (cacheName.includes('soulgood') || cacheName.includes('workbox')) {
            return caches.delete(cacheName);
          }
        })
      );
      console.log('Service Worker caches cleared');
    } catch (err) {
      console.error('Failed to clear Service Worker caches:', err);
    }
  }
};

/**
 * Complete logout: clear tokens, user data, and service worker caches
 */
export const logout = async () => {
  clearAuthTokens();
  await clearServiceWorkerCaches();

  // Optionally notify the service worker to clear user-specific state
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'LOGOUT',
    });
  }
};
