import api from '@/services/api';
import { User } from '@/types';

// 1. TOKEN STORAGE HELPERS

export const tokenStorage = {
  getToken: (): string | null => localStorage.getItem('token'),
  
  getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),
  
  setTokens: (token: string, refreshToken: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
  
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// 2. AUTH API RESPONSE TYPES

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// 3. AUTH SERVICE

export const authService = {
  // Token accessors (used by userSlice for initial state hydration)
  getToken: (): string | null => tokenStorage.getToken(),
  
  getRefreshToken: (): string | null => tokenStorage.getRefreshToken(),
  
  getCurrentUser: (): User | null => tokenStorage.getUser(),
  
  isAuthenticated: (): boolean => !!tokenStorage.getToken(),

  // Auth actions
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    
    tokenStorage.setTokens(token, refreshToken);
    tokenStorage.setUser(user);
    
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    const { token, refreshToken, user } = response.data;
    
    tokenStorage.setTokens(token, refreshToken);
    tokenStorage.setUser(user);
    
    return response.data;
  },

  refresh: async (): Promise<{ token: string; refreshToken: string }> => {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken: currentRefreshToken }
    );
    
    const { token, refreshToken } = response.data;
    tokenStorage.setTokens(token, refreshToken);
    
    return { token, refreshToken };
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {
          // Ignore errors - we're logging out anyway
        });
      }
    } finally {
      tokenStorage.clearTokens();
      window.location.href = '/login';
    }
  },
};

export default authService;