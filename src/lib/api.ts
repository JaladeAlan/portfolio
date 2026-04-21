import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Attach JWT token on each request (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
