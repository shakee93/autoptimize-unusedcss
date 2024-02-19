import React, {Dispatch, SetStateAction, useEffect, useRef, useState, lazy} from "react";
import PageSpeedScore from "app/page-optimizer/components/performance-widgets/PageSpeedScore";
import LicenseWidget from "app/dashbaord/components/LicenseWidget";
import UnusedCSSSummary from "app/dashbaord/components/UnusedCSSSummary";
import CacheSummary from "app/dashbaord/components/CacheSummary";
import CDNSummary from "app/dashbaord/components/CDNSummary";
import Header from "app/page-optimizer/components/Header";

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
import SpeedIndex from "app/page-optimizer/spaces/Metrics";
import TogglePerformance from "components/toggle-performance";
import useCommonDispatch from "hooks/useCommonDispatch";
import SlideUp from "components/animation/SlideUp";
import {JsonView} from "react-json-view-lite";
import ErrorFetch from "components/ErrorFetch";

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function Dashbaord() {
    const {data, loading, error} = useSelector(optimizerData);
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
            const content =  document.getElementById('rapidload-page-optimizer-content');
            content?.scrollTo(0, 0)
        }

    }, [savingData])

    return <>


        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                ease: 'linear',
                duration: 0.04,
            }}
            id='rapidload-page-optimizer-wrapper'
            className={cn(
                "bg-white h-fit font-sans overflow-hidden flex flex-col text-base items-center "
            )}>


            <div
                id='rapidload-page-optimizer-content'
                className={cn(
                    'overflow-y-auto scrollbar-stable w-full pb-20 -mt-[70px] min-h-[780px] flex items-center',
                    'dark:bg-brand-900 bg-brand-200/60 ',
                    // 'dark:bg-brand-930 bg-brand-50 min-h-screen',
                    savingData && 'relative overflow-hidden'
                )}>

                {!loading ? (
                    <section
                        ref={optimizerContainer}
                        className={cn(
                            'relative container grid grid-cols-none lg:grid-cols-12 lg:grid-rows-none  gap-8 pt-[84px] mt-4',
                        )}>

                        {(savingData || invalidatingCache) && (
                            <div className='fixed inset-0 flex justify-center items-center bg-brand-50/80 dark:bg-brand-950/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
                                <div className='fixed top-1/2 flex gap-2 items-center justify-center'>
                                    <Loader className='w-5 animate-spin'/>
                                    {savingData && 'Saving Changes...'}
                                    {invalidatingCache && 'Flushing Cache...'}
                                </div>
                            </div>
                        )}

                        {error ?
                            <div className='col-span-12 py-32 flex flex-col gap-6 justify-center items-center text-center'>
                                <ErrorFetch className='items-center' error={error}/>
                            </div> :
                            <>

                                <div className="col-span-12 lg:col-span-3">

                                    <div   className="widgets pt-4 flex">
                                        <PageSpeedScore/>
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-3">

                                    <div   className="widgets pt-4 flex">
                                        <CacheSummary/>
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-3">

                                    <div   className="widgets pt-4 gap-4 grid">
                                        <UnusedCSSSummary
                                            settings={{
                                                title: "Unused CSS summary",
                                                total_jobs: 1000,
                                                items: [
                                                    { label: "Success jobs", value: "153 jobs", performance: 95 },
                                                    { label: "Failed jobs", value: "153 jobs", performance: 95 },
                                                    { label: "Warning jobs", value: "153 jobs", performance: 95 }
                                                ]
                                            }}
                                        />

                                        <UnusedCSSSummary
                                            settings={{
                                                title: "Critical CSS summary",
                                                total_jobs: 1000,
                                                items: [
                                                    { label: "Success jobs", value: "153 jobs", performance: 95 },
                                                    { label: "Failed jobs", value: "153 jobs", performance: 95 },
                                                    { label: "Warning jobs", value: "153 jobs", performance: 95 }
                                                ]
                                            }}
                                        />

                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-3">

                                    <div   className="widgets pt-4 gap-4 grid">
                                        <LicenseWidget/>
                                        <CDNSummary/>
                                    </div>
                                </div>
                                <article className={cn(
                                     'col-span-12'
                                )}>

                                    {/*<AnimatePresence initial={true} mode='wait'>*/}
                                    {/*    {activeMetric ? (*/}
                                    {/*        <SpeedIndex/>*/}
                                    {/*    ) : (*/}
                                    {/*        <SlideUp uuid='perf'>*/}
                                    {/*            <Performance/>*/}
                                    {/*        </SlideUp>*/}
                                    {/*    )}*/}
                                    {/*</AnimatePresence>*/}
                                </article>
                            </>}
                    </section>
                ) : (
                    <Loading url={url}/>
                )}
            </div>
            {/*{!error && (*/}
            {/*    <Footer />*/}
            {/*)}*/}
            <Toaster/>
        </m.div>
    </>;
}
