import { useAuthStore } from "@/store/auth.store";
import { useLocationStore } from "@/store/location.store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // baseURL: "http://192.168.100.212:5001",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().odooUserAuth?.api_key;
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
    console.log(error.message, "error in apiClient");
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
