


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const HeartIcon = ({ color }) => {
    return (
        <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M12.2511 21.7227C9.99008 20.3311 7.88665 18.6933 5.97851 16.8388C4.637 15.503 3.61572 13.8748 2.99289 12.0785C1.8721 8.59408 3.18126 4.60503 6.845 3.4245C8.77051 2.80462 10.8734 3.15891 12.496 4.37654C14.1191 3.1604 16.2214 2.80623 18.1471 3.4245C21.8108 4.60503 23.1294 8.59408 22.0085 12.0785C21.3857 13.8748 20.3645 15.503 19.0229 16.8388C17.1148 18.6933 15.0113 20.3311 12.7503 21.7227L12.5054 21.875L12.2511 21.7227Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M16.395 7.34692C17.5047 7.7014 18.2931 8.69765 18.3917 9.86982" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        

    );
};

export default HeartIcon;
