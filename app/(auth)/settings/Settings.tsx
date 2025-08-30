import { Dimensions, Image, Pressable, StyleSheet } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
const Settings = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme, width);

  const links = [
    // {
    //   title: "Edit Profile",
    //   onPress: () => router.push("/(auth)/editProfile"),
    // },

    {
      title: "Notifications",
      onPress: () => router.push("/(auth)/settings/notifications"),
    },
    // {
    //   title: "Legal and Policy",
    //   // onPress: () => router.push('/(auth)/(drawer)/legal')
    // },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title={"Settings"} />
      </View>
      {links.map((link, index) => (
        <Pressable onPress={link.onPress} key={index}>
          <View key={index} style={styles.linkContainer}>
            <Text style={styles.linkText}>{link.title}</Text>
            <View style={styles.linkIconContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={Colors[colorScheme].icon_color}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default Settings;

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme === "light"
          ? Colors[theme].background_light
          : "rgba(0, 0, 0, 0.95)",
    },
    headerContainer: {
      paddingHorizontal: 15,
      paddingBottom: 20,
    },
    linkContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: Colors[theme].border,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 17,
      marginTop: 15,
      marginHorizontal: 15,
    },
    linkIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    linkText: {
      fontSize: 16,
    },
    linkIconText: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
      marginRight: 5,
    },
  });
