import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button, View, Text } from "@/components/Themed";
import { router } from "expo-router";

const Orders = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const [orders, setOrders] = useState([]);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title={"My Orders"} />
      </View>
      <View style={styles.body}>
        <Text style={{ marginBottom: 10 }}>Lets create your first order!</Text>
        <Button
          variant="primary"
          size="large"
          title="Start Shopping"
          onPress={() => {
            router.push("/(auth)/(tabs)");
          }}
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
    headerContainer: {
      paddingHorizontal: 15,
    },
    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 15,
    },
  });
export default Orders;
