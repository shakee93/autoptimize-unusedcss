import React, {useEffect, useRef, useState} from 'react';
import {CheckBadgeIcon} from "@heroicons/react/24/solid";
import PerformanceIcons from 'app/page-optimizer/components/performance-widgets/PerformanceIcons';
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useOptimizerContext} from "../../../../context/root";
import {Skeleton} from "components/ui/skeleton"



interface PageSpeedScoreProps {
    pagespeed?: any;
    priority?: boolean;
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
        const performance = data?.data.performance?? 0;
        console.log("Score",performance)

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

    const FirstLettersComponent = ({ text }) => {
        const firstLetters = text.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        return firstLetters;
    };


    useEffect(() => {
        progressBarColorCode();
        console.log("performance", data?.data.metrics.icon);
        if (!loading && data) {
            let currentNumber = 0;

            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <= data.data.performance) {
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

        const targetNumber = data.data.performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    };


    return (

        <div>
            <div className="w-[285px] h-[325px] mb-3 drop-shadow-sm rounded-xl border border-gray-200 bg-white">
                <div className="content grid place-content-center place-items-center mt-[30px]">

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
                                    className='text-5xl transition-all ease-out duration-300 absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'
                                >{performance}%</span>
                            </CircularProgressbarWithChildren>
                        )}
                    </div>


                    <div className="flex mb-2 mt-3">
                        <PerformanceIcons icon={performanceIcon} className={'mt-2 mr-1'}/>
                        <h1 className="text-base font-bold">Performance</h1>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex">
                            <PerformanceIcons icon={'fail'} className={'mt-2 mr-1'}/>
                            <p className="text-xm font-normal">0-49</p>
                        </div>
                        <div className="flex">
                            <PerformanceIcons icon={'average'} className={'mt-2 mr-1'}/>
                            <p className="text-xm font-normal">50-89</p>
                        </div>
                        <div className="flex">
                            <PerformanceIcons icon={'pass'} className={'mt-2 mr-1'}/>
                            <p className="text-xm font-normal">89-100</p>
                        </div>
                    </div>
            
                </div>
            </div>
            {/*<div className="w-[285px] h-[195px] mb-3 drop-shadow-sm rounded-xl border border-gray-200 bg-white">*/}
            {/*    <div className="p-5 grid grid-cols-3 gap-3">*/}
            {/*        {pagespeed?.metrics.map((data, index) => (*/}
            {/*        <div className={'justify-center grid'}>*/}
            {/*            <div className="flex">*/}
            {/*                <p className="text-sm font-medium mr-2 mt-[1px]">{data.title}</p>*/}
            {/*                <span*/}
            {/*                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>*/}
            {/*                    <PerformanceIcons icon={data.icon }/>*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*            <p className="text-2xl font-medium text-red">{data.data.performance}</p>*/}
            {/*        </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
            
            <div onClick={handleCoreWebClick} className="w-[285px] drop-shadow-sm rounded-xl border border-gray-200 bg-white ">
                <div className={`flex p-5 pl-6 border-b-[1px] border-gray-200 cursor-pointer`}>
                    <div>
                        <p className="text-[16px] font-medium text-black">Core Web Vitals (28 days)</p>
                        <p className="text-[12px] font-medium text-gray-light-font">Real user experience from Google</p>
                    </div>
                    <div>
                            <CheckBadgeIcon className='w-[30px] h-[30px] ml-4 mt-1 text-green-600'/>
                    </div>
                </div>
                <div className={`${isCoreWebClicked ? 'visible h-[180px]' : 'invisible h-[0px]'}`}>
                <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                    {data?.data.metrics.map((s, index) => (

                    <div key={index} className={`${index % 3 === 2 ? 'mb-4' : ''}`}>
                        <div className="flex">
                            <p className="text-xs font-medium mr-[8px] mt-[1px]">{<FirstLettersComponent text={s.title} />}</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <PerformanceIcons icon={s.icon}/>
                            </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 mt-1 text-red">{s.displayValue}</p>
                    </div>
                    ))}
                </div>

                </div>
            
            </div>
        </div>
    )
}

export default PageSpeedScore