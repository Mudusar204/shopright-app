import { useEffect, useState } from "react";
import {
  useOtpVerification,
  useResendOtp,
} from "@/hooks/mutations/auth/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
export default function useOtpScreen() {
  const { mutateAsync, error, isPending, isSuccess } = useOtpVerification();
  const {
    mutateAsync: mutateResendOtp,
    error: errorResendOtp,
    isPending: isPendingResendOtp,
    isSuccess: isSuccessResendOtp,
  } = useResendOtp();
  const { user, setIsLoggedIn } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  // const { refetch, loading } = useLocation();
  const handleOtpVerification = async () => {
    try {
      if (otp.length < 6) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a valid OTP",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      const response = await mutateAsync({
        otp: otp,
        email: user?.email,
      });

      if (response?.error) {
        Toast.show({
          type: "error",
          position: "top",
          text1:
            response?.message || "OTP Verification failed. Please try again.",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      Toast.show({
        type: "success",
        position: "top",
        text1: response?.message || "OTP Verified Success",
        text2: "Welcome to the app",
        visibilityTime: 3000,
        autoHide: true,
      });

      setIsLoggedIn(true);
      router.push("/(auth)/(tabs)");
    } catch (err: any) {
      console.log(err.response.data, "error in useOtpScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1: err.response.data.error || "An error occurred",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await mutateResendOtp({
        email: email ? email : user?.email,
      });

      if (response?.error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: response?.message || "OTP resend failed. Please try again.",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      Toast.show({
        type: "success",
        position: "top",
        text1: response?.message || "OTP resend Success",
        text2: "Welcome to the app",
        visibilityTime: 3000,
        autoHide: true,
      });
      if (email) {
        router.push("/(public)/confirmSignup");
      }
    } catch (err: any) {
      console.log(err.response.data, "error in useOtpScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1: err.response.data.error || "An error occurred",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return {
    otp,
    setOtp,
    handleOtpVerification,
    isLoading: isPending,
    isLoadingResendOtp: isPendingResendOtp,
    handleResendCode,
    email,
    setEmail,
  };
}
