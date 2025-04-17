import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import FilterIcon from '@/assets/images/svgs/FilterIcon';

const FilterHandler = () => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);
  return (

    <View
      style={styles.button}

    >
      <View style={styles.iconContainer}>
        <FilterIcon color={Colors[colorTheme].text} />
      </View>
    </View>
  );
};

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
  button: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors[colorTheme].background_light,
    borderWidth: 1,
    borderColor: Colors[colorTheme].border,
    borderRadius: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterHandler;
