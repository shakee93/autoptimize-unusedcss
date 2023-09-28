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
import {ArrowLeftToLine, ArrowRightToLine, Circle, Loader, ThumbsUp} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import {m, AnimatePresence} from "framer-motion";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";
import {Toaster} from "components/ui/toaster";
import usePerformanceColors from "hooks/usePerformanceColors";
import Indicator from "components/indicator";
import Performance from "app/page-optimizer/spaces/Performance";
import SpeedIndex from "app/page-optimizer/spaces/SpeedIndex";
import TogglePerformance from "components/toggle-performance";
import useCommonDispatch from "hooks/useCommonDispatch";
import SlideUp from "components/animation/SlideUp";
import {JsonView} from "react-json-view-lite";
import ErrorFetch from "components/ErrorFetch";

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function PageOptimizer() {
    const {data, loading, error} = useSelector(optimizerData);
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(data?.performance);
    const { dispatch, activeMetric } = useCommonDispatch()

    const {
        options,
        setOpenAudits,
        mode,
        manipulatingStyles,
        savingData,
        togglePerformance,
        optimizerContainer
    } = useAppContext()

    let url = options?.optimizer_url;


    return (

        <m.div
            initial={{ y: 20, opacity: 0, scale:0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{
                ease: 'linear',
                duration: 0.1,
        }}
            id='rapidload-page-optimizer'
            className={cn(
                "rounded-md overflow-hidden fixed z-[100000] w-screen h-screen top-0 left-0 flex min-h-screen flex-col text-base items-center ",
                "dark:text-brand-300 text-brand-800 dark:bg-brand-930 bg-brand-50"
            )}>

            <Header url={url}/>

            <div className={cn(
                'overflow-y-auto scrollbar-stable w-full h-fit pb-20',
                savingData && 'relative overflow-hidden h-[calc(100vh-130px)]'
            )}>

                {!loading ? (
                    <section
                        ref={optimizerContainer}
                        className={cn(
                        'container grid grid-cols-12 gap-8 pt-4',
                    )}>

                        {savingData && (
                            <div className='fixed h-screen w-screen inset-0 z-[110000] bg-brand-50/80 dark:bg-brand-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
                                <div className='flex gap-2 items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
                                    <Loader className='w-5 animate-spin'/> Saving Changes...
                                </div>
                            </div>
                        )}

                        {error ?
                            <div className='col-span-12 py-32 flex flex-col gap-6 justify-center items-center text-center'>
                                <ErrorFetch className='items-center' error={error}/>
                            </div> :
                        <>

                            {togglePerformance && (
                                <aside data-tour='speed-insights' className="col-span-3">
                                    <div className="text-lg ml-5  flex items-center gap-2">
                                        <Circle style={{
                                            fill: progressbarColor
                                        }} className='w-2 mt-0.5 stroke-0 transition-colors'/>
                                        Speed Insights {togglePerformance && <TogglePerformance/>} </div>
                                    <div className="widgets pt-4 flex">
                                        <PageSpeedScore/>
                                    </div>
                                </aside>
                            )}
                            <article className={cn(
                                togglePerformance ? 'col-span-9' : 'col-span-12',
                            )}>

                                <AnimatePresence initial={true} mode='wait'>
                                    {activeMetric ? (
                                        <SpeedIndex/>
                                    ) : (
                                        <SlideUp uuid='perf'>
                                            <Performance/>
                                        </SlideUp>
                                    )}
                                </AnimatePresence>
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
        </m.div>
    );
}
