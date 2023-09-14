import React, {Dispatch, SetStateAction, useEffect, useRef, useState, lazy} from "react";

import Header from "app/page-optimizer/components/Header";
import PageSpeedScore from "app/page-optimizer/components/performance-widgets/PageSpeedScore";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import Card from "components/ui/card";
import {useSelector} from "react-redux";
import {useAppContext} from "../../context/app";
import {cn} from "lib/utils";
import Audit from "app/page-optimizer/components/audit/Audit";
import Footer from "app/page-optimizer/components/Footer";
import Loading from "components/loading";
import {optimizerData} from "../../store/app/appSelector";
import {ArrowLeftToLine, ArrowRightToLine, Loader} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import {m, AnimatePresence} from "framer-motion";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";
import {Toaster} from "components/ui/toaster";

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function PageOptimizer() {
    const [activeTab, setActiveTab] = useState<AuditTypes>("opportunities");
    const [togglePerformance, setTogglePerformance] = useState(true);
    const {data, loading, error} = useSelector(optimizerData);
    const {
        options,
        setOpenAudits,
        mode,
        manipulatingStyles,
        savingData
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

    const renderTabs = () => {


        return tabs.map((tab) => {
            const isActive = activeTab === tab.key ? "font-medium border-b border-b-purple-750" : "text-brand-500 dark:hover:text-brand-300";
            return (
                <div
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(`cursor-pointer  flex items-center gap-2 px-4 py-3 text-sm font-medium`, isActive)}
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
                                '',
                                activeTab === tab.key && ' text-white dark:text-brand-900'
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

    // useEffect(() => {
    //
    //     setOpenAudits([]);
    //
    // }, [activeTab])
    return (

        <div
            id='rapidload-page-optimizer'
            className={cn("fixed z-[100000] w-screen h-screen top-0 left-0 flex min-h-screen flex-col text-base items-center dark:text-brand-200 text-brand-800 dark:bg-brand-930 bg-brand-50")}>

            <Header url={url}/>

            <div className={cn(
                'relative overflow-auto w-full h-fit',
                savingData && 'overflow-hidden h-[calc(100vh-130px)]'
            )}>

                {!loading ? (
                    <section className={cn(
                        'container grid grid-cols-12 gap-8 pt-4',
                    )}>

                        {savingData && (
                            <div className='absolute h-[calc(100vh-130px)] w-screen left-0 inset-0 z-[110000] bg-brand-50/80 dark:bg-brand-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
                                <div className='flex gap-2 items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
                                    <Loader className='w-5 animate-spin'/> Saving Changes...
                                </div>
                            </div>
                        )}

                        {error ?
                            <div className='col-span-12 py-32 flex flex-col gap-6 justify-center items-center text-center'>
                                <ExclamationCircleIcon className='w-12 fill-red-500'/>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-medium text-lg '>Oops! Something went wrong</span>
                                    {error}
                                </div>
                            </div> :
                        <>

                            {togglePerformance && (
                                <aside className="col-span-3">
                                    <div className="text-lg ml-5 flex items-center gap-2">Speed Insights {togglePerformance && <TogglePerformanceComponent/>} </div>
                                    <div className="widgets pt-4 flex">
                                        <PageSpeedScore/>
                                    </div>
                                </aside>
                            )}
                            <article className={cn(
                                togglePerformance ? 'col-span-9' : 'col-span-12',

                            )}>



                                <h2 className="text-lg ml-5 flex gap-2 font-normal items-center">
                                    {!togglePerformance && <TogglePerformanceComponent/>}
                                    Fix Performance Issues</h2>
                                <div className="tabs pt-4 flex">
                                    <Card className='flex select-none p-0 px-6'>
                                        {renderTabs()}
                                    </Card>
                                </div>
                                <div className="audits pt-4 flex">
                                    {(data?.grouped[activeTab] && data?.grouped[activeTab].length > 0) && (
                                        <AnimatePresence initial={false}>
                                            <div className='grid grid-cols-12 gap-6 w-full relative mb-24'>
                                                <div className='col-span-12 flex flex-col gap-4'>
                                                    {data?.grouped[activeTab]?.map((audit: Audit, index: number) => (
                                                        <m.div
                                                            initial={{opacity: 0, y: 10}}
                                                            animate={{opacity: 1, y: 0}}
                                                            exit={{opacity: 0, y: -20}}
                                                            transition={{delay: index * 0.03}}
                                                            className='relative' key={audit.id}>

                                                            {/*{ TODO: fix this with new animation }*/}
                                                            {/*<div className={cn(*/}
                                                            {/*    'h-3 absolute -left-6 text-center top-[1.5rem]',*/}
                                                            {/*    // componentHeights[index] > 50 ? 'top-[22px]' :'top-1/2 -translate-y-1/2'*/}
                                                            {/*)}>*/}
                                                            {/*        <span*/}
                                                            {/*            className={`relative border-2 inline-block w-3 h-3 dark:border-zinc-600 border-zinc-300 rounded-full ${index === 0 ? 'dark:bg-brand-600 bg-brand-300 ' : 'bg-transparent'}`}></span>*/}
                                                            {/*    {(data?.grouped[activeTab] && (index !== (data?.grouped[activeTab].length - 1))) && (*/}
                                                            {/*        <span*/}
                                                            {/*            style={{*/}
                                                            {/*                height: componentHeights[index]*/}
                                                            {/*            }}*/}
                                                            {/*            className={`min-h-[2.6rem] w-[2px] border-dashed border-zinc-300 dark:border-zinc-600 border-l-2 left-1/2 -translate-x-1/2 top-6 absolute`}></span>*/}

                                                            {/*    )}*/}
                                                            {/*</div>*/}

                                                            <Audit
                                                                activeTab={activeTab}
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
                        </>}
                    </section>
                ) : (
                    <Loading url={url}/>
                )}
            </div>
            {!error && (
                <Footer togglePerformance={togglePerformance} url={options.optimizer_url} />
            )}
            <Toaster/>
        </div>
    );
}
