import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { Button, Text, TextInput, View } from "@/components/Themed";
import React, { useState, useEffect } from "react";
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
import { useUpdateProfile } from "@/hooks/mutations/auth/auth.mutation";
import Toast from "react-native-toast-message";
const Profile = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const { data: userAddresses } = useGetUserAddresses();
  const { data: odooUser } = useGetOdooUser();
  const isLoggedIn = useAuthStore().isLoggedIn;
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  console.log(odooUser, "odooUser found");
  console.log(userAddresses, "userAddresses", odooUser);
  const styles = createStyles(colorScheme, width);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset>();

  // Initialize email and phone from odooUser data
  useEffect(() => {
    if (typeof odooUser === "object" && odooUser?.records?.[0]) {
      setEmail(odooUser.records[0].login || "");
      setPhone(odooUser.records[0].phone || "");
    }
  }, [odooUser]);

  const handleSaveProfile = async () => {
    try {
      if (!email.trim()) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Email is required",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      await updateProfile({
        email: email.trim(),
        phone: phone.trim(),
      });

      Toast.show({
        type: "success",
        position: "top",
        text1: "Profile updated successfully",
        visibilityTime: 3000,
        autoHide: true,
      });

      setIsEditMode(false);
    } catch (error: any) {
      console.log(error, "error in handleSaveProfile");
      Toast.show({
        type: "error",
        position: "top",
        text1: error?.message || "Failed to update profile",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (typeof odooUser === "object" && odooUser?.records?.[0]) {
      setEmail(odooUser.records[0].login || "");
      setPhone(odooUser.records[0].phone || "");
    }
    setIsEditMode(false);
  };

  const links = [
    {
      title: "Email",
      value: typeof odooUser === "object" ? odooUser?.records[0]?.login : "N/A",
      editable: true,
    },

    {
      title: "Phone",
      value: typeof odooUser === "object" ? odooUser?.records[0]?.phone : "N/A",
      editable: true,
    },
    {
      title: "Address",
      value:
        userAddresses?.records[0]?.street2 ||
        userAddresses?.records[0]?.city ||
        userAddresses?.records[0]?.state ||
        userAddresses?.records[0]?.country ||
        "N/A",
      editable: false,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="Profile" />
        {isLoggedIn && !isEditMode && (
          <TouchableOpacity
            onPress={() => setIsEditMode(true)}
            style={styles.editButton}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={Colors[colorScheme].text}
            />
          </TouchableOpacity>
        )}
      </View>
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

      {links.map((link, index) => {
        const isEditableField = isEditMode && link.editable;
        const isEmail = link.title === "Email";
        const isPhone = link.title === "Phone";

        return (
          <View key={index} style={{ marginTop: 15 }}>
            <Text style={styles.linkText}>{link.title}</Text>
            <View style={styles.linkContainer}>
              {isEditableField ? (
                <TextInput
                  style={styles.editInput}
                  value={isEmail ? email : phone}
                  onChangeText={isEmail ? setEmail : setPhone}
                  placeholder={`Enter ${link.title.toLowerCase()}`}
                  keyboardType={isPhone ? "phone-pad" : "email-address"}
                  autoCapitalize={isEmail ? "none" : "none"}
                />
              ) : (
                <Text style={styles.linkText}>{link.value}</Text>
              )}
              <View style={styles.linkIconContainer}></View>
            </View>
          </View>
        );
      })}

      {isEditMode && isLoggedIn && (
        <View style={styles.editActions}>
          <Button
            variant="outline"
            size="large"
            title="Cancel"
            onPress={handleCancelEdit}
            style={{ flex: 1, marginRight: 10 }}
            disabled={isPending}
          />
          <Button
            variant="primary"
            size="large"
            title={isPending ? "Saving..." : "Save"}
            onPress={handleSaveProfile}
            style={{ flex: 1 }}
            disabled={isPending}
          />
        </View>
      )}

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
    headerWrapper: {
      position: "relative",
    },
    editButton: {
      position: "absolute",
      right: 0,
      top: 0,
      padding: 8,
      zIndex: 1,
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
    editInput: {
      flex: 1,
      fontSize: 16,
      backgroundColor: "transparent",
    },
    editActions: {
      flexDirection: "row",
      marginTop: 30,
      gap: 10,
    },
  });
