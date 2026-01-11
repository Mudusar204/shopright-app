import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import useNetworkStatus from "@/customHooks/useNetworkStatus";
import { Ionicons } from "@expo/vector-icons";

const NetworkStatusBar = () => {
  const { isOffline } = useNetworkStatus();
  const colorScheme = useColorScheme() as "light" | "dark";
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(isOffline ? 0 : -100)).current;
  const opacity = useRef(new Animated.Value(isOffline ? 1 : 0)).current;

  useEffect(() => {
    if (isOffline) {
      // Slide down and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide up and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOffline, translateY, opacity]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme].error || "#FF3B30",
          paddingTop: insets.top + 8,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="cloud-offline-outline"
          size={20}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FF3B30",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NetworkStatusBar;

