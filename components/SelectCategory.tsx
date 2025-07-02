import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text, View } from "./Themed";
import React from "react";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";

const SelectCategoryComponent = ({
  item,
  selectedItem,
  setSelectedItem,
}: any) => {
  const colorTheme = useColorScheme() as "light" | "dark";
  const width = Dimensions.get("window").width;
  const styles = createStyles(colorTheme, width);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          selectedItem.includes(item) && styles.buttonSelected,
        ]}
        onPress={() =>
          setSelectedItem(
            selectedItem.includes(item)
              ? selectedItem.filter((i: any) => i !== item)
              : [...selectedItem, item]
          )
        }
      >
        <Text
          style={[
            styles.buttonText,
            selectedItem.includes(item) && styles.buttonTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colorTheme: "light" | "dark", width: number) =>
  StyleSheet.create({
    button: {
      paddingVertical: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[colorTheme].border,
      backgroundColor: Colors[colorTheme].background_light,
      width: width / 3 - 22,
    },
    buttonSelected: {
      backgroundColor: Colors[colorTheme].primary_color,
      borderColor: Colors[colorTheme].primary_color,
    },
    buttonText: {
      fontSize: 16,
      textAlign: "center",
      fontWeight: "400",
      color: Colors[colorTheme].text_primary,
    },
    buttonTextSelected: {
      color: Colors[colorTheme].text_white,
    },
  });
export default SelectCategoryComponent;
