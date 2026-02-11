import React, { useCallback, useMemo } from "react";
import { StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";
import { View, Text, Button } from "@/components/Themed";
import { router } from "expo-router";
import LocationIcon from "@/assets/images/svgs/Location";
import PhoneIcon from "@/assets/images/svgs/Phone";
import { useMyCartStore } from "@/store/myCart.store";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { getImageSource } from "@/utils";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useWishlistStore } from "@/store/wishlist.store";

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
  qtyAvailable?: any;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({
    id,
    image,
    title,
    price,
    description,
    relatedItems,
    tags,
    qtyAvailable,
  }) => {
    const { addToCart, cartItems, removeFromCart } = useMyCartStore();
    const inWishlist = useWishlistStore((state) => state.isInWishlist(id));
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

    const colorTheme = useColorScheme() as "light" | "dark";
    const screenHeight = Dimensions.get("window").height;
    const styles = createStyles(colorTheme, screenHeight);
    const { width } = Dimensions.get("window");

    // Memoize the card width
    const cardWidth = useMemo(() => width / 2 - 30, [width]);

    // Memoize cart item check
    const isInCart = useMemo(
      () => cartItems.find((item) => Number(item.id) === Number(id)),
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
          qtyAvailable,
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

    const handleWishlistToggle = useCallback(() => {
      toggleWishlist({ id, image, title, price });
    }, [id, image, title, price, toggleWishlist]);

    return (
      <View style={[styles.container, { width: cardWidth }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            paddingHorizontal: 5,
            paddingTop: 5,
          }}
        >
          <Feather
            name="check-circle"
            size={20}
            color={Colors[colorTheme].primary_color}
            style={{
              opacity: isInCart ? 1 : 0,
            }}
          />
          <Pressable onPress={handleWishlistToggle}>
            <AntDesign
              name={inWishlist ? "heart" : "hearto"}
              size={20}
              color={
                inWishlist
                  ? Colors[colorTheme].primary_color
                  : Colors[colorTheme].icon_color
              }
            />
          </Pressable>
        </View>
        <Pressable style={styles.pressableContainer} onPress={handlePress}>
          {/* Image */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                resizeMode="contain"
                source={getImageSource(image)}
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
                { flex: 1, flexWrap: "wrap", textAlign: "center" },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.title}></Text>
              <Text style={styles.title}>Rs.{price}</Text>
            </View>
            {/* <Button
              variant="primary"
              size="small"
              style={{}}
              title={
                cartItems.find((item) => item.id === id)
                  ? "Remove Item"
                  : "Add To Cart"
              }
              icon={<Feather name="shopping-cart" size={18} color="white" />}
              onPress={handleCartAction}
            /> */}
            <Pressable
              style={[
                styles.addToCartButton,
                {
                  backgroundColor:
                    // qtyAvailable > 0
                    true
                      ? Colors[colorTheme].primary_color
                      : Colors[colorTheme].secondary_color,
                },
              ]}
              onPress={handleCartAction}
              // disabled={qtyAvailable < 1}
            >
              <Text style={[styles.addToCart]}>
                {/* {qtyAvailable < 1 */}
                {false
                  ? "Out of Stock"
                  : isInCart
                  ? "Remove Item"
                  : "Add To Cart  "}
              </Text>
              {!isInCart && (
                //  && qtyAvailable > 0
                <Feather name="shopping-cart" size={18} color="white" />
              )}
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  }
);

ProductCard.displayName = "ProductCard";

const createStyles = (colorTheme: "light" | "dark", height: number) =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
      borderRadius: 5,
      overflow: "hidden",
      borderWidth: colorTheme === "dark" ? 1 : 0,
      borderColor: Colors[colorTheme].border,
      margin: 10,
      // backgroundColor: Colors[colorTheme].background_light,
      shadowColor: Colors[colorTheme].text_light,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 20,
    },
    pressableContainer: {
      flex: 1,
      // backgroundColor: Colors[colorTheme].background_light, // Add background color here too
      backgroundColor: "transparent", // Add background color here too
    },
    imageContainer: {
      width: "100%",
      height: height * 0.1,
    },
    image: {
      width: "100%",
      height: "100%",
      paddingBottom: 10,
    },
    content: {
      // padding: 1,
      // backgroundColor: "red",
      flex: 1,
      justifyContent: "space-between",
    },
    title: {
      fontWeight: "bold",
      fontSize: 14,
      marginBottom: 4,
      marginLeft: 4,
      marginTop: 10,
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
      // justifyContent: "space-between",
      backgroundColor: "transparent",
    },

    addToCartButton: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      padding: 8,
    },
    addToCart: {
      fontWeight: "bold",
      fontSize: 12,
      textAlign: "center",
      color: Colors[colorTheme].text_white,
    },
  });

export default ProductCard;
