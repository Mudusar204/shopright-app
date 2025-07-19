import React, { useCallback, useMemo } from "react";
import { StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";
import { View, Text } from "@/components/Themed";
import { router } from "expo-router";
import LocationIcon from "@/assets/images/svgs/Location";
import PhoneIcon from "@/assets/images/svgs/Phone";
import { useMyCartStore } from "@/store/myCart.store";
import EvilIcons from "@expo/vector-icons/EvilIcons";
interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
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

const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ id, image, title, price, description, relatedItems, tags }) => {
    const { addToCart, cartItems, removeFromCart } = useMyCartStore();

    const colorTheme = useColorScheme() as "light" | "dark";
    const styles = createStyles(colorTheme);
    const { width } = Dimensions.get("window");

    // Memoize the card width
    const cardWidth = useMemo(() => width / 3 - 16, [width]);

    // Memoize cart item check
    const isInCart = useMemo(
      () => cartItems.find((item) => item.id === id),
      [cartItems, id]
    );

    // Memoize navigation handler
    const handlePress = useCallback(() => {
      router.push({
        pathname: "/(auth)/(tabs)/(home)/product-details",
        params: {
          id,
          image,
          title,
          price,
          description,
          tags: JSON.stringify(tags),
          relatedItems: JSON.stringify(relatedItems),
        },
      });
    }, [id, image, title, price, description, tags, relatedItems]);

    // Memoize cart action handler
    const handleCartAction = useCallback(() => {
      if (isInCart) {
        removeFromCart(id);
      } else {
        addToCart({ id, image, title, price });
      }
    }, [isInCart, removeFromCart, addToCart, id, image, title, price]);

    return (
      <View style={[styles.container, { width: cardWidth }]}>
        <Pressable style={styles.pressableContainer} onPress={handlePress}>
          {/* Image */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                resizeMode="cover"
                source={{ uri: image }}
                style={styles.image}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EvilIcons
                  name="image"
                  size={100}
                  color={Colors[colorTheme].text}
                />
              </View>
            )}
          </View>

          {/* Content */}
          <View style={[styles.content, { backgroundColor: "transparent" }]}>
            <Text
              style={[
                styles.title,
                // { flex: 1, flexWrap: "wrap", textAlign: "center" },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.title}>1 kg</Text>
              <Text style={styles.title}>Rs.{price}</Text>
            </View>

            <Pressable
              style={styles.addToCartButton}
              onPress={handleCartAction}
            >
              <Text style={styles.addToCart}>
                {isInCart ? "Remove Item" : "Add To Cart"}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  }
);

ProductCard.displayName = "ProductCard";

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
      backgroundColor: "red",
      flex: 1,
      justifyContent: "space-between",
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
