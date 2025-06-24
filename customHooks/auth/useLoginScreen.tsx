import { useEffect, useState } from "react";
import { useLogin } from "@/hooks/mutations/auth/auth.mutation";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
export default function useLoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, error, isPending, isSuccess } = useLogin();
  const [isLoading, setIsLoading] = useState(isPending);
  const { setIsLoggedIn, setOdooUser, setOdooUserAuth } = useAuthStore();
  // const { refetch, loading } = useLocation();
  const handleLogin = async () => {
    try {
      if (identifier.length < 4) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a valid email or phone number",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }
      setIsLoading(true);

      const response = await mutateAsync({
        identifier: identifier,
        password: password,
      });

      if (!response?.User) {
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
      setOdooUserAuth({
        api_key: response?.["api-key"],
        login: identifier,
        password: password,
        db: "Testing",
      });
      router.push("/(auth)/(tabs)");
    } catch (err: any) {
      setIsLoading(false);
      console.log(err.response.data, "error in useLoginScreen");

      Toast.show({
        type: "error",
        position: "top",
        text1: err.response.data.message || "An error occurred",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    handleLogin,
    isLoading: isLoading,
  };
}
