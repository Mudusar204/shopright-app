


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const LocationIcon = ({ color,size="small" }) => {
    return (
        <Svg width={size=== "large" ? "16" :"8"} height={size=== "large" ? "16" :"8"} viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M4.64174 7.22342C4.49372 7.36201 4.29583 7.43951 4.08988 7.43951C3.88393 7.43951 3.68607 7.36201 3.53801 7.22342C2.18226 5.94634 0.365389 4.51972 1.25142 2.44853C1.73049 1.32866 2.88048 0.612061 4.08988 0.612061C5.29929 0.612061 6.44927 1.32866 6.92835 2.44853C7.81326 4.51712 6.00084 5.95075 4.64174 7.22342Z" stroke={color ? color: "#5E81F4"} strokeWidth="0.640167"/>
        <Path d="M5.28466 3.68492C5.28466 4.34479 4.74973 4.87972 4.08985 4.87972C3.42998 4.87972 2.89505 4.34479 2.89505 3.68492C2.89505 3.02504 3.42998 2.49011 4.08985 2.49011C4.74973 2.49011 5.28466 3.02504 5.28466 3.68492Z" stroke={color ? color: "#5E81F4"} strokeWidth="0.640167"/>
        </Svg>
        

    );
};

export default LocationIcon;
