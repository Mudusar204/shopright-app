import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";

export const getAllProducts = async () => {
  const response = await apiClient.get(API_ROUTES.PRODUCTS["GET_ALL_PRODUCTS"]);

  return response.data;
};
