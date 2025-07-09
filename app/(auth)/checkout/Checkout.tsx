import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import Checkbox from "expo-checkbox";
import React, { useRef, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button } from "@/components/Themed";
import { router } from "expo-router";
import { useMyCartStore } from "@/store/myCart.store";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useGetUserAddresses } from "@/hooks/queries/auth/auth.query";
import AddAddressBottomSheet from "@/components/BottomSheets/AddAddressBottomSheet";
import { BottomSheetScrollHandle } from "@/components/BottomSheets/BottomSheet";
import { useCreateOrder } from "@/hooks/mutations/orders/orders.mutation";
import Toast from "react-native-toast-message";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import socketService from "@/services/socket.service";

const Checkout = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { cartItems, getTotalPrice, clearCart } = useMyCartStore();
  const { data: userAddresses } = useGetUserAddresses();
  console.log(userAddresses, "userAddresses");
  const { mutate: createOrder, isPending, isSuccess } = useCreateOrder();
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const bottomSheetRef = useRef<BottomSheetScrollHandle>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const handleCheckout = () => {
    // if (!selectedAddress) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Please select an address",
    //   });
    //   return;
    // }
    if (cartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please add items to your cart",
      });
      return;
    }
    createOrder(
      {
        addressId: selectedAddress?.id,
        paymentMethod: selectedPayment,
        customerNote: selectedAddress?.instructions,
        totalAmount: getTotalPrice(),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (response) => {
          console.log(response, "response in checkout");
          clearCart();
          router.push("/(auth)/order-success");
          Toast.show({
            type: "success",
            text1: "Order placed successfully",
          });

          // Emit socket event for order placed
          socketService.emit("order-placed", {
            orderId: response?.id || "new-order",
            userId: "user-id", // You can get this from your auth store
            details: {
              items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                title: item.title,
                price: item.price,
              })),
              totalAmount: getTotalPrice(),
              paymentMethod: selectedPayment,
              address: selectedAddress,
              customerNote: selectedAddress?.instructions,
            },
          });
          socketService.emit("join-order-room", response?.id);
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: error.message,
          });
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Checkout" />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>
                {item.title} x {item.quantity}
              </Text>
              <Text style={styles.orderItemPrice}>
                Rs.{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              Rs.{getTotalPrice().toFixed(2)}
            </Text>
          </View>
        </View>

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

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Select Address</Text>
            <Button
              variant="primary"
              size="small"
              title="+ Address"
              onPress={() => bottomSheetRef.current?.handleBottomSheet()}
              style={{ marginBottom: 15 }}
            />
          </View>
          {userAddresses?.records?.length > 0 &&
          (userAddresses?.records[0]?.street ||
            userAddresses?.records[0]?.street2 ||
            userAddresses?.records[0]?.city ||
            userAddresses?.records[0]?.state ||
            userAddresses?.records[0]?.country) ? (
            <Pressable
              style={styles.addressItem}
              onPress={() => setSelectedAddress(userAddresses.records[0])}
            >
              {/* <Checkbox
                color={Colors[colorScheme].primary_color}
                style={styles.checkbox}
                value={selectedAddress?.id === userAddresses.records[0].id}
                onValueChange={() =>
                  setSelectedAddress(userAddresses.records[0])
                }
              /> */}
              <Text style={styles.addressItemText}>
                {userAddresses.records[0]?.street}{" "}
                {userAddresses.records[0]?.street2}{" "}
                {userAddresses.records[0]?.city}{" "}
                {userAddresses.records[0]?.state}{" "}
                {userAddresses.records[0]?.country}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.emptyAddressContainer}>
              <Text style={styles.emptyAddressText}>No addresses found</Text>
            </View>
          )}
          {/* <FlatList
            data={userAddresses}
            renderItem={({ item }) => (
              <Pressable
                style={styles.addressItem}
                onPress={() => setSelectedAddress(item)}
              >
                <Checkbox
                  color={Colors[colorScheme].primary_color}
                  style={styles.checkbox}
                  value={selectedAddress?.id === item.id}
                  onValueChange={() => setSelectedAddress(item)}
                />
                <Text style={styles.addressItemText}>
                  {item?.fullName} {item?.area} {item?.streetAddress}{" "}
                  {item?.city} {item?.state} {item?.country}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item?.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyAddressContainer}>
                <Text style={styles.emptyAddressText}>No addresses found</Text>
              </View>
            }
          /> */}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Enter your instructions"
            value={selectedAddress?.instructions}
            onChangeText={(text) =>
              setSelectedAddress({ ...selectedAddress, instructions: text })
            }
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          />
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
      justifyContent: "space-between",
      alignItems: "center",
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
      flex: 1,
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
    addressItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      // justifyContent: "space-between",
      padding: 10,
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      marginBottom: 10,
    },
    addressItemText: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    checkbox: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Colors[theme].primary_color,
      width: 20,
      height: 20,
      marginRight: 10,
    },
    emptyAddressContainer: {
      padding: 15,
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      marginBottom: 10,
    },
    emptyAddressText: {
      fontSize: 16,
      color: Colors[theme].text,
      textAlign: "center",
    },
  });

export default Checkout;
