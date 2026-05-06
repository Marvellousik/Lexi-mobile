import { api } from './api';
import * as SecureStore from 'expo-secure-store';

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

// Utility to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  // THE MASTER SWITCH. 
  // Set to false when your Go microservices are deployed.
  private useMock = true; 

  // --- PUBLIC API METHODS ---

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (this.useMock) {
      return this.mockRegister(payload);
    }
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (this.useMock) {
      return this.mockLogin(payload);
    }
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  }

  async resendVerification(email: string): Promise<any> {
    if (this.useMock) {
      return this.mockResendVerification(email);
    }
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  }

  // --- TOKEN MANAGEMENT ---

  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }

  // --- MOCK IMPLEMENTATIONS (ISOLATED FROM PRODUCTION LOGIC) ---

  private async mockLogin(payload: LoginPayload): Promise<AuthResponse> {
    await delay(1200); // 1.2 second fake latency

    if (payload.email === 'dev@lexiassist.com' && payload.password === 'password123') {
      return {
        data: {
          access_token: 'mock_jwt_access_token_xyz123',
          refresh_token: 'mock_jwt_refresh_token_abc987',
          user: {
            id: 'dev_user_001',
            name: 'Marvellous Dev',
            email: 'dev@lexiassist.com',
          },
        },
      };
    }

    // Simulate an Axios error structure
    throw {
      response: {
        status: 401,
        data: {
          message: 'Invalid email or password.',
        },
      },
    };
  }

  private async mockRegister(payload: RegisterPayload): Promise<AuthResponse> {
    await delay(1500);

    if (payload.email === 'dev@lexiassist.com') {
      throw {
        response: {
          status: 409,
          data: { message: 'An account with this email already exists.' },
        },
      };
    }

    // Return a valid mock response matching your AuthResponse interface
    return {
      data: {
        access_token: 'mock_jwt_access_token_newuser',
        refresh_token: 'mock_jwt_refresh_token_newuser',
        user: {
          id: 'new_user_' + Math.floor(Math.random() * 1000),
          name: payload.name,
          email: payload.email,
        },
      },
    };
  }

  private async mockResendVerification(email: string): Promise<any> {
    await delay(800);

    if (!email) {
      throw {
        response: {
          status: 400,
          data: { message: 'Email is required.' },
        },
      };
    }

    return {
      data: {
        message: 'Verification email sent successfully.',
      },
    };
  }
}

// Export a singleton instance of the service
export const authService = new AuthService();