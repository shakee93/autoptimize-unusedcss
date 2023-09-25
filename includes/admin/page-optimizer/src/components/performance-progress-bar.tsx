import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import usePerformanceColors from "hooks/usePerformanceColors";
import {cn} from "lib/utils";
import {AnimatePresence, m} from "framer-motion";

interface PerformanceProgressBarProps {
    performance?: number
    className?: string
    scoreClassName?: string
    background?: boolean
    stroke?: number
    children?: ReactNode
}

const PerformanceProgressBar = ({
                                    performance,
                                    className,
                                    scoreClassName,
                                    background = true,
                                    stroke = 4,
                                    children
} : PerformanceProgressBarProps ) => {

    const [score, setScore] = useState(0);
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(performance);

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
                    'relative',
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
                <AnimatePresence initial={false}>
                                <div
                                    style={{
                                        color: progressbarColor
                                    }}
                                    className={cn(
                                        'w-full flex gap-2 flex-col text-center text-4xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold',
                                        scoreClassName
                                    )}
                                >

                                        <span>{score}</span>
                                        {children && (
                                            <m.div
                                                key='children'  // add a unique key
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 10}}
                                            >
                                                {children}
                                            </m.div>
                                        )}

                                </div>
                </AnimatePresence>
            </CircularProgressbarWithChildren>
        </>
    )
}

export default PerformanceProgressBar