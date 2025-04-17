import React from 'react';
import {  Image, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import Feather from '@expo/vector-icons/Feather'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
interface ProductItemProps {
  image: string;
  title: string;
  location: string;
  price: string;
  phoneNumber?: string;
}

const ProductItem = ({
  image,
  title,
  location,
  price,
  phoneNumber,
}: ProductItemProps) => {
    const colorTheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorTheme);
  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image source={require('@/assets/images/markerAddImage.png')} style={styles.image} />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {phoneNumber && (
            <View style={styles.phoneRow}>
              <Feather name="phone-call" size={14} color={Colors[colorTheme].text_secondary} />
              <Text style={styles.phoneText}>{phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
        <SimpleLineIcons name="location-pin" size={14} color={Colors[colorTheme].background_secondary} />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors[colorTheme].border,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    color: Colors[colorTheme].text_secondary,
    fontSize: 12,
    marginLeft: 4,
    paddingBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: Colors[colorTheme].background_secondary,
    fontSize: 14,
    marginLeft: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
});

export default ProductItem;
