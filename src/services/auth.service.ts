import { api } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
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

class AuthService {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  }

  async resendVerification(email: string): Promise<any> {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  }
}

export const authService = new AuthService();
