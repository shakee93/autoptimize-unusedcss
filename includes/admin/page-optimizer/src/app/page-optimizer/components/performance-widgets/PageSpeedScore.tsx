import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CheckBadgeIcon} from "@heroicons/react/24/solid";
import PerformanceIcons from 'app/page-optimizer/components/performance-widgets/PerformanceIcons';
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useAppContext} from "../../../../context/app";
import {Skeleton} from "components/ui/skeleton"
import {JsonView} from "react-json-view-lite";
import {cn} from "lib/utils";
import Card from "components/ui/card";



interface PageSpeedScoreProps {
    pagespeed?: any;
    priority?: boolean;
}

interface PerfCardProps {
    children: ReactNode,
    className?: string
}

const PageSpeedScore = ({pagespeed, priority = true }: PageSpeedScoreProps) => {
    const [performanceIcon, setPerformanceIcon] = useState('fail');
    const [progressbarColor, setProgressbarColor] = useState('#ECECED');
    const [isCoreWebClicked, setCoreWebIsClicked] = useState(false);

    const {setShowOptimizer} = useAppContext()
    const {data, error, loading} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const [on, setOn] = useState<boolean>(false)

    const handleCoreWebClick = useCallback(() => {
        setCoreWebIsClicked(!isCoreWebClicked);
    }, [isCoreWebClicked]);

    const progressBarColorCode = useCallback( () => {
        const performance = data?.performance?? 0;

        if (performance < 50) {
            setProgressbarColor('#FF3333');
            setPerformanceIcon('fail')
        } else if (performance < 90) {
            setProgressbarColor('#FFAA33');
            setPerformanceIcon('average')
        } else if (performance < 101) {
            setProgressbarColor('#09B42F');
            setPerformanceIcon('pass')
        }
    }, [data?.performance]);

    const FirstLettersComponent = ({ text }: { text: string }) => {
        const replacedText = text.replace(/_/g, ' ');
        const firstLetters = replacedText.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        const shortenedText = firstLetters.slice(0, 3);
        return <>{shortenedText}</>;
    };


    useEffect(() => {
        progressBarColorCode();
        if (!loading && data) {
            let currentNumber = 0;

            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <= data?.performance) {
                    setPerformance(currentNumber)
                } else {
                    clearInterval(timer);
                }
            }, 10); // Change the delay (in milliseconds) as desired

            return () => clearInterval(timer);
        }

    }, [data, loading]);

    const calculateOpacity = useMemo( () => {

        if (!data) {
            return 0;
        }

        const targetNumber = data?.performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    }, [performance]);

    const PerfCard = ({ children, className } : PerfCardProps) => {

        return (
            <div className={cn(
                'mb-3 drop-shadow-sm rounded-3xl border bg-brand-50 dark:bg-brand-950',
                className
            )}>
                {children}
            </div>
        )
    }

    const desiredOrder = [
        "First Contentful Paint",
        "Largest Contentful Paint",
        "Total Blocking Time",
        "Cumulative Layout Shift",
        "Speed Index",
    ];
    const sortedData = data?.metrics.sort((a, b) => {
        const aIndex = desiredOrder.indexOf(a.title);
        const bIndex = desiredOrder.indexOf(b.title);

        // If either metric is not found in the desiredOrder array, place it at the end.
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        // Sort based on the index in the desiredOrder array.
        return aIndex - bIndex;
    });

    const metricOrder = [
        "LARGEST_CONTENTFUL_PAINT_MS",
        "FIRST_INPUT_DELAY_MS",
        "CUMULATIVE_LAYOUT_SHIFT_SCORE",
        "FIRST_CONTENTFUL_PAINT_MS",
        "INTERACTION_TO_NEXT_PAINT",
        "EXPERIMENTAL_TIME_TO_FIRST_BYTE"
    ];




    return (

        <div className='w-full flex flex-col gap-4'>
            <Card>
                <div className="content grid place-content-center place-items-center mt-[30px]">

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-3 px-4 items-center'>

                            <div className='mt-6'>
                                {loading || on ? (
                                    <Skeleton className="w-44 h-44 rounded-full"/>
                                ) : (
                                    <CircularProgressbarWithChildren
                                        strokeWidth={4}
                                        className='w-44 h-44 relative'
                                        styles={
                                            buildStyles({
                                                pathColor: progressbarColor,
                                                trailColor: '#eeeeee',
                                                pathTransitionDuration: .5,
                                                strokeLinecap: 'round',
                                            })} value={performance}>
                                <span
                                    style={{
                                        opacity: calculateOpacity
                                    }}
                                    className='text-5xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'
                                >{performance}</span>
                                    </CircularProgressbarWithChildren>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex mb-2 mt-3">
                        <PerformanceIcons icon={performanceIcon} className={'mt-2 mr-1'}/>
                        <h1 className="text-base font-bold">Performance</h1>
                    </div>
                    <div className="flex justify-around text-xm gap-4 font-normal w-full mb-5">
                        <div className="flex items-center gap-1">
                            <PerformanceIcons icon={'fail'}/>
                            0-49
                        </div>
                        <div className="flex items-center gap-1">
                            <PerformanceIcons icon={'average'}/>
                            50-89
                        </div>
                        <div className="flex items-center gap-1">
                            <PerformanceIcons icon={'pass'}/>
                            89-100
                        </div>
                    </div>

                </div>
            </Card>
            <Card>
                <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                    {sortedData?.map((s, index) => (

                        <div key={index} className={`${index % 3 === 2 ? 'mb-4' : ''}`}>
                            <div className="flex">
                                <div className="grid grid-cols-2 gap-1.5 items-center justify-center">
                                    <div><p className="text-xs font-medium">{<FirstLettersComponent text={s.title} />}</p></div>
                                    <div><span
                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full dark:bg-brand-700 bg-brand-100`}>
                                <PerformanceIcons icon={s.icon}/>
                            </span></div>
                                </div>
                            </div>
                            <p className="text-[22px] font-medium mr-2 mt-1 text-red">{s.displayValue}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {data?.loadingExperience?.metrics && (
                <Card>
                    <div onClick={handleCoreWebClick} className={`flex justify-around px-6 py-4 cursor-pointer`}>
                        <div>
                            <p className="">Real Experience (28 days)</p>
                            <p className="text-xs opacity-60">Real user experience from Google</p>
                        </div>
                        <CheckBadgeIcon className='w-[30px] h-[30px] ml-4 mt-1 text-green-600'/>
                    </div>
                    {isCoreWebClicked && (
                        <div className='border-t dark:border-zinc-700'>

                            <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                                {Object.entries(data.loadingExperience.metrics).map(([metricName, metric], index) => (
                                    <div key={index} className={`${index % 3 === 2 ? 'mb-4' : ''}`}>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 gap-1.5 items-center justify-center">
                                                <div><p className="text-xs font-medium">{<FirstLettersComponent text={metricName} />}</p></div>
                                                <div><span
                                                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full dark:bg-zinc-700 bg-zinc-100`}>
                                <PerformanceIcons icon={metric.category}/>
                            </span></div>
                                            </div>
                                        </div>
                                        <p className="text-[22px] font-medium mr-2 mt-1 text-red">{metric.percentile}</p>

                                    </div>
                                ))}


                            </div>

                        </div>
                    )}

                </Card>
            )}



        </div>
    )
}

export default React.memo(PageSpeedScore)