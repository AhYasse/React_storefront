import api from '@/services/api';
import { User } from '@/types';

const sanitizeUser = (user: any): User | null => {
  if (!user || typeof user !== 'object') return null;
  const { _token, _refreshToken, ...clean } = user;
  return clean as User;
};

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
  
  setUser: (user: any): void => {
    const cleanUser = sanitizeUser(user);
    if (cleanUser) {
      localStorage.setItem('user', JSON.stringify(cleanUser));
    }
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
    const response = await api.post<AuthResponse>('/users/login', credentials);
    const { token, refreshToken, user } = response.data;
    const cleanUser = sanitizeUser(user);
    
    console.log('[authService.login] API Response:', { token: !!token, refreshToken: !!refreshToken, hasUser: !!cleanUser, user: cleanUser });
    
    tokenStorage.setTokens(token, refreshToken);
    if (cleanUser) {
      tokenStorage.setUser(cleanUser);
    }
    
    return { token, refreshToken, user: cleanUser as User };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    const { token, refreshToken, user } = response.data;
    const cleanUser = sanitizeUser(user);
    
    tokenStorage.setTokens(token, refreshToken);
    if (cleanUser) {
      tokenStorage.setUser(cleanUser);
    }
    
    return { token, refreshToken, user: cleanUser as User };
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
        await api.post('/users/logout', { refreshToken }).catch(() => {
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