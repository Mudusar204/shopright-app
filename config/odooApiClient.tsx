import { useAuthStore } from "@/store/auth.store";
import { useLocationStore } from "@/store/location.store";
import axios from "axios";

const odooApiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ODOO_API_URL,
  // baseURL: 'http://192.168.0.104:3000/api/v1',
});

odooApiClient.interceptors.request.use(
  (config) => {
    const odooUserAuth = useAuthStore.getState().odooUserAuth;
    // console.log("odooUserAuth", odooUserAuth);
    if (odooUserAuth) {
      config.headers["api-key"] = odooUserAuth.api_key;
      config.headers["login"] = odooUserAuth.login;
      config.headers["password"] = odooUserAuth.password;
      config.headers["db"] = odooUserAuth.db;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

odooApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error, "error in apiClient");
    if (error.response && error.response.status === 401) {
      const { clear: clearAuth } = useAuthStore.getState();
      clearAuth();
      const { clear: clearLocation } = useLocationStore.getState();
      clearLocation();
    }
    return Promise.reject(error);
  }
);

export default odooApiClient;
