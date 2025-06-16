import Colors from "@/constants/Colors";
import React, { useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BottomModal from "./BottomSheet";
import { useColorScheme } from "../useColorScheme";
import { Text, View } from "../Themed";
import { useAddUserAddress } from "@/hooks/mutations/user/user.mutation";
import { useGetUserAddresses } from "@/hooks/queries/user/user.query";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import LocationMarker from "@/assets/images/svgs/LocationMarker";

const AddAddressBottomSheet = ({
  bottomSheetRef,
  selectedAddress,
  setSelectedAddress,
}: {
  bottomSheetRef: any;
  selectedAddress: any;
  setSelectedAddress: (address: any) => void;
}) => {
  const { mutate: addUserAddress } = useAddUserAddress();
  const { data: userAddresses } = useGetUserAddresses();
  const theme = useColorScheme() as "light" | "dark";
  const style = styles(theme);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 23.723081,
    longitude: 90.4087,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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
    <BottomModal ref={bottomSheetRef} scrollable={false} snapPoints={["90%"]}>
      <View style={style.container}>
        <View style={style.searchContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search location"
            onPress={handleLocationSelect}
            enablePoweredByContainer={false}
            fetchDetails={true}
            keyboardShouldPersistTaps="handled"
            query={{
              key: "AIzaSyAKmwq_hiM8N93ukg6pe1OvuLPV57_Eo8U",
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
        </View>
      </View>
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
      zIndex: 1,
      backgroundColor: "transparent",
    },
    autocompleteContainer: {
      flex: 0,
    },
    searchInput: {
      height: 50,
      fontSize: 16,
      marginTop: 10,
      color: Colors[theme].text,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    listView: {
      position: "absolute",
      top: 50,
      left: 15,
      right: 15,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      zIndex: 1000,
    },
    row: {
      backgroundColor: "transparent",
      padding: 15,
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
      height: Dimensions.get("window").height * 0.7,
      borderRadius: 10,
      overflow: "hidden",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
