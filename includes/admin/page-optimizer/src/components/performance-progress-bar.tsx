import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import React, {useCallback, useEffect, useMemo, useState} from "react";

interface PerformanceProgressBarProps {
    performance?: number
}

const PerformanceProgressBar = ({ performance } : PerformanceProgressBarProps ) => {

    if (!performance) {
        return <></>
    }

    const [score, setScore] = useState(0);
    const [performanceIcon, setPerformanceIcon] = useState('fail');
    const [progressbarColor, setProgressbarColor] = useState('#ECECED');
    const [progressbarBg, setProgressbarBg] = useState('#ECECED');


    const progressBarColorCode = useCallback( () => {
        const bgOpacity = 0.05

        if (performance < 50) {
            setProgressbarColor('#ff4e43');
            setProgressbarBg(`rgb(255, 51, 51, ${bgOpacity} )`);
            setPerformanceIcon('fail')
        } else if (performance < 90) {
            setProgressbarColor('#FFAA33');
            setProgressbarBg(`rgb(255, 170, 51, ${bgOpacity})`);
            setPerformanceIcon('average')
        } else if (performance < 101) {
            setProgressbarColor('#09B42F');
            setProgressbarBg(`rgb(9, 180, 4, ${bgOpacity})`);
            setPerformanceIcon('pass')
        }
    }, [performance]);


    useEffect(() => {
        progressBarColorCode();
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

    const calculateOpacity = useMemo( () => {

        if (!performance) {
            return 0;
        }

        const targetNumber = performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    }, [performance]);

    return (
        <>
            <CircularProgressbarWithChildren
                strokeWidth={4}
                background={true}
                className='w-44 h-44 relative'
                styles={
                    buildStyles({
                        pathColor: progressbarColor,
                        trailColor: 'transparent',
                        pathTransitionDuration: .5,
                        strokeLinecap: 'round',
                        backgroundColor: progressbarBg
                    })} value={score}>
                                <span
                                    style={{
                                        opacity: 1,
                                        color: progressbarColor
                                    }}
                                    className='text-4xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'
                                >{score}</span>
            </CircularProgressbarWithChildren>
        </>
    )
}

export default PerformanceProgressBar