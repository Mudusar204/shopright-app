


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const PhoneIcon = ({ color,size="small" }) => {
    return (
        <Svg width={size=== "large" ? "16" :"9"} height={size=== "large" ? "16" :"9"} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M2.55166 1.18274C2.75663 1.18274 3.57648 3.0274 3.57648 3.23237C3.57648 3.64229 2.96159 4.05222 2.75663 4.46214C2.55166 4.87207 2.96159 5.282 3.37152 5.69192C3.53139 5.85179 4.19137 6.51177 4.60129 6.30681C5.01122 6.10185 5.42114 5.48696 5.83107 5.48696C6.03603 5.48696 7.8807 6.30681 7.8807 6.51177C7.8807 7.33162 7.26581 7.94651 6.65092 8.15148C6.03603 8.35644 5.62611 8.35644 4.80626 8.15148C3.9864 7.94651 3.37152 7.74155 2.3467 6.71674C1.32189 5.69192 1.11692 5.07703 0.911962 4.25718C0.706999 3.43733 0.706999 3.0274 0.911962 2.41252C1.11692 1.79763 1.73181 1.18274 2.55166 1.18274Z" stroke={color} strokeWidth="0.657458" strokeLinecap="round" stroke-linejoin="round"/>
        <Path d="M5.01126 2.83887C5.28181 2.96594 5.52777 3.13811 5.73273 3.34717C5.93359 3.54804 6.10166 3.78989 6.22464 4.05225" stroke={color} strokeWidth="0.657458" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M5.42131 1.28516C5.99931 1.43683 6.51581 1.73607 6.92574 2.146C7.33156 2.55593 7.63081 3.06833 7.77838 3.64223" stroke={color} strokeWidth="0.657458" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        

    );
};

export default PhoneIcon;
