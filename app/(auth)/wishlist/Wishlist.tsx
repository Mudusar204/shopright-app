import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { View, Text, Button } from "@/components/Themed";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useWishlistStore } from "@/store/wishlist.store";
import ProductCard from "@/components/ProductCard";
import { router } from "expo-router";

const Wishlist = () => {
  const theme = useColorScheme() as "light" | "dark";
  const styles = createStyles(theme);
  const { wishlistItems, clearWishlist } = useWishlistStore();

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Wishlist" />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Button
            variant="primary"
            size="large"
            title="Start Exploring"
            onPress={() => router.push("/(auth)/(drawer)/(tabs)/(home)")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Wishlist" />
      </View>
      <FlatList
        data={wishlistItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
            description={""}
          />
        )}
      />
      <View style={styles.footer}>
        <Button
          variant="secondary"
          size="large"
          title="Clear Wishlist"
          onPress={clearWishlist}
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
      paddingBottom: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 18,
      marginBottom: 20,
      color: Colors[theme].text,
      textAlign: "center",
    },
    listContent: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 80,
    },
    row: {
      justifyContent: "space-between",
    },
    footer: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].border,
    },
  });

export default Wishlist;
