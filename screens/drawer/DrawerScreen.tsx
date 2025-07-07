import React from "react";
import { Text, View } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/i18n";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Platform, Pressable, StyleSheet, Switch } from "react-native";
import { router } from "expo-router";
import { useLocationStore } from "@/store/location.store";
import MenuHandler from "@/components/MenuHandler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import LocationIcon from "@/assets/images/svgs/Location";
import BrightnessIcon from "@/assets/images/svgs/Brightness";
import InfoIcon from "@/assets/images/svgs/Info";
import LockIcon from "@/assets/images/svgs/Lock";
import BagIcon from "@/assets/images/svgs/Bag";
import HeartIcon from "@/assets/images/svgs/Heart";
import UserSettingIcon from "@/assets/images/svgs/UserSettings";
import LogoutIcon from "@/assets/images/svgs/Logout";
import { useThemStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { useMyCartStore } from "@/store/myCart.store";
const TitleWithImage = ({
  Icon,
  title,
  titleStyle,
  onPress,
}: {
  Icon: any;
  title: string;
  titleStyle?: any;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.titleContainer}>
        {Icon}
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const DrawerScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useThemStore((state: any) => state.theme);
  const toggleTheme = useThemStore((state: any) => state.toggleTheme);
  // const { address } = useLocationStore();
  const colorTheme = useColorScheme() as "light" | "dark";
  const { setIsLoggedIn, odooUserAuth, clear } = useAuthStore();
  const { cartItems, clearCart } = useMyCartStore();
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 20,
        },
      ]}
    >
      <View style={[styles.menuContainer]}>
        <View style={styles.menuHandlerContainer}>
          <MenuHandler />
        </View>
        <Pressable>
          <View style={styles.profileContainer}>
            <Image
              source={require("@/assets/images/profileImg.png")}
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileNameText}>
                {odooUserAuth?.login || "John Doe"}
              </Text>
              <View style={[styles.locationRow]}>
                <LocationIcon color={Colors[colorTheme].primary_color} />
                <Text
                  style={[
                    styles.profileLocationText,
                    { color: Colors[colorTheme].primary_color },
                  ]}
                >
                  Faisalabad, Pakistan
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.darkModeContainer}>
          <TitleWithImage
            Icon={<BrightnessIcon color={Colors[colorTheme].icon_color} />}
            title="Dark Mode"
            onPress={() => {
              // router.push('/(auth)/radar/Radar'),
              //  navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />

          <Switch
            value={theme === "dark"}
            onValueChange={() =>
              toggleTheme(theme === "dark" ? "light" : "dark")
            }
            style={{ marginTop: 30 }}
          />
        </View>
        <TitleWithImage
          Icon={<InfoIcon color={Colors[colorTheme].icon_color} />}
          title="Account Information"
          onPress={() => {}}
        />
        <TitleWithImage
          Icon={<LockIcon color={Colors[colorTheme].icon_color} />}
          title="Password"
          onPress={() => {
            router.push("/(public)/newPassword");
          }}
        />
        <TitleWithImage
          Icon={<BagIcon color={Colors[colorTheme].icon_color} />}
          title="My Orders"
          onPress={() => {}}
        />
        <TitleWithImage
          Icon={<HeartIcon color={Colors[colorTheme].icon_color} />}
          title="Wishlist"
          onPress={() => {}}
        />
        <TitleWithImage
          Icon={<UserSettingIcon color={Colors[colorTheme].icon_color} />}
          title="Settings"
          onPress={() => {
            router.push("/(auth)/settings");
          }}
        />
        <TitleWithImage
          Icon={<InfoIcon color={Colors[colorTheme].icon_color} />}
          title="FAQs"
          onPress={() => {}}
        />
        <View style={{}}>
          <TitleWithImage
            Icon={<LogoutIcon color="#FF5757" />}
            title="Logout"
            titleStyle={{ color: "#FF5757" }}
            onPress={() => {
              clear();
              clearCart();
              router.push("/login");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },

  menuHandlerContainer: {
    transform: [{ rotate: "90deg" }],
    backgroundColor: "transparent",
    overflow: "visible",
    alignSelf: "flex-start",
  },

  menuContainer: {
    marginBottom: 200,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  profileTextContainer: {
    marginLeft: 5,
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  profileLocationText: {
    fontSize: 10,
    fontWeight: "400",
  },
  darkModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
    backgroundColor: "transparent",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "400",
  },
});

export default DrawerScreen;
