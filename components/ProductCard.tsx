import React from "react";
import { StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";
import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import LocationIcon from "@/assets/images/svgs/Location";
import PhoneIcon from "@/assets/images/svgs/Phone";
import { useMyCartStore } from "@/store/myCart.store";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  phoneNumber: string;
  description: string;
  relatedItems?: Array<
    | {
        image: string;
        title: string;
        price: string;
        location: string;
        phoneNumber: string;
        description: string;
      }
    | any
  >;
  tags?: Array<string>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  location,
  price,
  phoneNumber,
  description,
  relatedItems,
  tags,
}) => {
  const { addToCart, cartItems, removeFromCart } = useMyCartStore();

  const colorTheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorTheme);
  const { width } = Dimensions.get("window");
  return (
    <View style={[styles.container, { width: width / 3 - 16 }]}>
      <Pressable
        style={styles.pressableContainer}
        onPress={() =>
          router.push({
            pathname: "/(auth)/(tabs)/(home)/product-details",
            params: {
              id,
              image,
              title,
              location,
              price,
              phoneNumber,
              description,
              tags: JSON.stringify(tags),
              relatedItems: JSON.stringify(relatedItems),
            },
          })
        }
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: image }}
            style={styles.image}
          />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: "transparent" }]}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.title}>1 kg</Text>
            <Text style={styles.title}>Rs.{price}</Text>
          </View>

          <Pressable
            style={styles.addToCartButton}
            onPress={() => {
              if (cartItems.find((item) => item.id === id)) {
                removeFromCart(id);
              } else {
                addToCart({ id, image, title, price });
              }
            }}
          >
            <Text style={styles.addToCart}>
              {cartItems.find((item) => item.id === id)
                ? "Remove Item"
                : "Add To Cart"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
      borderRadius: 5,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
      margin: 5,
      backgroundColor: Colors[colorTheme].background_light,
    },
    pressableContainer: {
      flex: 1,
      backgroundColor: Colors[colorTheme].background_light, // Add background color here too
    },
    imageContainer: {
      width: "100%",
      height: 75,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    content: {
      padding: 1,
    },
    title: {
      fontWeight: "bold",
      fontSize: 10,
      marginBottom: 4,
      marginTop: 4,
    },
    locationRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    locationText: {
      color: Colors[colorTheme].background_secondary,
      fontSize: 8,
      marginLeft: 4,
      textAlign: "center",
    },
    price: {
      fontWeight: "bold",
      fontSize: 14,
      textAlign: "center",
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },

    addToCartButton: {
      marginTop: 5,
      color: Colors[colorTheme].primary_color,
      fontSize: 10,
      textAlign: "center",
      backgroundColor: "transparent",
      padding: 5,

      marginBottom: 0,
      borderRadius: 5,
      borderWidth: 1,

      borderColor: Colors[colorTheme].primary_color,
    },
    addToCart: {
      fontWeight: "bold",
      fontSize: 12,
      textAlign: "center",
      color: Colors[colorTheme].primary_color,
    },
  });

export default ProductCard;
