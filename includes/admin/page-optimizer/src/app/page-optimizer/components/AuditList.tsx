import Audit from "app/page-optimizer/components/audit/Audit";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {AnimatePresence, m} from 'framer-motion'

interface Props {
    activeTab: AuditTypes
}

const AuditList =({ activeTab }: Props) => {
    const {data, loading, error} = useSelector(optimizerData);


    const activeData = useMemo(() => {
        console.log( data?.grouped[activeTab]);

        return data?.grouped[activeTab] || []
    }, [activeTab, data])


    return <AnimatePresence initial={false}>
        {activeData?.map((audit: Audit, index: number) => (

                    <m.div
                        key={audit.id}
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: index < 5 ? index * 0.02 : index * 0.01}}
                        className='relative' >
                        <Audit
                            index={index} audit={audit}/>
                    </m.div>

            )
        )}
    </AnimatePresence>
}

export default React.memo(AuditList)