import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, View } from "@/components/Themed";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import SmsIcon from "@/assets/images/svgs/Sms";
import InputHandler from "@/components/InputHandler";
import Lock2Icon from "@/assets/images/svgs/Lock2";
import useLoginScreen from "@/customHooks/auth/useLoginScreen";

const Login = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const {
    identifier,
    setIdentifier,
    password,
    setOdooAdmin,
    setPassword,
    handleLogin,
    isLoading,
  } = useLoginScreen();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>
        {" "}
        Great to see you again, You've been missed!
      </Text>
      <InputHandler
        leftIcon={<SmsIcon color={Colors[colorScheme].icon_color} />}
        placeholder="Email or Phone Number"
        value={identifier}
        onChangeText={setIdentifier}
        textContentType="telephoneNumber"
      />
      <InputHandler
        leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        textContentType="password"
      />
      <Button
        textColor={Colors[colorScheme].text_white}
        style={styles.button}
        variant={isLoading || !identifier || !password ? "primary" : "primary"}
        size="large"
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setOdooAdmin()}>
          <Text style={styles.footerText}>
            {/* <Link style={styles.footerLink} href="/forgetPassword"> */}
            Forgot Password?
            {/* </Link> */}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {" "}
          <Link style={styles.footerLink} href="/signup">
            Create an account
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default Login;

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
      marginBottom: 15,
    },
    footer: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
    },
    footerLink: {
      color: Colors[theme].primary_color,
    },
    button: {
      marginTop: 50,
    },
  });
