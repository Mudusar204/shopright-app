import { useEffect, useState } from "react";
import { useLogin, useRegister } from "@/hooks/mutations/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export default function useSignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync, error, isPending, isSuccess } = useRegister();
  const { user, setUser } = useAuthStore();
  const handleRegister = async () => {
    try {
      if (phone.length < 9) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a valid phone number",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

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

      const response = await mutateAsync({
        name: name,
        phoneNumber: phone,
        email: email,
        password: password,
      });

      if (response?.error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: response?.message || "Login failed. Please try again.",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      Toast.show({
        type: "success",
        position: "top",
        text1: response?.message || "OTP Sent Success",
        text2: "Welcome to the app",
        visibilityTime: 3000,
        autoHide: true,
      });

      setUser({
        _id: response?.user?._id,
        name: name,
        phoneNumber: phone,
        email: email,
      });
      router.push("/(public)/confirmSignup");
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
    phone,
    setPhone,
    email,
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
