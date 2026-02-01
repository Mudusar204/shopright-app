import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  ActivityIndicator,
  BackHandler,
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
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
import { useGetSliderImages } from "@/hooks/queries/categories/sliderImages.query";
import ImageSlider from "@/components/ImageSlider";
import { useGetCategories } from "@/hooks/queries/categories/categories.query";
import { getImageSource } from "@/utils";
import SaleAlert from "@/components/SaleAlert";
import InAppUpdateScreen from "@/components/UpdateCheck";
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
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const {
    data: sliderImages,
    isLoading: sliderImagesLoading,
    isError: sliderImagesError,
    refetch: sliderImagesRefetch,
  } = useGetSliderImages();

  // console.log(sliderImages, "sliderImages");
  const [filter, setFilter] = useState<FilterItem[]>([
    { all: true },
    { category: null },
    { brand: "" },
    { priceRange: [1, 20000] },
    { sort: "" },
  ]);
  const { cartItems } = useMyCartStore();
  const { data, isLoading, isError, refetch } = useGetProducts();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategories();

  const categoriesData = useMemo(() => {
    console.log(categories?.records[0], "categoriesData");
    return categories?.records || [];
  }, [categories?.records]);
  console.log(categoriesData.length, "categoriesData");
  // Sample banner images for the slider
  const bannerImages = sliderImages?.records?.map((item: any) => ({
    id: item?.id,
    image: item?.img_url,
  }));

  // Memoize filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (!data?.records) return [];

    let filteredItems = data?.records?.filter((item: any) => {
      // If "all" is selected, show all items
      if (filter[0].all) return true;

      // Filter by category
      if (filter[1].category !== null) {
        // Match on primary categ_id instead of public_categ_ids
        // const primaryCategoryId = item?.categ_id?.id ?? item?.categ_id?.[0]?.id;
        const primaryCategoryId = item?.public_categ_ids?.[0];
        if (primaryCategoryId !== filter[1]?.category?.id) {
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

    // Apply search filter
    if (searchQuery) {
      filteredItems = filteredItems.filter((item: any) =>
        item.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (filter[4]?.sort) {
      const sortBy = filter[4].sort;
      filteredItems.sort((a: any, b: any) => {
        switch (sortBy) {
          case "Price":
            // Sort by price (low to high)
            return (a?.list_price || 0) - (b?.list_price || 0);
          case "Categories":
            // Sort by category name (alphabetical)
            const categoryA = a?.categ_id?.[0]?.name || "";
            const categoryB = b?.categ_id?.[0]?.name || "";
            return categoryA.localeCompare(categoryB);
          default:
            return 0;
        }
      });
    }

    return filteredItems;
  }, [data?.records, filter, searchQuery]);

  const filtering = filteredData.filter((item: any) => item.id == 14948);

  // console.log(filteredData[2], "filteredData qty_available");
  const handleFilterPress = useCallback(() => {
    setIsFilterVisible(true);
  }, []);
  // Memoize the render category item function for FlatList

  const selectedCategoryId = filter[1]?.category?.id ?? null;

  // Check if filters are active
  const hasActiveFilters =
    searchQuery?.trim().length > 0 || selectedCategoryId !== null;

  const renderCategoryItem = useCallback(
    ({ item }: { item: any }) => {
      const isSelected = selectedCategoryId === item?.id;
      return (
        <Pressable
          onPress={() => {
            setFilter((prev) => {
              const currentCategory = prev[1].category;

              // If tapped category is already selected, deselect it
              if (currentCategory === item) {
                return [
                  { all: true }, // reset "all"
                  { category: null }, // deselect category
                  prev[2], // keep brand
                  prev[3], // keep priceRange
                  prev[4], // keep sort
                ];
              }

              // Otherwise, select new category
              return [
                { all: false }, // not all
                { category: item }, // set new category
                prev[2], // keep brand
                prev[3], // keep priceRange
                prev[4], // keep sort
              ];
            });
          }}
          style={{
            alignItems: "center",
            padding: 6,
            borderRadius: 10,
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected
              ? Colors[colorScheme].primary_color
              : "transparent",
          }}
        >
          <Image
            source={getImageSource(item?.category_image_url)}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
          <Text style={{ marginTop: 6 }}>{item.name}</Text>
        </Pressable>
      );
    },
    [selectedCategoryId, colorScheme]
  );

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
        relatedItems={item?.alternative_product_ids}
        qtyAvailable={item?.qty_available}
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
      filter[4]?.sort !== "" ? filter[4]?.sort : "Sort by",
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

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     const backHandler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       () => {
  //         // Return true to prevent default back action
  //         return true;
  //       }
  //     );

  //     // Cleanup: remove the event listener when component unmounts
  //     return () => backHandler.remove();
  //   }
  // }, []);

  const onUpdateNotRequired = useCallback(() => {
    setShowUpdatePrompt(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setFilter((prev) => [
      { all: true }, // reset "all"
      { category: null }, // clear category
      prev[2], // keep brand
      prev[3], // keep priceRange
      prev[4], // keep sort
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {showUpdatePrompt && (
        <InAppUpdateScreen onContinue={onUpdateNotRequired} />
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MenuHandler />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
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
        <View>
          <SaleAlert />
        </View>
        <View style={styles.searchContainer}>
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
              style={styles.searchInput}
            />
          </View>
          {hasActiveFilters && (
            <Pressable style={styles.clearButton} onPress={handleClearFilters}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          )}
        </View>

        {/* <View style={styles.filterContainer}>
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Something went wrong</Text>
              <Button title="Retry" onPress={() => refetch()} />
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderProductItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              contentContainerStyle={{
                marginHorizontal: 10,
                paddingBottom: 80,
              }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={6}
              windowSize={10}
              initialNumToRender={9}
              ListHeaderComponent={
                <View style={styles.mapContainer}>
                  <ImageSlider
                    images={bannerImages}
                    height={screenHeight * 0.2}
                    showDots={true}
                    autoPlay={true}
                    autoPlayInterval={4000}
                  />
                  <View style={{ marginTop: 10 }}>
                    <Text>Categories</Text>
                    <FlatList
                      data={categoriesData}
                      renderItem={renderCategoryItem}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{
                        gap: 10,
                        paddingHorizontal: 10,
                      }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </View>
              }
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
              refreshing={isLoading}
              onRefresh={() => {
                refetch();
              }}
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
      fontSize: 12,
      height: 20,
      width: 20,
      textAlign: "center",
      position: "absolute",
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
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 25,
      marginHorizontal: 20,
      gap: 10,
    },
    locationContainer: {
      flex: 1,
      height: 42,
      paddingHorizontal: 15,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[colorTheme].background_light,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
    },
    searchInput: {
      flex: 1,
      backgroundColor: "transparent",
    },
    clearButton: {
      width: 42,
      height: 42,
      borderRadius: 10,
      backgroundColor: "#FF3B30",
      justifyContent: "center",
      alignItems: "center",
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
      // flex: 1,
      marginTop: 10,
      marginHorizontal: 10,
      // borderRadius: 20,
      overflow: "hidden",
    },
    productContainer: {
      flex: 3,
      marginTop: 10,
    },
  });
