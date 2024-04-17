import React, {useState, useEffect, ReactNode} from 'react';
import {cn} from "lib/utils";

interface CountdownTimerProps {
    text: string
    className: string
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ text, className }) => {

    const [countdown, setCountdown] = useState<number>(getRandomNumber(30, 40));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown > 0) {
                    return prevCountdown - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <p className={cn(
            ' select-none',
            className
        )}>
            {text} — just {countdown} seconds to completion. Hang tight!
        </p>
    );
};

export default CountdownTimer;
