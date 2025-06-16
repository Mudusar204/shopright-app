import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";

export const getUserAddresses = async () => {
  const response = await apiClient.get(API_ROUTES.USER["GET_USER_ADDRESSES"]);

  return response.data;
};

export const addUserAddress = async (payload: any) => {
  const response = await apiClient.post(
    API_ROUTES.USER["ADD_USER_ADDRESS"],
    payload
  );

  return response.data;
};
