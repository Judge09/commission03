/**
 * API Client
 * Fetch wrapper that attaches the session token as a Bearer header
 */

import { getAccessToken } from './auth';

/**
 * Fetch with session token attached
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const apiFetch = async (url, options = {}) => {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
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
