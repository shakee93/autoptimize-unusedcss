import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import usePerformanceColors from "hooks/usePerformanceColors";
import {cn} from "lib/utils";

interface PerformanceProgressBarProps {
    performance?: number
    className?: string
    scoreClassName?: string
    background?: boolean
    stroke?: number
}

const PerformanceProgressBar = ({
                                    performance,
                                    className,
                                    scoreClassName,
                                    background = true,
                                    stroke = 4
} : PerformanceProgressBarProps ) => {

    const [score, setScore] = useState(0);
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(performance ? performance : 0);

    useEffect(() => {
        if (performance) {
            let currentNumber = 0;

            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <= performance) {
                    setScore(currentNumber)
                } else {
                    clearInterval(timer);
                }
            }, 10); // Change the delay (in milliseconds) as desired

            return () => clearInterval(timer);
        }

    }, [performance]);


    return (
        <>
            <CircularProgressbarWithChildren
                strokeWidth={stroke}
                background={background}
                className={cn(
                    'h-44 relative',
                    className
                )}
                styles={
                    buildStyles({
                        pathColor: progressbarColor,
                        trailColor: !background ? progressbarBg : 'transparent',
                        pathTransitionDuration: .5,
                        strokeLinecap: 'round',
                        backgroundColor: progressbarBg
                    })} value={score}>
                                <span
                                    style={{
                                        color: progressbarColor
                                    }}
                                    className={cn(
                                        'text-4xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold',
                                        scoreClassName
                                    )}
                                >{score}</span>
            </CircularProgressbarWithChildren>
        </>
    )
}

export default PerformanceProgressBar