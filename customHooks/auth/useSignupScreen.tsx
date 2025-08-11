import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/mutations/auth/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useRegister } from "@/hooks/mutations/user/user.mutation";

export default function useSignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync, error, isPending, isSuccess } = useRegister();
  const { odooUser, setOdooUser, setOdooUserAuth } = useAuthStore();
  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Passwords do not match",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      const response = await mutateAsync(
        {
          name: name,
          phone: phone,
          login: email,
          password: password,
        },
        {
          onSuccess: (data) => {
            console.log(data, "data in useSignupScreen");
            Toast.show({
              type: "success",
              position: "top",
              text1: "User created successfully",
              text2: "Please login to continue",
              visibilityTime: 3000,
              autoHide: true,
            });
            router.push("/(public)/login");
          },
          onError: (error) => {
            console.log(error, "error in useSignupScreen");
            Toast.show({
              type: "error",
              position: "top",
              text1: response?.message || "Login failed. Please try again.",
              visibilityTime: 3000,
              autoHide: true,
            });
          },
        }
      );

      // router.push("/(public)/confirmSignup");
    } catch (err: any) {
      console.log(err.response.data, "error in useLoginScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1:
          err.response.data.message ||
          err.response.data.error ||
          "An error occurred",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return {
    email,
    phone,
    setPhone,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    handleRegister,
    isLoading: isPending,
  };
}
