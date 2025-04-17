import { StyleSheet, Alert } from 'react-native'
import { Button, Text, View } from '@/components/Themed'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import InputHandler from '@/components/InputHandler';
import { useAuthStore } from '@/store/auth.store';

 const ConfirmSignUp = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorScheme);
  const { username } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const {setIsLoggedIn} = useAuthStore((state: any) => state);
  const handleConfirmation = async () => {
    if (loading || !code) return;

    try {
      setLoading(true);
      if (true) {
        setIsLoggedIn(true);
        Alert.alert('Success', 'Account confirmed successfully!', [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/(tabs)'),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (true) {
        Alert.alert('Success', 'Verification code resent successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={null} />
      <Text style={styles.title}>Verify your account</Text>
      <Text style={styles.subtitle}>
        Please enter the verification code sent to your email
      </Text>
      <InputHandler
        placeholder='Verification Code'
        value={code}
        onChangeText={setCode}
      />
      <Button
        style={styles.button}
        variant='primary'
        size='large'
        title={loading ? "Verifying..." : "Verify"}
        onPress={handleConfirmation}
        // disabled={loading || !code}
      />
      <Button
      textColor={Colors[colorScheme].text_white}
        style={styles.resendButton}
        variant='secondary'
        size='large'
        title="Resend Code"
        onPress={handleResendCode}
      />
    </View>
  );
}
export default ConfirmSignUp
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
      marginBottom: 15,
    },
    button: {
      marginTop: 20,
    },
    resendButton: {
      marginTop: 12,
    },
  });