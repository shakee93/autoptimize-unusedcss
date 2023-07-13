import React, {useEffect, useRef, useState} from 'react';
import {CheckBadgeIcon} from "@heroicons/react/24/solid";

import {
    Pass,
    Fail,
    Average,
} from '../parts/icon-svg';
import Icon from '../parts/Icon';



interface PageSpeedScoreProps {
    pagespeed?: PageSpeed;
    priority?: boolean;
}

const PageSpeedScore = ({pagespeed, priority = true }: PageSpeedScoreProps) => {
    const [progress, setProgress] = useState(0);
    const [performanceColor, setPerformanceColor] = useState('#ECECED');
    const [strokeDasharray, setStrokeDasharray] = useState(0);
    const [strokeDashoffset, setStrokeDashoffset] = useState(0);
    const [isCoreWebClicked, setCoreWebIsClicked] = useState(false);

    const handleCoreWebClick = () => {
        setCoreWebIsClicked(!isCoreWebClicked);
    };

    const animateProgressBar = () => {
        const radius = 62;
        const circumference = 2 * Math.PI * radius;
        let currentProgress = 0;
        const performance = pagespeed?.performance?? 0;

        setStrokeDasharray(circumference);
        setStrokeDashoffset(circumference);

        if (performance < 50) {
            setPerformanceColor('#FF3333');
        } else if (performance < 90) {
            setPerformanceColor('#FFAA33');
        } else if (performance < 101) {
            setPerformanceColor('#09B42F');
        }


        const interval = setInterval(() => {
            if (currentProgress >= performance) {
                clearInterval(interval);
            } else {
                currentProgress += 1;
                const offset = circumference - (currentProgress / 100) * circumference;
                setStrokeDashoffset(offset);
                setProgress(currentProgress);
            }
        }, 20);
    };

    useEffect(() => {
        animateProgressBar();
    }, []);


    return (

        <div>
            <div className="w-[285px] h-[280px] mb-3 drop-shadow-sm rounded-xl border border-gray-200 bg-white">
                <div className="content grid place-content-center place-items-center mt-[30px]">
                    <div className="performance-circle">
                        <svg width="155" height="155">
                            <circle className="inner-circle" cx="77.5" cy="77.5" r="62" strokeWidth="10"></circle>
                            <circle className="progress-bar" cx="77.5" cy="77.5" r="62" strokeWidth="10"
                                    stroke={performanceColor} style={{
                                strokeDasharray: strokeDasharray,
                                strokeDashoffset: strokeDashoffset
                            }}></circle>
                            <text x="50%" y="50%" textAnchor="middle" dy=".3em"
                                  className="text-[28px] text-black">{progress}%
                            </text>
                        </svg>
                    </div>
                    <div className="flex mb-2 mt-3">
                        <svg className="mr-2 mt-1" height="12.5" width="12.5">
                            <circle cx="6.25" cy="6.25" r="5" fill={performanceColor}></circle>
                        </svg>
                        <h1 className="text-base font-bold">Performance</h1>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex">
                            <Fail cls="mt-2 mr-1"/>
                            <p className="text-xm font-normal">0-49</p>
                        </div>
                        <div className="flex">
                            <Average cls="mt-2 mr-1"/>
                            <p className="text-xm font-normal">50-89</p>
                        </div>
                        <div className="flex">
                            <Pass cls="mt-2 mr-1"/>
                            <p className="text-xm font-normal">89-100</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="w-[285px] h-[195px] mb-3 drop-shadow-sm rounded-xl border border-gray-200 bg-white">
                <div className="p-5 grid grid-cols-3 gap-3">
                    {pagespeed?.metrics.map((data, index) => (
                    <div className={'justify-center grid'}>
                        <div className="flex">
                            <p className="text-sm font-medium mr-2 mt-[1px]">{data.title}</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Icon icon={data.icon }/>
                            </span>
                        </div>
                        <p className="text-2xl font-medium text-red">{data.displayValue}</p>
                    </div>
                    ))}
                </div>
            </div>

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
                    <div>
                        <div className="flex">
                            <p className="text-xs font-medium mr-[8px] mt-[1px]">LCP</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Fail/>
                            </span>
                        </div>

                        <p className="text-[22px] font-medium mr-2 text-red">3.6 s</p>
                    </div>
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-3 mt-[1px]">FID</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Average/>
                            </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-red">0.6 s</p>
                    </div>

                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-3 mt-[1px]">CLS</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Pass/>
                            </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-green">0.6 s</p>
                    </div>

                </div>
                <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-2 mt-[1px]">FCP</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Fail/>
                            </span>
                        </div>

                        <p className="text-[22px] font-medium mr-2 text-red">3.6 s</p>
                    </div>
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-2 mt-[1px]">INP</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Average/>
                            </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-red">0.6 s</p>
                    </div>

                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-1 mt-[1px]">TTFB</p>
                            <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200`}>
                                <Pass/>
                            </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-green">0.6 s</p>
                    </div>

                </div>
                </div>

            </div>
            </div>
    )
}

export default PageSpeedScore