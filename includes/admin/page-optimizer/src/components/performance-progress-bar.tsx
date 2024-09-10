import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import React, {ReactNode, useEffect, useState, useCallback, useMemo} from "react";
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
    animate?: boolean
    loading?: boolean
}

const messages = [
    'Initiating analysis',
    'Fetching assets',
    'Running PageSpeed Insights',
    'Analyzing performance',
    'Evaluating metrics',
    'Compiling results',
    'Almost done',
];

const loadingColor = 'rgb(231 231 233)'; // zinc-400
const loadingBgColor = 'rgb(244 244 245)'; // zinc-100

const PerformanceProgressBar: React.FC<PerformanceProgressBarProps> = ({
    performance,
    className,
    scoreClassName,
    background = true,
    stroke = 4,
    children,
    animate = true,
    loading = false
}) => {
    const [score, setScore] = useState(animate ? 0 : performance || 0);
    const [message, setMessage] = useState(0);
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(performance);

    const animateScore = useCallback(() => {
        if (performance && animate) {
            let currentNumber = 0;
            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <= performance) {
                    setScore(currentNumber);
                } else {
                    clearInterval(timer);
                }
            }, 10);
            return () => clearInterval(timer);
        }
    }, [performance, animate]);

    const cycleMessages = useCallback(() => {
        if (loading) {
            const interval = setInterval(() => {
                setMessage(p => (p >= messages.length - 1 ? 0 : p + 1));
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(animateScore, [animateScore]);
    useEffect(cycleMessages, [cycleMessages]);

    const progressBarStyles = useMemo(() => buildStyles({
        pathColor: loading ? loadingColor : progressbarColor,
        trailColor: !background ? (loading ? loadingBgColor : progressbarBg) : 'transparent',
        pathTransitionDuration: 0.5,
        strokeLinecap: 'round',
        backgroundColor: loading ? loadingBgColor : progressbarBg
    }), [loading, progressbarColor, background, progressbarBg]);

    return (
        <CircularProgressbarWithChildren
            strokeWidth={stroke}
            background={background}
            className={cn(
                'max-h-[176px] relative w-full align-middle',
                className,
                loading && 'animate-spin'
            )}
            styles={progressBarStyles}
            value={score}
        >
            <AnimatePresence initial={false}>
                <div
                    style={{ color: loading ? loadingColor : progressbarColor }}
                    className={cn(
                        'w-full flex gap-2 flex-col text-center text-4xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold',
                        scoreClassName
                    )}
                >
                    {!loading && <span>{score.toFixed(0)}</span>}
                    <span className={cn(
                        "text-xs font-normal px-6",
                        loading && 'text-brand-400'
                    )}>
                        {loading ? messages[message] : "Performance Score"}
                    </span>
                    {children && (
                        <m.div
                            key='children'
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
    );
};

export default React.memo(PerformanceProgressBar);