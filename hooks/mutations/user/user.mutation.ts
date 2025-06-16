import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import {
  login,
  register,
  logout,
  otpVerification,
  resendOtp,
} from "@/services/auth.services";
import { addUserAddress } from "@/services/user.services";

const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return register(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["register"],
      });
    },
    onError(error) {
      console.error("register", error);
    },
  });
};

const useAddUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return addUserAddress(payload);
    },
  });
};

export { useRegister, useAddUserAddress };
