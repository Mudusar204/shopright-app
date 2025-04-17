import { Stack } from 'expo-router';
import React from 'react';

const ProfileLayout = () => {
  return (
    <Stack>
     
      <Stack.Screen 
        name="Profile" 
        options={{
          headerShown: false,
        }} 
      />
     
    </Stack>
  );
};

export default ProfileLayout;