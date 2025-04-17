import { Dimensions, Image, Pressable, StyleSheet, Alert } from 'react-native'
import { Button, Text, View } from '@/components/Themed'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import InputHandler from '@/components/InputHandler';
import ProfileIcon from '@/assets/images/svgs/Profile';
import SmsIcon from '@/assets/images/svgs/Sms';
import Lock2Icon from '@/assets/images/svgs/Lock2';
import LocationWithCircle from '@/assets/images/svgs/LocationWithCircle';
import EditIcon from '@/assets/images/svgs/Edit';
import LocationInputHandler from '@/components/LocationInputHandler';
import { ImagePickerAsset } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const width = Dimensions.get('window').width;
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorScheme, width);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset>();
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (data: any, details: any) => {
    if (details) {
      const { formatted_address } = details;
      setLocation(formatted_address);

      // If you need the coordinates
      const { lat, lng } = details.geometry.location;
      // Do something with coordinates if needed
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      if (selectedImage?.uri) {
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        
      
      }
      
    

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={null} />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={selectedImage ? { uri: selectedImage.uri } : require('@/assets/images/profileImg.png')} style={styles.profileImage} />
        </View>
        <View style={styles.profileEditIconContainer}>
          <Pressable onPress={pickImage} >

            <EditIcon color={Colors[colorScheme].text_white} />
          </Pressable>
        </View>
      </View>
      <InputHandler leftIcon={<ProfileIcon color={Colors[colorScheme].icon_color} />} placeholder='Name' value={name} onChangeText={setName} textContentType='name' />
      <InputHandler leftIcon={<SmsIcon color={Colors[colorScheme].icon_color} />} placeholder='Email' value={email} onChangeText={setEmail} textContentType='emailAddress' />
      <View style={styles.locationContainer}>
        <LocationInputHandler
          placeholder="Search location"
          onLocationSelect={handleLocationSelect}
          leftIcon={<LocationWithCircle color={Colors[colorScheme].icon_color} />}
        />
      </View>
      <InputHandler leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true} textContentType='password' />
      <Button 
        style={{ marginTop: 12 }} 
        variant={loading ? 'disabled' : 'primary'} 
        size='large' 
        title={loading ? "Updating..." : "Update"} 
        onPress={handleUpdateProfile} 
      />

    </View>
  )
}

export default EditProfile

const createStyles = (theme: 'light' | 'dark', width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 20,
    },

    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      position: 'relative',
    },
    profileImageContainer: {
      // marginRight: 10,
      borderRadius: 100,
      overflow: 'hidden',
    },
    profileImage: {
      width: 115,
      height: 115,
    },
    profileEditIconContainer: {
      position: 'absolute',
      top: 0,
      left: width / 2,
      backgroundColor: Colors[theme].primary_color,
      borderRadius: 100,
      padding: 8,
      borderWidth: 2,
      borderColor: Colors[theme].background,
    },
    locationContainer: {
      zIndex: 100,
      elevation: 100,
    },
    footerText: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
    },
    footerLink: {
      color: Colors[theme].primary_color,
    },
  });
