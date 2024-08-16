import AuditComponent from "app/page-optimizer/components/audit/Audit";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {AnimatePresence, m} from 'framer-motion'
import {useInView} from "react-intersection-observer";
import Card from "components/ui/card";
import AuditSkeleton from "app/page-optimizer/components/audit/AuditSkeleton";

interface Props {
    activeTab: AuditTypes
}

const AuditList =({ activeTab }: Props) => {
    const {data, loading, error} = useSelector(optimizerData);


    const activeData = useMemo(() => {
        // return data?.grouped[activeTab] || []

        if (loading || !data) {
            return []
        }

        return (data?.grouped as Record<AuditTypes, Audit[] | undefined>)[activeTab] || [];
    }, [activeTab, data])


    return <AnimatePresence initial={false}>

        {loading ? new Array(5).fill(null).map((s, i) =>
                <m.div
                    key={`${i}-${activeTab}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration:0.2, delay: i * 0.05 }}
                    className='relative'
                >
                    <AuditSkeleton key={i}/>
                </m.div>
            ) :
        activeData.map((audit, index) =>  <div key={audit.id}>
                <m.div
                    key={index}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.005 }}
                    className='relative'
                >
                    <AuditComponent index={index} audit={audit} />
                </m.div>
        </div>
        )}


    </AnimatePresence>
}

export default React.memo(AuditList)