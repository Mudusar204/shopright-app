import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from './Themed'
import React from 'react'
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';

const SelectButton = ({ item, selectedItem, setSelectedItem }: any) => {
    const colorTheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorTheme);

    return (
        <View>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedItem === item && styles.buttonSelected,
                ]}
                onPress={() => setSelectedItem(item)}
            >
                <Text
                    style={[
                        styles.buttonText,
                        selectedItem === item && styles.buttonTextSelected,
                    ]}
                >
                    {item}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
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
        fontWeight: '500',
        color: Colors[colorTheme].text_primary,
    },
    buttonTextSelected: {
        color: Colors[colorTheme].text_white,
    },
})
export default SelectButton
