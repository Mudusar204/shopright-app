import LocationMarker from '@/assets/images/svgs/LocationMarker';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useColorScheme } from './useColorScheme';

const MapComponent = () => {
    const colorTheme = useColorScheme() as 'light' | 'dark';
  const [region] = useState({
    latitude: -6.200000, // Example: Jakarta
    longitude: 106.816666,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Sample marker data
  const markers = [
    {
      id: 1,
      latitude: -6.194422,
      longitude: 106.821558,
      profileImage: 'https://via.placeholder.com/40', // Replace with actual image URL
      adImage: '@/assets/images/locationMarker.png',     // Replace with ad image URL
      adName: 'Ad name',
      price: '$783.00',
    },
    {
      id: 2,
      latitude: -6.203491,
      longitude: 106.811547,
      profileImage: '@/assets/images/locationMarker.png',
      adImage: '@/assets/images/markerAddImage.png',
      adName: 'Another Ad',
      price: '$650.00',
    },
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          >
            {/* Custom Marker */}
            <View style={styles.markerContainer}>
              {/* <Image
                source={{ uri: marker.profileImage }}
                style={styles.profileImage}
              /> */}
              <LocationMarker color={Colors[colorTheme].text_secondary} />
            </View>

            {/* Custom Callout */}
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Image
                  source={require("@/assets/images/markerAddImage.png")}
                  style={styles.adImage}
                />
                <Text style={styles.adTitle}>{marker.adName}</Text>
                <Text style={styles.adPrice}>{marker.price}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    // borderWidth: 2,
    // borderColor: '#fff',
    // borderRadius: 20,
    // padding: 2,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  calloutContainer: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    // elevation: 5,
  },
  adImage: {
    width: 150,
    height: 100,
    borderRadius: 5,
    marginTop: 5,

  },
  adTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginVertical: 4,
  },
  adPrice: {
    fontSize: 10,
  },
});

export default MapComponent;
