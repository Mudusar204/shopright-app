import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/mutations/auth/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useRegister } from "@/hooks/mutations/user/user.mutation";
import { extractErrorFromHtml, stripHtmlTags } from "@/utils";

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
      console.log(password.length, "password in useSignupScreen");
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      ) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Weak Password",
          text2:
            "Password must be at least 8 characters long and include uppercase, lowercase, number & special character",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      const response = await mutateAsync({
        name: name,
        phone: phone,
        login: email,
        password: password,
      });
      const keys = Object.keys(response);

      const isSuccess = response?.["New resource"]?.[0]?.id;

      if (isSuccess) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "User created successfully",
          text2: "Please login to continue",
          visibilityTime: 3000,
          autoHide: true,
        });
        router.push("/(public)/login");
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "User creation failed",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
      // router.push("/(public)/confirmSignup");
    } catch (err: any) {
      console.log(err.response.data, "error in useLoginScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1:
          extractErrorFromHtml(err?.response?.data) ||
          extractErrorFromHtml(err?.response.data?.message) ||
          extractErrorFromHtml(err?.response.data?.error) ||
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
