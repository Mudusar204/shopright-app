import { StyleSheet, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import Header from "@/components/Header";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Button, View, Text } from "@/components/Themed";
import { router } from "expo-router";
import { useGetMyOrders } from "@/hooks/queries/orders/orders.query";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

const Orders = () => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const { data: myOrders, isLoading, isError } = useGetMyOrders();

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
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {format(new Date(item.createdAt), "MMM dd, yyyy")}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.orderStatus) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.orderStatus.toUpperCase()}
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
          <Text style={styles.detailText}>{item.itemsCount} items</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="cash-outline"
            size={20}
            color={Colors[colorScheme].text}
          />
          <Text style={styles.detailText}>Rs. {item.totalAmount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors[colorScheme].text}
          />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.pickupAddress}
          </Text>
        </View>
      </View>

      {item.orderStatus === "pending" && (
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
          <Text>Loading orders...</Text>
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

  if (!myOrders || myOrders.length === 0) {
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
        data={myOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    },
    orderInfo: {
      flex: 1,
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
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
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
