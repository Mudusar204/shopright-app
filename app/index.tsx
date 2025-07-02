import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";

const index = () => {
  const { isLoggedIn, isOnboarded } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure the component is mounted and ready before navigation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const navigate = () => {
      if (!isLoggedIn) {
        router.replace(!isOnboarded ? "/onboarding" : "/login");
      } else {
        router.replace("/(auth)/(drawer)/(tabs)/(home)");
      }
    };

    // Use a small delay to ensure navigation happens after render cycle
    const navigationTimer = setTimeout(navigate, 10);
    return () => clearTimeout(navigationTimer);
  }, [isLoggedIn, isOnboarded, isReady]);

  // Show loading indicator while waiting for app to be ready
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary_color} />
      </View>
    );
  }

  return null;
};

export default index;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
});
