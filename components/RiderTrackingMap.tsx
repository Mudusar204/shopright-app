import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";

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

interface RoutePoint {
  latitude: number;
  longitude: number;
}

const RiderTrackingMap: React.FC<RiderTrackingMapProps> = ({
  riderLocation,
  deliveryLocation,
  riderName = "Rider",
  isConnected,
  height = 200,
}) => {
  console.log(riderLocation, "riderLocation");
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: deliveryLocation.latitude,
    longitude: deliveryLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<RoutePoint[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Fetch route from Google Maps Directions API
  const fetchRoute = async () => {
    if (!riderLocation) return;

    setIsLoadingRoute(true);
    setRouteError(null);

    try {
      const origin = `${riderLocation.latitude},${riderLocation.longitude}`;
      const destination = `${deliveryLocation.latitude},${deliveryLocation.longitude}`;
      const apiKey = "AIzaSyAsQaw80JUEAI_a82j_1bp366sei7GibWY";

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.routes.length > 0) {
        const route = data.routes[0];
        const points = route.overview_polyline.points;

        // Decode the polyline points
        const decodedPoints = polyline
          .decode(points)
          .map(([latitude, longitude]: [number, number]) => ({
            latitude,
            longitude,
          }));
        setRouteCoordinates(decodedPoints);
        setRouteError(null); // Clear any previous errors
      } else {
        console.warn("Could not find route. Using direct path.");
        // Fallback to direct line without showing error to user
        setRouteCoordinates([
          {
            latitude: riderLocation.latitude,
            longitude: riderLocation.longitude,
          },
          {
            latitude: deliveryLocation.latitude,
            longitude: deliveryLocation.longitude,
          },
        ]);
        setRouteError(null);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // Only show error if we don't have any route coordinates yet
      if (routeCoordinates.length === 0) {
        setRouteError("Failed to load route. Using direct path.");
      }
      // Fallback to direct line
      // setRouteCoordinates([
      //   {
      //     latitude: riderLocation.latitude,
      //     longitude: riderLocation.longitude,
      //   },
      //   {
      //     latitude: deliveryLocation.latitude,
      //     longitude: deliveryLocation.longitude,
      //   },
      // ]);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Calculate region to show both points when no rider location
  const getInitialRegion = () => {
    if (!riderLocation) {
      return {
        latitude: deliveryLocation.latitude,
        longitude: deliveryLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    // Calculate the midpoint between rider and delivery location
    const midLat = (riderLocation.latitude + deliveryLocation.latitude) / 2;
    const midLng = (riderLocation.longitude + deliveryLocation.longitude) / 2;

    // Calculate the distance between points to set appropriate delta
    const latDiff = Math.abs(
      riderLocation.latitude - deliveryLocation.latitude
    );
    const lngDiff = Math.abs(
      riderLocation.longitude - deliveryLocation.longitude
    );

    // Use the larger difference to ensure both points are visible
    const maxDiff = Math.max(latDiff, lngDiff);
    const delta = Math.max(maxDiff * 1.5, 0.01); // Minimum delta of 0.01

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  };

  // Update map region when rider location changes
  useEffect(() => {
    if (riderLocation && mapRef.current) {
      const newRegion = getInitialRegion();
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [riderLocation]);

  // Fetch route when rider location changes
  useEffect(() => {
    if (riderLocation) {
      // Fetch route immediately on first load, with delay only for subsequent updates
      if (routeCoordinates.length === 0) {
        fetchRoute();
      } else {
        // Add a small delay to avoid too many API calls for location updates
        const timeoutId = setTimeout(() => {
          fetchRoute();
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [riderLocation, deliveryLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={[styles.map, { height }]}
          initialRegion={getInitialRegion()}
          showsUserLocation={false}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {/* Delivery Location Marker */}
          <Marker
            coordinate={deliveryLocation}
            image={require("@/assets/images/home.png")}
            style={{
              width: 10,
              height: 10,
            }}
          ></Marker>

          {/* Rider Location Marker */}
          {riderLocation && (
            <Marker
              coordinate={riderLocation}
              image={require("@/assets/images/rider.png")}
            >
              {/* <View style={styles.riderMarkerContainer}>
                <Ionicons name="bicycle" size={16} color="white" />
              </View> */}
            </Marker>
          )}

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors[colorScheme].primary_color}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>

        {/* Loading indicator */}
        {isLoadingRoute && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading route...</Text>
          </View>
        )}

        {/* Error message */}
        {routeError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{routeError}</Text>
          </View>
        )}
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
      padding: 4,
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
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1,
    },
    loadingText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    errorContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,0,0,0.5)",
      zIndex: 1,
    },
    errorText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

export default RiderTrackingMap;
