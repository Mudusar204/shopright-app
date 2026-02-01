import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  Modal,
  Pressable,
} from "react-native";

import {
  showUpdatePopup,
  getUpdateInfo,
  startFlexibleUpdateWithProgress,
  subscribeToUpdateProgress,
} from "react-native-rn-in-app-update";

import DeviceInfo from "react-native-device-info";

const IOS_BUNDLE_ID = "com.shopright.club";
// App Store URL - will be extracted from API response, fallback to known URL
const IOS_APPSTORE_URL_FALLBACK =
  "https://apps.apple.com/pk/app/shopright-club/id6751136785";
const ANDROID_PLAYSTORE_URL_FALLBACK =
  "https://play.google.com/store/apps/details?id=com.shopright.club";

type Props = {
  /**
   * Called when no update is available (or update check fails),
   * so the parent can hide this UI.
   */
  onContinue?: () => void;
  /**
   * If true, user can't dismiss the prompt when update is available.
   */
  force?: boolean;
};

const InAppUpdateScreen = ({ onContinue, force = false }: Props) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateType, setUpdateType] = useState<"immediate" | "flexible" | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const [checked, setChecked] = useState(false);
  const [appStoreUrl, setAppStoreUrl] = useState(IOS_APPSTORE_URL_FALLBACK);

  /**
   * ======================
   * ANDROID UPDATE CHECK
   * ======================
   */
  const checkAndroidUpdate = async () => {
    try {
      const info = await getUpdateInfo();

      if (info?.updateAvailability) {
        setUpdateAvailable(true);

        if (info.immediateAllowed) {
          setUpdateType("immediate");
        } else if (info.flexibleAllowed) {
          setUpdateType("flexible");
        }
      } else {
        setUpdateAvailable(false);
      }
    } catch (e) {
      console.log("Android update check error:", e);
      setUpdateAvailable(false);
    }
  };

  /**
   * ======================
   * IOS UPDATE CHECK
   * ======================
   */
  const checkIosUpdate = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();

      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}&country=PK`
      );
      const json = await res.json();

      if (json?.resultCount === 1) {
        const appInfo = json.results[0];
        const storeVersion = appInfo.version;

        // Extract App Store URL from response, fallback to known URL
        const trackViewUrl = appInfo.trackViewUrl || IOS_APPSTORE_URL_FALLBACK;
        setAppStoreUrl(trackViewUrl);

        if (isVersionGreater(storeVersion, currentVersion)) {
          setUpdateAvailable(true);
          return;
        }
      }
      setUpdateAvailable(false);
    } catch (e) {
      console.log("iOS update check error:", e);
      setUpdateAvailable(false);
    }
  };

  /**
   * ======================
   * VERSION COMPARE
   * ======================
   */
  const isVersionGreater = (store: string, current: string) => {
    const s = store.split(".").map(Number);
    const c = current.split(".").map(Number);

    for (let i = 0; i < Math.max(s.length, c.length); i++) {
      if ((s[i] || 0) > (c[i] || 0)) return true;
      if ((s[i] || 0) < (c[i] || 0)) return false;
    }
    return false;
  };

  /**
   * ======================
   * START UPDATE
   * ======================
   */
  const startUpdate = () => {
    if (Platform.OS === "android") {
      // if (updateType === "immediate") {
      //   showUpdatePopup("immediate");
      // } else {
      //   startFlexibleUpdateWithProgress();
      // }
      Linking.openURL(ANDROID_PLAYSTORE_URL_FALLBACK);
    } else {
      Linking.openURL(appStoreUrl);

      // Alert.alert(
      //   "Update Available",
      //   "A new version is available on the App Store",
      //   [
      //     {
      //       text: "Update",
      //       onPress: () => Linking.openURL(appStoreUrl),
      //     },
      //   ],
      //   { cancelable: false }
      // );
    }
  };

  /**
   * ======================
   * FLEXIBLE UPDATE PROGRESS
   * ======================
   */
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const unsubscribe = subscribeToUpdateProgress(
      ({ bytesDownloaded, totalBytesToDownload }) => {
        if (totalBytesToDownload > 0) {
          const percent = (bytesDownloaded / totalBytesToDownload) * 100;
          setProgress(Math.floor(percent));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * ======================
   * INIT
   * ======================
   */
  useEffect(() => {
    if (Platform.OS === "android") {
      checkAndroidUpdate().finally(() => setChecked(true));
    } else {
      checkIosUpdate().finally(() => setChecked(true));
    }
  }, []);

  // If we've checked and there's no update, let parent continue and render nothing.
  useEffect(() => {
    if (!checked) return;
    if (!updateAvailable) onContinue?.();
  }, [checked, updateAvailable, onContinue]);

  const canDismiss = useMemo(() => !force, [force]);

  if (!checked) return null;
  if (!updateAvailable) return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Update available</Text>
          <Text style={styles.text}>
            A newer version of ShopRight is available. Please update to
            continue.
          </Text>

          {Platform.OS === "android" && updateType && (
            <Text style={styles.text}>Update type: {updateType}</Text>
          )}

          {Platform.OS === "android" &&
            updateType === "flexible" &&
            progress > 0 && (
              <Text style={styles.progress}>Downloading: {progress}%</Text>
            )}

          <View style={styles.actions}>
            {canDismiss && (
              <Pressable
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={onContinue}
              >
                <Text style={styles.secondaryText}>Later</Text>
              </Pressable>
            )}
            <View style={styles.primaryButton}>
              <Button title="Update now" onPress={startUpdate} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InAppUpdateScreen;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  progress: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  actions: {
    marginTop: 6,
    gap: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#f1f3f5",
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  primaryButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
});
