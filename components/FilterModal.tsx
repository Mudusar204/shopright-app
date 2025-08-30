import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { View, Text, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { AntDesign } from "@expo/vector-icons";
import SelectButton from "./SelectButton";
import { useGetCategories } from "@/hooks/queries/categories/categories.query";
import { useGetBrands } from "@/hooks/queries/categories/brands.query";

// const brands = ["Nestle", "Pepsi", "PeakFreeze", "Candy"];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filter: any;
  setFilter: (filters: any) => void;
}

// Memoized category item component
const CategoryItem = React.memo(
  ({ item, selectedCategory, setSelectedCategory }: any) => (
    <SelectButton
      key={item.id}
      item={item}
      selectedItem={selectedCategory?.id === item?.id ? item : null}
      setSelectedItem={(selectedItem: any) => {
        setSelectedCategory(selectedItem ? selectedItem : null);
      }}
    />
  )
);

// Memoized brand item component
const BrandItem = React.memo(
  ({ brand, selectedBrand, setSelectedBrand }: any) => (
    <SelectButton
      key={brand}
      item={brand}
      selectedItem={selectedBrand}
      setSelectedItem={setSelectedBrand}
    />
  )
);

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filter,
  setFilter,
}) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const screenHeight = Dimensions.get("window").height;
  const styles = createStyles(colorScheme, screenHeight);

  // Animation value
  const [animation] = useState(new Animated.Value(0));

  // State for filters - use category ID instead of object
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [minPrice, setMinPrice] = useState("1");
  const [maxPrice, setMaxPrice] = useState("100000");

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategories();
  console.log(categories?.records?.[0], "categories");
  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useGetBrands();
  console.log(brands?.records, "brands");

  // Memoize categories data to prevent unnecessary re-renders
  const categoriesData = useMemo(() => {
    return categories?.records || [];
  }, [categories?.records]);

  const brandsData = useMemo(() => {
    return brands?.records || [];
  }, [brands?.records]);

  // Memoize the category render item function
  const renderCategoryItem = useCallback(
    ({ item }: { item: any }) => (
      <CategoryItem
        item={item}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    ),
    [selectedCategory]
  );

  // Memoize the brand render item function
  const renderBrandItem = useCallback(
    ({ item }: { item: any }) => (
      <BrandItem
        brand={item.name}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    ),
    [selectedBrand]
  );

  // Memoize key extractors
  const categoryKeyExtractor = useCallback(
    (item: any) => item.id.toString(),
    []
  );
  const brandKeyExtractor = useCallback((item: string) => item, []);

  // Animate modal when visibility changes
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0], // Adjust this value based on your modal height
  });

  // Memoize reset function
  const handleReset = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand("");
    setMinPrice("1");
    setMaxPrice("1000");
    setSelectedSort("");
    setFilter([
      { all: true },
      { category: null },
      { brand: "" },
      { priceRange: [1, 20000] },
      { sort: "" },
    ]);
    onClose();
  }, [setFilter, onClose]);

  // Memoize apply function
  const handleApply = useCallback(() => {
    const min = parseInt(minPrice) || 1;
    const max = parseInt(maxPrice) || 100000;

    setFilter([
      { all: false },
      { category: selectedCategory ? selectedCategory : null },
      { brand: selectedBrand },
      {
        priceRange: min === 1 && max === 1000 ? [1, 20000] : [min, max],
      },
      { sort: selectedSort },
    ]);
    onClose();
  }, [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    selectedSort,
    setFilter,
    onClose,
  ]);

  // Handle price input changes
  const handleMinPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= parseInt(maxPrice)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= parseInt(minPrice)) {
      setMaxPrice(value);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* <StatusBar hidden={true} /> */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.headerContainer}>
                  <Text style={styles.header}>Filter</Text>
                  <AntDesign
                    name="closecircleo"
                    size={22}
                    color={Colors[colorScheme].icon_color}
                    onPress={onClose}
                  />
                </View>

                {/* Categories */}
                <Text style={styles.sectionTitle}>Category</Text>
                {categoriesLoading ? (
                  <Text>Loading categories...</Text>
                ) : categoriesError ? (
                  <Text>Error loading categories</Text>
                ) : (
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categoriesData}
                    renderItem={renderCategoryItem}
                    keyExtractor={categoryKeyExtractor}
                    contentContainerStyle={{ gap: 12 }}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={5}
                  />
                )}

                {/* Brands */}
                <Text style={styles.sectionTitle}>Brands</Text>
                {brandsLoading ? (
                  <Text>Loading brands...</Text>
                ) : brandsError ? (
                  <Text>Error loading brands</Text>
                ) : (
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={brandsData}
                    renderItem={renderBrandItem}
                    keyExtractor={brandKeyExtractor}
                    contentContainerStyle={{ gap: 12 }}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={5}
                    ListEmptyComponent={
                      <Text
                        style={{
                          color: Colors[colorScheme].text,
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        No brands found
                      </Text>
                    }
                  />
                )}
                {/* Languages */}

                {/* Price Range */}
                <Text style={styles.sectionTitle}>Price</Text>
                <View style={styles.priceContainer}>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Min Price</Text>
                    <View style={styles.priceInputWrapper}>
                      <Text style={styles.pricePrefix}>Rs.</Text>
                      <TextInput
                        style={styles.priceInput}
                        value={minPrice}
                        onChangeText={handleMinPriceChange}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={
                          Colors[colorScheme].text_secondary
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Max Price</Text>
                    <View style={styles.priceInputWrapper}>
                      <Text style={styles.pricePrefix}>Rs.</Text>
                      <TextInput
                        style={styles.priceInput}
                        value={maxPrice}
                        onChangeText={handleMaxPriceChange}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={
                          Colors[colorScheme].text_secondary
                        }
                      />
                    </View>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Sort By</Text>
                <View style={styles.row}>
                  {["Price", "Categories"].map((sort) => (
                    <SelectButton
                      key={sort}
                      item={sort}
                      selectedItem={selectedSort}
                      setSelectedItem={setSelectedSort}
                    />
                  ))}
                </View>
                {/* Action Buttons */}
                <View style={styles.footer}>
                  <Button
                    title="Reset"
                    variant="secondary"
                    size="medium"
                    onPress={handleReset}
                  />
                  <Button
                    title="Apply"
                    variant="primary"
                    size="medium"
                    onPress={handleApply}
                  />
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (colorTheme: "light" | "dark", height: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent backdrop
      justifyContent: "flex-start",
    },
    modalContainer: {
      height: "65%",
      backgroundColor: Colors[colorTheme].background,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      overflow: "hidden",
      // shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    content: {
      flex: 1,
      padding: 25,
      // marginTop: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 12,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginVertical: 15,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 10,
    },
    languageContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      // marginVertical: 15,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#C0C0C0",
    },
    buttonSmall: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#C0C0C0",
    },
    buttonSelected: {
      backgroundColor: "#007AFF",
      borderColor: "#007AFF",
    },
    buttonText: {
      fontSize: 14,
      color: "#000",
    },
    buttonTextSelected: {
      color: "#FFF",
    },
    priceLabel: {
      marginBottom: 8,
      fontSize: 14,
      color: Colors[colorTheme].primary_color,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 20,
      marginVertical: 10,
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 10,
    },
    priceInputContainer: {
      flex: 1,
    },
    priceInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    priceInput: {
      flex: 1,
      fontSize: 16,
      color: Colors[colorTheme].text_primary,
      paddingRight: 5,
    },
    pricePrefix: {
      fontSize: 16,
      color: Colors[colorTheme].text_primary,
      marginRight: 5,
    },
  });

export default FilterModal;
