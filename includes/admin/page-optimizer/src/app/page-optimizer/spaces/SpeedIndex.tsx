import React, {useMemo} from "react";
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
    const {data, loading, error} = useSelector(optimizerData);

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
        ].filter(audit => audit.scoreDisplayMode !== 'informative')

        if (activeMetric?.refs.acronym === 'SI') {
            return  audits
        }

        return audits.filter(audit => audit.metrics.find(metric => metric.id === activeMetric?.id));
    }, [data, activeMetric])

    const points = useMemo(() => {

        return [
            <>Weighs <span className='text-brand-800 font-medium'>{activeMetric?.refs.weight}%</span> of your page speed score</>,
            activeMetric?.potentialGain ? <>Enhance this to gain <span className='text-green-600 font-medium'>{activeMetric?.potentialGain.toFixed(1)} points boost</span> </> : null,
        ]
    }, [activeMetric])
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
                        <ul className='flex text-sm gap-3 text-brand-500'>
                            {points.map((point, index) => (
                                point && (<li key={index} className='flex gap-1.5 items-center'>
                                    <Circle className='w-2 stroke-none mt-[1px] fill-brand-300'/> <span>{point}</span>
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