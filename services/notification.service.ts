import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import apiClient from "@/config/apiClient";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: "default" | "normal" | "high";
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return false;
      }

      return true;
    } else {
      console.log("Must use physical device for Push Notifications");
      return false;
    }
  }

  /**
   * Get the Expo push token
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const token = await Notifications.getExpoPushTokenAsync({
        // projectId: process.env.EXPO_PROJECT_ID, // You'll need to set this
        projectId: "da149288-c370-43e4-bbc9-5216690dbaf2",
      });

      this.expoPushToken = token.data;
      return token.data;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }

  /**
   * Register the push token with your backend
   */
  async registerPushToken(riderId: string, token: string): Promise<boolean> {
    try {
      console.log("registerPushToken", riderId, token);
      const response = await apiClient.post("/notifications/register-token", {
        userId: riderId,
        pushToken: token,
        platform: Platform.OS,
        deviceId: Device.deviceName || "unknown",
      });
      return true;
    } catch (error) {
      console.error("Error registering push token:", error);
      return false;
    }
  }

  /**
   * Unregister the push token from your backend
   */
  async unregisterPushToken(riderId: string, token: string): Promise<boolean> {
    try {
      console.log("unregisterPushToken", riderId, token);
      const response = await apiClient.delete(
        "/notifications/unregister-token",
        {
          data: {
            userId: riderId,
            pushToken: token,
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error("Error unregistering push token:", error);
      return false;
    }
  }

  /**
   * Send a local notification
   */
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound !== false,
        priority: notification.priority || "default",
      },
      trigger: null, // Send immediately
    });
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound !== false,
        priority: notification.priority || "default",
      },
      trigger,
    });
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Set notification channel for Android
   */
  async setNotificationChannel(): Promise<void> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add notification response received listener
   */
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Get the current push token
   */
  getCurrentPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Initialize notification service
   */
  async initialize(userId?: string): Promise<string | null> {
    await this.setNotificationChannel();
    const token = await this.getExpoPushToken();

    if (token && userId) {
      await this.registerPushToken(userId, token);
    }

    return token;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
