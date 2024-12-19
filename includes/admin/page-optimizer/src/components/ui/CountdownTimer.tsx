import React, {useState, useEffect, ReactNode} from 'react';
import {cn} from "lib/utils";

interface CountdownTimerProps {
    text?: string
    className?: string
    timerOnly?: boolean
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ text, className, timerOnly }) => {

    const [countdown, setCountdown] = useState<number>(getRandomNumber(60, 65));

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
            {countdown === 0 
                ? "It's taking longer than expected. Hang tight!"
                : timerOnly 
                    ? `${countdown}s` 
                    : `${text} — just ${countdown} seconds to completion. Hang tight!`
            }
        </p>
    );
};

export default CountdownTimer;
