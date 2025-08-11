import React, { useCallback, useRef, useState, useMemo } from "react";
import {
  ActivityIndicator,
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
import { useGetProducts } from "@/hooks/queries/products/products.query";
import { useGetCategories } from "@/hooks/queries/categories/categories.query";

type FilterItem = {
  all?: boolean;
  category?: any | null;
  brand?: string;
  priceRange?: [number, number];
  sort?: string;
  status?: string;
};

// Memoized ProductCard component
const MemoizedProductCard = React.memo(ProductCard);

export default function HomeScreen() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filter, setFilter] = useState<FilterItem[]>([
    { all: true },
    { category: null },
    { brand: "" },
    { priceRange: [1, 20000] },
    { sort: "" },
  ]);
  const { cartItems } = useMyCartStore();
  const { data, isLoading, isError } = useGetProducts();

  // Memoize filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (!data?.records) return [];

    if (searchQuery) {
      return data?.records?.filter((item: any) =>
        item.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data?.records?.filter((item: any) => {
      // If "all" is selected, show all items
      if (filter[0].all) return true;

      // Filter by category
      if (filter[1].category !== null) {
        // Check if the product's category ID matches the selected category
        const productCategoryIds = item?.public_categ_ids || [];
        if (!productCategoryIds.includes(filter[1]?.category?.id)) {
          return false;
        }
      }

      // Filter by brand (if implemented)
      if (filter[2].brand && item?.brand !== filter[2].brand) {
        return false;
      }

      // Filter by price range
      if (filter[3].priceRange) {
        const [minPrice, maxPrice] = filter[3].priceRange;
        const itemPrice = item?.list_price || 0;
        if (itemPrice < minPrice || itemPrice > maxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [data?.records, filter, searchQuery]);

  const handleFilterPress = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  // Memoize the render item function for FlatList
  const renderProductItem = useCallback(
    ({ item }: { item: any }) => (
      <MemoizedProductCard
        id={item?.id}
        image={item?.image_1920}
        title={item?.display_name}
        price={item?.list_price}
        description={item?.description_ecommerce}
        tags={item?.categ_id}
      />
    ),
    []
  );

  // Memoize key extractor
  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  // Memoize dropdown filter data
  const dropdownFilterData = useMemo(
    () => [
      filter[1]?.category != null ? filter[1]?.category?.name : "Category",
      filter[2]?.brand != "" ? filter[2]?.brand : "Brands",
      filter[3]?.priceRange?.[1] !== 20000
        ? filter[3]?.priceRange?.[0] + " - " + filter[3]?.priceRange?.[1]
        : "Price",
      filter[4]?.sort !== "" ? filter[4]?.sort : "Payment & Offers",
    ],
    [filter]
  );

  // Memoize dropdown render item
  const renderDropdownItem = useCallback(
    ({ item }: { item: any }) => (
      <DropdownFilter label={item} onClose={handleFilterPress} />
    ),
    [handleFilterPress]
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MenuHandler />
          </View>
          <View style={{ flex: 1 }}>
            {colorScheme === "dark" ? (
              <Image
                resizeMode="contain"
                style={styles.userImage}
                source={require("@/assets/images/logo.png")}
              />
            ) : (
              <Image
                resizeMode="contain"
                style={styles.userImage}
                source={require("@/assets/images/logo-dark.png")}
              />
            )}
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </Pressable>

        <View style={styles.filterContainer}>
          <Pressable onPress={handleFilterPress}>
            <FilterHandler />
          </Pressable>
          <FlatList
            data={dropdownFilterData}
            renderItem={renderDropdownItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* <View style={styles.mapContainer}>
          <MapComponent />
        </View> */}
        <View style={styles.productContainer}>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                size="large"
                color={Colors[colorScheme].primary_color}
              />
            </View>
          ) : isError ? (
            <Text>Error loading products</Text>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderProductItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              contentContainerStyle={{ marginHorizontal: 10 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={6}
              windowSize={10}
              initialNumToRender={9}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    marginTop: 150,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No products found</Text>
                </View>
              }
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
