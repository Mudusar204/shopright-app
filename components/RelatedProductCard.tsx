import React from 'react';
import { StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { View, Text, Button } from '@/components/Themed';
import { router } from 'expo-router';
import PhoneIcon from '@/assets/images/svgs/Phone';
import LocationIcon from '@/assets/images/svgs/Location';

interface RelatedProductCardProps {
  explorePage?: boolean;
  image: string;
  title: string;
  location: string;
  price: string;
  phoneNumber: string;
  description: string;
  relatedItems?: any[];
  tags?: any[];
}

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({
  explorePage,
  image,
  title,
  location,
  price,
  phoneNumber,
  description,
  relatedItems,
    tags,
}) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme, explorePage);
  const { width } = Dimensions.get('window');
  return (
    <View style={[styles.container, { width: width / 2 - 25 }]}>

    
        {/* Image */}
        <View style={[styles.imageContainer, { backgroundColor: Colors[colorTheme].background_light }]}>
          <Image resizeMode="cover" source={require('@/assets/images/productImg.jpg')} style={styles.image} />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: Colors[colorTheme].background_light }]}>
          <Text style={styles.title}>{title}</Text>
         
        
          
         

        <View style={styles.footer}>
          <Text style={styles.price}>Rs.{price}</Text>
          <Button style={styles.button} title="View" variant='primary' size='small'  onPress={() => router.push({
            pathname: explorePage ? '/(auth)/(tabs)/(explore)/product-details' : '/(auth)/(tabs)/(home)/product-details',
            params: {
              image,
              title,
              location,
              price,
              phoneNumber,
              description,
            }
          })} />
          </View>
        </View>

        {/* Footer with Phone */}
       
    </View>

  );
};

const createStyles = (colorTheme: 'light' | 'dark', explorePage?: boolean) => StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor:Colors[colorTheme].background_light,
    borderRadius: explorePage ? 15 : 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors[colorTheme].border,
    margin: 5,
  },
  imageContainer: {
    width: "100%",
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 10,
    backgroundColor:"transparent"
  },
  title: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  phoneContainer: {
    marginTop:explorePage ? 0 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:"transparent"
  },
  price: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:10,
    backgroundColor:"transparent"

  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: Colors[colorTheme].background_secondary,
    fontSize: 8,
    marginLeft: 4,
  },
  phoneText: {
    marginLeft: 5,
    color: Colors[colorTheme].text_secondary,
    fontSize: 10,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal:25,
    paddingVertical:5,
    borderRadius:5,
  },
});

export default RelatedProductCard;
