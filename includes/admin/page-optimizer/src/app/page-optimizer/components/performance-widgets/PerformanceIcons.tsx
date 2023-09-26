import React, {useEffect, useState} from 'react';
import { Pass, Fail, Average } from '../icons/icon-svg';
import {cn} from "lib/utils";

interface IconProps {
    icon?: string;
    className?: string; // Add className prop
}

const PerformanceIcons = ({ icon, className }: IconProps) => {
    let [iconComponent, setIcon] = useState(<></>);


    useEffect(() => {

        if (icon === 'pass' || icon === 'FAST' || icon === 'passed_audit' ) {
            setIcon(<Pass />)
        } else if (icon === 'average' || icon === 'AVERAGE') {
            setIcon(<Average />)
        } else if (icon === 'fail' || icon === 'SLOW' ) {
            setIcon(<Fail />)
        }

    }, [])

    return (
        <span className={cn(
            className
        )}>
      {iconComponent}
    </span>
    );
};

export default PerformanceIcons;
