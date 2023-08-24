import React from 'react';
import { Pass, Fail, Average } from '../icons/icon-svg';

interface IconProps {
    icon: string;
    className?: string; // Add className prop
}

const PerformanceIcons = ({ icon, className }: IconProps) => {
    let iconComponent = null;

    if (icon === 'pass' || icon === 'FAST' ) {
        iconComponent = <Pass />;
    } else if (icon === 'average' || icon === 'AVERAGE') {
        iconComponent = <Average />;
    } else if (icon === 'fail' || icon === 'SLOW' ) {
        iconComponent = <Fail />;
    }

    return (
        <span className={`${className}`}>
      {iconComponent}
    </span>
    );
};

export default PerformanceIcons;
