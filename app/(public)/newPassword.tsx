import { StyleSheet, Alert } from 'react-native'
import { Button, Text, View } from '@/components/Themed'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import InputHandler from '@/components/InputHandler';
import { router, useLocalSearchParams } from 'expo-router';
import Lock2Icon from '@/assets/images/svgs/Lock2';

const NewPassword = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorScheme);
  const { username } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!username) {
      Alert.alert('Error', 'Email is required. Please start from forgot password.');
      router.push('/(public)/forgetPassword');
      return;
    }

    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      if (true) {

      Alert.alert(
        'Success', 
        'Your password has been reset successfully',
        [
          {
            text: 'Login',
            onPress: () => router.push('/(public)/login')
          }
        ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={null} />
      <Text style={styles.title}>New password</Text>
      <Text style={styles.subtitle}>Set your new password to login</Text>
      
      <InputHandler 
        placeholder='Verification Code'
        value={code}
        onChangeText={setCode}
        // maxLength={6}
      />

      <InputHandler 
        leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />} 
        placeholder='New Password' 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={true} 
        textContentType='newPassword'
      />

      <InputHandler 
        leftIcon={<Lock2Icon color={Colors[colorScheme].icon_color} />} 
        placeholder='Confirm New Password' 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry={true} 
        textContentType='newPassword'
      />

      <Button 
      textColor={Colors[colorScheme].text_white}
        style={{marginTop: 12}} 
        variant={loading || !code || !password || !confirmPassword ? 'primary' : 'primary'} 
        size='large' 
        title={loading ? "Resetting Password..." : "Continue"} 
        onPress={handleResetPassword}
        // disabled={loading || !code || !password || !confirmPassword}
      />
    </View>
  )
}

export default NewPassword

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginTop: 10,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].text_secondary,
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
  });
