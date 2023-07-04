import React, {useEffect, useRef, useState} from 'react';
import {CheckBadgeIcon} from "@heroicons/react/24/solid";

const PageSpeedScore = () => {
    const [progress, setProgress] = useState(0);
    const [performanceColor, setPerformanceColor] = useState('#ECECED');
    const [strokeDasharray, setStrokeDasharray] = useState(0);
    const [strokeDashoffset, setStrokeDashoffset] = useState(0);

    const animateProgressBar = () => {
        const radius = 65;
        const circumference = 2 * Math.PI * radius;
        let currentProgress = 0;
        const performance = 20;

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
            <div className="w-[285px] h-[340px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
                <div className="content grid place-content-center place-items-center mt-[30px]">
                    <div className="performance-circle">
                        <svg width="155" height="155">
                            <circle className="inner-circle" cx="77.5" cy="77.5" r="62" strokeWidth="23"></circle>
                            <circle className="progress-bar" cx="77.5" cy="77.5" r="62" strokeWidth="23"
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
                            <svg className="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"></path>
                            </svg>
                            <p className="text-xm font-normal">0-49</p>
                        </div>
                        <div className="flex">
                            <svg className="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="9" height="9" fill="#FFAA33"></rect>
                            </svg>
                            <p className="text-xm font-normal">50-89</p>
                        </div>
                        <div className="flex">
                            <svg className="mt-[5px] mr-1" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="4.5" cy="4.5" r="4.5" fill="#09B42F"></circle>
                            </svg>
                            <p className="text-xm font-normal">89-100</p>
                        </div>
                    </div>
                    <div
                        className="mt-2 ml-[26px] mr-[26px] border-t-2 border-gray-border-line content grid place-content-center place-items-center">
                        <p className="mt-1.5 text-xm font-normal text-center">Values are estimated and may vary. The
                            performance score is calculated directly from these metrics.</p>
                        {/*<button className="text-xs bg-transparent mb-3 text-black-b transition duration-300 hover:bg-purple font-medium hover:text-white py-1 px-3 border border-gray-button-border hover:border-transparent mt-3 rounded-full">27 data points</button>*/}
                    </div>
                </div>
            </div>
            <div className="w-[285px] h-[195px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white">
                <div className="p-5 grid grid-cols-3 gap-3 pl-6">
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-[8px] mt-[1px]">LCP</p>
                            <span
                                className={`border-4 border-gray-highlight inline-block w-6 h-6 rounded-full bg-gray-highlight`}>
                             <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"></path>
                        </svg>
                        </span>
                        </div>

                        <p className="text-[22px] font-medium mr-2 text-red">3.6 s</p>
                    </div>
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-3 mt-[1px]">FID</p>
                            <span
                                className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full bg-gray-highlight`}>
                             <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                            <rect width="9" height="9" fill="#FFAA33"></rect>
                        </svg>
                        </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-red">0.6 s</p>
                    </div>

                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-3 mt-[1px]">CLS</p>
                            <span
                                className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full bg-gray-highlight`}>
                            <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.5" cy="4.5" r="4.5" fill="#09B42F"></circle>
                        </svg>
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
                                className={`border-4 border-gray-highlight inline-block w-6 h-6 rounded-full bg-gray-highlight`}>
                             <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"></path>
                        </svg>
                        </span>
                        </div>

                        <p className="text-[22px] font-medium mr-2 text-red">3.6 s</p>
                    </div>
                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-2 mt-[1px]">INP</p>
                            <span
                                className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full bg-gray-highlight`}>
                             <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                            <rect width="9" height="9" fill="#FFAA33"></rect>
                        </svg>
                        </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-red">0.6 s</p>
                    </div>

                    <div>
                        <div className="flex">
                            <p className="text-[13px] font-medium mr-1 mt-[1px]">TTFB</p>
                            <span
                                className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full bg-gray-highlight`}>
                            <svg className="mt-[3px] ml-[4px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.5" cy="4.5" r="4.5" fill="#09B42F"></circle>
                        </svg>
                        </span>
                        </div>
                        <p className="text-[22px] font-medium mr-2 text-green">0.6 s</p>
                    </div>

                </div>
            </div>

            <div className="w-[285px] h-[195px] drop-shadow-sm rounded-xl border border-gray-border-line bg-white p-5 pl-6">
                <div className={"flex"}>
                    <div>
                        <p className="text-[16px] font-medium text-black">Core Web Vitals (28 days)
                        </p>
                        <p className="text-[12px] font-medium text-gray-light-font">Real user experience from Google
                        </p>
                    </div>
                    <div>
                            <CheckBadgeIcon/>
                    </div>
                </div>


            </div>
            </div>
    )
}

export default PageSpeedScore