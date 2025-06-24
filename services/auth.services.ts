import apiClient from "@/config/apiClient";
import odooApiClient from "@/config/odooApiClient";
import { API_ROUTES } from "@/constants/api.routes";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const login = async (data: any) => {
  const response = await axios.get(`http://69.62.120.81:8088/odoo_connect`, {
    headers: {
      "Content-Type": "application/json",
      login: data.identifier,
      password: data.password,
      db: "Testing",
    },
  });
  console.log(response.data, "login response");
  return response.data;
};

export const getOdooUser = async () => {
  const odooUserAuth = useAuthStore.getState().odooUserAuth;
  if (!odooUserAuth) {
    throw new Error("Odoo user auth not found");
  }
  try {
    const response = await axios.get(
      `http://69.62.120.81:8088/send_request?model=res.users&fields=name,email`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": odooUserAuth.api_key,
          login: odooUserAuth.login,
          password: odooUserAuth.password,
          db: odooUserAuth.db,
        },
      }
    );

    // const response = await odooApiClient.get(`/send_request?model=res.users`);
    console.log(response, "getOdooUser response");
    return response.data;
  } catch (error) {
    console.log(error, "error in getOdooUser");
  }
};
export const register = async (data: any) => {
  const response = await apiClient.post(API_ROUTES.USER["REGISTER"], data);
  return response.data;
};

export const otpVerification = async (data: any) => {
  const response = await apiClient.post(
    API_ROUTES.AUTH["OTP_VERIFICATION"],
    data
  );
  return response.data;
};

export const resendOtp = async (data: any) => {
  const response = await apiClient.post(API_ROUTES.AUTH["RESEND_OTP"], data);
  return response.data;
};

export const logout = async (data: any) => {
  const response = await apiClient.get(API_ROUTES.AUTH["LOGOUT"], {
    params: {
      userId: data.user_id, // Pass user_id as a query parameter
    },
  });

  return response.data;
};
