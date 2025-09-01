import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  BackHandler,
  TouchableOpacity,
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
import {
  useGetOdooUser,
  useGetUserAddresses,
} from "@/hooks/queries/auth/auth.query";
const Profile = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const { data: userAddresses } = useGetUserAddresses();
  const { data: odooUser } = useGetOdooUser();
  const isLoggedIn = useAuthStore().isLoggedIn;
  console.log(odooUser, "odooUser found");
  console.log(userAddresses, "userAddresses", odooUser);
  const styles = createStyles(colorScheme, width);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset>();
  const links = [
    {
      title: "Email",
      value: typeof odooUser === "object" ? odooUser?.records[0]?.login : "N/A",
    },

    {
      title: "Phone",
      value: typeof odooUser === "object" ? odooUser?.records[0]?.phone : "N/A",
    },
    {
      title: "Address",
      value:
        userAddresses?.records[0]?.street2 ||
        userAddresses?.records[0]?.city ||
        userAddresses?.records[0]?.state ||
        userAddresses?.records[0]?.country ||
        "N/A",
    },
  ];
  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.profileImageContainer}>
        <AntDesign name="user" size={80} color={Colors[colorScheme].text} />
        {/* <Image
          source={
            selectedImage
              ? { uri: selectedImage.uri }
              : require("@/assets/images/profileImg.png")
          }
          style={styles.profileImage}
        /> */}
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileNameText}>
            {userAddresses?.records[0]?.name}
          </Text>
        </View>
      </View>

      {links.map((link, index) => (
        <View key={index} style={{ marginTop: 15 }}>
          <Text style={styles.linkText}>{link.title}</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>{link.value}</Text>
            <View style={styles.linkIconContainer}></View>
          </View>
        </View>
      ))}
      {!isLoggedIn && (
        <Button
          variant="primary"
          size="large"
          title="Login"
          onPress={() => {
            router.push("/(public)/login");
          }}
          style={{ marginTop: 30 }}
        />
      )}
    </View>
  );
};

export default Profile;

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    button: {
      height: 41,
      width: 41,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:
        theme === "light"
          ? "rgba(245, 245, 245, 1)"
          : "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      borderColor: "#E9E9E9",
      borderRadius: 12,
    },
    iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 15,
    },

    profileImageContainer: {
      marginTop: 40,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      width: 115,
      borderRadius: 100,
      height: 115,
    },

    profileTextContainer: {},
    profileNameText: {
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
      marginTop: 10,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 5,
    },
    profileLocationText: {
      fontSize: 16,
      fontWeight: "500",
    },
    linkContainer: {
      backgroundColor:
        theme === "light"
          ? Colors[theme].background_light
          : "rgba(0, 0, 0, 0.95)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: Colors[theme].border,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 17,
      marginTop: 15,
      // marginHorizontal: 15,
    },
    linkIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    linkText: {
      fontSize: 16,
    },
  });
