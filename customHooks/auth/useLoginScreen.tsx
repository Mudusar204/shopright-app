import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/mutations/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
export default function useLoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, error, isPending, isSuccess } = useLogin();
  const [isLoading, setIsLoading] = useState(isPending);
  const { setIsLoggedIn, setUser, setToken } = useAuthStore();
  // const { refetch, loading } = useLocation();
  const handleLogin = async () => {
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
      setIsLoading(true);

      const response = await mutateAsync({
        phoneNumber: phone,
        password: password,
      });

      if (response?.error) {
        setIsLoading(false);
        Toast.show({
          type: "error",
          position: "top",
          text1: response?.message || "Login failed. Please try again.",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }
      setIsLoading(false);

      Toast.show({
        type: "success",
        position: "top",
        text1: response?.message || "Login Success",
        text2: "Welcome to the app",
        visibilityTime: 3000,
        autoHide: true,
      });
      console.log("login >", response, "<response");
      setIsLoggedIn(true);
      setUser(response?.user);
      setToken(response?.token);
      router.push("/(auth)/(tabs)");
    } catch (err: any) {
      setIsLoading(false);
      console.log(err.response.data, "error in useLoginScreen");

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
    phone,
    setPhone,
    password,
    setPassword,
    handleLogin,
    isLoading: isLoading,
  };
}
