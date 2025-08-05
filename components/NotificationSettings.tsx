import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/auth.store";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import notificationService from "@/services/notification.service";

interface NotificationSettingsProps {
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onClose,
}) => {
  const colorTheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorTheme);
  const { expoPushToken, registerToken, unregisterToken } = useNotifications();
  const odooUserAuth = useAuthStore.getState().odooUserAuth;

  const [settings, setSettings] = useState({
    orderNotifications: true,
    paymentNotifications: true,
    promotionalNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegisterToken = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Push token not available ");
      return;
    }

    try {
      const success = await registerToken();
      console.log(success, "final response");
      if (success) {
        Alert.alert("Success", "Notifications enabled successfully");
      } else {
        Alert.alert("Error", "Failed to enable notifications");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to enable notifications");
    }
  };

  const getPushToken = async () => {
    const token = await notificationService.getExpoPushToken();
    console.log("token", token);
  };

  const handleUnregisterToken = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Push token not available");
      return;
    }

    try {
      const success = await unregisterToken();
      if (success) {
        Alert.alert("Success", "Notifications disabled successfully");
      } else {
        Alert.alert("Error", "Failed to disable notifications");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to disable notifications");
    }
  };

  const renderSettingItem = (
    title: string,
    description: string,
    key: keyof typeof settings,
    value: boolean
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(newValue) => handleSettingChange(key, newValue)}
        trackColor={{
          false: Colors[colorTheme].border,
          true: Colors[colorTheme].primary_color,
        }}
        thumbColor={
          value ? Colors[colorTheme].text_white : Colors[colorTheme].text
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Token</Text>
              <Text style={styles.settingDescription}>
                {expoPushToken ? "Token registered" : "Token not available"}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.enableButton]}
              onPress={handleRegisterToken}
            >
              <Text style={styles.buttonText}>Enable Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.enableButton]}
              onPress={getPushToken}
            >
              <Text style={styles.buttonText}>Get Push Token</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.disableButton]}
              onPress={handleUnregisterToken}
            >
              <Text style={styles.buttonText}>Disable Notifications</Text>
            </TouchableOpacity>
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
    },
    buttonContainer: {
      marginTop: 16,
      gap: 12,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    enableButton: {
      backgroundColor: Colors[colorTheme].primary_color,
    },
    disableButton: {
      backgroundColor: "#FF3B30",
    },
    buttonText: {
      color: Colors[colorTheme].text_white,
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default NotificationSettings;
