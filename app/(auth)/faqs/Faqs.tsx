import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/* ---------------- FAQ DATA ---------------- */

const FAQS = [
  {
    q: "What products do you sell at Shopright?",
    a: "We sell a variety of quality products, including household items, kitchen items, vegetables, meats, daily essentials, and selected specialty products.",
  },
  {
    q: "Are your products original and authentic?",
    a: "Yes, all products at Shopright are 100% original and quality-checked before dispatch.",
  },
  {
    q: "Do you offer cash on delivery (COD)?",
    a: "Yes, Cash on Delivery (COD) is available for selected locations.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery, bank transfer, and other available digital payment options.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery usually takes within 2 hours depending on your location.",
  },
  {
    q: "What are your delivery charges?",
    a: "Delivery charges depend on your location and order value and are shown at checkout.",
  },
  {
    q: "Do you deliver all over Pakistan?",
    a: "Yes, we deliver to most cities and areas across Pakistan.",
  },
  {
    q: "How can I place an order?",
    a: "You can place an order through our website or by contacting us via WhatsApp.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, customers can track the rider’s live location, distance, and estimated delivery time on our app or website.",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "Orders can be cancelled before shipment. Once dispatched, cancellation may not be possible.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted if the product is damaged, defective, or incorrect.",
  },
  {
    q: "Can I exchange a product?",
    a: "Yes, exchanges are available for eligible products, subject to stock availability.",
  },
  {
    q: "What items are not eligible for return or exchange?",
    a: "Used items, perishable goods, frozen items, and products without original packaging are not eligible.",
  },
  {
    q: "What should I do if I receive a damaged or wrong item?",
    a: "Please contact us within 48 hours of receiving the product with clear photos.",
  },
  {
    q: "How can I contact Shopright customer support?",
    a: "You can contact us via phone, WhatsApp, or email.",
  },
];

/* ---------------- COMPONENT ---------------- */

const Faqs = () => {
  const width = Dimensions.get("window").width;
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme, width);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Header title="FAQs" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <View key={index} style={styles.faqCard}>
              <Pressable
                style={styles.questionRow}
                onPress={() => setOpenIndex(isOpen ? null : index)}
              >
                <Text style={styles.questionText}>{item.q}</Text>

                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={22}
                  color={Colors[colorScheme].text}
                />
              </Pressable>

              {isOpen && <Text style={styles.answerText}>{item.a}</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Faqs;

/* ---------------- STYLES ---------------- */

const createStyles = (theme: "light" | "dark", width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 16,
    },

    scrollContent: {
      // padding: 16,
      paddingTop: 16,
      paddingBottom: 30,
    },

    faqCard: {
      backgroundColor: Colors[theme].border,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
    },

    questionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    questionText: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
      marginRight: 10,
      color: Colors[theme].text,
    },

    answerText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 20,
      color: Colors[theme].text,
    },
  });
