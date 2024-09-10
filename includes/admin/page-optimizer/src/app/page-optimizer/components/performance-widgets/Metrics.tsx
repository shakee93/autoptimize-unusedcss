import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import Card from "components/ui/card";
import React, {useEffect, useState} from "react";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import usePerformanceColors from "hooks/usePerformanceColors";
import PerformanceProgressBar from "components/performance-progress-bar";
import {cn} from "lib/utils";
import {ArrowRight, Info} from "lucide-react";
import {useAppContext} from "../../../../context/app";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../../../store/common/commonActions";
import {AnimatePresence, m} from "framer-motion";


interface MetricsProps {
    metrics: Metric[]
    performance: number
}

const Metrics = ({ metrics = [], performance } : MetricsProps) => {

    const desiredMetricsOrder = ["First Contentful Paint", "Largest Contentful Paint", "Total Blocking Time", "Cumulative Layout Shift", "Speed Index"];
    const sortedMetricsData = metrics.sort((a, b) => desiredMetricsOrder.indexOf(a.title) - desiredMetricsOrder.indexOf(b.title));
    const { dispatch, activeMetric, hoveredMetric} = useCommonDispatch()



    const { optimizerContainer } = useAppContext()

    const slideVariants = {
        initial: {
            x: '-20%',  // Starts off the right side of the screen
            opacity: 0
        },
        in: {
            x: '0%',  // Slides in from the right to its original position
            opacity: 1
        },
        out: {
            x: '20%',  // Slides out to the left
            opacity: 0
        }
    };

    useEffect(() => {

        if (activeMetric) {
            optimizerContainer.current?.scrollIntoView({
                behavior: 'smooth'
            })
        }

    }, [activeMetric])

    return (
        <div className="w-full lg:flex flex-col lg:grid-cols-none grid grid-cols-2 grid-rows-3">



            {sortedMetricsData
                .sort((a,b) => b.potentialGain - a.potentialGain)
                .map((metric, index) => (
                    <div key={index}
                         onClick={e => {
                             dispatch(setCommonState('activeMetric',metric))
                         }}
                         onMouseEnter={() => {
                             const delayedDispatch = setTimeout(() => {
                                 dispatch(setCommonState('hoveredMetric', metric));
                             }, 100);
                             return () => clearTimeout(delayedDispatch);
                         }}
                         onMouseLeave={() => {
                             const delayedDispatch = setTimeout(() => {
                                 dispatch(setCommonState('hoveredMetric', null));
                             }, 100);
                             return () => clearTimeout(delayedDispatch);
                         }}
                         className={cn(
                             'lg:last:rounded-b-3xl select-none cursor-pointer dark:hover:bg-brand-900/50 hover:bg-brand-100/50 group flex flex-row justify-between items-center ' +
                             'last:border-b-0 border-b lg:border-b-0 lg:border-t lg:even:border-l-0 even:border-l px-3 lg:px-6 py-2.5',
                             metric.id === activeMetric?.id && 'bg-brand-100/80 dark:bg-brand-900/80 '

                         )}>
                        <div className='flex flex-col justify-between'>
                            <div className='flex items-center gap-1.5 flex-row text-sm font-medium'>
                                <div className='inline-flex flex-col'>
                                    <span>
                                        {metric.title}
                                    </span>
                                    <span className='text-xs text-brand-500 font-normal'>

                                        {metric.potentialGain > 1 ?
                                            <>Enhance this for <span className='group-hover:text-green-600'>{ metric.potentialGain.toFixed(0) } point boost.</span> </> :
                                            `Looks great, well done!`}

                                    </span>
                                </div>

                                {/*<Info className='w-4 text-brand-400'/>*/}
                            </div>
                            <div
                                style={{
                                    color:  usePerformanceColors(metric.score)[1]
                                }}
                                className='text-lg font-medium text-brand-500'>
                                {metric.displayValue}
                            </div>
                        </div>
                        <div className='hidden xl:block'>
                            { hoveredMetric?.id === metric.id ?
                                <div
                                    className={cn(
                                        'flex items-center justify-center w-[36px] h-[36px] rounded-full bg-brand-200 dark:bg-brand-800',
                                    )}>
                                    <ArrowRight className='w-4' />
                                </div>
                                :

                                <div
                                    className={cn(
                                        '',
                                    )}>
                                    <PerformanceProgressBar
                                        background={false}
                                        stroke={10}
                                        scoreClassName='text-[12px]'
                                        className='h-9'
                                        performance={metric.score}/>
                                </div>

                            }
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default Metrics