import React from "react";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import NotificationSettings from "@/components/NotificationSettings";
import { router } from "expo-router";

const NotificationSettingsScreen = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <NotificationSettings onClose={handleClose} />
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
  });

export default NotificationSettingsScreen;
