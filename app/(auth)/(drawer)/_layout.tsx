import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer';
import DrawerScreen from '@/screens/drawer/DrawerScreen';
const Layout = () => {
  return (

    <Drawer  drawerContent={(props) => <DrawerScreen />} screenOptions={{
      drawerType: 'front',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      headerShown: false,
      drawerStyle: {
        width: 300,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}/>

  )
}

export default Layout
