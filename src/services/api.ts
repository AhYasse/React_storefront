import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Base Configuration
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// 2. Request Interceptor: Attach Auth Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from localStorage (matches auth flow storage key)
    const token = localStorage.getItem('token');
    
    // Attach to Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Refresh Queue & 5xx/Network Retries
let isRefreshing = false;
type FailedQueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean; 
      _retryCount?: number; 
    };

    const isNetworkError = !error.response; 
    const isServerError = error.response?.status ? error.response.status >= 500 : false;

    // Exponential Backoff for 5xx / Network Errors (Max 3 attempts)
    if ((isNetworkError || isServerError) && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = 1000 * Math.pow(2, originalRequest._retryCount - 1);
      
      console.warn(`[API Retry] ${originalRequest._retryCount}/3 attempt for ${originalRequest.url} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    // 401 Unauthorized & Token Refresh Queue
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        processQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Final Fallback: Reject all other errors (400, 403, 404, or 5xx after 3 failed retries)
    return Promise.reject(error);
  }
);  

export default api;