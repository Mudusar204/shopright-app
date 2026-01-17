import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  BackHandler,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Text, View } from "@/components/Themed";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import LocationIcon from "@/assets/images/svgs/Location";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ImagePickerAsset } from "expo-image-picker";
import { useAuthStore } from "@/store/auth.store";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const Support = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme, width);

  const handlePhonePress = () => {
    Linking.openURL("tel:+923003302711");
  };

  return (
    <View style={styles.container}>
      <Header title="Support Center" />
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Contact Admin</Text>
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.phoneText}>+92 300 3302711</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Support;

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: Colors[theme].background,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors[theme].background,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "500",
    },
    phoneText: {
      fontSize: 24,
      fontWeight: "600",
      color: "lightblue",
    },
  });
