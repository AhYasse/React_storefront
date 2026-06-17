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

// 3. AUTH SERVICE METHODS

export const authService = {
  
    //Login with email/password

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    
    // Persist tokens and user data
    tokenStorage.setTokens(token, refreshToken);
    tokenStorage.setUser(user);
    
    return response.data;
  },

    // Register a new account
   
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, refreshToken, user } = response.data;
    
    tokenStorage.setTokens(token, refreshToken);
    tokenStorage.setUser(user);
    
    return response.data;
  },

  
    // Explicitly refresh the access token
    // (Note: The API interceptor also handles 401 refreshes automatically,
    // but this is useful for manual refreshes, e.g., before token expiry)

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

  
// Logout: clear all auth state and redirect to login
   
  logout: async (): Promise<void> => {
    try {
      // Optionally notify the backend to invalidate the refresh token
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {
          // Ignore errors - we're logging out anyway
        });
      }
    } finally {
      // Always clear local state, even if the API call fails
      tokenStorage.clearTokens();
      
      // Redirect to login page
      window.location.href = ' /React_storefront/login';
    }
  },

  
// Check if the user is currently authenticated
 
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getToken();
  },

  
    // Get the current user from local storage
   
  getCurrentUser: (): User | null => {
    return tokenStorage.getUser();
  },
};

export default authService;