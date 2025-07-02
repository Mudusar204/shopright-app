import "react-native-get-random-values";
import { router, Stack, usePathname } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar, StatusBarStyle } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Colors from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useAuthStore } from "@/store/auth.store";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient(); // Initialize QueryClient only onc
export default function Layout() {
  const colorScheme = useColorScheme() as "light" | "dark";
  // const [fontsLoaded, fontsError] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  //   ...FontAwesome.font,
  // });
  let fontsLoaded = true;
  let fontsError = false;
  useEffect(() => {
    if (fontsError) {
      console.error("Error loading fonts:", fontsError);
    }
  }, [fontsError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  const { isLoggedIn, isOnboarded } = useAuthStore((state) => state);

  // Add isOnboarded as a dependency
  const CustomStatusBar = ({
    backgroundColor,
    barStyle,
  }: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  }) => {
    const insets = useSafeAreaInsets();
    const location = usePathname();
    const isOnboardingScreen = location === "/onboarding";
    const statusBarStyle = isOnboardingScreen ? "light-content" : barStyle;
    const background_color = isOnboardingScreen
      ? Colors[colorScheme].primary_color
      : backgroundColor;

    return (
      <View style={{ height: insets.top, backgroundColor: background_color }}>
        <StatusBar
          backgroundColor={background_color}
          barStyle={statusBarStyle}
        />
      </View>
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <CustomStatusBar
              backgroundColor={Colors[colorScheme].background}
              barStyle={
                colorScheme === "dark"
                  ? "light-content"
                  : ("dark-content" as StatusBarStyle)
              }
            />
            <Stack
              initialRouteName="index"
              screenOptions={{ headerShown: false }}
            />
            <Toast />
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: string | null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      padding: 16,
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    content: {
      width: "100%",
      maxWidth: 800, // for web view during development
      margin: "auto",
    },
    settingsContainer: {
      marginTop: 20,
    },
    text: {
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: 18,
    },
  });
