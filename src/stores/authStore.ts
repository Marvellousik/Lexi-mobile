import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<User | null>;
}

const LAST_LOGIN_KEY = 'lexi_last_login_at';
const SESSION_USER_KEY = 'lexi_session_user';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,

  setAuth: async (user) => {
    await AsyncStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(LAST_LOGIN_KEY, Date.now().toString());
    set({ user });
  },

  logout: async () => {
    await AsyncStorage.removeItem(SESSION_USER_KEY);
    await AsyncStorage.removeItem(LAST_LOGIN_KEY);
    set({ user: null });
  },

  restoreSession: async () => {
    const lastLogin = await AsyncStorage.getItem(LAST_LOGIN_KEY);
    const userJson = await AsyncStorage.getItem(SESSION_USER_KEY);

    if (!lastLogin || !userJson) return null;

    const elapsed = Date.now() - parseInt(lastLogin, 10);
    if (elapsed > THIRTY_DAYS_MS) {
      await AsyncStorage.removeItem(SESSION_USER_KEY);
      await AsyncStorage.removeItem(LAST_LOGIN_KEY);
      return null;
    }

    const user = JSON.parse(userJson) as User;
    set({ user });
    return user;
  },
}));
