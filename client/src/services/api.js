import axios from 'axios';

// In production, fallback to the deployed Render backend if VITE_API_BASE_URL is not configured
const defaultApiUrl = import.meta.env.PROD
  ? 'https://aspirantai-api.onrender.com/api/v1'
  : '/api/v1';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiUrl;
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aspirantai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, clear token
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        localStorage.removeItem('aspirantai_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
