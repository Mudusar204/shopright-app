import React, { useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Modal, Animated, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { View, Text, Button } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import SelectButton from './SelectButton';
import Slider from '@react-native-community/slider';
const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Meat & Seafood", "Bakery & Snacks", "Household Essentials"];
const brands = ["Nestle","Pepsi", "PeakFreeze","Candy"];


interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filter: any;
    setFilter: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, filter, setFilter }) => {

    const colorScheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorScheme);

    // Animation value
    const [animation] = useState(new Animated.Value(0));

    // State for filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [priceRange, setPriceRange] = useState([1, 10000]);



    // Animate modal when visibility changes
    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 0], // Adjust this value based on your modal height
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <StatusBar hidden={true} />
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    transform: [{ translateY }]
                                }
                            ]}
                        >
                            <ScrollView style={styles.content}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.header}>Filter</Text>
                                    <AntDesign
                                        name="closecircleo"
                                        size={22}
                                        color={Colors[colorScheme].icon_color}
                                        onPress={onClose}
                                    />
                                </View>

                                {/* Categories */}
                                <Text style={styles.sectionTitle}>Category</Text>
                                <View style={styles.row}>
                                    {categories.map((cat) => (
                                        <SelectButton
                                            key={cat}
                                            item={cat}
                                            selectedItem={selectedCategory}
                                            setSelectedItem={setSelectedCategory}
                                        />
                                    ))}
                                </View>
                                {/* Categories */}
                                <Text style={styles.sectionTitle}>Brands</Text>
                                <View style={styles.row}>
                                    {brands.map((brand) => (
                                        <SelectButton
                                            key={brand}
                                            item={brand}
                                            selectedItem={selectedBrand}
                                            setSelectedItem={setSelectedBrand}
                                        />
                                    ))}
                                </View>
                                {/* Languages */}


                                {/* Price Range */}
                                <Text style={styles.sectionTitle}>Price</Text>
                                <Text style={styles.priceLabel}>
                                    Rs.{priceRange[0]} - {priceRange[1]}
                                </Text>
                                <Slider
                                    style={{ width: '100%', height: 20 }}
                                    minimumValue={1}
                                    maximumValue={10000}
                                    lowerLimit={1}
                                    upperLimit={10000}
                                    step={1}
                                    value={priceRange[1]}
                                    onValueChange={(value) => setPriceRange([1, value])}
                                    minimumTrackTintColor={Colors[colorScheme].primary_color}
                                    thumbTintColor={Colors[colorScheme].primary_color}
                                />

                                <Text style={styles.sectionTitle}>Sort By</Text>
                                <View style={styles.row}>
                                    {["Price", "Categories"].map((sort) => (
                                        <SelectButton
                                            key={sort}
                                            item={sort}
                                            selectedItem={selectedSort}
                                            setSelectedItem={setSelectedSort}
                                        />
                                    ))}
                                </View>
                                {/* Action Buttons */}
                                <View style={styles.footer}>
                                    <Button
                                        title="Reset"
                                        variant="secondary"
                                        size="medium"
                                        onPress={() => {
                                            setSelectedCategory('');
                                            setSelectedBrand('');
                                            setPriceRange([1, 10000]);
                                            setSelectedSort('');
                                            setFilter([{ all: true }, { category: "" }, { brand: "" }, { priceRange: [1, 10000] }, { sort: "" }]);
                                            onClose();
                                        }}
                                    />
                                    <Button
                                        title="Apply"
                                        variant="primary"
                                        size="medium"
                                        onPress={() => {

                                            setFilter([{ all: false }, { category: selectedCategory }, { brand: selectedBrand }, { priceRange: priceRange }, { sort: selectedSort }]);
                                            onClose();
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent backdrop
        justifyContent: 'flex-start',
    },
    modalContainer: {
        height: '60%',
        backgroundColor: Colors[colorTheme].background,
        borderRadius: 15,
        overflow: 'hidden',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flex: 1,
        padding: 25,
        marginTop: 20,

    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 10,
    },
    languageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        // marginVertical: 15,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C0C0C0',
    },
    buttonSmall: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#C0C0C0',
    },
    buttonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    buttonText: {
        fontSize: 14,
        color: '#000',
    },
    buttonTextSelected: {
        color: '#FFF',
    },
    priceLabel: {
        marginBottom: 8,
        fontSize: 14,
        color: Colors[colorTheme].primary_color,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        marginTop: 16,
    },


});

export default FilterModal;
