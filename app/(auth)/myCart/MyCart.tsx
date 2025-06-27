import { StyleSheet, ScrollView, FlatList } from "react-native";
import React from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button, Text, View } from "@/components/Themed";
import { router } from "expo-router";
import CartItem from "@/components/CartItem";
import { useMyCartStore } from "@/store/myCart.store";

const MyCart = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { cartItems, getTotalPrice } = useMyCartStore();

  const handleCheckout = () => {
    router.push("/(auth)/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title={"My Cart"} />
        </View>
        <View style={styles.body}>
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title={"My Cart"} />
      </View>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>Rs.{getTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          variant="primary"
          size="large"
          title="Proceed to Checkout"
          onPress={handleCheckout}
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
    scrollView: {
      flex: 1,
      padding: 15,
    },
    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    emptyText: {
      fontSize: 18,
      color: Colors[theme].text,
      marginBottom: 20,
    },
    footer: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].text_light,
    },
    totalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors[theme].text,
    },
    totalPrice: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors[theme].primary_color,
    },
  });

export default MyCart;
