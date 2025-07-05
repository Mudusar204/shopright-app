import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface RiderTrackingMapProps {
  riderLocation: {
    latitude: number;
    longitude: number;
  } | null;
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  riderName?: string;
  isConnected: boolean;
  height?: number;
}

const RiderTrackingMap: React.FC<RiderTrackingMapProps> = ({
  riderLocation,
  deliveryLocation,
  riderName = "Rider",
  isConnected,
  height = 200,
}) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: deliveryLocation.latitude,
    longitude: deliveryLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Update map region when rider location changes
  useEffect(() => {
    if (riderLocation && mapRef.current) {
      const newRegion = {
        latitude: riderLocation.latitude,
        longitude: riderLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [riderLocation]);

  // Calculate route between rider and delivery location
  const getRouteCoordinates = () => {
    if (!riderLocation) return [];

    return [
      { latitude: riderLocation.latitude, longitude: riderLocation.longitude },
      {
        latitude: deliveryLocation.latitude,
        longitude: deliveryLocation.longitude,
      },
    ];
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={[styles.map, { height }]}
          initialRegion={region}
          showsUserLocation={false}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {/* Delivery Location Marker */}
          <Marker
            coordinate={deliveryLocation}
            title="Delivery Location"
            description="Your order will be delivered here"
          >
            <View style={styles.deliveryMarkerContainer}>
              <Ionicons
                name="location"
                size={24}
                color={Colors[colorScheme].primary_color}
              />
            </View>
          </Marker>

          {/* Rider Location Marker */}
          {riderLocation && (
            <Marker
              coordinate={riderLocation}
              title={riderName}
              description="Your rider is here"
            >
              <View style={styles.riderMarkerContainer}>
                <Ionicons name="bicycle" size={20} color="white" />
              </View>
            </Marker>
          )}

          {/* Route Line */}
          {riderLocation && (
            <Polyline
              coordinates={getRouteCoordinates()}
              strokeColor={Colors[colorScheme].primary_color}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>

        {/* Connection Status Indicator */}
        {/* <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isConnected
                  ? Colors[colorScheme].success
                  : Colors[colorScheme].error,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected
                    ? Colors[colorScheme].success
                    : Colors[colorScheme].error,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? "Live Tracking" : "Offline"}
            </Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      overflow: "hidden",
    },
    mapWrapper: {
      position: "relative",
    },
    map: {
      width: "100%",
    },
    deliveryMarkerContainer: {
      backgroundColor: Colors[theme].background,
      borderRadius: 20,
      padding: 8,
      borderWidth: 2,
      borderColor: Colors[theme].primary_color,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    riderMarkerContainer: {
      backgroundColor: Colors[theme].primary_color,
      borderRadius: 20,
      padding: 8,
      borderWidth: 2,
      borderColor: "white",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    statusContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
    },
    statusIndicator: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: Colors[theme].background,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors[theme].text,
    },
  });

export default RiderTrackingMap;
