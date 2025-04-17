import { useAuthStore } from '@/store/auth.store';
import { useLocationStore } from '@/store/location.store';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://20.84.125.71:3000/api/v1',
  // baseURL: 'http://192.168.0.104:3000/api/v1',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const { clear: clearAuth } = useAuthStore.getState();
      clearAuth();
      const { clear: clearLocation } = useLocationStore.getState();
      clearLocation();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
