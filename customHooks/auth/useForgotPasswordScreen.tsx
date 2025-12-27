import { useState } from "react";
import { useResetPassword } from "@/hooks/mutations/auth/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function useForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { mutateAsync, isPending } = useResetPassword();

  const handleResetPassword = async () => {
    try {
      if (!email || email.length < 4) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a valid email address",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      const response = await mutateAsync({
        login: email,
      });

      if (response?.result?.success) {
        Toast.show({
          type: "success",
          position: "top",
          text1: response?.result?.message || "Reset link sent!",
          text2: "Please check your email",
          visibilityTime: 3000,
          autoHide: true,
        });
        // Navigate back to login after successful reset
        router.back();
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: response?.result?.message || "Failed to send reset link. Please try again.",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (err: any) {
      console.log(err?.response?.data || err, "error in useForgotPasswordScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1: err?.response?.data?.result?.message || err?.message || "An error occurred",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return {
    email,
    setEmail,
    handleResetPassword,
    isLoading: isPending,
  };
}

