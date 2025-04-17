


import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const LockIcon = ({ color }) => {
    return (
        <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M17.1078 9.84139V7.60493C17.1078 4.98722 14.9848 2.8643 12.3671 2.8643C9.7494 2.85285 7.61815 4.96535 7.60669 7.5841V7.60493V9.84139" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M16.3366 22.1351H8.37725C6.196 22.1351 4.42725 20.3673 4.42725 18.1851V13.7173C4.42725 11.5351 6.196 9.76733 8.37725 9.76733H16.3366C18.5179 9.76733 20.2866 11.5351 20.2866 13.7173V18.1851C20.2866 20.3673 18.5179 22.1351 16.3366 22.1351Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M12.3572 14.7944V17.108" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        

    );
};

export default LockIcon;
