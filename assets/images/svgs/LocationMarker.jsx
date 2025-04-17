


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

const LocationMarker = ({ color }) => {
    return (
        <Svg width="32" height="47" viewBox="0 0 32 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Ellipse opacity="0.15" cx="15.9381" cy="37.7939" rx="13.9464" ry="8.14292" transform="rotate(0.926985 15.9381 37.7939)" fill="#252B5C" />
            <Ellipse opacity="0.5" cx="15.9381" cy="37.7939" rx="6.43678" ry="3.80003" transform="rotate(0.926985 15.9381 37.7939)" fill="#252B5C" />
            <Path d="M31.3065 16.3252C31.1984 23.0113 21.4988 33.3575 17.5576 37.2896C16.6508 38.1944 15.2127 38.1711 14.3356 37.2375C10.5237 33.1799 1.16397 22.5253 1.27216 15.8392C1.33738 11.8084 2.98209 7.96834 5.84448 5.16371C8.70686 2.35908 12.5525 0.819654 16.5353 0.884097C20.5181 0.94854 24.3118 2.61157 27.082 5.50734C29.8522 8.40311 31.3718 12.2944 31.3065 16.3252Z" fill="url(#paint0_linear_18_1565)" />
            <Path opacity="0.25" d="M16.0921 28.2684C19.3721 28.3215 22.5388 27.0694 24.8956 24.7877C27.2524 22.5059 28.6063 19.3814 28.6593 16.1014C28.7124 12.8215 27.4603 9.65476 25.1786 7.29795C22.8968 4.94114 19.7723 3.58728 16.4923 3.53421C13.2124 3.48114 10.0457 4.7332 7.68888 7.01496C5.33207 9.29671 3.97821 12.4212 3.92514 15.7012C3.87207 18.9812 5.12413 22.1479 7.40589 24.5047C9.68764 26.8615 12.8122 28.2153 16.0921 28.2684Z" fill="white" />
            <Defs>
                <LinearGradient id="paint0_linear_18_1565" x1="16.5353" y1="0.884097" x2="15.9205" y2="38.8794" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#CCCCCC" />
                    <Stop offset="1" stop-color="#CCCCCC" />
                </LinearGradient>
            </Defs>
        </Svg>




    );
};

export default LocationMarker;
