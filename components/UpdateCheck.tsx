import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  Linking,
  Modal,
  Pressable,
} from "react-native";

import DeviceInfo from "react-native-device-info";

const IOS_BUNDLE_ID = "com.shopright.club";
const IOS_APPSTORE_URL_FALLBACK =
  "https://apps.apple.com/pk/app/shopright-club/id6751136785";
const ANDROID_PLAYSTORE_URL_FALLBACK =
  "https://play.google.com/store/apps/details?id=com.shopright.club";

const ANDROID_CHECK_API_BASE = "https://api.shopright.club/admin/check";

type UpdateCheckResponse = {
  updateRequired: boolean;
  forceUpdate: boolean;
  latestVersion: string;
  message: string;
  storeUrl: string;
};

type Props = {
  onContinue?: () => void;
  force?: boolean;
};

const InAppUpdateScreen = ({ onContinue, force = false }: Props) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [checked, setChecked] = useState(false);
  const [appStoreUrl, setAppStoreUrl] = useState(IOS_APPSTORE_URL_FALLBACK);
  const [androidStoreUrl, setAndroidStoreUrl] = useState(
    ANDROID_PLAYSTORE_URL_FALLBACK
  );
  const [forceUpdateFromApi, setForceUpdateFromApi] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(
    "A newer version of ShopRight is available. Please update to continue."
  );

  /**
   * ======================
   * ANDROID UPDATE CHECK (Backend API)
   * ======================
   */
  const checkAndroidUpdate = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      console.log("currentVersion", currentVersion);
      const url = `${ANDROID_CHECK_API_BASE}?platform=android&version=${encodeURIComponent(
        currentVersion
      )}`;
      const res = await fetch(url);

      const data: UpdateCheckResponse = await res.json();

      if (data?.updateRequired) {
        setUpdateAvailable(true);
        setForceUpdateFromApi(Boolean(data.forceUpdate));
        // setAndroidStoreUrl(ANDROID_PLAYSTORE_URL_FALLBACK);
        // if (data.message?.trim()) setUpdateMessage(data.message.trim());
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
   * IOS UPDATE CHECK (existing flow – iTunes)
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

  const isVersionGreater = (store: string, current: string) => {
    const s = store.split(".").map(Number);
    const c = current.split(".").map(Number);

    for (let i = 0; i < Math.max(s.length, c.length); i++) {
      if ((s[i] || 0) > (c[i] || 0)) return true;
      if ((s[i] || 0) < (c[i] || 0)) return false;
    }
    return false;
  };

  const startUpdate = () => {
    if (Platform.OS === "android") {
      Linking.openURL(androidStoreUrl);
    } else {
      Linking.openURL(appStoreUrl);
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      checkAndroidUpdate().finally(() => setChecked(true));
    } else {
      checkIosUpdate().finally(() => setChecked(true));
    }
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!updateAvailable) onContinue?.();
  }, [checked, updateAvailable, onContinue]);

  const canDismiss = useMemo(
    () => !force && !forceUpdateFromApi,
    [force, forceUpdateFromApi]
  );

  if (!checked) return null;
  if (!updateAvailable) return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Update available</Text>
          <Text style={styles.text}>
            {updateMessage ??
              "A newer version of ShopRight is available. Please update to continue."}
          </Text>

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
