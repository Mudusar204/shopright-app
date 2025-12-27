import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils";
import {
  login,
  register,
  logout,
  addUserAddress,
  verifyOtp,
  resendOtp,
  resetPassword,
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

const useAddUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      return addUserAddress(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user-addresses"],
      });
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

const useOtpVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return verifyOtp(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["otp-verification"],
      });
    },
    onError(error) {
      console.error("otp-verification", error);
    },
  });
};

const useResendOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return resendOtp(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resend-otp"],
      });
    },
    onError(error) {
      console.error("resend-otp", error);
    },
  });
};

const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      return resetPassword(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reset-password"],
      });
    },
    onError(error) {
      console.error("reset-password", error);
    },
  });
};

export {
  useLogin,
  useLogout,
  useAddUserAddress,
  useOtpVerification,
  useResendOtp,
  useResetPassword,
};
