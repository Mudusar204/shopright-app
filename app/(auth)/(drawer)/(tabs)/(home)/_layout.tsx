import { Stack } from 'expo-router';
import React from 'react';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="product-details" 
        options={{ 
          headerShown: false 
        }} 
      />
      {/* Add other home-related screens here */}
    </Stack>
  );
};

export default HomeLayout;