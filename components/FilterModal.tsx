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
} from "react-native";
import { View, Text, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { AntDesign } from "@expo/vector-icons";
import SelectButton from "./SelectButton";
import Slider from "@react-native-community/slider";
import { useGetCategories } from "@/hooks/queries/categories/categories.query";

const brands = ["Nestle", "Pepsi", "PeakFreeze", "Candy"];

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
  const styles = createStyles(colorScheme);

  // Animation value
  const [animation] = useState(new Animated.Value(0));

  // State for filters - use category ID instead of object
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [priceRange, setPriceRange] = useState([1, 1000]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategories();
  console.log(categories?.records?.length, "categories");

  // Memoize categories data to prevent unnecessary re-renders
  const categoriesData = useMemo(() => {
    return categories?.records || [];
  }, [categories?.records]);

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
        brand={item}
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
    setPriceRange([1, 1000]);
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
    setFilter([
      { all: false },
      { category: selectedCategory ? selectedCategory : null },
      { brand: selectedBrand },
      {
        priceRange:
          priceRange[0] === 1 && priceRange[1] === 1000
            ? [1, 20000]
            : priceRange,
      },
      { sort: selectedSort },
    ]);
    onClose();
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    selectedSort,
    setFilter,
    onClose,
  ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />
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
                <View style={styles.row}>
                  {brands.map((brand) => (
                    <BrandItem
                      key={brand}
                      brand={brand}
                      selectedBrand={selectedBrand}
                      setSelectedBrand={setSelectedBrand}
                    />
                  ))}
                </View>
                {/* Languages */}

                {/* Price Range */}
                <Text style={styles.sectionTitle}>Price</Text>
                <Text style={styles.priceLabel}>
                  Rs.{priceRange[0]} - {priceRange[1]}
                </Text>
                <Slider
                  style={{ width: "100%", height: 20 }}
                  minimumValue={1}
                  maximumValue={20000}
                  lowerLimit={1}
                  upperLimit={20000}
                  step={1}
                  value={priceRange[1]}
                  onValueChange={(value) =>
                    setPriceRange([priceRange[0], value])
                  }
                  minimumTrackTintColor={Colors[colorScheme].primary_color}
                  thumbTintColor={Colors[colorScheme].primary_color}
                />

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

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent backdrop
      justifyContent: "flex-start",
    },
    modalContainer: {
      height: "65%",
      backgroundColor: Colors[colorTheme].background,
      borderRadius: 15,
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
      marginTop: 20,
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
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginVertical: 20,
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
      marginTop: 16,
    },
  });

export default FilterModal;
