import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
const Support = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme, width);

  const phone = "+923003302711";
  const email = "support@shopright.com";
  const whatsapp = "923003302711";

  return (
    <View style={styles.container}>
      <Header title="Support Center" />

      <View style={styles.card}>
        <MaterialIcons
          name="support-agent"
          size={90}
          color={Colors[colorScheme].border}
          style={styles.icon}
        />
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>
          Our support team is always available to assist you.
        </Text>

        {/* Call Support */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <MaterialIcons name="call" size={22} color="#fff" />
          <Text style={styles.actionText}>{phone}</Text>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity
          style={[styles.actionButton, styles.whatsapp]}
          onPress={() => Linking.openURL(`https://wa.me/${whatsapp}`)}
        >
          <FontAwesome5 name="whatsapp" size={24} color="white" />
          <Text style={styles.actionText}>Chat on WhatsApp</Text>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          style={[styles.actionButton, styles.email]}
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          <MaterialIcons name="email" size={22} color="#fff" />
          <Text style={styles.actionText}>{email}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Support;

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: Colors[theme].background,
    },

    card: {
      flex: 1,
      // justifyContent: "center",
      marginTop: 90,
      padding: 24,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
      // shadowColor: "#000",
      // shadowOpacity: 0.08,
      // shadowRadius: 10,
      // elevation: 4,
    },

    icon: {
      marginBottom: 12,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 6,
    },

    subtitle: {
      fontSize: 14,
      textAlign: "center",
      color: theme === "dark" ? "#aaa" : "#666",
      marginBottom: 20,
    },

    actionButton: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: Colors[theme].border,
      marginBottom: 12,
      gap: 10,
    },

    whatsapp: {
      backgroundColor: "#25D366",
    },

    email: {
      backgroundColor: "#4A6CF7",
    },

    actionText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
  });
