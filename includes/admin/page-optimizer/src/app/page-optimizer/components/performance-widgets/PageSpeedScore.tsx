import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {CheckBadgeIcon} from "@heroicons/react/24/solid";
import PerformanceIcons from 'app/page-optimizer/components/performance-widgets/PerformanceIcons';
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useOptimizerContext} from "../../../../context/root";
import {Skeleton} from "components/ui/skeleton"
import {JsonView} from "react-json-view-lite";
import {cn} from "lib/utils";



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

    const {setShowOptimizer} = useOptimizerContext()
    const {data, error, loading} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const [on, setOn] = useState<boolean>(false)

    const handleCoreWebClick = () => {
        setCoreWebIsClicked(!isCoreWebClicked);
    };

    const progressBarColorCode = () => {
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


    };

    const FirstLettersComponent = ({ text }: {text: string}) => {
        const firstLetters = text.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        return <>{firstLetters}</>;
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

    const calculateOpacity = () => {

        if (!data) {
            return 0;
        }

        const targetNumber = data?.performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    };

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

    return (

        <div className='w-full'>
            <PerfCard>
                <div className="content grid place-content-center place-items-center mt-[30px]">

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-3 px-4 items-center'>

                            <div className='mt-6'>
                                {loading || on ? (
                                    <Skeleton className="w-44 h-44 rounded-full"/>
                                ) : (
                                    <CircularProgressbarWithChildren strokeWidth={4} className='w-44 h-44 relative' styles={buildStyles({
                                        pathColor: progressbarColor,
                                        pathTransitionDuration: .5,
                                    })} value={performance}>
                                <span
                                    style={{
                                        opacity: calculateOpacity()
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
            </PerfCard>
            <PerfCard>
                <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                    {data?.metrics.map((s, index) => (

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
            </PerfCard>

            <PerfCard>
                <div onClick={handleCoreWebClick} className={`flex justify-around px-6 py-4 cursor-pointer`}>
                    <div>
                        <p className="">Real Experience (28 days)</p>
                        <p className="text-xs opacity-60">Real user experience from Google</p>
                    </div>
                    <CheckBadgeIcon className='w-[30px] h-[30px] ml-4 mt-1 text-green-600'/>
                </div>
                {isCoreWebClicked && (
                    <div className='border-t'>

                        <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                            {data?.metrics.map((s, index) => (

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

                    </div>
                )}

            </PerfCard>
        </div>
    )
}

export default PageSpeedScore