import React, { Dispatch, SetStateAction, useEffect, useRef, useState, lazy } from "react";

import Header from "app/page-optimizer/components/Header";
import PageSpeedScore from "app/page-optimizer/components/performance-widgets/PageSpeedScore";
import { useSelector } from "react-redux";
import { useAppContext } from "../../context/app";
import { cn } from "lib/utils";
import Loading from "components/loading";
import OptimizerInProgress from "components/optimizer-in-progress";
import { optimizerData } from "../../store/app/appSelector";
import { Loader } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Toaster } from "components/ui/toaster";
import usePerformanceColors from "hooks/usePerformanceColors";
import Performance from "app/page-optimizer/spaces/Performance";
import SpeedIndex from "app/page-optimizer/spaces/Metrics";
import TogglePerformance from "components/toggle-performance";
import useCommonDispatch from "hooks/useCommonDispatch";
import SlideUp from "components/animation/SlideUp";
import ErrorFetch from "components/ErrorFetch";

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function PageOptimizer() {
    const { data, loading, error, testMode } = useSelector(optimizerData);
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(data?.performance);
    const { dispatch, activeMetric } = useCommonDispatch()

    const {
        options,
        savingData,
        togglePerformance,
        optimizerContainer,
        invalidatingCache
    } = useAppContext()

    let url = options?.optimizer_url;

    // TODO: temp fix for scroll view leakage
    useEffect(() => {

        if (savingData) {
            const content = document.getElementById('rapidload-page-optimizer-content');
            content?.scrollTo(0, 0)
        }

    }, [savingData])

    return (

        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                ease: 'linear',
                duration: 0.04,
            }}
            id='rapidload-page-optimizer-wrapper'
            translate="no"
            className={cn(
                " bg-white font-sans overflow-hidden fixed z-[100000] w-screen h-screen top-0 left-0 flex min-h-screen flex-col text-base items-center ",
                "dark:text-brand-300 text-brand-800",
                "notranslate"
            )}>

            <AnimatePresence>
                {testMode &&
                    <m.div
                        initial={{ borderWidth: '0px' }}
                        animate={{ borderWidth: '5px' }}
                        exit={{ borderWidth: '0px' }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            'absolute inset-0 z-[110002] pointer-events-none',
                            'border-solid border-[#f7b250] rounded-none'
                        )}>
                        <div className={cn(
                            'absolute -inset-[3px] rounded-xl',
                            'border-[3px] border-[#f7b250]'
                        )} />
                    </m.div>}
            </AnimatePresence>


            <Header url={url} />

            <div
                id='rapidload-page-optimizer-content'
                className={cn(
                    'overflow-y-auto scrollbar-stable w-full h-fit pb-10 -mt-[70px] ',
                    'dark:bg-brand-900 bg-brand-200/60 min-h-screen',
                    savingData && 'relative overflow-hidden',

                )}>

                <section
                    ref={optimizerContainer}
                    className={cn(
                        'relative container grid grid-cols-none lg:grid-cols-12 lg:grid-rows-0 gap-6 pt-[72px] mt-4',
                    )}>

                    {(savingData || invalidatingCache) && (
                        <div className='fixed inset-0 flex justify-center items-center z-[110000] bg-brand-50/80 dark:bg-brand-950/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
                            <div className='fixed top-1/2 flex gap-2 items-center justify-center'>
                                <Loader className='w-5 animate-spin' />
                                {savingData && 'Saving Changes...'}
                                {invalidatingCache && 'Flushing Cache...'}
                            </div>
                        </div>
                    )}

                    <div className="col-span-12 w-full">
                        {/* <AnimatePresence>
                            {testMode && (
                                <m.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        ease: 'easeInOut',
                                        duration: 0.5,
                                    }}
                                    className="text-sm bg-white dark:bg-brand-950 flex flex-col px-6 py-3 rounded-lg border-2"
                                >
                                    <span className="font-semibold text-md  dark:text-brand-300">Test Mode Activated</span>
                                    <span className="capitalize">
                                        optimizations are safely previewed without affecting your live website. Perfect for experimentation and fine-tuning.
                                    </span>
                                </m.div>
                            )}
                        </AnimatePresence> */}
                    </div>
                    <>

                        {togglePerformance && (
                            <aside className="col-span-12 lg:col-span-3">
                                <div className="text-lg ml-5  flex items-center gap-2">
                                    {/*<Circle style={{*/}
                                    {/*    fill: progressbarColor*/}
                                    {/*}} className='w-2 mt-0.5 stroke-0 transition-colors'/>*/}
                                    Page Insights {togglePerformance && <TogglePerformance />} </div>
                                <div className="widgets pt-4 flex">
                                    <PageSpeedScore />
                                </div>
                            </aside>
                        )}
                        <article className={cn(
                            togglePerformance ? 'col-span-12 lg:col-span-9' : 'col-span-12',
                        )}>

                            <AnimatePresence initial={true} mode='wait'>
                                {activeMetric ? (
                                    <SpeedIndex />
                                ) : (
                                    <SlideUp uuid='perf'>
                                        <Performance />
                                    </SlideUp>
                                )}
                            </AnimatePresence>
                        </article>
                    </>
                </section>

            </div>
            <Toaster />
        </m.div>
    );
}
