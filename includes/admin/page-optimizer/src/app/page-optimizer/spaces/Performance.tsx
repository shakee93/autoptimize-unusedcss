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
import {CopyMinus, FoldVertical, Layers, SplitSquareVertical} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import ScaleUp from "components/animation/ScaleUp";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import {Cog6ToothIcon, InformationCircleIcon} from "@heroicons/react/20/solid";
import SetupChecklist from "app/page-optimizer/components/SetupChecklist";
import AuditList from "app/page-optimizer/components/AuditList";
import Configurations from "app/page-optimizer/spaces/Configurations";

const Performance = () => {
    const {data, loading, error} = useSelector(optimizerData);

    const { dispatch ,  activeTab, openAudits} = useCommonDispatch()
    const [isSticky, setIsSticky] = useState(false);
    const navbarRef = useRef(null);

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
        {
            key: "configurations",
            name: "Speed Settings",
            color: 'border-orange-400',
            activeColor: 'bg-orange-400',
        },
    ];


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the sentinel (a small element before the navbar) is not in viewport, navbar is sticky
                setIsSticky(!entry.isIntersecting);
            },
            { threshold: [1] }
        );

        if (navbarRef.current) {
            observer.observe(navbarRef.current);
        }

        return () => {
            if (navbarRef.current) {
                observer.unobserve(navbarRef.current);
            }
        };
    }, []);
    return (
        <div data-tour='audits'>
            <h2 className="text-lg mt-0.5 ml-5 mb-4 flex gap-2 font-normal items-center">
                {!togglePerformance && <TogglePerformance/>}
                Fix Performance Issues</h2>
            <div ref={navbarRef} style={{ height: '1px' }}></div>
            <div className={cn(
                'tabs flex sticky -top-1 z-10',
            )}>
                <Card data-tour='audit-groups'
                      className={cn(
                          'dark:bg-brand-930/90 bg-brand-0 flex justify-between items-center select-none p-0 pl-6 pr-3',
                          isSticky && 'rounded-b-xl rounded-t-none shadow-lg'
                      )}

                >
                   <div className='flex'>
                       {tabs.map((tab) => {
                           return (
                               <div
                                   onClick={() => dispatch(setCommonState('activeTab', tab.key))}
                                   className={cn(
                                       `cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium`,
                                       isSticky && 'py-3',
                                       activeTab === tab.key ? "font-medium border-b border-b-purple-750" : "text-brand-500 dark:hover:text-brand-300"
                                   )}
                                   key={tab.key}
                               >
                                   {tab.name}
                                   {(tab.key !== 'configurations' && data && data?.audits.length > 0) && (
                                       <div className={
                                           cn(
                                               'flex text-xxs items-center justify-center rounded-full w-6 h-6 border-2',
                                               isSticky && 'w-5 h-5 border',
                                               tab.color,
                                               (activeTab === tab.key) && tab.activeColor,
                                           )}>
                            <span className={cn(
                                activeTab === tab.key && ' text-white dark:text-brand-900'
                            )}>
                                {data?.grouped[`${tab.key}`].length}
                            </span>
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
                                            <FoldVertical className='w-5 text-brand-500 dark:text-brand-200'/>
                                        </TooltipText>
                                    </div>
                                </ScaleUp>
                            }
                        </AnimatePresence>

                    </div>
                </Card>
            </div>
            <div className="audits pt-4 flex mb-24">
                <div className='w-full'>
                    <AnimatePresence initial={false}>
                        <div key='performance' className='grid grid-cols-12 gap-6 w-full relative '>
                            <div className='col-span-12 flex flex-col gap-4'>
                                {activeTab === 'configurations' ?
                                   <>
                                       {/*<SetupChecklist/>*/}
                                       <Configurations/>
                                   </>
                                    : <AuditList activeTab={activeTab}/>
                                }

                            </div>
                        </div>
                        <div key='audit-blank'>
                            {(activeTab !== 'configurations' && (!data?.grouped[activeTab] || data?.grouped[activeTab].length <= 0)) && (
                                <m.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    className='flex flex-col gap-8 items-center px-8 pt-40 w-full'>

                                    <div>
                                        <img alt='Good Job!' className='w-64'
                                             src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/success.svg`) : '/success.svg'}/>
                                    </div>

                                    <span className='flex gap-2'>
                                    Brilliantly done! It's clear you've mastered this.
                                </span>
                                </m.div>

                            )}
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Performance