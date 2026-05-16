import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LOCAL_URL = 'http://10.77.141.7:3000/api/v1';
const PROD_URL = 'https://api.lexiassist.com/api/v1';

const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`[API REQUEST] Fetching: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ==========================================
    // 🚧 DEVELOPMENT MOCK BACKEND INTERCEPTOR 🚧
    // ==========================================
    if (__DEV__ && error.message === 'Network Error') {
      console.log(`[MOCK API] Intercepted missing backend for ${error.config.url}. Injecting fake data...`);
      
      // Fake Response for the Dashboard
      if (error.config.url.includes('/dashboard')) {
        return Promise.resolve({
          status: 200,
          data: {
            // Depending on how your useDashboard hook extracts data, 
            // it usually looks inside response.data or response.data.data
            greeting: "Good evening,",
            userName: "Marvellous",
            avatarUrl: null,
            feedbackBanner: {
              visible: true
            },
            tools: [
              { id: "1", title: "Reading Assistant", icon: "book", route: "/tools/reading" },
              { id: "2", "title": "Study Buddy", icon: "school", route: "/tools/studybuddy" },
              { id: "3", title: "Text to Speech", icon: "volume-high", route: "/tools/tts" },
              { id: "4", title: "Writing Assistant", icon: "pencil", route: "/tools/writing" }
            ],
            recentFiles: [
              { id: "1", name: "History of Hitler.pdf", time: "2 hours ago" },
              { id: "2", name: "Data Communication.pdf", time: "Yesterday" }
            ]
          }
        });
      }
      // You can add more mock routes here later (e.g., /profile, /tools)
    }

    // ==========================================
    // STANDARD ERROR HANDLING
    // ==========================================
    if (error.response) {
      console.log(`[API ERROR] ${error.response.status} at ${error.config.url}:`, error.response.data);
    } else if (error.message !== 'Network Error') {
      console.log('[API NETWORK ERROR] Could not reach the server:', error.message);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token, refresh_token } = res.data.data;
        await SecureStore.setItemAsync('access_token', access_token);
        if (refresh_token) {
          await SecureStore.setItemAsync('refresh_token', refresh_token);
        }
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);