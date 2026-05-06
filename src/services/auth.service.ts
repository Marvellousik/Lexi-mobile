import { api } from './api';
import * as SecureStore from 'expo-secure-store';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  resendVerification: async (email: string) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  },

  storeTokens: async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  },
};
