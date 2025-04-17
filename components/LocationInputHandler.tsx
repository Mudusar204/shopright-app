import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface LocationInputHandlerProps {
  placeholder?: string;
  onLocationSelect: (data: any, details: any) => void;
  leftIcon?: React.ReactNode;
}

const LocationInputHandler = ({ 
  placeholder = 'Search location', 
  onLocationSelect,
  leftIcon 
}: LocationInputHandlerProps) => {
  const theme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={onLocationSelect}
        fetchDetails={true}
        query={{
          key: 'AIzaSyAKmwq_hiM8N93ukg6pe1OvuLPV57_Eo8U',
          language: 'en',
        }}
        enablePoweredByContainer={false}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.input,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          separator: styles.separator,
          poweredContainer: { display: 'none' },
        }}
        textInputProps={{
          placeholderTextColor: Colors[theme].text_secondary,
        }}
      />
    </View>
  );
};

export default LocationInputHandler;

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[theme].background_light,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      borderRadius: 12,
      marginTop: 12,
      zIndex: 50,
      elevation: 50,
      position: 'relative',
    },
    iconContainer: {
      paddingLeft: 15,
      paddingVertical: 17,
      zIndex: 51,
    },
    autocompleteContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      zIndex: 51,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      backgroundColor: 'transparent',
      color: Colors[theme].text,
      height: 54,
      marginLeft: 10,
      marginTop: 0,
      marginBottom: 0,
      paddingVertical: 0,
    },
    listView: {
      position: 'absolute',
      top: 60,
      left: -32,
      width: Dimensions.get('window').width - 40,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      zIndex: 999,
      elevation: 999,
    },
    row: {
      backgroundColor: 'transparent',
      padding: 15,
    },
    description: {
      color: Colors[theme].text,
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: Colors[theme].border,
    },
  }); 