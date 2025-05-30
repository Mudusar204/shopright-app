


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const InfoIcon = ({ color }) => {
    return (
        <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M12.4999 2.86475C17.8218 2.86475 22.1354 7.17933 22.1354 12.5002C22.1354 17.821 17.8218 22.1356 12.4999 22.1356C7.17909 22.1356 2.8645 17.821 2.8645 12.5002C2.8645 7.17933 7.17909 2.86475 12.4999 2.86475Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M12.4949 8.54614V13.1492" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M12.4949 16.4543H12.5049" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        

    );
};

export default InfoIcon;
