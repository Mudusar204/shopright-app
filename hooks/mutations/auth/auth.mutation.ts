import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import {
  login,
  register,
  logout,
  otpVerification,
  resendOtp,
} from "@/services/auth.services";

const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.warn(payload, "payload");

      return login(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["login"],
      });
    },
    onError(error) {
      console.error("login", error);
    },
  });
};

const useOtpVerification = () => {
  return useMutation({
    mutationFn: (payload: any) => {
      return otpVerification(payload);
    },
  });
};

const useResendOtp = () => {
  return useMutation({
    mutationFn: (payload: any) => {
      return resendOtp(payload);
    },
  });
};
const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.warn(payload, "payload");
      return logout(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["logout"],
      });
    },
    onError(error) {
      console.error("logout", getErrorMessage(error));
    },
  });
};

export { useLogin, useLogout, useOtpVerification, useResendOtp };
