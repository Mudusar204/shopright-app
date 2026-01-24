import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useGetDeliveryCharges } from "@/hooks/queries/orders/orders.query";

const { width } = Dimensions.get("window");

export default function SaleAlert() {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { data: deliveryCharges } = useGetDeliveryCharges();
  console.log(deliveryCharges?.records[0]?.amount, "deliveryCharges");
  const translateX = useRef(new Animated.Value(width)).current;

  const ALERTS = [
    `🚚 Enjoy FREE Delivery! Orders above Rs.${deliveryCharges?.records[0]?.amount}`,
    "     🕒 Order before 10:00 PM & get same-day delivery!",
    "Cooked meals prepared within 24 hours",
  ];

  useEffect(() => {
    translateX.setValue(width);

    Animated.loop(
      Animated.timing(translateX, {
        toValue: -width * 2.6,
        duration: 18000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.marquee, { transform: [{ translateX }] }]}>
        {ALERTS.map((item, index) => (
          <Text key={index} style={styles.text} numberOfLines={1}>
            {item}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[colorTheme].primary_color,
      paddingVertical: 8,
      overflow: "hidden",
      marginTop: 10,
    },
    marquee: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      color: Colors[colorTheme].text_white,
      fontSize: 14,
      fontWeight: "600",
      marginRight: 30,
    },
  });
