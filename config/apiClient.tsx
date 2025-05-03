import { useAuthStore } from "@/store/auth.store";
import { useLocationStore } from "@/store/location.store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://0.0.0.0:3000/api",
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
    console.log(response, "response in apiClient");
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
