import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  notificationService,
  NotificationData,
} from "@/services/notification.service";
import { useAuthStore } from "@/store/auth.store";

export const useNotifications = () => {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const { odooUserAuth, expoPushToken, setExpoPushToken } = useAuthStore();
  useEffect(() => {
    if (expoPushToken === null) {
      const initializeNotifications = async () => {
        if (odooUserAuth?.id) {
          const token: any = await notificationService.initialize(
            odooUserAuth.id.toString()
          );
          console.log(typeof token, "token created  ");
          setExpoPushToken(token);
        }
      };

      initializeNotifications();

      // Set up notification listeners
      notificationListener.current =
        notificationService.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        notificationService.addNotificationResponseReceivedListener(
          (response) => {
            console.log("Notification response: ", response);
            // Handle notification tap here
            handleNotificationResponse(response);
          }
        );
      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        }
      };
    }
  }, [odooUserAuth?.id, expoPushToken]);

  const handleNotificationResponse = (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data;

    // Handle different notification types
    if (data?.type === "order") {
      // Navigate to order details
      // You can use router.push here if needed
      console.log("Order notification  tapped   :", data.orderId);
    } else if (data?.type === "payment") {
      // Navigate to payment screen
      console.log("Payment notification tapped:", data.paymentId);
    }
  };

  const sendLocalNotification = async (notification: NotificationData) => {
    await notificationService.sendLocalNotification(notification);
  };

  const scheduleNotification = async (
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ) => {
    return await notificationService.scheduleLocalNotification(
      notification,
      trigger
    );
  };

  const registerToken = async () => {
    if (odooUserAuth?.id && expoPushToken) {
      console.log("sending token");
      const response = await notificationService.registerPushToken(
        odooUserAuth.id.toString(),
        expoPushToken
      );
      console.log(response, "response ");
      return true;
    }
    return false;
  };

  const unregisterToken = async () => {
    if (odooUserAuth?.id && expoPushToken) {
      setExpoPushToken(null);
      return await notificationService.unregisterPushToken(
        odooUserAuth.id.toString(),
        expoPushToken
      );
    }
    return false;
  };

  const cancelAllNotifications = async () => {
    await notificationService.cancelAllScheduledNotifications();
  };

  const getScheduledNotifications = async () => {
    return await notificationService.getScheduledNotifications();
  };

  return {
    expoPushToken,
    notification,
    sendLocalNotification,
    scheduleNotification,
    registerToken,
    unregisterToken,
    cancelAllNotifications,
    getScheduledNotifications,
  };
};
