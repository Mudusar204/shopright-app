import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useMyCartStore } from "@/store/myCart.store";
import { getImageSource } from "@/utils";

interface CartItemProps {
  item: {
    id: string;
    image: any;
    title: string;
    price: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { updateQuantity, removeFromCart } = useMyCartStore();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQuantity);
  };
  console.log(item);

  return (
    <View style={styles.container}>
      <Image source={getImageSource(item.image)} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{`Rs.${item.price}`}</Text>
        <View style={styles.quantityContainer}>
          <Button
            variant="outline"
            size="small"
            onPress={() => handleQuantityChange(-1)}
            icon={
              <Ionicons
                name="remove"
                size={16}
                color={Colors[colorScheme].primary_color}
              />
            }
            style={{
              paddingLeft: 5,
              paddingRight: 7,
            }}
          />
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Button
            variant="outline"
            size="small"
            onPress={() => handleQuantityChange(1)}
            icon={
              <Ionicons
                name="add"
                size={16}
                color={Colors[colorScheme].primary_color}
              />
            }
            style={{
              paddingLeft: 5,
              paddingRight: 7,
            }}
          />
        </View>
      </View>
      <View>
        <Button
          title="Remove"
          variant="primary"
          size="small"
          onPress={() => removeFromCart(item.id)}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      marginBottom: 10,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 15,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 5,
    },
    price: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors[theme].primary_color,
      marginBottom: 10,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    quantity: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
      minWidth: 30,
      textAlign: "center",
    },
  });

export default CartItem;
