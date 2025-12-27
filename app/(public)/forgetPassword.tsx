import { StyleSheet } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import React from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import InputHandler from "@/components/InputHandler";
import { router } from "expo-router";
import SmsIcon from "@/assets/images/svgs/Sms";
import useForgotPasswordScreen from "@/customHooks/auth/useForgotPasswordScreen";

const ForgetPassword = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { email, setEmail, handleResetPassword, isLoading } =
    useForgotPasswordScreen();

  return (
    <View style={styles.container}>
      <Header title={null} />
      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={styles.subtitle}>Enter your email to get a Reset link</Text>

      <InputHandler
        leftIcon={<SmsIcon color={Colors[colorScheme].icon_color} />}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
      />

      <Button
        textColor={Colors[colorScheme].text_white}
        style={styles.button}
        variant={isLoading || !email ? "primary" : "primary"}
        size="large"
        title={isLoading ? "Sending..." : "Reset password"}
        onPress={handleResetPassword}
        disabled={isLoading || !email}
      />

      <Button
        style={styles.backButton}
        variant="secondary"
        size="large"
        title="Back to Login"
        onPress={() => router.back()}
      />
    </View>
  );
};

export default ForgetPassword;

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginTop: 10,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
      textAlign: "center",
      marginTop: 5,
      marginBottom: 10,
    },
    button: {
      marginTop: 12,
    },
    backButton: {
      marginTop: 12,
    },
  });
