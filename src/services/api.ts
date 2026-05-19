import axios from 'axios';

const BASE_URL = 'https://api.lexiassist.com/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    console.log(`[API REQUEST] Fetching: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.log(`[API ERROR] ${error.response.status} at ${error.config.url}:`, error.response.data);
    } else if (error.message !== 'Network Error') {
      console.log('[API NETWORK ERROR] Could not reach the server:', error.message);
    }
    return Promise.reject(error);
  }
);
