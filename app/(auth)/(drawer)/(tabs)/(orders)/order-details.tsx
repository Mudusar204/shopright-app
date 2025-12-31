import React, { useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  RefreshControl,
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
import useRealTimeRider from "@/customHooks/riders/useRealTimeRider";
import RiderTrackingMap from "@/components/RiderTrackingMap";
import { socketService } from "@/services/socket.service";
import { OrderStatus } from "@/constants/enums";
import { useUpdateOrderStatus } from "@/hooks/mutations/orders/orders.mutation";
import { useGetRiderLocation } from "@/hooks/queries/auth/auth.query";
import { getImageSource } from "@/utils";

const OrderDetails = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { orderId } = useLocalSearchParams();
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderById(Number(orderId));
  const { data: riderLastLocation } = useGetRiderLocation(
    order?.records[0]?.app_rider_id || ""
  );

  const date = new Date(order?.records[0]?.date_order);
  date.setHours(date.getHours() + 5);

  const formattedDate = format(date, "MMM dd, yyyy hh:mm a");
  console.log(riderLastLocation, "riderLastLocation in order-details");
  const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus();
  console.log(order, "order in order-details", orderId, isError, error);

  // Real-time rider tracking
  const riderId = order?.records[0]?.app_rider_id;
  console.log("riderId extracted from order:", riderId);
  console.log("Full order data:", order?.records[0]);

  const { riderLocation, socketConnected, isTracking } = useRealTimeRider({
    riderId,
    onLocationUpdate: (location) => {
      console.log("Rider location updated:", location);
    },
  });
  console.log("useRealTimeRider result:", {
    riderLocation,
    socketConnected,
    isTracking,
  });

  // Remove duplicate subscription - useRealTimeRider already handles this
  // useEffect(() => {
  //   console.log("riderId in order-details", riderId, socketConnected);
  //   const unsubscribe = socketService.subscribeToRiderLocation(
  //     riderId,
  //     (data) => {
  //       console.log("Live location from any rider:", data);
  //       // Example: update markers on Google Map
  //     }
  //   );

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme]?.primary_color}
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
      case OrderStatus.Pending:
        return Colors[colorScheme].warning;
      case OrderStatus.Confirmed:
        return Colors[colorScheme].primary_color;

      case OrderStatus.Processing:
        return Colors[colorScheme].primary_color;
      case OrderStatus.PickedUp:
        return Colors[colorScheme].primary_color;
      case OrderStatus.InTransit:
        return Colors[colorScheme].primary_color;
      case OrderStatus.Delivered:
        return Colors[colorScheme].success;
      case OrderStatus.Cancelled:
        return Colors[colorScheme].error;
      case OrderStatus.FailedDelivery:
        return Colors[colorScheme].error;
      default:
        return Colors[colorScheme].warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "started":
        return "checkmark-circle-outline";
      case "full":
        return "car-outline";
      case "cancelled":
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
    { id: "started", label: "In Transit" },
    { id: "full", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
    // { id: "failed", label: "Failed" },
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
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginBottom: 80 }}
      >
        {/* Status Timeline */}
        {/* <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Order Status</Text>
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
                        ? getStatusColor(order?.order_status)
                        : Colors[colorScheme]?.background_light,
                      borderColor: isCompleted
                        ? getStatusColor(order?.order_status)
                        : Colors[colorScheme]?.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(status.id)}
                    size={20}
                    color={isCompleted ? "white" : Colors[colorScheme]?.text}
                  />
                </View>
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color: isCurrent
                        ? getStatusColor(order?.order_status)
                        : Colors[colorScheme]?.text,
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
                          ? getStatusColor(order?.records[0]?.order_status)
                          : Colors[colorScheme]?.border,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View> */}

        {/* Order Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Status</Text>
            <Text
              style={{
                backgroundColor: getStatusColor(
                  order?.records[0]?.order_status
                ),
                color: "white",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              {order?.records[0]?.order_status === OrderStatus.Pending
                ? "Pending"
                : order?.records[0]?.order_status === OrderStatus.Confirmed
                ? "Confirmed"
                : order?.records[0]?.order_status === OrderStatus.Processing
                ? "Processing"
                : order?.records[0]?.order_status === OrderStatus.PickedUp
                ? "Picked Up"
                : order?.records[0]?.order_status === OrderStatus.InTransit
                ? "In Transit"
                : order?.records[0]?.order_status === OrderStatus.Delivered
                ? "Delivered"
                : order?.records[0]?.order_status === OrderStatus.Cancelled
                ? "Cancelled"
                : order?.records[0]?.order_status === OrderStatus.Refunded
                ? "Refunded"
                : order?.records[0]?.order_status ===
                    OrderStatus.ReturnedToVendor ||
                  order?.records[0]?.order_status === OrderStatus.Returned
                ? "Returned"
                : "Pending"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>#{order?.records[0]?.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Name</Text>
            <Text style={styles.infoValue}>{order?.records[0]?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rider</Text>
            <Text style={styles.infoValue}>
              {order?.records[0]?.app_rider_id || "Not Assigned"}
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
            <Text style={styles.infoLabel}>Amount Paid</Text>
            <Text style={styles.infoValue}>
              Rs. {order?.records[0]?.amount_paid}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        {order?.records[0]?.order_line &&
          order?.records[0]?.order_line.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              {order?.records[0]?.order_line.map((item: any, index: number) => (
                <View key={item.id || index} style={styles.itemContainer}>
                  <View style={styles.itemImageContainer}>
                    {item?.product_image_url ? (
                      <Image
                        source={getImageSource(item?.product_image_url)}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.itemImagePlaceholder}>
                        <Ionicons
                          name="image-outline"
                          size={24}
                          color={Colors[colorScheme].text_secondary}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item?.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      Rs. {item?.price_unit} x {item?.product_uom_qty}
                    </Text>
                    <Text style={styles.itemTotal}>
                      Total: Rs. {item?.price_total}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

        {/* Delivery Address */}
        {order?.records[0]?.partner_shipping_id && (
          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressContent}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors[colorScheme].primary_color}
              />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressName}>
                  {order?.records[0]?.partner_shipping_id?.name}
                </Text>
                <Text style={styles.addressText}>
                  {order?.records[0]?.partner_shipping_id?.street}
                </Text>
                {order?.records[0]?.partner_shipping_id?.street2 && (
                  <Text style={styles.addressText}>
                    {order?.records[0]?.partner_shipping_id?.street2}
                  </Text>
                )}
                <Text style={styles.addressText}>
                  {order?.records[0]?.partner_shipping_id?.city},{" "}
                  {order?.records[0]?.partner_shipping_id?.zip}
                </Text>
                {order?.records[0]?.partner_shipping_id?.country && (
                  <Text style={styles.addressText}>
                    {order?.records[0]?.partner_shipping_id?.country}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Real-time Rider Tracking */}
        {order?.records[0]?.app_rider_id && (
          // order?.records[0]?.order_status === OrderStatus.InTransit &&
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Delivery and Rider Location</Text>
            <View style={styles.riderInfoContainer}>
              <View style={styles.riderInfo}>
                <Ionicons
                  name="bicycle"
                  size={20}
                  color={Colors[colorScheme].primary_color}
                />
                <Text style={styles.riderName}>
                  {order?.records[0]?.app_rider_id || "Rider"}
                </Text>
                <View
                  style={[
                    styles.trackingStatus,
                    {
                      backgroundColor: socketConnected
                        ? Colors[colorScheme].success
                        : Colors[colorScheme].error,
                    },
                  ]}
                >
                  <Text style={styles.trackingStatusText}>
                    {socketConnected ? "Live" : "Offline"}
                  </Text>
                </View>
              </View>
            </View>
            <RiderTrackingMap
              riderLocation={
                riderLocation
                  ? {
                      latitude: riderLocation?.latitude,
                      longitude: riderLocation?.longitude,
                    }
                  : {
                      latitude: riderLastLocation?.latitude || 0,
                      longitude: riderLastLocation?.longitude || 0,
                    }
              }
              deliveryLocation={{
                latitude:
                  order?.records[0]?.partner_shipping_id?.partner_latitude ||
                  23.723081,
                longitude:
                  order?.records[0]?.partner_shipping_id?.partner_longitude ||
                  90.4087,
              }}
              riderName={order?.records[0]?.app_rider_id || "Rider"}
              isConnected={socketConnected}
              height={250}
            />
            {!socketConnected && (
              <View style={styles.offlineMessage}>
                <Ionicons
                  name="wifi-outline"
                  size={16}
                  color={Colors[colorScheme].text_secondary}
                />
                <Text style={styles.offlineMessageText}>
                  Rider tracking is currently offline
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {order?.records[0]?.order_status === OrderStatus.Pending && (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                // Handle cancel order
                updateOrderStatus({
                  orderId: order?.records[0]?.id,
                  status: OrderStatus.Cancelled,
                });
              }}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Cancelling..." : "Cancel Order"}
              </Text>
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
    itemsContainer: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      margin: 15,
    },
    itemContainer: {
      flexDirection: "row",
      marginBottom: 15,
      backgroundColor: "transparent",
    },
    itemImageContainer: {
      width: 60,
      height: 60,
      borderRadius: 8,
      overflow: "hidden",
      marginRight: 12,
    },
    itemImage: {
      width: "100%",
      height: "100%",
    },
    itemImagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: Colors[theme].border,
      justifyContent: "center",
      alignItems: "center",
    },
    itemDetails: {
      flex: 1,
      backgroundColor: "transparent",
    },
    itemName: {
      fontSize: 14,
      fontWeight: "500",
      color: Colors[theme].text,
      marginBottom: 4,
    },
    itemPrice: {
      fontSize: 12,
      color: Colors[theme].text_secondary,
      marginBottom: 2,
    },
    itemTotal: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors[theme].primary_color,
    },
    addressContainer: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      margin: 15,
    },
    addressContent: {
      flexDirection: "row",
      backgroundColor: "transparent",
    },
    addressTextContainer: {
      flex: 1,
      marginLeft: 10,
      backgroundColor: "transparent",
    },
    addressName: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors[theme].text,
      marginBottom: 4,
    },
    addressText: {
      fontSize: 12,
      color: Colors[theme].text_secondary,
      marginBottom: 2,
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
    riderInfoContainer: {
      marginBottom: 10,
      backgroundColor: "transparent",
    },
    riderInfo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    riderName: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
      flex: 1,
    },
    trackingStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    trackingStatusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    offlineMessage: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      backgroundColor: "transparent",
    },
    offlineMessageText: {
      marginLeft: 6,
      fontSize: 12,
      color: Colors[theme].text_secondary,
    },
  });

export default OrderDetails;
