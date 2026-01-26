import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/auth.store";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import notificationService from "@/services/notification.service";
import Header from "./Header";

interface NotificationSettingsProps {
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onClose,
}) => {
  const colorTheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorTheme);
  const { registerToken, unregisterToken } = useNotifications();
  const { odooUserAuth, expoPushToken, setExpoPushToken } = useAuthStore();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize: Check if token exists to determine enabled state
  useEffect(() => {
    const initializeToken = async () => {
      try {
        // If token exists, assume notifications are enabled
        // If no token, notifications are disabled
        setIsEnabled(!!expoPushToken);
      } catch (error) {
        console.error("Error initializing token:", error);
        setIsEnabled(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeToken();
  }, [expoPushToken]);

  const handleToggle = async (value: boolean) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (value) {
        // Enable notifications
        let token = expoPushToken;

        // Get token if it doesn't exist
        if (!token) {
          token = await notificationService.getExpoPushToken();
          if (token) {
            setExpoPushToken(token);
          } else {
            Alert.alert(
              "Permission Required",
              "Please allow notifications in your device settings to enable this feature."
            );
            setIsLoading(false);
            return;
          }
        }

        // Register token
        const success = await registerToken();
        if (success) {
          setIsEnabled(true);
          Alert.alert("Success", "Notifications enabled successfully");
        } else {
          Alert.alert(
            "Error",
            "Failed to enable notifications. Please try again."
          );
          setIsEnabled(false);
        }
      } else {
        // Disable notifications
        if (!expoPushToken) {
          setIsEnabled(false);
          setIsLoading(false);
          return;
        }

        const success = await unregisterToken();
        if (success) {
          // unregisterToken sets expoPushToken to null, so state will update via useEffect
          setIsEnabled(false);
          Alert.alert("Success", "Notifications disabled successfully");
        } else {
          Alert.alert(
            "Error",
            "Failed to disable notifications. Please try again."
          );
          setIsEnabled(true);
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsEnabled(!value); // Revert to previous state
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <Header title={"Notification Settings"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors[colorTheme].primary_color}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={"Notification Settings"} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                {isEnabled
                  ? "Receive notifications about your orders and updates"
                  : "Enable to receive notifications about your orders and updates"}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors[colorTheme].primary_color}
              />
            ) : (
              <Switch
                value={isEnabled}
                onValueChange={handleToggle}
                disabled={isLoading}
                trackColor={{
                  false: Colors[colorTheme].border,
                  true: Colors[colorTheme].primary_color,
                }}
                thumbColor={
                  isEnabled
                    ? Colors[colorTheme].text_white
                    : Colors[colorTheme].text
                }
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Status: {isEnabled ? "Enabled" : "Disabled"}
            </Text>
            {!expoPushToken && !isEnabled && (
              <Text style={[styles.infoText, { marginTop: 4 }]}>
                Tap the switch above to enable notifications
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorTheme].background,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorTheme].border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors[colorTheme].text,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 18,
      color: Colors[colorTheme].text,
    },
    content: {
      flex: 1,
    },
    section: {
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors[colorTheme].text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorTheme].border,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      color: Colors[colorTheme].text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: Colors[colorTheme].text_secondary,
      marginTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: Colors[colorTheme].text_secondary,
    },
    infoContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: Colors[colorTheme].background_light,
      borderRadius: 8,
    },
    infoText: {
      fontSize: 14,
      color: Colors[colorTheme].text_secondary,
    },
  });

export default NotificationSettings;
