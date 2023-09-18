import React, {useMemo} from "react";
import {useAppContext} from "../../../context/app";
import TogglePerformance from "components/toggle-performance";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import Audit from "app/page-optimizer/components/audit/Audit";


const SpeedIndex = () => {
    const {data, loading, error} = useSelector(optimizerData);

    const {
        togglePerformance,
        activeMetric
    } = useAppContext()

    const audits = useMemo(() => {

        return [
            ...data?.grouped?.opportunities || [],
            ...data?.grouped?.diagnostics || [],
        ].filter(audit => audit.scoreDisplayMode !== 'informative')
    }, [data])
    return (
        <div>
            <h2 className="text-lg ml-5 flex gap-2 font-normal items-center">
                {!togglePerformance && <TogglePerformance/>}
                Enhance {activeMetric?.title}</h2>
            <div>
                <div>Related Audits</div>
                <div className='flex flex-col gap-4'>
                    {audits && audits.map((audit, index) => (
                        <div  key={index} className='relative'>
                            <Audit

                                index={index} audit={audit}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpeedIndex