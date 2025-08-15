import { useEffect, useCallback, useMemo } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import i18n from "@/i18n";
import { useLocationStore } from "@/store/location.store";

export const useLocation = () => {
  const {
    updateLocationState,
    address,
    loading,
    location,
    locationGranted,
    locationServicesEnabled,
  } = useLocationStore();
  const router = useRouter();

  // Open settings function, memoized to prevent re-creation
  const openSettings = useCallback(() => {
    Alert.alert(
      "Location Permission",
      "Please enable location services to continue",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            Toast.show({
              type: "error",
              text1: "Location permission denied",
            });
            router.push("/");
          },
        },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]
    );
  }, [router]);

  // Request location permission, memoized to prevent re-creation
  const requestLocationPermission = useCallback(async () => {
    try {
      // setLoading(true); // Start loading when refetching
      updateLocationState("loading", true);
      // Check if location services are enabled on the device
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      updateLocationState("locationServicesEnabled", servicesEnabled);

      if (!servicesEnabled) {
        Toast.show({
          type: "error",
          text1: "Location Permission Required",
          text2: "Please enable location services to continue",
        });
        openSettings();
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        openSettings(); // Navigate to settings
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      updateLocationState("location", currentLocation);
      updateLocationState("locationGranted", true);

      // Perform reverse geocoding to get the address information
      const geocodedAddress = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocodedAddress.length > 0) {
        updateLocationState("address", geocodedAddress[0]);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Location error",
      });
    } finally {
      updateLocationState("loading", false);
    }
  }, [openSettings]);

  // Run location request on mount or when refetch is triggered
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Memoize the values returned to avoid unnecessary re-renders
  const locationData = useMemo(
    () => ({
      location,
      address,
      locationGranted,
      locationServicesEnabled,
      loading,
      refetch: requestLocationPermission, // Expose refetch handler
    }),
    [
      location,
      address,
      locationGranted,
      locationServicesEnabled,
      loading,
      requestLocationPermission,
    ]
  );

  const getCoordinates = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    const geocodedAddress = await Location.reverseGeocodeAsync({
      latitude: currentLocation?.coords?.latitude,
      longitude: currentLocation?.coords?.longitude,
    });

    return { currentLocation, geocodedAddress };
  };

  return { locationData, getCoordinates };
};
