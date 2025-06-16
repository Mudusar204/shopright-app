import { Stack } from "expo-router";
import React from "react";

const OrdersLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="Orders"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order-details"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default OrdersLayout;
