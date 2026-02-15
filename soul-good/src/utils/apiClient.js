/**
 * API Client with automatic token refresh interceptor
 * Handles 401 errors and silently refreshes access tokens
 */

import { getAccessToken, refreshAccessToken, clearAuthTokens } from './auth';

let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New access token if refresh succeeded
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Enhanced fetch with automatic token refresh on 401 errors
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const apiFetch = async (url, options = {}) => {
  // Prepare headers with access token
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the initial request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, attempt token refresh
  if (response.status === 401 && !url.includes('/api/auth/refresh')) {
    if (isRefreshing) {
      // Another request is already refreshing the token
      // Queue this request and wait for the new token
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: async (newToken) => {
            try {
              const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders,
              });
              resolve(retryResponse);
            } catch (err) {
              reject(err);
            }
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      processQueue(null, newToken);

      // Retry the original request with the new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      return response;
    } catch (err) {
      isRefreshing = false;
      processQueue(err, null);

      // Token refresh failed - clear tokens and redirect to login
      clearAuthTokens();

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw err;
    }
  }

  return response;
};

/**
 * Convenience method for GET requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiGet = async (url, options = {}) => {
  const response = await apiFetch(url, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};

/**
 * Convenience method for POST requests
 * @param {string} url - API endpoint URL
 * @param {object} data - Request body data
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiPost = async (url, data, options = {}) => {
  const response = await apiFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};

/**
 * Convenience method for PUT requests
 * @param {string} url - API endpoint URL
 * @param {object} data - Request body data
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiPut = async (url, data, options = {}) => {
  const response = await apiFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};

/**
 * Convenience method for DELETE requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiDelete = async (url, options = {}) => {
  const response = await apiFetch(url, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};
