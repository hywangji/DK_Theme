import axios from 'axios';
import { appConfig } from '@/lib/config';
import { tokenStorage } from '@/lib/storage';

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      // Keep the requested /site-admin denial page instead of redirecting to /login.
      if (window.location.pathname !== '/site-admin') window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
