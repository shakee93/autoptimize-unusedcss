import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { FoldVertical } from "lucide-react";
import { setCommonState } from "../../../store/common/commonActions";
import { cn } from "lib/utils";
import useCommonDispatch from "hooks/useCommonDispatch";
import { AnimatePresence } from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import TooltipText from "components/ui/tooltip-text";

const loadingTab: Tab = {
    key: "passed_audits",
    name: "Passed Audits",
    color: 'border-zinc-600',
    activeColor: 'bg-green-600'
}

const tabs: Tab[] = [
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

const PageSpeedInsights = ({ }) => {

    const { data, loading, reanalyze, settings, error } = useSelector(optimizerData);
    const { dispatch, activeTab, openAudits, storePassedAudits, settingsMode } = useCommonDispatch()
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        dispatch(setCommonState('activeTab', 'opportunities'))
    }, [])  

    return (
        <div className={cn(
            'tabs flex sticky -top-1 dark:bg-brand-800/40 bg-brand-200 px-4 py-4 pb-4 rounded-t-3xl border-b-2 border-brand-300 dark:border-brand-600/40',
        )}>
        <div data-tour='audit-groups'
                    className={cn(
                        'flex justify-between items-center select-none rounded-[20px] w-full',
                        isSticky && 'rounded-b-xl rounded-t-none shadow-lg'
                    )}

                >
                    <div className='flex'>
                        {tabs.map((tab) => {
                            return (
                                <div
                                    onClick={() => dispatch(setCommonState('activeTab', tab.key))}
                                    className={cn(
                                        `cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl`,
                                        isSticky && 'py-3',
                                        activeTab === tab.key ? "font-medium bg-brand-0 dark:bg-brand-950" : "dark:hover:text-brand-300"
                                    )}
                                    key={tab.key}
                                >
                                    {tab.name}
                                    {(tab.key !== 'configurations') && (
                                        <div className={
                                            cn(
                                                'flex  text-xxs items-center justify-center rounded-full w-6 h-6 border-2',
                                                isSticky && 'w-5 h-5 border',
                                                (loading && !reanalyze) ? 'bg-zinc-200 border-zinc-300/30 text-zinc-300/30' : cn(
                                                    tab.color,
                                                    (activeTab === tab.key) && tab.activeColor,
                                                )
                                            )}>
                                            <div className={cn(
                                                activeTab === tab.key && ' text-white dark:text-brand-900'
                                            )}>
                                                {data?.grouped[`${tab.key}`].length || '-'}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )
                        })}
                    </div>

                    <div className='flex items-center'>
                        <AnimatePresence>
                            {openAudits.length > 1 &&
                                <ScaleUp>
                                    <div
                                        onClick={e => dispatch(setCommonState('openAudits', []))}
                                        className='dark:hover:bg-brand-700 hover:bg-brand-100 w-9 h-9 rounded-full flex items-center justify-center'>
                                        <TooltipText text='Collpase all Audits'>
                                            <FoldVertical className='w-5 text-brand-500 dark:text-brand-200' />
                                        </TooltipText>
                                    </div>
                                </ScaleUp>
                            }
                        </AnimatePresence>

                    </div>
                </div>
        </div>
    )
}

export default PageSpeedInsights;   