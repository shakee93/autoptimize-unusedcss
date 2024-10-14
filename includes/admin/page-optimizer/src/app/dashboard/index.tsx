import React, {Dispatch, SetStateAction, useEffect, useRef, useState, lazy} from "react";
import PageSpeedWidget from "app/dashboard/components/performance-widgets/PageSpeedWidget";
import LicenseWidget from "app/dashboard/components/LicenseWidget";
import UnusedCSSSummary from "app/dashboard/components/UnusedCSSSummary";
import CacheSummary from "app/dashboard/components/CacheSummary";
import CDNSummary from "app/dashboard/components/CDNSummary";
import OptimizerPagesTable from "app/dashboard/components/OptimizerPagesTable";
import GeneralSettings from "app/dashboard/components/GeneralSettings";
import Header from "app/page-optimizer/components/Header";

import {useDispatch, useSelector} from "react-redux";
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
import SpeedInsights from "../speed-popover/components/speed-insights";
import {ContentSelector} from "components/ui/content-selector";
import {AppAction, RootState} from "../../store/app/appTypes";
import {fetchPosts} from "../../store/app/appActions";
import {ThunkDispatch} from "redux-thunk";
import PerformanceGears from "./components/performance-widgets/PerformanceGears";
import PerformanceWidget from './components/performance-widgets/PerformanceWidget';
import PageSpeedCoach from './components/performance-widgets/PageSpeedCoach';

export interface AuditComponentRef {
    notifyHeightChange: () => void;
}

export default function Dashboard() {
    const {data, loading, error} = useSelector(optimizerData);

    const {
        options,
        savingData,
        togglePerformance,
        optimizerContainer,
        invalidatingCache
    } = useAppContext()

    let url = options?.optimizer_url;
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();

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
                "h-fit font-sans overflow-hidden flex flex-col text-base items-center "
            )}>


            <div
                id='rapidload-page-optimizer-content'
                className={cn(
                    'overflow-y-auto w-full pb-20 min-h-[780px] mt-4 flex items-center',
                    'dark:bg-brand-900',
                    // 'dark:bg-brand-930 bg-brand-50 min-h-screen',
                    savingData && 'relative overflow-hidden'
                )}>

                <section
                    ref={optimizerContainer}
                    className={cn(
                        'relative container flex flex-col mt-4 gap-4',
                    )}>

                    {(savingData || invalidatingCache) && (
                        <div
                            className='fixed inset-0 flex justify-center items-center bg-brand-50/80 dark:bg-brand-950/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>
                            <div className='fixed top-1/2 flex gap-2 items-center justify-center'>
                                <Loader className='w-5 animate-spin'/>
                                {savingData && 'Saving Changes...'}
                                {invalidatingCache && 'Flushing Cache...'}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col w-full gap-4">
                            <LicenseWidget/>
                            <CacheSummary/>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            {/*<PageSpeedCoach/>*/}
                            <CDNSummary/>
                            <CDNSummary/>
                        </div>
                        <div className="flex flex-col w-full">
                            <PerformanceWidget/>
                            <PerformanceGears/>
                        </div>
                        {/*<div className="flex-col">*/}
                        {/*    <div className="widgets pt-4 gap-4 grid">*/}
                        {/*        <PageSpeedCoach/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="col-span-2">*/}
                        {/*    <div className="widgets pt-4 gap-4 grid">*/}
                        {/*        <SpeedInsights dashboardMode={true}/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="">*/}

                        {/*    <div className="widgets flex">*/}
                        {/*        <CDNSummary/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="">*/}

                        {/*<div className="widgets flex">*/}
                        {/*    <CacheSummary/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="">*/}

                        {/*    <div className="widgets gap-4 grid">*/}
                        {/*        <UnusedCSSSummary*/}
                        {/*            settings={[*/}
                        {/*                {*/}
                        {/*                    title: "Unused CSS summary",*/}
                        {/*                    total_jobs: 1000,*/}
                        {/*                    items: [*/}
                        {/*                        {label: "Success jobs", value: "153 jobs", performance: 95},*/}
                        {/*                        {label: "Failed jobs", value: "153 jobs", performance: 95},*/}
                        {/*                        {label: "Warning jobs", value: "153 jobs", performance: 95}*/}
                        {/*                    ]*/}
                        {/*                },*/}
                        {/*                {*/}
                        {/*                    title: "Critical CSS summary",*/}
                        {/*                    total_jobs: 1000,*/}
                        {/*                    items: [*/}
                        {/*                        {label: "Success jobs", value: "153 jobs", performance: 95},*/}
                        {/*                        {label: "Failed jobs", value: "153 jobs", performance: 95},*/}
                        {/*                        {label: "Warning jobs", value: "153 jobs", performance: 95}*/}
                        {/*                    ]*/}
                        {/*                }*/}
                        {/*            ]}*/}
                        {/*        />*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="col-span-3">
                        <div className="widgets gap-4 grid">
                            <OptimizerPagesTable
                                settings={
                                    {
                                        title: "Optimize Pages",
                                        description: "Check out you Optimized Pages details in here.",
                                            total_jobs: 1000,
                                        }
                                    }
                                />
                            </div>
                        </div>

                </section>
            </div>
            {/*{!error && (*/}
            {/*    <Footer />*/}
            {/*)}*/}
            <Toaster/>
        </m.div>
    </>;
}
