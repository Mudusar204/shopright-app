import { Dimensions, Image, Pressable, StyleSheet, Alert } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import { useDeleteOdooUser } from "@/hooks/mutations/user/user.mutation";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth.store";

const DeleteAccount = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme, width);
  const [loading, setLoading] = useState(false);
  const { clear } = useAuthStore();
  const { mutateAsync, isPending } = useDeleteOdooUser();

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      Alert.alert(
        "Are you sure you want to delete your account?",
        "This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () =>
              mutateAsync(undefined, {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Account deleted successfully",
                  });
                  clear();
                  router.back();
                },
                onError: () => {
                  Alert.alert("Error", "Failed to delete account");
                },
              }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={"Delete Account"} />
      <View style={styles.buttonContainer}>
        <Button
          style={{
            marginTop: 12,
            backgroundColor: Colors[colorScheme].error,
          }}
          variant={isPending ? "disabled" : "primary"}
          size="large"
          title={loading ? "Deleting..." : "Delete Account"}
          onPress={handleUpdateProfile}
        />
      </View>
    </View>
  );
};

export default DeleteAccount;

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 20,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
