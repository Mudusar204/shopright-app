import { Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import React, { useRef, useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import InputHandler from "@/components/InputHandler";
import ProfileIcon from "@/assets/images/svgs/Profile";
import SmsIcon from "@/assets/images/svgs/Sms";
import Lock2Icon from "@/assets/images/svgs/Lock2";

import useSignupScreen from "@/customHooks/auth/useSignupScreen";
import { useAuthStore } from "@/store/auth.store";
import Feather from "@expo/vector-icons/Feather";
const Signup = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const {
    password,
    setPassword,
    phone,
    setPhone,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    email,
    setEmail,
    handleRegister,
    isLoading,
  } = useSignupScreen();
  const { setOdooAdmin } = useAuthStore();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Header title={null} backButton={true} />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Please fill the details and create account
      </Text>

      <InputHandler
        leftIcon={<ProfileIcon color={Colors[colorScheme].icon_color} />}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        textContentType="name"
      />

      <InputHandler
        leftIcon={<SmsIcon color={Colors[colorScheme].icon_color} />}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
      />
      <InputHandler
        leftIcon={<SmsIcon color={Colors[colorScheme].icon_color} />}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        textContentType="none"
      />
      <InputHandler
        leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />}
        rightIcon={
          <Feather
            name={!isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color={Colors[colorScheme].icon_color}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        textContentType="password"
      />
      <InputHandler
        leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />}
        rightIcon={
          <Feather
            name={!isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={Colors[colorScheme].icon_color}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!isPasswordVisible}
        textContentType="password"
      />
      <Button
        textColor={Colors[colorScheme].text_white}
        style={{ marginTop: 12 }}
        variant={
          isLoading || !name || !email || !password || !confirmPassword
            ? "primary"
            : "primary"
        }
        size="large"
        title={isLoading ? "Signing up..." : "Sign up"}
        onPress={handleRegister}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Link style={styles.footerLink} href="/login">
            Sign in
          </Link>
        </Text>
        <TouchableOpacity onPress={() => setOdooAdmin()}>
          <Text style={styles.footerText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 20,
    },

    locationContainer: {
      zIndex: 100,
      elevation: 100,
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
      marginBottom: 15,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      alignItems: "center",
    },
    footerText: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
    },
    footerLink: {
      color: Colors[theme].primary_color,
    },
  });
