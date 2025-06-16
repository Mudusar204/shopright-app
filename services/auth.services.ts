import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";

export const login = async (data: any) => {
  const response = await apiClient.post(API_ROUTES.AUTH["LOGIN"], data);
  return response.data;
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
