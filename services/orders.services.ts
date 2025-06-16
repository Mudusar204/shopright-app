import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/constants/api.routes";

export const createOrder = async (data: any) => {
  const response = await apiClient.post(
    API_ROUTES.ORDERS["CREATE_ORDER"],
    data
  );

  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get(API_ROUTES.ORDERS["GET_MY_ORDERS"]);

  return response.data;
};

export const getOrderById = async (orderId: number) => {
  const response = await apiClient.get(
    API_ROUTES.ORDERS.GET_ORDER_BY_ID(orderId)
  );
  return response.data;
};
