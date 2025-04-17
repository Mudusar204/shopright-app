import { useState } from 'react';
import { Button, Image, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { View, Text } from '@/components/Themed';
import UploadImageIcon from '@/assets/images/svgs/UploadImage';
const ImagePickerComponent = ({selectedImages, onImagesSelected}: {selectedImages: ImagePicker.ImagePickerAsset[], onImagesSelected: (images: ImagePicker.ImagePickerAsset[]) => void}) => {
  // const [image, setImage] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      onImagesSelected([...selectedImages, result.assets[0]]);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage} style={styles.imageContainer}>
      <UploadImageIcon color={"red"} />
        <Text style={styles.text}>Choose File To Upload</Text>
        {selectedImages.map((image) => (
          <Image source={{ uri: image.uri }} style={styles.image} key={image.uri} />
        ))}
      </Pressable>
    </View>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors[colorScheme].background_light,
    borderWidth: 1,
    borderColor: Colors[colorScheme].background_secondary,
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingHorizontal: 15,
    marginTop: 12,
    height: 178,
    overflow: 'hidden'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default ImagePickerComponent;