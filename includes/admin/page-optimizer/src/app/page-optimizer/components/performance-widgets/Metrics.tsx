import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import Card from "components/ui/card";
import React from "react";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import usePerformanceColors from "hooks/usePerformanceColors";
import PerformanceProgressBar from "components/performance-progress-bar";


interface MetricsProps {
    metrics: Metric[]
    performance: number
}

const Metrics = ({ metrics, performance } : MetricsProps) => {

    return (
        <div>
            <div className="flex flex-col w-full">
                {metrics.map((s, index) => (
                    <div key={index}
                         className='flex flex-row justify-between items-center border-t px-6 py-2.5'>
                        <div className='flex flex-col justify-between'>
                            <div className='text-sm font-medium'>
                                {s.title}
                            </div>
                            <div
                                style={{
                                    color:  usePerformanceColors(s.score)[1]
                                }}
                                className='text-lg font-medium text-brand-500'>
                                {s.displayValue}
                            </div>
                        </div>
                        <div>
                            <PerformanceProgressBar
                                background={false}
                                stroke={10}
                                trail='rgb(232 232 232)'
                                scoreClassName='text-[12px]'
                                className='h-9'
                                performance={s.score}/>
                        </div>
                    </div>
                    // <div key={index} className={`${index % 3 === 2 ? 'mb-4' : ''}`}>
                    //     <div className="flex">
                    //         <div className="grid grid-cols-2 gap-1.5 items-center justify-center">
                    //             <div><p className="text-xs font-medium">{s.title}</p></div>
                    //             <div><span
                    //                 className={`inline-flex items-center justify-center w-6 h-6 rounded-full dark:bg-brand-700 bg-brand-100`}>
                    //             <PerformanceIcons icon={s.icon}/>
                    //         </span></div>
                    //         </div>
                    //     </div>
                    //     <p className="text-[22px] font-medium mr-2 mt-1 text-red">{s.displayValue}</p>
                    // </div>
                ))}
            </div>
            {/*<JsonView data={metrics}/>*/}
        </div>
    )
}

export default React.memo(Metrics)