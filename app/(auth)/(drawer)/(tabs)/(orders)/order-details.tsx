import React from "react";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { View, Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useLocalSearchParams, router } from "expo-router";
import { useGetOrderById } from "@/hooks/queries/orders/orders.query";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import MapView, { Marker, Callout } from "react-native-maps";
import LocationMarker from "@/assets/images/svgs/LocationMarker";
import Header from "@/components/Header";

const OrderDetails = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { orderId } = useLocalSearchParams();
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderById(Number(orderId));
  console.log(order, "order in order-details", orderId, isError, error);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme].primary_color}
          />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Order not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return Colors[colorScheme].warning;
      case "accepted":
        return Colors[colorScheme].info;
      case "in_transit":
        return Colors[colorScheme].primary_color;
      case "delivered":
        return Colors[colorScheme].success;
      case "cancelled":
      case "failed":
        return Colors[colorScheme].error;
      default:
        return Colors[colorScheme].text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "accepted":
        return "checkmark-circle-outline";
      case "in_transit":
        return "car-outline";
      case "delivered":
        return "checkmark-done-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      case "failed":
        return "alert-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const statuses = [
    { id: "pending", label: "Order Placed" },
    { id: "accepted", label: "Order Accepted" },
    { id: "in_transit", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
  ];

  const currentStatusIndex = statuses.findIndex(
    (status) => status.id === order?.records[0]?.state
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Order Details" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginBottom: 80 }}
      >
        {/* Status Timeline */}
        <View style={styles.timelineContainer}>
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            return (
              <View key={status.id} style={styles.timelineItem}>
                <View
                  style={[
                    styles.statusIcon,
                    {
                      backgroundColor: isCompleted
                        ? getStatusColor(order?.records[0]?.state)
                        : Colors[colorScheme].background_light,
                      borderColor: isCompleted
                        ? getStatusColor(order?.records[0]?.state)
                        : Colors[colorScheme].border,
                    },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(status.id)}
                    size={20}
                    color={isCompleted ? "white" : Colors[colorScheme].text}
                  />
                </View>
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color: isCurrent
                        ? getStatusColor(order?.records[0]?.state)
                        : Colors[colorScheme].text,
                    },
                  ]}
                >
                  {status.label}
                </Text>
                {index < statuses.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor: isCompleted
                          ? getStatusColor(order?.records[0]?.state)
                          : Colors[colorScheme].border,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Order Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>#{order?.records[0]?.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {format(
                new Date(order?.records[0]?.date_order),
                "MMM dd, yyyy hh:mm a"
              )}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rider</Text>
            <Text style={styles.infoValue}>
              {order?.records[0]?.rider_id?.name || "Not Assigned"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Items</Text>
            <Text style={styles.infoValue}>
              {order?.records[0]?.order_line?.length} items
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount</Text>
            <Text style={styles.infoValue}>
              Rs. {order?.records[0]?.amount_total}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method</Text>
            <Text style={styles.infoValue}>
              {order?.records[0]?.payment_method}
            </Text>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude:
                  order?.records[0]?.partner_shipping_id[1]?.latitude ||
                  23.723081,
                longitude:
                  order?.records[0]?.partner_shipping_id[1]?.longitude ||
                  90.4087,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker
                coordinate={{
                  latitude:
                    order?.records[0]?.partner_shipping_id[1]?.latitude ||
                    23.723081,
                  longitude:
                    order?.records[0]?.partner_shipping_id[1]?.longitude ||
                    90.4087,
                }}
              >
                <View style={styles.markerContainer}>
                  <LocationMarker color={Colors[colorScheme].text_secondary} />
                </View>
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>Pickup Location</Text>
                    <Text style={styles.calloutText}>
                      {order?.records[0]?.partner_shipping_id[1]?.address}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            </MapView>
          </View>
          <Text style={styles.addressText}>
            {order?.records[0]?.partner_shipping_id[1]?.address}
          </Text>
        </View>

        {/* Action Buttons */}
        {order?.records[0]?.state === "draft" && (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                // Handle cancel order
              }}
            >
              <Text style={styles.buttonText}>Cancel Order</Text>
            </Pressable>
            {/* <Pressable
              style={[styles.button, styles.supportButton]}
              onPress={() => {
                // Handle contact support
              }}
            >
              <Text style={styles.buttonText}>Contact Support</Text>
            </Pressable> */}
          </View>
        )}
      </ScrollView>
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    timelineContainer: {
      padding: 20,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      margin: 15,
    },
    timelineItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: "transparent",
    },
    statusIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    },
    statusLabel: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "500",
    },
    timelineLine: {
      position: "absolute",
      left: 19,
      top: 40,
      width: 2,
      height: 30,
    },
    infoContainer: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      margin: 15,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      backgroundColor: "transparent",
    },
    infoLabel: {
      color: Colors[theme].text_secondary,
      fontSize: 14,
    },
    infoValue: {
      color: Colors[theme].text,
      fontSize: 14,
      fontWeight: "500",
    },
    mapContainer: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      margin: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      color: Colors[theme].text,
    },
    mapWrapper: {
      height: 200,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    calloutContainer: {
      width: 200,
      backgroundColor: Colors[theme].background,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
    },
    calloutTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 5,
      color: Colors[theme].text,
    },
    calloutText: {
      fontSize: 12,
      color: Colors[theme].text_secondary,
      textAlign: "center",
    },
    addressText: {
      fontSize: 14,
      color: Colors[theme].text_secondary,
      marginTop: 5,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      gap: 10,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: Colors[theme].error,
    },
    supportButton: {
      backgroundColor: Colors[theme].primary_color,
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
  });

export default OrderDetails;
