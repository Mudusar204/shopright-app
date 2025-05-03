import { useEffect, useCallback, useMemo } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import i18n from '@/i18n';
import { useLocationStore } from '@/store/location.store';

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
      i18n.t('location.permission_required'),
      i18n.t('location.please_enable_location'),
      [
        {
          text: i18n.t('actions.cancel'),
          style: 'cancel',
          onPress: () => {
            Toast.show({
              type: 'error',
              text1: i18n.t('location.permission_denied'),
            });
            router.push('/');
          },
        },
        {
          text: i18n.t('actions.open_settings'),
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
      updateLocationState('loading', true);
      // Check if location services are enabled on the device
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      updateLocationState('locationServicesEnabled', servicesEnabled);

      if (!servicesEnabled) {
        Toast.show({
          type: 'error',
          text1: i18n.t('location.permission_required'),
          text2: i18n.t('location.please_enable_location'),
        });
        openSettings();
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        openSettings(); // Navigate to settings
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      updateLocationState('location', currentLocation);
      updateLocationState('locationGranted', true);

      // Perform reverse geocoding to get the address information
      const geocodedAddress = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocodedAddress.length > 0) {
        updateLocationState('address', geocodedAddress[0]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('alert.error'),
        text2: i18n.t('location.error'),
      });
    } finally {
      updateLocationState('loading', false);
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
