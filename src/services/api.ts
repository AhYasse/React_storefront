import axios, { InternalAxiosRequestConfig } from 'axios';

// 1. Base Configuration
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  // Optional: Set a reasonable timeout to prevent hanging requests
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
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

// Note: Response interceptors (401 refresh, retry logic, error formatting) 
// will be added in the next step

export default api;