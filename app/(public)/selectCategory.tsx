import { ScrollView, StyleSheet } from 'react-native'
import { Button, Text, View } from '@/components/Themed'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import InputHandler from '@/components/InputHandler';
import { router } from 'expo-router';
import SmsIcon from '@/assets/images/svgs/Sms';
import SelectCategoryComponent from '@/components/SelectCategory';
const SelectCategory = () => {
    const colorScheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorScheme);
    const [email, setEmail] = useState('');
    const categories = ["Category", "Sports", "Business", "Education","Technology","Travel","Food","Health","Education","Food","Music","Art","Fashion"];
    const [selectedCategory, setSelectedCategory] = useState([]);
   
    return (
        <View style={styles.container}>
            <Header title={null} />
            <View style={styles.contentContainer}>

                <View style={styles.categoryContainer}>
                    <Text style={[styles.title, { textAlign: "center" }]}>Welcome John</Text>
                    <Text style={[styles.subtitle, { textAlign: "center" }]}>Follow 5 or more categories to get started</Text>
                    <ScrollView contentContainerStyle={styles.languageContainer}>
                        {categories.map((cat) => (
                            <SelectCategoryComponent
                                key={cat}
                                item={cat}
                                selectedItem={selectedCategory}
                                setSelectedItem={setSelectedCategory}
                            />
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.nicheContainer}>

                    <Text style={styles.title}>Did not find your niche?</Text>
                    <Text style={styles.subtitle}> Add your category</Text>
                    <InputHandler placeholder='Type your category' value={email} onChangeText={setEmail} textContentType='emailAddress' />

                    <Button style={{ marginTop: 12 }} variant='primary' size='large' title="Let's Start" onPress={() => { router.push('/(auth)/(tabs)') }} />
                </View>
            </View>

        </View>
    )
}

export default SelectCategory

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors[theme].background,
            paddingHorizontal: 20,
            paddingBottom: 30,
        },
        contentContainer: {
            flex: 1,
            justifyContent: "space-between",
        },
        categoryContainer: {
            flex: 1,
        },
        languageContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 15,
        },
        nicheContainer: {
            //   flex:1,
        },
        title: {
            fontSize: 24,
            //   textAlign: 'center',
            marginTop: 10,
        },
        subtitle: {
            fontSize: 16,
            color: Colors[theme].text_secondary,
            marginTop: 5,
            marginBottom: 10,
        },

    });
