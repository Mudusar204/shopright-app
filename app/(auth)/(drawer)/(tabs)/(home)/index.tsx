import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Divider, Text, TextInput, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import i18n from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import InputBatch from "@/components/InputBatch";
import DropdownFilter from "@/components/DropdownFilter";
import FilterHandler from "@/components/FilterHandler";
import MapComponent from "@/components/MapComponent";
import FilterModal from "@/components/FilterModal";
import ProductCard from "@/components/ProductCard";
import MenuHandler from "@/components/MenuHandler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMyCartStore } from "@/store/myCart.store";
import { useGetAllProducts } from "@/hooks/queries/products/products.query";
type FilterItem = {
  all?: boolean;
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  sort?: string;
  status?: string;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterItem[]>([
    { all: true },
    { category: "" },
    { brand: "" },
    { priceRange: [5, 25] },
    { sort: "" },
  ]);
  const [userId, setUserId] = useState("");
  const { addToCart, cartItems, removeFromCart } = useMyCartStore();
  const { data, isLoading, isError } = useGetAllProducts();
  console.log("API Response:", data);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);
  // const PRODUCTS = [
  //   {
  //     id: 1,
  //     title: "Smartphone X",
  //     description: "Latest smartphone with advanced features",
  //     listPrice: "999.99",
  //     discountedPrice: "899.99",
  //     availableQuantity: 50,
  //     barcode: "123456789012",
  //     brand: "TechBrand",
  //     category: {
  //       id: 1,
  //       name: "Electronics",
  //       description: "Electronic devices and accessories",
  //     },
  //     images: [
  //       "https://cdn.shopify.com/s/files/1/0777/0954/1664/files/0967774925055_6dd7450b-f1e2-40c0-9807-b9f9fd489142.jpg?v=1742640659",
  //     ],
  //     isAvailable: true,
  //     sku: "SPX-001",
  //     tags: [
  //       { id: 3, name: "New Arrival" },
  //       { id: 2, name: "Sale" },
  //     ],
  //     variants: [
  //       {
  //         id: 1,
  //         variantName: "Storage",
  //         variantValue: "128GB",
  //         additionalPrice: "0.00",
  //         stock: 25,
  //       },
  //       {
  //         id: 2,
  //         variantName: "Storage",
  //         variantValue: "256GB",
  //         additionalPrice: "100.00",
  //         stock: 25,
  //       },
  //     ],
  //     createdAt: "2025-06-15T15:37:09.054Z",
  //     updatedAt: "2025-06-15T15:37:09.054Z",
  //   },
  //   {
  //     id: 2,
  //     title: "Smartphone Y",
  //     description: "Premium smartphone with cutting-edge technology",
  //     listPrice: "1299.99",
  //     discountedPrice: "1199.99",
  //     availableQuantity: 30,
  //     barcode: "123456789013",
  //     brand: "TechBrand",
  //     category: {
  //       id: 1,
  //       name: "Electronics",
  //       description: "Electronic devices and accessories",
  //     },
  //     images: [
  //       "https://cdn.shopify.com/s/files/1/0777/0954/1664/files/0967774925055_6dd7450b-f1e2-40c0-9807-b9f9fd489142.jpg?v=1742640659",
  //     ],
  //     isAvailable: true,
  //     sku: "SPY-001",
  //     tags: [
  //       { id: 3, name: "New Arrival" },
  //       { id: 2, name: "Sale" },
  //     ],
  //     variants: [
  //       {
  //         id: 3,
  //         variantName: "Storage",
  //         variantValue: "256GB",
  //         additionalPrice: "0.00",
  //         stock: 15,
  //       },
  //       {
  //         id: 4,
  //         variantName: "Storage",
  //         variantValue: "512GB",
  //         additionalPrice: "200.00",
  //         stock: 15,
  //       },
  //     ],
  //     createdAt: "2025-06-15T15:37:09.054Z",
  //     updatedAt: "2025-06-15T15:37:09.054Z",
  //   },
  // ];

  const handleFilterPress = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MenuHandler />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              resizeMode="contain"
              style={styles.userImage}
              source={require("@/assets/images/logo.png")}
            />
          </View>
          <Pressable
            style={styles.cart}
            onPress={() => router.push("/(auth)/myCart")}
          >
            <Text style={styles.cartCount}>{cartItems.length}</Text>
            <Feather
              name="shopping-cart"
              size={24}
              color={Colors[colorScheme].primary_color}
            />
          </Pressable>
        </View>
        <Pressable>
          <View style={styles.locationContainer}>
            <AntDesign
              style={{ marginRight: 10 }}
              name="search1"
              size={20}
              color={Colors[colorScheme].icon_color}
            />
            <TextInput
              placeholder="What you are looking for?"
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </Pressable>

        <View style={styles.filterContainer}>
          <Pressable onPress={handleFilterPress}>
            <FilterHandler />
          </Pressable>
          <FlatList
            data={[
              filter[1].category != "" ? filter[1].category : "Category",
              filter[2].brand != "" ? filter[2].brand : "Brands",
              filter[3].priceRange?.[1] !== 25
                ? filter[3].priceRange?.[0] + " - " + filter[3].priceRange?.[1]
                : "Price",
              filter[4].sort !== "" ? filter[4].sort : "Payment & Offers",
            ]}
            renderItem={({ item }: { item: any }) => (
              <DropdownFilter
                label={item}
                onClose={() => {
                  handleFilterPress();
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.mapContainer}>
          <MapComponent />
        </View>
        <View style={styles.productContainer}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : isError ? (
            <Text>Error loading products</Text>
          ) : (
            <FlatList
              data={Array.isArray(data) ? data : [data]}
              renderItem={({ item }) => (
                <ProductCard
                  id={item.id.toString()}
                  image={item.images[0]}
                  title={item.title}
                  location={item.category.name}
                  price={item.listPrice}
                  phoneNumber={item.brand}
                  description={item.description}
                  tags={item.tags.map((tag: any) => tag.name)}
                  relatedItems={item.variants.map((variant: any) => ({
                    image: item.images[0],
                    title: `${item.title} - ${variant.variantValue}`,
                    price: (
                      parseFloat(item.listPrice) +
                      parseFloat(variant.additionalPrice)
                    ).toString(),
                    location: item.category.name,
                    phoneNumber: item.brand,
                    description: item.description,
                  }))}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              contentContainerStyle={{ marginHorizontal: 10 }}
            />
          )}
        </View>
      </View>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filter={filter}
        setFilter={setFilter}
      />
    </SafeAreaView>
  );
}

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    header: {
      width: "100%",
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userImage: {
      width: 145,
      height: 45,
      // borderRadius: 50,
    },
    headerLeft: {
      flex: 1,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    cart: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "relative",
    },
    cartCount: {
      height: 20,
      width: 20,
      position: "absolute",
      paddingLeft: 5,
      paddingTop: 1,
      top: -10,
      right: -10,
      color: "white",
      borderRadius: 100,
      backgroundColor: Colors[colorTheme].primary_color,
    },
    welcomeText: {
      fontSize: 17,
      fontWeight: "normal",
    },
    locationContainer: {
      height: 42,
      marginTop: 25,
      marginHorizontal: 20,
      paddingHorizontal: 15,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: Colors[colorTheme].background_light,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
    },
    locationText: {
      fontSize: 12,
      fontWeight: "medium",
      marginRight: 5,
    },
    divider: {
      marginLeft: 10,
      width: 1,
      height: 42,
      backgroundColor: Colors[colorTheme].border,
    },
    filterContainer: {
      marginTop: 10,
      marginLeft: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    mapContainer: {
      flex: 1,
      marginTop: 10,
      marginHorizontal: 20,
      borderRadius: 20,
      overflow: "hidden",
    },
    productContainer: {
      flex: 3,
      marginTop: 10,
    },
  });
