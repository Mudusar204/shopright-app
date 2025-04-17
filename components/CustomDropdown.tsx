import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme'
import { Ionicons } from '@expo/vector-icons';
interface CustomDropdownProps {
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme() as "light" | "dark";
  const styles = createStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.selector} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.selectorText}>
          {value || placeholder}
        </Text>
        {isOpen ? 
          <Ionicons name="chevron-up" size={24} color={Colors[colorScheme].text} /> : 
          <Ionicons name="chevron-down" size={24} color={Colors[colorScheme].text} />
        }
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.option,
                    value === option && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const createStyles = (colorScheme: "light" | "dark") => StyleSheet.create({
  container: {
    marginTop: 12,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors[colorScheme].background_light,
    borderWidth: 1,
    borderColor: Colors[colorScheme].border,
    borderRadius: 12,
  },
  selectorText: {
    color: Colors[colorScheme].text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors[colorScheme].background,
    borderRadius: 12,
    maxHeight: '70%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors[colorScheme].border,
  },
  selectedOption: {
    backgroundColor: Colors[colorScheme].primary_color + '20',
  },
  optionText: {
    color: Colors[colorScheme].text,
    fontSize: 16,
  },
  selectedOptionText: {
    color: Colors[colorScheme].primary_color,
    fontWeight: '600',
  },
});

export default CustomDropdown; 