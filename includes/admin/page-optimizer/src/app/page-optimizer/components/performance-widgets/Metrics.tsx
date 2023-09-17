import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import Card from "components/ui/card";
import React from "react";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import usePerformanceColors from "hooks/usePerformanceColors";
import PerformanceProgressBar from "components/performance-progress-bar";
import {cn} from "lib/utils";
import {Info} from "lucide-react";


interface MetricsProps {
    metrics: Metric[]
    performance: number
}

const Metrics = ({ metrics, performance } : MetricsProps) => {

    // reorder metrics start
    const desiredOrder = [
        "First Contentful Paint",
        "Largest Contentful Paint",
        "Total Blocking Time",
        "Cumulative Layout Shift",
        "Speed Index",
    ];

    const sortedData = metrics.sort((a, b) => {
        const aIndex = desiredOrder.indexOf(a.title);
        const bIndex = desiredOrder.indexOf(b.title);

        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
    });
    // reorder metrics end


    let weight = {
        'First Contentful Paint': 10,
        'Speed Index': 10,
        'Largest Contentful Paint': 25,
        'Total Blocking Time': 30,
        'Cumulative Layout Shift': 25,
    }
    return (
        <div>
            <div className="flex flex-col w-full">
                {sortedData.map((s, index) => (
                    <div key={index}
                         className='group flex flex-row justify-between items-center border-t px-6 py-2.5'>
                        <div className='flex flex-col justify-between'>
                            <div className='inline-flex gap-1.5 items-center text-sm font-medium'>
                                {s.title} <Info className='w-4 text-brand-400'/>
                            </div>
                            <div
                                style={{
                                    color:  usePerformanceColors(s.score)[1]
                                }}
                                className='text-lg font-medium text-brand-500'>
                                {s.displayValue}
                                {/*- { (weight[s.title] - weight[s.title] / 100 * s.score).toFixed(0) }*/}
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