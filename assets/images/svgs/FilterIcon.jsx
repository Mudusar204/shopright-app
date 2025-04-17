


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const FilterIcon = ({ color }) => {
    return (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M2.66669 3.33361L6.66669 3.33337" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M8.66669 3.33337H13.3334" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M10.6667 6V10" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M6.66669 1.33337V5.33337" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M8 10.6666V14.6666" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M10.6667 8L13.3334 8.0002" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M2.66669 8.0002L8.66669 8" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M8 12.6666H13.3333" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        <Path d="M2.66669 12.6668L6.00002 12.6666" stroke={color} stroke-width="1.25" stroke-linecap="round"/>
        </Svg>
        



    );
};

export default FilterIcon;
