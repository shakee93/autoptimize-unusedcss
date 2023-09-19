import Card from "components/ui/card";
import {AnimatePresence, m} from "framer-motion";
import Audit from "app/page-optimizer/components/audit/Audit";
import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {useAppContext} from "../../../context/app";
import {cn} from "lib/utils";
import TogglePerformance from "components/toggle-performance";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../../store/common/commonActions";

const Performance = () => {
    const {data, loading, error} = useSelector(optimizerData);

    const { dispatch ,  common} = useCommonDispatch()
    const { activeTab } = common

    const {
        options,
        setOpenAudits,
        mode,
        manipulatingStyles,
        savingData,
        togglePerformance,
        setTogglePerformance,
    } = useAppContext()

    const tabs: Tab[] = [
        // {
        //     key: "attention_required",
        //     name: "Attention Required",
        //     color: 'border-red-400',
        //     activeColor: 'bg-red-400'
        // },
        {
            key: "opportunities",
            name: "Opportunities",
            color: 'border-orange-400',
            activeColor: 'bg-orange-400',
        },
        {
            key: "diagnostics",
            name: "Diagnostics",
            color: 'border-yellow-400 ',
            activeColor: 'bg-yellow-400 '
        },
        {
            key: "passed_audits",
            name: "Passed Audits",
            color: 'border-green-600',
            activeColor: 'bg-green-600'
        },
    ];

    // useEffect(() => {
    //
    //     setOpenAudits([]);
    //
    // }, [activeTab])

    return (
        <div>
            <h2 className="text-lg mt-0.5 ml-5 flex gap-2 font-normal items-center">
                {!togglePerformance && <TogglePerformance/>}
                Fix Performance Issues</h2>
            <div className="tabs pt-4 flex">
                <Card className='flex select-none p-0 px-6'>
                    {tabs.map((tab) => {
                        return (
                            <div
                                onClick={() => dispatch(setCommonState('activeTab', tab.key))}
                                className={cn(
                                    `cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium`,
                                    activeTab === tab.key ? "font-medium border-b border-b-purple-750" : "text-brand-500 dark:hover:text-brand-300"
                                )}
                                key={tab.key}
                            >
                                {tab.name}
                                {(data && data?.audits.length > 0) && (
                                    <div className={
                                        cn(
                                            'flex text-xxs items-center justify-center rounded-full w-6 h-6 border-2',
                                            tab.color,
                                            (activeTab === tab.key) && tab.activeColor,
                                        )}>
                            <span className={cn(
                                'transition-colors',
                                activeTab === tab.key && ' text-white dark:text-brand-900'
                            )}>
                                {data?.grouped[`${tab.key}`].length}
                            </span>
                                    </div>
                                )}

                            </div>
                        )
                    })}
                </Card>
            </div>
            <div className="audits pt-4 flex">
                <AnimatePresence initial={false}>
                    {(data?.grouped[activeTab] && data?.grouped[activeTab].length > 0) ? (

                        <div className='grid grid-cols-12 gap-6 w-full relative mb-24'>
                            <div className='col-span-12 flex flex-col gap-4'>
                                {data?.grouped[activeTab] &&
                                    data?.grouped[activeTab]?.map((audit: Audit, index: number) => (
                                            <m.div
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -20}}
                                                transition={{delay: index * 0.03}}
                                                className='relative' key={audit.id}>
                                                <Audit
                                                    index={index} audit={audit}/>
                                            </m.div>
                                        )
                                    )}
                            </div>
                        </div>

                    ) : (
                        <m.div
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
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Performance