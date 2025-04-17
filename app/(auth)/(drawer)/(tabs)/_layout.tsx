import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Platform, Pressable, TouchableOpacity } from 'react-native';
import BackHandler from '@/components/BackHandler';
import HomeIcon from '@/assets/images/svgs/HomeIcon';
import AddListingIcon from '@/assets/images/svgs/AddListingIcon';
import ExploreIcon from '@/assets/images/svgs/ExploreIcon';
import { useGlobalStore } from '@/store/global.store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
 export default function TabLayout() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  
  const { isModalVisible, setIsModalVisible } = useGlobalStore(
    (state) => state
  );
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].text_primary,
        tabBarInactiveTintColor: Colors[colorScheme].icon_color,
        tabBarStyle: {
          position: 'absolute',
          borderTopColor: Colors[colorScheme].text_secondary,
          backgroundColor: Colors[colorScheme].background,
          overflow: 'visible',
          height: Platform.OS === 'ios' ? 88 : 80,
          paddingTop: Platform.OS === 'ios' ? 20 : 0,

          shadowColor: 'gray',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
         
         
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? Colors[colorScheme].primary_color : Colors[colorScheme].secondary_color}
            />
          ),
        }}
      />

       <Tabs.Screen
        name="(orders)"
       
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => (
              <AddListingIcon
                color={focused ? Colors[colorScheme].primary_color : Colors[colorScheme].secondary_color}
              />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="user" size={24}  color={focused ? Colors[colorScheme].primary_color : Colors[colorScheme].secondary_color} />
            // <ExploreIcon
            //   color={focused ? Colors[colorScheme].primary_color : Colors[colorScheme].secondary_color}
            // />
          ),
        }}
      /> 
    </Tabs>
  );
}
