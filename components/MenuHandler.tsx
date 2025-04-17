import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import MenuIcon from '@/assets/images/svgs/MenuIcon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
// Define the navigation type

const MenuHandler = ({ color }: any) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);
  // Properly type the navigation
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.3}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <View style={styles.iconContainer}>
        <MenuIcon color={color || Colors[colorTheme].text} />
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
    borderColor: Colors[colorTheme].border,
    borderRadius: 50,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuHandler;
