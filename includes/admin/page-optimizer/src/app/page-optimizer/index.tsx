import React, {Dispatch, SetStateAction, useEffect, useRef, useState, lazy} from "react";

import Header from "app/page-optimizer/components/Header";
import PageSpeedScore from "app/page-optimizer/components/performance-widgets/PageSpeedScore";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import Card from "components/ui/card";
import {useSelector} from "react-redux";
import {useOptimizerContext} from "../../context/root";
import {cn} from "lib/utils";
import Audit from "app/page-optimizer/components/audit/Audit";
import Footer from "app/page-optimizer/components/Footer";
import Loading from "components/loading";
import {optimizerData} from "../../store/app/appSelector";
import {ArrowLeftToLine, ArrowRightToLine} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import {m, AnimatePresence} from "framer-motion";

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function PageOptimizer() {
    const [activeTab, setActiveTab] = useState<AuditTypes>("attention_required");
    const [togglePerformance, setTogglePerformance] = useState(true);
    const {data, loading} = useSelector(optimizerData);
    const {options, setOpenAudits} = useOptimizerContext()

    const tabs: Tab[] = [
        {
            key: "attention_required",
            name: "Attention Required",
            color: 'border-red-400',
            activeColor: 'bg-red-400'
        },
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

    const renderTabs = () => {


        return tabs.map((tab) => {
            const isActive = activeTab === tab.key ? "font-medium border-b border-b-purple-750" : "text-zinc-500";
            return (
                <div
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium`, isActive)}
                    key={tab.key}
                >
                    {tab.name}
                    {(data && data.audits?.length > 0) && (
                        <div className={
                            cn(
                                'flex text-xxs items-center justify-center rounded-full w-6 h-6 border-2',
                                tab.color,
                                (activeTab === tab.key) && tab.activeColor,
                            )}>
                            <span className={cn(
                                activeTab === tab.key && 'text-white'
                            )}>
                                {data?.grouped[`${tab.key}`].length}
                            </span>
                        </div>
                    )}

                </div>
            );
        });
    };

    let xx = data?.grouped[activeTab]

    const componentRefs = useRef<(AuditComponentRef | null)[]>(xx ? xx.map(() => null) : []);
    const [componentHeights, setComponentHeights] = useState<number[]>([]);

    useEffect(() => {

        const heights = componentRefs.current.map((ref) => {
            if (ref) {
                // Get the height using the notifyHeightChange function
                ref.notifyHeightChange();
                return 45; // Temporary value
            }
            return 45;
        });
        setComponentHeights(heights);

    }, [data]);

    const handleAuditHeightChange = (index: number, height: number) => {
        setComponentHeights((prevHeights) => {
            const newHeights = [...prevHeights];
            newHeights[index] = height;
            return newHeights;
        });
    };

    let url = options?.optimizer_url;


    const TogglePerformanceComponent = ({}) => {

        return (
            <TooltipText text='Toggle Sidebar'>
                <span className='cursor-pointer' onClick={() => {
                    setTogglePerformance(prev => !prev)
                }}>
                            {(togglePerformance) ? <ArrowLeftToLine className="h-4 w-4 text-gray-500"/> :
                                <ArrowRightToLine className="h-4 w-4 text-gray-500"/>}
                        </span>
            </TooltipText>
        )
    }

    useEffect(() => {

        setOpenAudits([]);

    }, [activeTab])
    return (

        <div
            className={cn("fixed z-[100000] w-screen h-screen top-0 left-0 flex min-h-screen flex-col text-base items-center dark:text-zinc-200 text-zinc-800 dark:bg-zinc-930 bg-zinc-50")}>
            <div className='overflow-auto w-full'>
                <Header url={url}/>
                {!loading ? (
                    <section className="container grid grid-cols-12 gap-8 pt-4">
                        {togglePerformance && (
                            <aside className="col-span-3">
                                <div className="text-lg ml-5 flex items-center gap-2">Speed Insights {togglePerformance && <TogglePerformanceComponent/>} </div>
                                <div className="widgets pt-4 flex">
                                    <PageSpeedScore/>
                                </div>
                            </aside>
                        )}
                        <article className={`${togglePerformance ? 'col-span-9' : 'col-span-12'}`}>
                            <h2 className="text-lg ml-5 flex gap-2 font-normal items-center">
                                {!togglePerformance && <TogglePerformanceComponent/>}
                                Fix Performance Issues</h2>
                            <div className="tabs pt-4 flex">
                                <Card padding='p-0 px-6' className='flex select-none'>
                                    {renderTabs()}
                                </Card>
                            </div>
                            <div className="audits pt-4 flex">
                                {(data?.grouped[activeTab] && data?.grouped[activeTab].length > 0) && (
                                    <AnimatePresence initial={false}>
                                        <div className='grid grid-cols-12 gap-6 w-full relative mb-24'>
                                            <div className='col-span-12 ml-8 flex flex-col gap-4'>
                                                {data?.grouped[activeTab]?.map((audit: Audit, index: number) => (
                                                        <m.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className='relative' key={audit.id}>
                                                            <div className={cn(
                                                                'absolute -left-6 text-center top-[17px]',
                                                                // componentHeights[index] > 50 ? 'top-[22px]' :'top-1/2 -translate-y-1/2'
                                                            )}>
                                                            <span
                                                                className={`border-2 inline-block w-3 h-3  rounded-full ${index === 0 ? 'dark:bg-zinc-600 bg-zinc-300' : 'bg-transparent'}`}></span>
                                                                {(data?.grouped[activeTab] && (index !== (data?.grouped[activeTab].length - 1))) && (
                                                                    <span
                                                                        data-h={componentHeights[index]}
                                                                        style={{
                                                                            height: componentHeights[index]
                                                                        }}
                                                                        className={`w-[2px] border-dashed border-l-2 left-1/2 -translate-x-1/2 top-7 absolute`}></span>

                                                                )}
                                                            </div>
                                                            <Audit
                                                                onHeightChange={(height) => handleAuditHeightChange(index, height)}
                                                                ref={(element) => (componentRefs.current[index] = element)}
                                                                index={index} audit={audit}/>
                                                        </m.div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </article>
                    </section>
                ) : (
                    <Loading url={url}/>
                )}
            </div>
            <Footer togglePerformance={togglePerformance} url={options.optimizer_url} />
        </div>
    );
}
