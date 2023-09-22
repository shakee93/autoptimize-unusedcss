import React, {useEffect, useMemo} from "react";
import {useAppContext} from "../../../context/app";
import TogglePerformance from "components/toggle-performance";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import Audit from "app/page-optimizer/components/audit/Audit";
import useCommonDispatch from "hooks/useCommonDispatch";
import Description from "app/page-optimizer/components/audit/Description";
import {Circle, Dot} from "lucide-react";
import {Separator} from "@radix-ui/react-dropdown-menu";
import {m} from "framer-motion";
import SlideUp from "components/animation/SlideUp";


const SpeedIndex = () => {
    const {data, loading, error, activeReport} = useSelector(optimizerData);

    const curves = {
        mobile: {
            FCP: {weight: 0.10, median: 3000, p10: 1800},
            SI: {weight: 0.10, median: 5800, p10: 3387},
            LCP: {weight: 0.25, median: 4000, p10: 2500},
            TBT: {weight: 0.30, median: 600,  p10: 200},
            CLS: {weight: 0.25, median: 0.25, p10: 0.1},
        },
        desktop: {
            FCP: {weight: 0.10, median: 1600, p10: 934},
            SI: {weight: 0.10, median: 2300, p10: 1311},
            LCP: {weight: 0.25, median: 2400, p10: 1200},
            TBT: {weight: 0.30, median: 350, p10: 150},
            CLS: {weight: 0.25, median: 0.25, p10: 0.1},
        },
    }

    function calculateMetricValuesForScores(curveDetails: any) {
        const calculateMetricValue = (score: any, p10: any, median: any) => {
            return (1/score - 1) * (median - p10) + p10;
        };

        const goodThreshold = calculateMetricValue(0.89, curveDetails.p10, curveDetails.median);
        const averageThreshold = calculateMetricValue(0.49, curveDetails.p10, curveDetails.median);
        const poorThreshold = calculateMetricValue(0.01, curveDetails.p10, curveDetails.median); // Using 0.01 instead of 0 to avoid division by zero

        return {
            good: `${Math.round(goodThreshold)} - ${Math.round(curveDetails.p10)}`,
            average: `${Math.round(averageThreshold)}ms - ${Math.round(goodThreshold)}ms`,
            poor: `${Math.round(poorThreshold)}ms - ${Math.round(averageThreshold)}ms`
        };
    }

    const {
        togglePerformance,
        options
    } = useAppContext()

    const { common } = useCommonDispatch()
    const { activeMetric } = common

    const audits = useMemo(() => {

        let audits = [
            ...data?.grouped?.opportunities || [],
            ...data?.grouped?.diagnostics || [],
        ]

        if (activeMetric?.refs.acronym === 'SI') {
            return  audits.filter(audit => audit.scoreDisplayMode !== 'informative')
        }

        return audits.filter(audit => audit.metrics.find(metric => metric.id === activeMetric?.id));
    }, [data, activeMetric])

    // @ts-ignore
    let ranges = calculateMetricValuesForScores(curves[activeReport][activeMetric?.refs.acronym])

    const points = useMemo(() => {

        let unit = activeMetric?.refs.acronym !== 'CLS' ? 'ms' : ''
        return [
            activeMetric?.potentialGain ? <>Enhance this to gain <span className='text-green-600 font-medium'>{activeMetric?.potentialGain.toFixed(1)} points boost</span> </> : null,
            <>Weighs <span className='text-brand-800 dark:text-brand-500 font-medium'>{activeMetric?.refs.weight}%</span> of your page speed score</>,
            <>Bring this closer to {ranges?.good}{unit}</>
        ]
    }, [activeMetric, activeReport])


    return (
        <SlideUp uuid={activeMetric?.id ? activeMetric.id : 'no-key'}>
            {/*<h2 className="text-lg ml-5 flex gap-2 font-normal items-center">*/}
            {/*
            {/*    Enhance {activeMetric?.title}</h2>*/}
            <div className='ml-6'>
                {!togglePerformance && <TogglePerformance/>}
            </div>
            <div className='flex flex-col gap-3 mt-16 ml-6'>
                <div className='flex flex-col gap-3 border-b pb-6'>
                    <div className='text-4xl font-medium'> {activeMetric?.title}</div>
                    <div><Description className='pl-0 text-md' content={activeMetric?.description}/></div>
                    <div>
                        <ul className='flex text-sm gap-3 text-brand-500 dark:text-brand-400'>
                            {points.map((point, index) => (
                                point && (<li key={index} className='flex gap-1.5 items-center'>
                                    <Circle className='w-2 stroke-none mt-[1px] fill-brand-300 dark:fill-brand-700'/> <span>{point}</span>
                                </li>)
                            ))}

                        </ul>
                    </div>
                </div>
                {audits.length > 0 ?
                    <div className="flex gap-4 flex-col w-full">
                        <div className='borderx-b px-4 pt-4 w-full font-medium text-lg'>Related Audits</div>
                        <div className='flex flex-col gap-4'>
                            {audits.map((audit, index) => (
                                <div  key={index} className='relative'>
                                    <Audit
                                        metrics={false}
                                        index={index} audit={audit}/>
                                </div>
                            ))}
                        </div>
                    </div>
                : <m.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        className='flex flex-col gap-8 items-center px-8 pt-40 w-full'>

                        <div>
                            <img alt='Good Job!' className='w-64' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/success.svg`) : '/success.svg'}/>
                        </div>

                        <span className='flex gap-2'>
                                Brilliantly done! It's clear you've mastered this.
                            </span>

                    </m.div>
                }

            </div>
        </SlideUp>
    )
}

export default React.memo(SpeedIndex)