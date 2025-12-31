import Colors from "@/constants/Colors";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useEffect,
} from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import BottomModal from "../../../components/BottomSheets/BottomSheet";
import { useColorScheme } from "../../../components/useColorScheme";
import { Button, Text, TextInput, View } from "../../../components/Themed";
import { useAddUserAddress } from "@/hooks/mutations/auth/auth.mutation";
import { useGetUserAddresses } from "@/hooks/queries/auth/auth.query";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import LocationMarker from "@/assets/images/svgs/LocationMarker";
import BackHandler from "../../../components/BackHandler";
import Header from "../../../components/Header";
import Toast from "react-native-toast-message";
import { useLocation } from "@/hooks/useLocation";
import MyLocationIcon from "@/assets/images/svgs/MyLocation";
import CustomLocationSearch from "../../../components/CustomLocationSearch";
import * as Location from "expo-location";
import { router } from "expo-router";

// TypeScript interfaces for better type safety
interface AddressDetails {
  street: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zip: number;
  longitude: string;
  latitude: string;
}

interface MapState {
  region: Region;
  isManualMode: boolean;
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
}

interface ValidationErrors {
  [key: string]: string;
}

// Action types for useReducer
type AddressAction =
  | { type: "UPDATE_FIELD"; field: keyof AddressDetails; value: any }
  | { type: "RESET_FORM" }
  | { type: "SET_ADDRESS"; payload: Partial<AddressDetails> };

type MapAction =
  | { type: "UPDATE_REGION"; payload: Region }
  | { type: "SET_MANUAL_MODE"; payload: boolean }
  | {
      type: "SET_SELECTED_LOCATION";
      payload: { latitude: number; longitude: number; address: string } | null;
    }
  | { type: "RESET_MAP" };

// Initial state constants
const INITIAL_ADDRESS_DETAILS: AddressDetails = {
  street: "",
  street2: "",
  city: "",
  state: "",
  country: "",
  zip: 0,
  longitude: "",
  latitude: "",
};

// Faisalabad, Punjab, Pakistan
const INITIAL_REGION: Region = {
  latitude: 31.4181,
  longitude: 73.0791,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Reducer for address details
const addressReducer = (
  state: AddressDetails,
  action: AddressAction
): AddressDetails => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return INITIAL_ADDRESS_DETAILS;
    case "SET_ADDRESS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Reducer for map state
const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "UPDATE_REGION":
      return { ...state, region: action.payload };
    case "SET_MANUAL_MODE":
      return { ...state, isManualMode: action.payload };
    case "SET_SELECTED_LOCATION":
      return { ...state, selectedLocation: action.payload };
    case "RESET_MAP":
      return {
        region: INITIAL_REGION,
        isManualMode: false,
        selectedLocation: null,
      };
    default:
      return state;
  }
};

