import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import React, { ReactNode, useEffect, useState, useCallback, useMemo } from "react";
import usePerformanceColors from "hooks/usePerformanceColors";
import { cn } from "lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { Loader } from "lucide-react";

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
    const [message, setMessage] = useState(-1); // Change initial state to -1

    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(performance, loading);

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
            setMessage(0); // Set initial message immediately
            const interval = setInterval(() => {
                setMessage(p => (p >= messages.length - 1 ? 0 : p + 1));
            }, 7000);
            return () => clearInterval(interval);
        } else {
            setMessage(-1); // Reset message when not loading
        }
    }, [loading]);

    useEffect(animateScore, [animateScore]);
    useEffect(cycleMessages, [cycleMessages]);

    const progressBarStyles = useMemo(() => buildStyles({
        pathColor: progressbarColor,
        trailColor: !background ? progressbarBg : 'transparent',
        pathTransitionDuration: 0.5,
        strokeLinecap: 'round',
        backgroundColor: progressbarBg
    }), [progressbarColor, background, progressbarBg]);

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
            value={!loading ? score : 85}
        >
            <AnimatePresence initial={false}>
                <div
                    style={{ color: !loading ? progressbarColor : '#777777' }}
                    className={cn(
                        'w-full flex flex-col items-center text-center text-4xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold',
                        scoreClassName,
                        children && 'gap-1',
                        loading && 'gap-2'
                    )}
                >
                    {!loading && <span>{score.toFixed(0)}</span>}

                    <AnimatePresence mode="wait">
                        {loading && message !== -1 && (
                            <m.span
                                key={message}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1] // Easing function (ease-out)
                                }}
                                className={cn(
                                    "text-xs font-normal px-6",
                                )}
                            >
                                {loading && messages[message]}
                            </m.span>
                        )}
                    </AnimatePresence>

                    {children && (
                        <m.div
                            key='children'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
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