import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
interface InputBatchProps {
  label: string;
  onClose: () => void;
  color?: string;
}

const InputBatch = ({ label, onClose, color }: InputBatchProps) => {
  const colorTheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorTheme);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Text style={[styles.label, { color: color || Colors[colorTheme].text }]}>
        {label}
      </Text>
      <View style={styles.iconContainer}>
        <AntDesign
          name="closecircleo"
          size={12}
          color={"#7A7A7A"}
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
      backgroundColor: colorTheme === 'light' ? 'rgba(94, 129, 244, 0.2)' : 'rgba(94, 129, 244, 0.4)',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors[colorTheme].background_secondary,
      marginLeft: 10,
    },
    label: {
      fontSize: 10,
      marginRight: 6,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default InputBatch;
