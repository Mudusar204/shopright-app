import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Themed";
import { router } from "expo-router";
import { useMyCartStore } from "@/store/myCart.store";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useGetUserAddresses } from "@/hooks/queries/user/user.query";
import { useAddUserAddress } from "@/hooks/mutations/user/user.mutation";
import AddAddressBottomSheet from "@/components/BottomSheets/AddAddressBottomSheet";
import { BottomSheetScrollHandle } from "@/components/BottomSheets/BottomSheet";

const Checkout = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { cartItems, getTotalPrice, clearCart } = useMyCartStore();
  const { data: userAddresses } = useGetUserAddresses();
  const { mutate: addUserAddress } = useAddUserAddress();
  console.log(userAddresses, "userAddresses");
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("card");
  const bottomSheetRef = useRef<BottomSheetScrollHandle>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const handleCheckout = () => {
    // Here you would typically:
    // 1. Validate delivery details
    // 2. Process payment
    // 3. Create order
    // 4. Clear cart
    // 5. Navigate to success screen
    clearCart();
    router.push("/(auth)/order-success");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Checkout" />
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={deliveryDetails.name}
              onChangeText={(text) =>
                setDeliveryDetails({ ...deliveryDetails, name: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={deliveryDetails.phone}
              onChangeText={(text) =>
                setDeliveryDetails({ ...deliveryDetails, phone: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={deliveryDetails.address}
              onChangeText={(text) =>
                setDeliveryDetails({ ...deliveryDetails, address: text })
              }
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                value={deliveryDetails.city}
                onChangeText={(text) =>
                  setDeliveryDetails({ ...deliveryDetails, city: text })
                }
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter ZIP code"
                keyboardType="number-pad"
                value={deliveryDetails.zipCode}
                onChangeText={(text) =>
                  setDeliveryDetails({ ...deliveryDetails, zipCode: text })
                }
              />
            </View>
          </View>
        </View>
        <Button
          variant="primary"
          size="large"
          title="Add New Address"
          onPress={() => bottomSheetRef.current?.handleBottomSheet()}
        />
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Pressable
            style={[
              styles.paymentOption,
              selectedPayment === "card" && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment("card")}
          >
            <Ionicons
              name="card-outline"
              size={24}
              color={Colors[colorScheme].primary_color}
            />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
            {selectedPayment === "card" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors[colorScheme].primary_color}
                style={styles.checkIcon}
              />
            )}
          </Pressable>
          <Pressable
            style={[
              styles.paymentOption,
              selectedPayment === "cash" && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment("cash")}
          >
            <Ionicons
              name="cash-outline"
              size={24}
              color={Colors[colorScheme].primary_color}
            />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            {selectedPayment === "cash" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors[colorScheme].primary_color}
                style={styles.checkIcon}
              />
            )}
          </Pressable>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>
                {item.title} x {item.quantity}
              </Text>
              <Text style={styles.orderItemPrice}>
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          title="Place Order"
          onPress={handleCheckout}
        />
      </View>
      <AddAddressBottomSheet
        bottomSheetRef={bottomSheetRef}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    headerContainer: {
      paddingHorizontal: 15,
    },
    scrollView: {
      flex: 1,
      padding: 15,
    },
    section: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 15,
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      color: Colors[theme].text_secondary,
      marginBottom: 5,
    },
    input: {
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: Colors[theme].text,
    },
    row: {
      flexDirection: "row",
    },
    paymentOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      marginBottom: 10,
    },
    selectedPayment: {
      borderWidth: 1,
      borderColor: Colors[theme].primary_color,
    },
    paymentText: {
      fontSize: 16,
      color: Colors[theme].text,
      marginLeft: 10,
      flex: 1,
    },
    checkIcon: {
      marginLeft: "auto",
    },
    orderItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    orderItemName: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    orderItemPrice: {
      fontSize: 16,
      color: Colors[theme].text,
      fontWeight: "600",
    },
    totalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].text_light,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors[theme].text,
    },
    totalPrice: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors[theme].primary_color,
    },
    footer: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].text_light,
    },
  });

export default Checkout;
