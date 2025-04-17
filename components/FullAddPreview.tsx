import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import EditIcon from '@/assets/images/svgs/Edit';
import { Button } from './Themed';
import LocationIcon from '@/assets/images/svgs/Location';
import PhoneIcon from '@/assets/images/svgs/Phone';
import InfoIcon from '@/assets/images/svgs/Info';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
interface AddPreviewProps {
    title: string;
    price: number;
    location: string;
    contactNumber: string;
    category: string;
    imageUrl: string;
    description: string;
    setIsFullPreviewMode: (isFullPreviewMode: boolean) => void;
    setIsPreviewMode: (isPreviewMode: boolean) => void;
}

const AddPreview = ({ title, price, location, contactNumber, category, imageUrl, description, setIsFullPreviewMode, setIsPreviewMode }: AddPreviewProps) => {
    const colorScheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorScheme);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Full Ad Preview</Text>

            <View style={styles.imageContainer}>

                <Image
                    source={imageUrl && imageUrl.includes('http') ? { uri: imageUrl as string } : require('@/assets/images/productImg.jpg')}
                    style={styles.image}
                />
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>{title || 'Luxury Car'}</Text>

                {/* <EditIcon color={Colors[colorScheme].icon_color} /> */}
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>Price</Text>
                <Text style={styles.price}>{`$${price}` || '$230.00'}</Text>
            </View>
            <View style={styles.infoRow}>
                <LocationIcon size={"large"} color={Colors[colorScheme].primary_color} />
                <Text style={styles.infoText}>{location || 'Los Angeles, United States'}</Text>
            </View>
            <View style={styles.infoRow}>
                <PhoneIcon size={"large"} color={Colors[colorScheme].primary_color} />
                <Text style={styles.infoText}>{contactNumber || '(98) 749 9790384'}</Text>
            </View>
            <View style={styles.infoRow}>
                <FontAwesome6 name="clock-four" size={16} color={Colors[colorScheme].primary_color} />
                <Text style={styles.infoText}>{new Date().toLocaleString() || '12:30 PM, Thursday'}</Text>
            </View>
            <Text style={[styles.title, { marginTop: 15 }]}>Description</Text>
            <Text style={styles.description}>{description || 'Introducing THE NEW VOLVO XC40'}</Text>
            <Button variant="primary" title="Publish Now" onPress={() => { setIsFullPreviewMode(false); setIsPreviewMode(false); }} size="large" />
        </View>
    );
};

const createStyles = (colorScheme: 'light' | 'dark') =>
    StyleSheet.create({
        card: {
            backgroundColor: Colors[colorScheme].background_light,
            borderRadius: 12,
            padding: 15,
            borderWidth: 1,
            borderColor: Colors[colorScheme].border,
            marginBottom: 30,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            marginBottom: 5,
        },
        price: {
            fontSize: 20,
            fontWeight: '800',
            color: Colors[colorScheme].primary_color,
            marginBottom: 10,
        },
        badge: {
            alignSelf: 'flex-start',
            backgroundColor: Colors[colorScheme].primary_color,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
            marginBottom: 10,
        },
        badgeText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        imageContainer: {
            backgroundColor: Colors[colorScheme].secondary_light_color,
            width: '100%',
            height: 600,
            borderRadius: 10,
            marginTop: 15,
            marginBottom: 10,
        },
        image: {
            padding: 15,
            width: '100%',
            height: "100%",
            borderRadius: 10,
            resizeMode: 'cover',

        },
        description: {
            fontSize: 14,
            fontWeight: '500',
            color: Colors[colorScheme].text_secondary,
            marginBottom: 15,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
        },
        infoText: {
            fontSize: 14,
            color: Colors[colorScheme].icon_color,
            marginLeft: 5,
        },
    });

export default AddPreview;
