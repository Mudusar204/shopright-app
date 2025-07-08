import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import { createOrder } from "@/services/orders.services";

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

export { useCreateOrder };
