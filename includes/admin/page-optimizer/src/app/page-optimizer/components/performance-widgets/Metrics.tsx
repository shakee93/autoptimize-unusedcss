import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import Card from "components/ui/card";
import React from "react";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import usePerformanceColors from "hooks/usePerformanceColors";
import PerformanceProgressBar from "components/performance-progress-bar";
import {cn} from "lib/utils";
import {Info} from "lucide-react";
import {useAppContext} from "../../../../context/app";


interface MetricsProps {
    metrics: Metric[]
    performance: number
}

const Metrics = ({ metrics = [], performance } : MetricsProps) => {

    const { setActiveMetric, activeMetric } = useAppContext()
    const desiredMetricsOrder = [
        "First Contentful Paint",
        "Largest Contentful Paint",
        "Total Blocking Time",
        "Cumulative Layout Shift",
        "Speed Index",
    ];

    const sortedMetricsData = metrics.sort((a, b) => {
        const aIndex = desiredOrder.indexOf(a.title);
        const bIndex = desiredOrder.indexOf(b.title);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });


    return (
        <div>
            <div className="flex flex-col w-full">
                {sortedMetricsData
                    .sort((a,b) => b.potentialGain - a.potentialGain)
                    .map((metric, index) => (
                    <div key={index}
                         onMouseEnter={e => setActiveMetric(metric)}
                         onMouseLeave={e => setActiveMetric(null)}
                         className='hover:bg-brand-50 transition-colors group flex flex-row justify-between items-center border-t px-6 py-2.5'>
                        <div className='flex flex-col justify-between'>
                            <div className='flex items-center gap-1.5 flex-row text-sm font-medium'>
                                <div className='inline-flex flex-col'>
                                    <span>
                                        {metric.title}
                                    </span>
                                    <span className='text-xxs text-brand-500 font-light'>

                                        {metric.potentialGain > 0 ?
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
                        <div className={cn(
                            'opacity-70 group-hover:opacity-100 transition-opacity'
                        )}>
                            <PerformanceProgressBar
                                background={false}
                                stroke={10}
                                scoreClassName='text-[12px]'
                                className='h-9'
                                performance={metric.score}/>
                        </div>
                    </div>
                ))}
            </div>
            {/*<JsonView data={metrics}/>*/}
        </div>
    )
}

export default React.memo(Metrics)