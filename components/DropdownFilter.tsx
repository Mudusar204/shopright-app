import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface InputBatchProps {
  label: string;
  onClose: () => void;
  color?: string;
}

const DropdownFilter = ({ label, onClose, color }: InputBatchProps) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Text style={[styles.label, { color: color || Colors[colorTheme].text }]}>
        {label}
      </Text>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chevron-down"
          size={18}
          color={color || Colors[colorTheme].text_primary}
          onPress={onClose}
        />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colorTheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[colorTheme].background_light,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
      margin: 4,
    },
    label: {
      fontSize: 14,
      marginRight: 4,
      color: colorTheme === 'light' ? '#000' : '#FFF',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default DropdownFilter;
