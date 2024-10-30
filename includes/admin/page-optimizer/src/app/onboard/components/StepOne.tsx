import React, { useState, useEffect } from 'react';
import { cn } from "lib/utils";
import {useAppContext} from "../../../context/app";
import {BoltIcon, InformationCircleIcon} from "@heroicons/react/24/solid";
import TooltipText from "components/ui/tooltip-text";
import {changeReport, fetchReport} from "../../../store/app/appActions";
import {ArrowTopRightOnSquareIcon, DevicePhoneMobileIcon, ArrowLongRightIcon} from "@heroicons/react/24/outline";
import {Monitor, RefreshCw} from "lucide-react";
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import {setCommonState} from "../../../store/common/commonActions";
import AppButton from "components/ui/app-button";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import PerformanceProgressBar from "components/performance-progress-bar";
import usePerformanceColors from "hooks/usePerformanceColors";
import {AIButtonIcon} from "app/onboard/components/icons/icon-svg";

const StepOne = () => {
    const { options } = useAppContext()
    const { dispatch} = useCommonDispatch()
    const { activeReport } = useSelector(optimizerData);
    const performanceScore = 40;
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(performanceScore);

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 border flex flex-col gap-8 p-6 items-center rounded-3xl">
                <div className='px-2'>
                    <img className='w-22'
                         src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'}
                         alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex gap-2'>
                    <h1 className='text-4xl font-bold'>Welcome to RapidLoad</h1>
                </div>
                <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                    We have analyzed your entire site and this is the current results.
                </span>

                <div className='border rounded-xl p-4 flex items-center gap-4'>
                    <div className='p-2 bg-brand-200/60 rounded-lg'>
                        <InformationCircleIcon className='w-10 h-10 text-purple-700/90'/>
                    </div>

                    <span className='font-medium text-sm text-zinc-600 dark:text-brand-300'>
                        Your website (https://example.com/) uses caching. We bypass it to <br/> reveal the unoptimized performance, showing RapidLoad's full <br/> impact.
                    </span>
                </div>
                <div className='bg-brand-100/30 border rounded-3xl p-2'>
                    <div
                        className="flex px-2 py-2 justify-between ">
                        <div data-tour='switch-report-strategy'
                             className='select-none relative flex dark:bg-brand-800 py-0.5 bg-[#E8E8E8] rounded-2xl cursor-pointer'>
                            <div className={cn(
                                'absolute shadow-md translate-x-0 left-0.5 w-[48px] rounded-[15px] -z-1 duration-300 h-10 text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',
                                activeReport === 'desktop' && 'w-[51px] -translate-x-1 left-1/2'
                            )}>
                            </div>

                            <TooltipText text="Mobile">
                                <div onClick={() => dispatch(changeReport('mobile'))}
                                     className={`relative z-1 text-sm flex flex-column gap-2 pl-[18px] px-5 py-3 font-medium rounded-xl`}>
                                    <DevicePhoneMobileIcon className="w-4 font-medium dark:text-brand-500"/>
                                </div>
                            </TooltipText>

                            <TooltipText text='Desktop'>
                                <div onClick={() => dispatch(changeReport('desktop'))}
                                     className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-5 py-1 font-medium rounded-xl`}>
                                    <Monitor className="w-4 font-medium dark:text-brand-500 "/>
                                </div>
                            </TooltipText>
                        </div>

                    </div>
                    <div
                        className="flex items-center justify-center text-md gap-2 overflow-hidden relative">
                        <div className="flex justify-center px-4 py-0 max-w-xl mx-auto w-full relative">
                            {/* Before Results */}
                            <div className="flex flex-col items-center gap-4 px-6 py-4 rounded-2xl w-[230px]">
                                <div className="">
                                    <PerformanceProgressBar
                                        className={cn('max-h-[140px]')}
                                        performance={57}
                                    />
                                </div>
                                <div className="text-sm font-semibold border rounded-3xl p-2 py-1">Your Current Score
                                </div>
                            </div>

                            {/* Optimized Score */}
                            <div className="flex flex-col items-center gap-4 px-6 py-4 rounded-2xl w-[230px]">

                                <div className="">
                                    <PerformanceProgressBar
                                        className={cn('max-h-[140px]')}
                                        scoreClassName={"text-brand-950"}
                                        performance={performanceScore}
                                    />
                                </div>
                                <div
                                    className="items-center gap-1 text-sm font-semibold bg-purple-100 rounded-3xl p-2 py-1 flex">
                                    <AIButtonIcon/> AI Predicted Score
                                </div>
                            </div>


                        </div>
                    </div>

                </div>

                <button
                    className="flex items-center bg-gradient-to-r from-brand-900/80 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 shadow-[inset_0px_2px_5px_rgba(0,0,0,0.5),_0px_3px_6px_rgba(0,0,0,0.5)]">
                    Let’s improve this score
                    <ArrowLongRightIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

export default StepOne;
