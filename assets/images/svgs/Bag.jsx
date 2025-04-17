


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const BagIcon = ({ color }) => {
    return (
        <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M7.7982 22.3957H16.4939C19.6879 22.3957 22.1383 21.242 21.4424 16.5987L20.6319 10.3057C20.2028 7.98878 18.725 7.10205 17.4282 7.10205H6.82566C5.50986 7.10205 4.1178 8.05553 3.62199 10.3057L2.81154 16.5987C2.2204 20.7176 4.60407 22.3957 7.7982 22.3957Z" stroke={color} strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M7.65527 6.87323C7.65527 4.38774 9.67016 2.37284 12.1556 2.37284C13.3525 2.36777 14.5021 2.83968 15.3502 3.68422C16.1983 4.52875 16.6751 5.67634 16.6751 6.87323" stroke={color} strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M9.06641 11.5645H9.11408" stroke={color} strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
        <Path d="M15.1399 11.5645H15.1876" stroke={color} strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
        </Svg>
        

    );
};

export default BagIcon;
