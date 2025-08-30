import React from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { View, Text, Button } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";
import InputBatch from "@/components/InputBatch";
import RelatedProductCard from "@/components/RelatedProductCard";
import PhoneIcon from "@/assets/images/svgs/Phone";
import LocationIcon from "@/assets/images/svgs/Location";
import Feather from "@expo/vector-icons/Feather";
import { useMyCartStore } from "@/store/myCart.store";
import { getImageSource } from "@/utils";

const ProductDetails = () => {
  const params = useLocalSearchParams();
  let {
    id,
    image,
    title,
    location,
    price,
    phoneNumber,
    description,
    tags,
    relatedItems,
  } = params;
  const tagList = params.tags ? JSON.parse(tags as string) : [];
  const relatedItemsList = params.relatedItems
    ? JSON.parse(relatedItems as string)
    : [];
  const colorTheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorTheme);
  const { addToCart, cartItems, removeFromCart } = useMyCartStore();
  const handleAddToCart = () => {
    if (cartItems.find((item) => item.id === id)) {
      removeFromCart(id as string);
    } else {
      addToCart({
        id: id as string,
        image:
          image && image.includes("http")
            ? { uri: image }
            : require("@/assets/images/productImg.jpg"),
        title: title as string,
        price: price as string,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16 }}>
        <Header title={title as string} />
      </View>
      {/* Header Image */}
      <Image
        resizeMode="contain"
        source={getImageSource(image)}
        style={styles.headerImage}
      />

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title and Location */}

        <View style={styles.titleRow}>
          <View style={styles.phoneRow}>
            <Text style={styles.title}>{title}</Text>
            {/* <Button
              style={{
                paddingHorizontal: 2,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              title="Bakery & Snacks"
              variant="outline"
              size="small"
              onPress={() => {}}
            /> */}
          </View>
          <Text style={styles.price}>{`Rs.${price}`}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>{description}</Text>
        {tagList && tagList.length > 0 && (
          <View style={styles.inputBatchContainer}>
            {tagList?.map((tag: any, index: any) => (
              <InputBatch key={index} label={tag} onClose={() => {}} />
            ))}
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 15 }}>
        <Button
          variant="primary"
          size="large"
          title={
            cartItems.find((item) => item.id === id)
              ? "Remove From Cart"
              : "Add To Cart"
          }
          icon={<Feather name="shopping-cart" size={24} color="white" />}
          onPress={handleAddToCart}
        />
      </View>

      {/* Related Items */}
      {relatedItemsList.length > 0 && (
        <View style={styles.relatedItemsSection}>
          <Text style={styles.sectionTitle}>Related Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedItemsList?.map((item: any, index: number) => (
              <RelatedProductCard
                key={index}
                image={item.image}
                title={item.title}
                price={item.price}
                location={item.location}
                phoneNumber={item.phoneNumber}
                description={item.description}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorTheme].background,
    },
    headerImage: {
      width: "100%",
      height: 270,
      // resizeMode: "cover",
      marginTop: 10,
    },
    contentSection: {
      padding: 16,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "medium",
      marginRight: 10,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    locationText: {
      marginLeft: 4,
      fontSize: 14,
      color: Colors[colorTheme].background_secondary,
    },
    price: {
      fontSize: 22,
      fontWeight: "medium",
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    phoneText: {
      marginLeft: 8,
      fontSize: 14,
      color: Colors[colorTheme].text_secondary,
    },
    description: {
      fontSize: 15,
      lineHeight: 20,
      color: Colors[colorTheme].text_light,
    },
    relatedItemsSection: {
      padding: 16,
      marginBottom: 70,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
    },

    inputBatchContainer: {
      marginLeft: -10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 10,
    },
  });

export default ProductDetails;
