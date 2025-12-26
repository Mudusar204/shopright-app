import {
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Themed";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const OrderSuccess = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);

  // Prevent back button navigation on Android
  // Note: iOS swipe back is disabled via gestureEnabled: false in _layout.tsx
  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Return true to prevent default back action
          return true;
        }
      );

      // Cleanup: remove the event listener when component unmounts
      return () => backHandler.remove();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={80}
            color={Colors[colorScheme].primary_color}
          />
        </View>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed and will be delivered soon.
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={24}
              color={Colors[colorScheme].text_secondary}
            />
            <Text style={styles.detailText}>
              Estimated delivery: 30-45 minutes
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={24}
              color={Colors[colorScheme].text_secondary}
            />
            <Text style={styles.detailText}>
              Track your order in the orders section
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          title="Continue Shopping"
          onPress={() => router.push("/(auth)/(tabs)")}
        />
        <Button
          variant="outline"
          size="large"
          title="View Orders"
          onPress={() => router.push("/(auth)/(tabs)/(orders)")}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    iconContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: Colors[theme].text,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
      textAlign: "center",
      marginBottom: 30,
    },
    detailsContainer: {
      width: "100%",
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 20,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    detailText: {
      fontSize: 16,
      color: Colors[theme].text,
      marginLeft: 10,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].text_light,
    },
  });

export default OrderSuccess;
