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


const SpeedIndex = () => {
    const {data, loading, error} = useSelector(optimizerData);
    console.log('render');

    const {
        togglePerformance,
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
        <div>
            {/*<h2 className="text-lg ml-5 flex gap-2 font-normal items-center">*/}
            {/*    {!togglePerformance && <TogglePerformance/>}*/}
            {/*    Enhance {activeMetric?.title}</h2>*/}
            <div className='flex flex-col gap-3 mt-16 ml-6'>
                <div className='flex flex-col gap-3 border-b pb-6'>
                    <div className='text-4xl font-medium'>{activeMetric?.title}</div>
                    <div><Description className='pl-0 text-md' content={activeMetric?.description}/></div>
                    <div>
                        <ul className='flex text-sm gap-3 text-brand-500'>
                            {points.map((point, index) => (
                                point && (<li key={index} className='flex gap-1.5 items-center'>
                                    <Circle className='w-2 stroke-none mt-[1px] fill-slate-700'/> <span>{point}</span>
                                </li>)
                            ))}
                        </ul>
                    </div>
                </div>
                {audits.length > 0 &&
                    <div className="flex gap-4 flex-col w-full">
                        <div className='borderx-b px-4 pt-4 w-full font-medium text-lg'>Related Audits</div>
                        <div className='flex flex-col gap-4'>
                            {audits.map((audit, index) => (
                                <div  key={index} className='relative'>
                                    <Audit

                                        index={index} audit={audit}/>
                                </div>
                            ))}
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default React.memo(SpeedIndex)