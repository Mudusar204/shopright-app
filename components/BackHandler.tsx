import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface BackHandlerProps {
  color?: string;
}

const BackHandler = ({ color }: BackHandlerProps) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.button}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="chevron-back"
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
    backgroundColor: Colors[colorTheme].background_light,

    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackHandler;
