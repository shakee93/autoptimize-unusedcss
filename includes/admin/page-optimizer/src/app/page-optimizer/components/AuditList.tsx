import AuditComponent from "app/page-optimizer/components/audit/Audit";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {AnimatePresence, m} from 'framer-motion'
import {useInView} from "react-intersection-observer";

interface Props {
    activeTab: AuditTypes
}

const AuditList =({ activeTab }: Props) => {
    const {data, loading, error} = useSelector(optimizerData);


    const activeData = useMemo(() => {
        return data?.grouped[activeTab] || []
    }, [activeTab, data])


    return <AnimatePresence initial={false}>
        {activeData.map((audit, index) =>  <div key={audit.id}>
                <m.div
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