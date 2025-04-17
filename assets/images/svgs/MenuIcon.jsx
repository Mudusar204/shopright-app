


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const MenuIcon = ({ color }) => {
    return (    
        <Svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M7.25 11L19.75 11M1 6L19.75 6M1 1L13.5 1" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        
    );
};

export default MenuIcon;
