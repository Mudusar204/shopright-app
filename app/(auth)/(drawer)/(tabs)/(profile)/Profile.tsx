import { Dimensions, Image, Pressable, StyleSheet, Alert, BackHandler, TouchableOpacity } from 'react-native'
import { Button, Text, View } from '@/components/Themed'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import LocationIcon from '@/assets/images/svgs/Location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImagePickerAsset } from 'expo-image-picker';
const Profile = () => {
  const width = Dimensions.get('window').width;
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorScheme, width);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset>();
  return (
    <View style={styles.container}>
      <Header title='Profile'  />
      <View style={styles.profileImageContainer}>
        <Image source={selectedImage ? { uri: selectedImage.uri } : require('@/assets/images/profileImg.png')} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileNameText}>
            John Doe
          </Text>
          <View style={[styles.locationRow,]}>
            <LocationIcon color={Colors[colorScheme].primary_color} />
            <Text style={[styles.profileLocationText, { color: Colors[colorScheme].primary_color }]}>Faisalabad, Pakistan</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Profile

const createStyles = (theme: 'light' | 'dark', width: number) =>
  StyleSheet.create({
    button: {
      height: 41,
      width: 41,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'light' ? 'rgba(245, 245, 245, 1)' : 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      borderColor: '#E9E9E9',
      borderRadius: 12,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 15,
    },

    profileImageContainer: {
      marginTop: 40,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImage: {
      width: 115,
      borderRadius: 100,
      height: 115,
    },

    profileTextContainer: {
    },
    profileNameText: {
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 10,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 5
    },
    profileLocationText: {
      fontSize: 12,
      fontWeight: '400',
    },
  });