import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import React, { useCallback } from "react";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";

interface SelectButtonProps {
  item: string | { id: number; name: string };
  selectedItem: string | { id: number; name: string } | null;
  setSelectedItem: (item: any) => void;
}

const SelectButton = React.memo(
  ({ item, selectedItem, setSelectedItem }: SelectButtonProps) => {
    const colorTheme = useColorScheme() as "light" | "dark";
    const styles = createStyles(colorTheme);

    const handlePress = useCallback(() => {
      setSelectedItem(item);
    }, [item, setSelectedItem]);

    // Compare by id if both are objects, otherwise by value
    const isSelected =
      typeof item === "object" &&
      item !== null &&
      typeof selectedItem === "object" &&
      selectedItem !== null
        ? item.id === selectedItem.id
        : item === selectedItem;

    return (
      <View>
        <TouchableOpacity
          style={[styles.button, isSelected && styles.buttonSelected]}
          onPress={handlePress}
        >
          <Text
            style={[styles.buttonText, isSelected && styles.buttonTextSelected]}
          >
            {typeof item === "object" && item !== null
              ? item.name
              : String(item)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

SelectButton.displayName = "SelectButton";

const createStyles = (colorTheme: "light" | "dark") =>
  StyleSheet.create({
    button: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
      backgroundColor: Colors[colorTheme].background_light,
    },
    buttonSelected: {
      backgroundColor: Colors[colorTheme].primary_color,
      borderColor: Colors[colorTheme].primary_color,
    },
    buttonText: {
      fontSize: 12,
      fontWeight: "500",
      color: Colors[colorTheme].text_primary,
    },
    buttonTextSelected: {
      color: Colors[colorTheme].text_white,
    },
  });
export default SelectButton;
