import React, {useEffect, useState} from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import {ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { AnimatePresence, motion } from 'framer-motion';
import {Circle, Loader} from "lucide-react";
import PerformanceProgressBar from "components/performance-progress-bar";
import usePerformanceColors from "hooks/usePerformanceColors";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonRootState, setCommonState} from "../../../store/common/commonActions";

const StepFour= () => {
    const { options} = useAppContext()
    const { activeReport, data, homePerformance } = useSelector(optimizerData);
    const beforeColor = usePerformanceColors(homePerformance.first_entry);
    const afterColor = usePerformanceColors(homePerformance.last_entry);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const { dispatch} = useCommonDispatch()

    const gotoDashbaord = () => {
        setIsFadingOut(true);

        setTimeout(() => {
            window.location.hash = '#/';
        }, 300);
    }
    useEffect(() => {
        dispatch(setCommonRootState('onboardCompleted', true));
    },[dispatch]);


    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <>
                    <div className='px-2'>
                        <img className='w-22'
                             src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'}
                             alt='RapidLoad - #1 to unlock breakneck page speed'/>
                    </div>
                    <div className='flex flex-col gap-2 text-center'>
                        <h1 className='text-4xl font-bold'>Your Site is FAST!</h1>
                        <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                        We have analyzed your entire site and this is the current results.
                    </span>
                    </div>
                    <div className="flex justify-center p-4 max-w-xl mx-auto w-full relative items-center gap-4">
                        {/* Before Results */}
                        <div
                            className="flex flex-col items-center gap-2 px-10 py-4 rounded-2xl w-[230px] bg-brand-100/30">
                            <div className="text-lg font-semibold">Before Score</div>
                            <div className="">
                                <PerformanceProgressBar
                                    className={cn('max-h-[180px]')}
                                    background={false}
                                    stroke={6}
                                    performance={homePerformance.first_entry}
                                />
                            </div>
                            <div className="text-sm font-semibold flex items-center gap-1">
                                <Circle
                                    className={cn(
                                        `w-2 stroke-0 transition-all relative inline-flex`,
                                    )}
                                    style={{fill: afterColor[1]}}
                                /> Performance Score
                            </div>
                        </div>
                        {/* Divider with BoltIcon */}
                        <ArrowLongRightIcon className="w-6 h-6"/>


                        <div
                            className="flex flex-col items-center gap-2 px-10 py-4 rounded-2xl w-[230px] bg-brand-100/30">
                            <div className="text-lg font-semibold">Current Score</div>
                            <div className="">
                                <PerformanceProgressBar
                                    className={cn('max-h-[180px]')}
                                    scoreClassName={"text-brand-950"}
                                    background={false}
                                    stroke={6}
                                    performance={homePerformance.last_entry}
                                />
                            </div>
                            <div className="text-sm font-semibold flex items-center gap-1">
                                <Circle
                                    className={cn(
                                        `w-2 stroke-0 transition-all relative inline-flex`,
                                    )}
                                    style={{fill: beforeColor[1]}}
                                /> Performance Score
                            </div>
                        </div>

                    </div>
                    <button
                        className="flex items-center bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 "
                        onClick={gotoDashbaord}
                    >
                        Go to Dashboard
                        <ArrowLongRightIcon className="w-6 h-6"/>
                    </button>
                </>
            </div>
        </motion.div>
    );
};

export default StepFour;
