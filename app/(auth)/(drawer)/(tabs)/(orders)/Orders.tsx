import {
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button, View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { useGetMyOrders } from "@/hooks/queries/orders/orders.query";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { OrderStatus } from "@/constants/enums";
import { socketService } from "@/services/socket.service";

const Orders = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const {
    data: myOrders,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyOrders();
  console.log("myOrders", myOrders?.records?.length);
  useEffect(() => {
    const handleOrderUpdate = (payload: any) => {
      console.log("Order status updated:", payload);
      refetch(); // Refresh order list
    };

    socketService.on("order-status-update", handleOrderUpdate);
    socketService.on("new-order", handleOrderUpdate);

    return () => {
      socketService?.off("order-status-update", handleOrderUpdate);
      socketService?.off("new-order", handleOrderUpdate);
    };
  }, []);

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
      case OrderStatus.Returned:
        return Colors[colorScheme].warning;
      case OrderStatus.ReturnedToVendor:
        return Colors[colorScheme].warning;
      case OrderStatus.Refunded:
        return Colors[colorScheme].error;
      default:
        return Colors[colorScheme].warning;
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.orderCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(orders)/order-details",
          params: { orderId: item.id },
        })
      }
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{item?.id}</Text>
          <Text style={styles.orderDate}>
            {format(
              new Date(
                new Date(item?.date_order).getTime() + 5 * 60 * 60 * 1000
              ),
              "MMM dd, yyyy hh:mm a"
            )}
            {/* {format(new Date(item?.date_order), "MMM dd, yyyy hh:mm a")} */}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item?.order_status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item?.order_status === OrderStatus.Pending
              ? "Pending"
              : item?.order_status === OrderStatus.Confirmed
              ? "Confirmed"
              : item?.order_status === OrderStatus.Processing
              ? "Processing"
              : item?.order_status === OrderStatus.PickedUp
              ? "Picked Up"
              : item?.order_status === OrderStatus.InTransit
              ? "In Transit"
              : item?.order_status === OrderStatus.Delivered
              ? "Delivered"
              : item?.order_status === OrderStatus.Cancelled
              ? "Cancelled"
              : item?.order_status === OrderStatus.Refunded
              ? "Refunded"
              : item?.order_status === OrderStatus.ReturnedToVendor ||
                item?.order_status === OrderStatus.Returned
              ? "Returned"
              : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons
            name="cube-outline"
            size={20}
            color={Colors[colorScheme].text}
          />
          <Text style={styles.detailText}>
            {item?.order_line?.length} items
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="cash-outline"
            size={20}
            color={Colors[colorScheme].text}
          />
          <Text style={styles.detailText}>Rs. {item?.amount_total}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors[colorScheme].text}
          />
          <Text style={styles.detailText} numberOfLines={1}>
            {item?.partner_shipping_id?.street +
              " " +
              item?.partner_shipping_id?.street2 +
              " " +
              item?.partner_shipping_id?.city +
              " " +
              item?.partner_shipping_id?.country}
          </Text>
        </View>
      </View>

      {item.order_status === false && (
        <Button
          variant="outline"
          size="small"
          title="Cancel Order"
          onPress={() => {
            // Handle cancel order
          }}
          style={styles.cancelButton}
        />
      )}
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="My Orders" />
        </View>
        <View style={styles.body}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme].primary_color}
          />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="My Orders" />
        </View>
        <View style={styles.body}>
          <Text>Error loading orders</Text>
        </View>
      </View>
    );
  }

  if (!myOrders?.records || myOrders?.records?.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="My Orders" />
        </View>
        <View style={styles.body}>
          <Text style={{ marginBottom: 10 }}>
            Let's create your first order!
          </Text>
          <Button
            variant="primary"
            size="large"
            title="Start Shopping"
            onPress={() => {
              router.push("/(auth)/(tabs)");
            }}
          />
          <Button
            variant="primary"
            size="large"
            title="Refresh"
            onPress={() => {
              refetch();
            }}
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="My Orders" />
      </View>
      <FlatList
        data={myOrders?.records}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {
          refetch();
        }}
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
    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    listContainer: {
      padding: 15,
    },
    orderCard: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      backgroundColor: "transparent",
    },
    orderInfo: {
      flex: 1,
      backgroundColor: "transparent",
    },
    orderId: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[theme].text,
    },
    orderDate: {
      fontSize: 12,
      color: Colors[theme].text_secondary,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
    },
    statusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    orderDetails: {
      marginTop: 10,
      backgroundColor: "transparent",
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: "transparent",
    },
    detailText: {
      marginLeft: 8,
      color: Colors[theme].text,
      flex: 1,
    },
    cancelButton: {
      marginTop: 10,
    },
  });

export default Orders;
