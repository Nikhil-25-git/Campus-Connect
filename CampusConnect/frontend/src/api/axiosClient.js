import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified error parsing
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If token expired or invalid, clear auth state
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred. Please check if the server is running.';

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
