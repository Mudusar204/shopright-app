import Colors from "@/constants/Colors";
import React, { useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import BottomModal from "./BottomSheet";
import { useColorScheme } from "../useColorScheme";
import { Button, Text, TextInput, View } from "../Themed";
import { useAddUserAddress } from "@/hooks/mutations/user/user.mutation";
import { useGetUserAddresses } from "@/hooks/queries/user/user.query";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import LocationMarker from "@/assets/images/svgs/LocationMarker";
import BackHandler from "../BackHandler";
import Header from "../Header";
import Toast from "react-native-toast-message";

const AddAddressBottomSheet = ({
  bottomSheetRef,
  selectedAddress,
  setSelectedAddress,
}: {
  bottomSheetRef: any;
  selectedAddress: any;
  setSelectedAddress: (address: any) => void;
}) => {
  const { mutate: addUserAddress, isPending, isSuccess } = useAddUserAddress();
  const { data: userAddresses } = useGetUserAddresses();

  const theme = useColorScheme() as "light" | "dark";
  const style = styles(theme);
  const mapRef = useRef<MapView>(null);
  const [addManually, setAddManually] = useState(false);
  const [region, setRegion] = useState({
    latitude: 23.723081,
    longitude: 90.4087,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    area: "",
    apartment: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    longitude: 0,
    latitude: 0,
  });
  const handleAddAddress = () => {
    addUserAddress(deliveryDetails, {
      onSuccess: () => {
        bottomSheetRef.current?.handleClose();
        setDeliveryDetails({
          fullName: "",
          area: "",
          apartment: "",
          streetAddress: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          longitude: 0,
          latitude: 0,
        });
        Toast.show({
          type: "success",
          text1: "Address added successfully",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      },
    });
  };
  const handleLocationSelect = (data: any, details: any) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const newRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  };

  return (
    <BottomModal ref={bottomSheetRef} scrollable={false} snapPoints={["100%"]}>
      {!addManually ? (
        <View style={style.container}>
          <View style={style.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search location"
              onPress={handleLocationSelect}
              enablePoweredByContainer={false}
              fetchDetails={false}
              keyboardShouldPersistTaps="handled"
              minLength={2}
              debounce={300}
              onFail={(error) =>
                console.log("GooglePlacesAutocomplete failed:", error)
              }
              onNotFound={() =>
                console.log("GooglePlacesAutocomplete not found")
              }
              query={{
                key: "AIzaSyAsQaw80JUEAI_a82j_1bp366sei7GibWY",
                language: "en",
              }}
              styles={{
                container: style.autocompleteContainer,
                textInput: style.searchInput,
                listView: style.listView,
                row: style.row,
                description: style.description,
                separator: style.separator,
              }}
            />
          </View>

          <View style={style.mapContainer}>
            <MapView
              ref={mapRef}
              style={style.map}
              initialRegion={region}
              onRegionChangeComplete={setRegion}
            >
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              >
                <LocationMarker color={Colors[theme].text_secondary} />
              </Marker>
            </MapView>
            <View style={style.buttonContainer}>
              <Button
                variant="secondary"
                size="small"
                title="+ Manually"
                onPress={() => setAddManually(true)}
              />
              <Button
                variant="secondary"
                size="small"
                title="Use Current Location"
                onPress={() => bottomSheetRef.current?.handleBottomSheet()}
              />
            </View>
            <Button
              variant="primary"
              size="large"
              title="Confirm Location"
              onPress={() => bottomSheetRef.current?.handleClose()}
              style={style.confirmButton}
            />
          </View>
        </View>
      ) : (
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
                onPress={() => setAddManually(false)}
              />
            </View>
            <Text style={style.label}>Full Name</Text>
            <View style={style.inputContainer}>
              <TextInput
                style={style.input}
                placeholder="Enter your full name"
                value={deliveryDetails.fullName}
                onChangeText={(text) =>
                  setDeliveryDetails({ ...deliveryDetails, fullName: text })
                }
              />
            </View>
            <Text style={style.label}>Area</Text>
            <View style={style.inputContainer}>
              <TextInput
                style={style.input}
                placeholder="Enter your area"
                keyboardType="phone-pad"
                value={deliveryDetails.area}
                onChangeText={(text) =>
                  setDeliveryDetails({ ...deliveryDetails, area: text })
                }
              />
            </View>
            <Text style={style.label}>Street</Text>
            <View style={style.inputContainer}>
              <TextInput
                style={style.input}
                placeholder="Enter your street"
                value={deliveryDetails.streetAddress}
                onChangeText={(text) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    streetAddress: text,
                  })
                }
              />
            </View>
            <Text style={style.label}>Apartment</Text>
            <View style={style.inputContainer}>
              <TextInput
                style={style.input}
                placeholder="Enter your apartment (optional)"
                value={deliveryDetails.apartment}
                onChangeText={(text) =>
                  setDeliveryDetails({ ...deliveryDetails, apartment: text })
                }
              />
            </View>
            <View style={style.row}>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>City</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter city"
                    value={deliveryDetails.city}
                    onChangeText={(text) =>
                      setDeliveryDetails({ ...deliveryDetails, city: text })
                    }
                  />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>State</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter state"
                    keyboardType="number-pad"
                    value={deliveryDetails.state}
                    onChangeText={(text) =>
                      setDeliveryDetails({ ...deliveryDetails, state: text })
                    }
                  />
                </View>
              </View>
            </View>
            <View style={style.row}>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>Country</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter country"
                    value={deliveryDetails.country}
                    onChangeText={(text) =>
                      setDeliveryDetails({ ...deliveryDetails, country: text })
                    }
                  />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>Postal Code</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter postal code"
                    keyboardType="number-pad"
                    value={deliveryDetails.postalCode}
                    onChangeText={(text) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        postalCode: text,
                      })
                    }
                  />
                </View>
              </View>
            </View>
            <View style={style.row}>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>Longitude</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter longitude"
                    value={deliveryDetails.longitude.toString()}
                    onChangeText={(text) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        longitude: Number(text),
                      })
                    }
                  />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={style.label}>Latitude</Text>
                <View style={[style.inputContainer]}>
                  <TextInput
                    style={style.input}
                    placeholder="Enter latitude"
                    keyboardType="number-pad"
                    value={deliveryDetails.latitude.toString()}
                    onChangeText={(text) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        latitude: Number(text),
                      })
                    }
                  />
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
            disabled={
              isPending ||
              !deliveryDetails.fullName ||
              !deliveryDetails.area ||
              !deliveryDetails.streetAddress ||
              !deliveryDetails.city ||
              !deliveryDetails.state ||
              !deliveryDetails.country ||
              !deliveryDetails.postalCode ||
              !deliveryDetails.longitude ||
              !deliveryDetails.latitude
            }
            style={style.confirmButton}
          />
        </ScrollView>
      )}
    </BottomModal>
  );
};

export default AddAddressBottomSheet;

const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    searchContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 15,
      zIndex: 1000,
      backgroundColor: "transparent",
    },

    buttonContainer: {
      paddingHorizontal: 15,
      justifyContent: "flex-end",
      gap: 10,
      alignItems: "flex-end",
      width: "100%",
      position: "absolute",
      bottom: 80,
      alignSelf: "center",
      backgroundColor: "transparent",
    },

    confirmButton: {
      width: "92%",
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
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
      paddingHorizontal: 15,
      paddingVertical: 12,
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
      height: Dimensions.get("window").height * 0.83,
      borderRadius: 10,
      overflow: "hidden",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    section: {
      height: Dimensions.get("window").height * 0.81,
      // flex: 1,
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
  });
