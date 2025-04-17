import { StyleSheet, Text, TextInputProps, View } from 'react-native'
import React from 'react'
import { TextInput } from './Themed'
import Colors from '@/constants/Colors'
import { useColorScheme } from './useColorScheme'
const InputHandler = ({ placeholder, value, onChangeText, secureTextEntry, leftIcon, rightIcon, textContentType, multiline }: { placeholder: string, value: string, onChangeText: (text: string) => void, secureTextEntry?: boolean, leftIcon?: React.ReactNode, rightIcon?: React.ReactNode, textContentType?: TextInputProps['textContentType'], multiline?: boolean }) => {
    const theme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(theme);
    return (
        <View style={styles.container} >
            {leftIcon}
            <TextInput multiline={multiline} numberOfLines={multiline ? 4 : 1} placeholder={placeholder} textContentType={textContentType} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} style={[styles.input, { height: multiline ? 150 : "auto" }]} />
            {rightIcon}
        </View>
    )
}

export default InputHandler

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors[theme].background_light,
            borderWidth: 1,
            borderColor: Colors[theme].border,
            borderRadius: 12,
            paddingHorizontal: 15,
            paddingVertical: 17,
            marginTop: 12,
        },
        input: {
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            backgroundColor: "transparent",
            marginLeft: 10,
        }
    })