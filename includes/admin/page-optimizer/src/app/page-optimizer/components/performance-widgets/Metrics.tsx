import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import Card from "components/ui/card";
import React from "react";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import usePerformanceColors from "hooks/usePerformanceColors";
import PerformanceProgressBar from "components/performance-progress-bar";
import {cn} from "lib/utils";


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
                         className='group flex flex-row justify-between items-center border-t px-6 py-2.5'>
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
                        <div className={cn(
                            'opacity-70 group-hover:opacity-100 transition-opacity'
                        )}>
                            <PerformanceProgressBar
                                background={false}
                                stroke={10}
                                scoreClassName='text-[12px]'
                                className='h-9'
                                performance={s.score}/>
                        </div>
                    </div>
                ))}
            </div>
            {/*<JsonView data={metrics}/>*/}
        </div>
    )
}

export default React.memo(Metrics)