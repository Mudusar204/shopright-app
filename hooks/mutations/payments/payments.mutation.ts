import { useMutation } from "@tanstack/react-query";
import {
  createJazzCashTransaction,
  initiateJazzCashPayment,
} from "@/services/payment.services";

export const useCreateJazzCashTransaction = () => {
  return useMutation({
    mutationFn: (payload: any) => createJazzCashTransaction(payload),
  });
};

export const useInitiateJazzCashPayment = () => {
  return useMutation({
    mutationFn: (payload: any) => initiateJazzCashPayment(payload),
  });
};

