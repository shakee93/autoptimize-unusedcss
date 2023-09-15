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
import PerformanceProgressBar from "components/performance-progress-bar";
import Metrics from "app/page-optimizer/components/performance-widgets/Metrics";



interface PageSpeedScoreProps {
    pagespeed?: any;
    priority?: boolean;
}


const PageSpeedScore = ({pagespeed, priority = true }: PageSpeedScoreProps) => {
    const [isCoreWebClicked, setCoreWebIsClicked] = useState(false);

    const {setShowOptimizer} = useAppContext()
    const {data, error, loading} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const [on, setOn] = useState<boolean>(false)

    const handleCoreWebClick = useCallback(() => {
        setCoreWebIsClicked(!isCoreWebClicked);
    }, [isCoreWebClicked]);


    const FirstLettersComponent = ({ text }: { text: string }) => {
        const replacedText = text.replace(/_/g, ' ');
        const firstLetters = replacedText.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        return <>{firstLetters}</>;
    };


    return (

        <div className='w-full flex flex-col gap-4'>
            <Card>
                <div className="content flex flex-col items-center gap-3 mx-12 my-2.5">

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-3 px-4 items-center'>

                            <div className='mt-6'>
                                {loading || on ? (
                                    <Skeleton className="w-44 h-44 rounded-full"/>
                                ) : (
                                    <PerformanceProgressBar performance={data?.performance}/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col text-center gap-1">
                        <div>Performance</div>
                        <div className='text-xs text-brand-500 dark:text-brand-300 font-light'>
                            Values are estimated and may vary with Google Page Speed Insights.
                        </div>
                    </div>
                    <div className="flex justify-around text-sm gap-4 font-normal w-full mb-5 text-brand-700 dark:text-brand-300">
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
                {data?.metrics && (
                    <Metrics performance={data?.performance} metrics={data.metrics}/>
                )}
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