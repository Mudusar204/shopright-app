


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const BrightnessIcon = ({ color }) => {
    return (
        <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M12.5 1.04175V3.12508M12.5 21.8751V23.9584M4.39586 4.39592L5.87502 5.87509M19.125 19.1251L20.6042 20.6042M1.04175 12.5001H3.12508M21.875 12.5001H23.9584M4.39586 20.6042L5.87502 19.1251M19.125 5.87509L20.6042 4.39592M17.7084 12.5001C17.7084 15.3766 15.3766 17.7084 12.5001 17.7084C9.6236 17.7084 7.29175 15.3766 7.29175 12.5001C7.29175 9.6236 9.6236 7.29175 12.5001 7.29175C15.3766 7.29175 17.7084 9.6236 17.7084 12.5001Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        
       


    );
};

export default BrightnessIcon;
