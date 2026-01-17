import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import { createOrder, updateOrderStatus } from "@/services/orders.services";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.warn(payload, "payload");
      return createOrder(payload);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["my-orders"],
      });
      return data;
    },
  });
};

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.warn(payload, "payload");
      return updateOrderStatus(payload.orderId, payload.status);
    },
    onSuccess: async (data) => {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Order Cancelled",
        text2: "Your order has been cancelled",
        visibilityTime: 3000,
        autoHide: true,
      });
      router.back();
      await queryClient.invalidateQueries({
        queryKey: ["my-orders"],
      });

      // 🔄 Invalidate order detail query
      await queryClient.invalidateQueries({
        queryKey: ["order"],
      });
      return data;
    },
  });
};
export { useCreateOrder, useUpdateOrderStatus };
