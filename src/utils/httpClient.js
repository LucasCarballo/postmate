/**
 * HTTP Client for sending API requests
 */
import axios from 'axios';

/**
 * Sends an HTTP request based on the provided configuration
 * 
 * @param {object} config - Request configuration
 * @param {string} config.method - HTTP method (GET, POST, PUT, etc.)
 * @param {string} config.url - Target URL
 * @param {object} config.headers - Request headers
 * @param {any} config.body - Request body (for POST, PUT, etc.)
 * @returns {Promise} Promise that resolves to the response
 */
export const sendRequest = async (config) => {
  const startTime = Date.now();
  
  try {
    const response = await axios({
      method: config.method || 'GET',
      url: config.url,
      headers: config.headers || {},
      data: config.body,
      validateStatus: () => true // Don't throw errors for non-2xx responses
    });
    
    const endTime = Date.now();
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      time: endTime - startTime
    };
  } catch (error) {
    const endTime = Date.now();
    
    // Handle network errors, timeouts, etc.
    return {
      status: 0,
      statusText: 'Request Failed',
      headers: {},
      data: {
        error: error.message || 'Network Error',
        details: error.toString()
      },
      time: endTime - startTime
    };
  }
};

/**
 * Parse a URL to extract query parameters
 * 
 * @param {string} url - URL to parse
 * @returns {object} Object containing the base URL and query parameters
 */
export const parseUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const params = {};
    
    for (const [key, value] of urlObj.searchParams.entries()) {
      params[key] = value;
    }
    
    return {
      baseUrl: `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`,
      params
    };
  } catch (error) {
    // If URL is invalid, return the original
    return {
      baseUrl: url,
      params: {}
    };
  }
};

/**
 * Build a URL with query parameters
 * 
 * @param {string} baseUrl - Base URL without query parameters
 * @param {object} params - Query parameters as key-value pairs
 * @returns {string} Full URL with query parameters
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};
