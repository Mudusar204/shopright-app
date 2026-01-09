import { useQuery } from "@tanstack/react-query";
import {
  getMyOrders,
  getOrderById,
  getStandardDeliveryCharges,
} from "@/services/orders.services";

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetOrderById = (orderId: number) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetDeliveryCharges = () => {
  return useQuery({
    queryKey: ["delivery-charges"],
    queryFn: getStandardDeliveryCharges,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
