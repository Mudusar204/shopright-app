import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

const NotificationHandler = ({ color }: any) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);
  return (

    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.3}

    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="notifications"
          size={19}
          color={color || Colors[colorTheme].icon_color}
        />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
  button: {
    height: 41,
    width: 41,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme === 'light' ? 'rgba(245, 245, 245, 1)' : 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationHandler;