const AddAddress = ({
  selectedAddress,
  setSelectedAddress,
}: {
  selectedAddress: any;
  setSelectedAddress: (address: any) => void;
}) => {
  const { mutate: addUserAddress, isPending, isSuccess } = useAddUserAddress();
  const { locationData } = useLocation();

  const theme = useColorScheme() as "light" | "dark";
  const screenHeight = Dimensions.get("window").height;
  const style = styles(theme, screenHeight);
  const mapRef = useRef<MapView>(null);

  // Use useReducer for complex state management
  const [addressDetails, addressDispatch] = useReducer(
    addressReducer,
    INITIAL_ADDRESS_DETAILS
  );
  const [mapState, mapDispatch] = useReducer(mapReducer, {
    region: INITIAL_REGION,
    isManualMode: false,
    selectedLocation: null,
  });

  // Separate validation state with debouncing
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isValidating) {
        validateForm();
        setIsValidating(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [addressDetails, isValidating]);

  // Memoized validation logic - only recalculate when addressDetails changes
  const isFormValid = useMemo(() => {
    const requiredFields: (keyof AddressDetails)[] = [
      "street",
      "street2",
      "city",
      "zip",
      "longitude",
      "latitude",
    ];

    return (
      requiredFields.every(
        (field) =>
          addressDetails[field] &&
          (typeof addressDetails[field] === "string"
            ? addressDetails[field].toString().trim() !== ""
            : addressDetails[field] !== 0)
      ) &&
      addressDetails.longitude !== "" &&
      addressDetails.latitude !== ""
    );
  }, [addressDetails]);

  // Validation function - memoized to prevent recreation
  const validateField = useCallback(
    (field: keyof AddressDetails, value: any): string => {
      switch (field) {
        case "street":
        case "street2":
        case "city":
          return value.trim() === ""
            ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
            : "";
        case "zip":
          return value <= 0 ? "Valid zip code is required" : "";
        case "longitude":
        case "latitude":
          return value === ""
            ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
            : "";
        default:
          return "";
      }
    },
    []
  );

  // Optimized field update - triggers validation debouncing
  const updateAddressDetails = useCallback(
    (field: keyof AddressDetails, value: any) => {
      addressDispatch({ type: "UPDATE_FIELD", field, value });

      // Clear validation error for this field immediately
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      // For coordinate fields, validate immediately to prevent lag
      if (field === "latitude" || field === "longitude") {
        const error = validateField(field, value);
        if (error) {
          setValidationErrors((prev) => ({ ...prev, [field]: error }));
        }
      } else {
        // Trigger debounced validation for other fields
        setIsValidating(true);
      }
    },
    [validateField]
  );

  // Optimized map state updates
  const updateMapState = useCallback((action: MapAction) => {
    mapDispatch(action);
  }, []);

  const resetForm = useCallback(() => {
    addressDispatch({ type: "RESET_FORM" });
    setValidationErrors({});
    mapDispatch({ type: "RESET_MAP" });
  }, []);

  // Validate entire form - memoized to prevent recreation
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    Object.keys(addressDetails).forEach((key) => {
      const field = key as keyof AddressDetails;
      const error = validateField(field, addressDetails[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [addressDetails, validateField]);

  // Improved address submission
  const handleAddAddress = useCallback(() => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields",
      });
      return;
    }

    // Convert string coordinates to numbers for submission
    const submissionData = {
      ...addressDetails,
      latitude: parseFloat(addressDetails.latitude) || 0,
      longitude: parseFloat(addressDetails.longitude) || 0,
    };

    addUserAddress(submissionData, {
      onSuccess: () => {
        router.back();
        resetForm();
        Toast.show({
          type: "success",
          text1: "Address added successfully",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error.message || "Failed to add address",
        });
      },
    });
  }, [addressDetails, validateForm, addUserAddress, resetForm]);

  // Function to decode location and add address
  const handleConfirmLocation = useCallback(async () => {
    try {
      let locationToDecode = null;
      let addressData: Partial<AddressDetails> = {};

      // Determine which location to decode
      if (mapState.selectedLocation) {
        // Use selected location from search
        locationToDecode = {
          latitude: mapState.selectedLocation.latitude,
          longitude: mapState.selectedLocation.longitude,
        };
        addressData = {
          street: mapState.selectedLocation.address,
          latitude: mapState.selectedLocation.latitude.toString(),
          longitude: mapState.selectedLocation.longitude.toString(),
        };
      } else if (locationData.location) {
        // Use current location
        locationToDecode = {
          latitude: locationData.location.coords.latitude,
          longitude: locationData.location.coords.longitude,
        };
        addressData = {
          latitude: locationData.location.coords.latitude.toString(),
          longitude: locationData.location.coords.longitude.toString(),
          street: locationData.address?.street || "",
          city: locationData.address?.city || "",
          state: locationData.address?.region || "",
          country: locationData.address?.country || "",
        };
      } else {
        Toast.show({
          type: "error",
          text1: "No location selected",
          text2: "Please select a location or use current location",
        });
        return;
      }

      // Use Google Geocoding API to get detailed address
      const API_KEY = "AIzaSyAsQaw80JUEAI_a82j_1bp366sei7GibWY";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationToDecode.latitude},${locationToDecode.longitude}&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        // Extract address components
        const streetNumber =
          addressComponents.find((component: any) =>
            component.types.includes("street_number")
          )?.long_name || "";

        const route =
          addressComponents.find((component: any) =>
            component.types.includes("route")
          )?.long_name || "";

        const street =
          streetNumber && route ? `${streetNumber} ${route}` : route;

        const city =
          addressComponents.find((component: any) =>
            component.types.includes("locality")
          )?.long_name || "";

        const state =
          addressComponents.find((component: any) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || "";

        const country =
          addressComponents.find((component: any) =>
            component.types.includes("country")
          )?.long_name || "";

        const postalCode =
          addressComponents.find((component: any) =>
            component.types.includes("postal_code")
          )?.long_name || "";

        // Update address details with decoded information
        const decodedAddressData = {
          ...addressData,
          street: street || addressData.street || "",
          city: city || addressData.city || "",
          state: state || addressData.state || "",
          country: country || addressData.country || "",
          zip: postalCode ? parseInt(postalCode) : 0,
          street2: result.formatted_address || "",
        };

        // Call addUserAddress with the decoded data
        const submissionData = {
          ...decodedAddressData,
          latitude: parseFloat(decodedAddressData.latitude || "0") || 0,
          longitude: parseFloat(decodedAddressData.longitude || "0") || 0,
        };

        addUserAddress(submissionData, {
          onSuccess: () => {
            router.back();
            resetForm();
            Toast.show({
              type: "success",
              text1: "Address added successfully",
            });
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: error.message || "Failed to add address",
            });
          },
        });
      } else {
        // If geocoding fails, use the basic data
        const submissionData = {
          ...addressData,
          latitude: parseFloat(addressData.latitude || "0") || 0,
          longitude: parseFloat(addressData.longitude || "0") || 0,
        };

        addUserAddress(submissionData, {
          onSuccess: () => {
            router.back();
            resetForm();
            Toast.show({
              type: "success",
              text1: "Address added successfully",
            });
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: error.message || "Failed to add address",
            });
          },
        });
      }
    } catch (error) {
      console.error("Error decoding location:", error);
      Toast.show({
        type: "error",
        text1: "Error processing location",
        text2: "Please try again",
      });
    }
  }, [mapState.selectedLocation, locationData, addUserAddress, resetForm]);

  // Improved location selection
  const handleLocationSelect = useCallback(
    (data: any, details: any) => {
      if (details) {
        const { lat, lng } = details.geometry.location;
        const newRegion: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        updateMapState({ type: "UPDATE_REGION", payload: newRegion });
        updateMapState({
          type: "SET_SELECTED_LOCATION",
          payload: {
            latitude: lat,
            longitude: lng,
            address: details.formatted_address || data.description,
          },
        });
        mapRef.current?.animateToRegion(newRegion, 2000);

        // Auto-fill address details if available
        if (details.formatted_address) {
          addressDispatch({
            type: "SET_ADDRESS",
            payload: {
              street: details.formatted_address,
              latitude: lat.toString(),
              longitude: lng.toString(),
            },
          });
        }
      }
    },
    [updateMapState]
  );

  // Use current location handler
  const handleUseCurrentLocation = useCallback(() => {
    if (locationData.location) {
      const newRegion: Region = {
        latitude: locationData.location.coords.latitude,
        longitude: locationData.location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      updateMapState({ type: "UPDATE_REGION", payload: newRegion });
      updateMapState({ type: "SET_SELECTED_LOCATION", payload: null });
      mapRef.current?.animateToRegion(newRegion, 1000);

      // Auto-fill with current location data
      addressDispatch({
        type: "SET_ADDRESS",
        payload: {
          latitude: locationData.location.coords.latitude.toString(),
          longitude: locationData.location.coords.longitude.toString(),
          street: locationData.address?.street || "",
          city: locationData.address?.city || "",
        },
      });
    }
  }, [locationData, updateMapState]);

  // Toggle manual mode
  const toggleManualMode = useCallback(
    (isManual: boolean) => {
      updateMapState({ type: "SET_MANUAL_MODE", payload: isManual });
      if (!isManual) {
        resetForm();
      }
    },
    [updateMapState, resetForm]
  );

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Header title="Add Address" />
      </View>
      {!mapState.isManualMode ? (
        <View style={style.container}>
          <View style={style.mapContainer}>
            <View style={style.searchContainer}>
              <CustomLocationSearch
                placeholder="Search location"
                onLocationSelect={handleLocationSelect}
              />
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                You can simply tap on the map to select location after search or
                zoom in to the desired location.
              </Text>
            </View>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={mapState.region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              pointerEvents="box-none"
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                const newRegion: Region = {
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                updateMapState({ type: "UPDATE_REGION", payload: newRegion });
                updateMapState({
                  type: "SET_SELECTED_LOCATION",
                  payload: {
                    latitude,
                    longitude,
                    address: "",
                    // address: `Lat ${latitude.toFixed(
                    //   6
                    // )}, Lng ${longitude.toFixed(6)}`,
                  },
                });
                addressDispatch({
                  type: "SET_ADDRESS",
                  payload: {
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                  },
                });
              }}
            >
              {/* Selected Location Marker */}
              {mapState.selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: mapState.selectedLocation.latitude,
                    longitude: mapState.selectedLocation.longitude,
                  }}
                  title="Selected Location"
                  description={mapState.selectedLocation.address}
                >
                  {/* <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <LocationMarker color={"red"} />
                  </View> */}
                  <Callout tooltip>
                    <View style={style.calloutContainer}>
                      <Text style={style.calloutTitle}>Selected Location</Text>
                      <Text style={style.calloutAddress}>
                        {mapState.selectedLocation.address}
                      </Text>
                      <Text style={style.calloutCoordinates}>
                        {mapState.selectedLocation.latitude.toFixed(6)},{" "}
                        {mapState.selectedLocation.longitude.toFixed(6)}
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              )}
            </MapView>
            <View style={style.buttonContainer}>
              {/* <Button
                variant="secondary"
                size="small"
                title="+ Manually"
                onPress={() => toggleManualMode(true)}
              /> */}
              <Button
                variant="secondary"
                size="small"
                title="Use Current Location"
                onPress={handleUseCurrentLocation}
              />
              <Button
                variant="primary"
                size="large"
                title="Confirm Location"
                onPress={handleConfirmLocation}
                style={style.confirmButton}
                disabled={!mapState.selectedLocation && !locationData.location}
              />
            </View>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              position: "relative",
            }}
          >
            <View style={style.section}>
              <View style={[style.row, { marginBottom: 15 }]}>
                <Text style={style.sectionTitle}>Address Details</Text>
                <Button
                  variant="primary"
                  size="small"
                  title="Search"
                  onPress={() => toggleManualMode(false)}
                />
              </View>

              {/* Street Input */}
              <Text style={style.label}>Street</Text>
              <View style={style.inputContainer}>
                <TextInput
                  style={[
                    style.input,
                    validationErrors.street && style.inputError,
                  ]}
                  placeholder="Enter your street"
                  value={addressDetails.street}
                  onChangeText={(text) => updateAddressDetails("street", text)}
                />
                {validationErrors.street && (
                  <Text style={style.errorText}>{validationErrors.street}</Text>
                )}
              </View>

              {/* Address Input */}
              <Text style={style.label}>Address</Text>
              <View style={style.inputContainer}>
                <TextInput
                  style={[
                    style.input,
                    validationErrors.street2 && style.inputError,
                  ]}
                  placeholder="Enter your address"
                  value={addressDetails.street2}
                  onChangeText={(text) => updateAddressDetails("street2", text)}
                />
                {validationErrors.street2 && (
                  <Text style={style.errorText}>
                    {validationErrors.street2}
                  </Text>
                )}
              </View>

              {/* City Input */}
              <Text style={style.label}>City</Text>
              <View style={style.inputContainer}>
                <TextInput
                  style={[
                    style.input,
                    validationErrors.city && style.inputError,
                  ]}
                  placeholder="Enter your city"
                  value={addressDetails.city}
                  onChangeText={(text) => updateAddressDetails("city", text)}
                />
                {validationErrors.city && (
                  <Text style={style.errorText}>{validationErrors.city}</Text>
                )}
              </View>

              {/* Zip Input */}
              <Text style={style.label}>Zip</Text>
              <View style={style.inputContainer}>
                <TextInput
                  style={[
                    style.input,
                    validationErrors.zip && style.inputError,
                  ]}
                  placeholder="Enter your zip"
                  keyboardType="numeric"
                  value={addressDetails.zip.toString()}
                  onChangeText={(text) =>
                    updateAddressDetails("zip", Number(text) || 0)
                  }
                />
                {validationErrors.zip && (
                  <Text style={style.errorText}>{validationErrors.zip}</Text>
                )}
              </View>

              {/* State and Country Row */}
              <View style={style.row}>
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <Text style={style.label}>State</Text>
                  <View style={[style.inputContainer]}>
                    <TextInput
                      style={[
                        style.input,
                        validationErrors.state && style.inputError,
                      ]}
                      placeholder="Enter state"
                      value={addressDetails.state}
                      onChangeText={(text) =>
                        updateAddressDetails("state", text)
                      }
                    />
                    {validationErrors.state && (
                      <Text style={style.errorText}>
                        {validationErrors.state}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <Text style={style.label}>Country</Text>
                  <View style={[style.inputContainer]}>
                    <TextInput
                      style={[
                        style.input,
                        validationErrors.country && style.inputError,
                      ]}
                      placeholder="Enter country"
                      value={addressDetails.country}
                      onChangeText={(text) =>
                        updateAddressDetails("country", text)
                      }
                    />
                    {validationErrors.country && (
                      <Text style={style.errorText}>
                        {validationErrors.country}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Longitude and Latitude Row */}
              <View style={style.row}>
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <Text style={style.label}>Latitude</Text>
                  <View style={[style.inputContainer]}>
                    <TextInput
                      style={[
                        style.input,
                        validationErrors.latitude && style.inputError,
                      ]}
                      placeholder="Enter latitude"
                      keyboardType="decimal-pad"
                      value={addressDetails.latitude}
                      onChangeText={(text) =>
                        updateAddressDetails("latitude", text)
                      }
                    />
                    {validationErrors.latitude && (
                      <Text style={style.errorText}>
                        {validationErrors.latitude}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <Text style={style.label}>Longitude</Text>
                  <View style={[style.inputContainer]}>
                    <TextInput
                      style={[
                        style.input,
                        validationErrors.longitude && style.inputError,
                      ]}
                      placeholder="Enter longitude"
                      keyboardType="decimal-pad"
                      value={addressDetails.longitude}
                      onChangeText={(text) =>
                        updateAddressDetails("longitude", text)
                      }
                    />
                    {validationErrors.longitude && (
                      <Text style={style.errorText}>
                        {validationErrors.longitude}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <Button
              variant="primary"
              size="large"
              title="Confirm Location"
              onPress={handleAddAddress}
              isLoading={isPending}
              disabled={isPending || !isFormValid}
              style={style.confirmButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default AddAddress;

const styles = (theme: "light" | "dark", screenHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    headerContainer: {
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    searchContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 15,
      backgroundColor: "transparent",
      zIndex: 1000,
    },
    buttonContainer: {
      paddingHorizontal: 15,
      justifyContent: "flex-end",
      gap: 10,
      alignItems: "flex-end",
      width: "100%",
      position: "absolute",
      bottom: "8%",
      alignSelf: "center",
      backgroundColor: "transparent",
    },
    confirmButton: {
      // width: "92%",
      // position: "absolute",
      // bottom: 20,
      // alignSelf: "center",
    },
    autocompleteContainer: {
      flex: 1,
      zIndex: 1000,
    },
    searchInput: {
      height: 50,
      fontSize: 16,
      marginTop: 10,
      color: Colors[theme].text,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      backgroundColor: Colors[theme].background,
    },
    listView: {
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      zIndex: 1001,
      maxHeight: 200,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      backgroundColor: Colors[theme].background_light,
    },
    description: {
      color: Colors[theme].text,
      fontSize: 14,
    },
    separator: {
      height: 1,
      backgroundColor: Colors[theme].border,
    },
    mapContainer: {
      height: Dimensions.get("window").height - 50,
      borderRadius: 10,
      overflow: "hidden",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    section: {
      height: Dimensions.get("window").height * 0.81,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors[theme].text,
    },
    inputContainer: {
      marginBottom: 15,
      backgroundColor: "transparent",
    },
    label: {
      fontSize: 14,
      color: Colors[theme].text_secondary,
      marginBottom: 5,
    },
    input: {
      backgroundColor: Colors[theme].background,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      color: Colors[theme].text,
    },
    inputError: {
      borderColor: Colors[theme].error || "#ff0000",
    },
    errorText: {
      color: Colors[theme].error || "#ff0000",
      fontSize: 12,
      marginTop: 4,
    },
    calloutContainer: {
      width: 200,
      backgroundColor: Colors[theme].background,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    calloutTitle: {
      fontWeight: "bold",
      fontSize: 14,
      marginBottom: 5,
      color: Colors[theme].text,
    },
    calloutAddress: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 5,
      color: Colors[theme].text_secondary,
    },
    calloutCoordinates: {
      fontSize: 10,
      color: Colors[theme].text_secondary,
      fontFamily: "monospace",
    },
  });
