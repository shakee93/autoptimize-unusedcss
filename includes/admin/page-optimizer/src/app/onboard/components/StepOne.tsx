import React, { useState, useEffect } from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import { BoltIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import TooltipText from "components/ui/tooltip-text";
import { changeReport, fetchReport, getAiPrediction } from "../../../store/app/appActions";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Loader, Monitor, RefreshCw } from "lucide-react";
import useCommonDispatch from "hooks/useCommonDispatch";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import PerformanceProgressBar from "components/performance-progress-bar";
import usePerformanceColors from "hooks/usePerformanceColors";
import { AIButtonIcon } from "app/onboard/components/icons/icon-svg";
import { Skeleton } from "components/ui/skeleton";
import { setCommonRootState } from '../../../store/common/commonActions';
import ErrorFetch from 'components/ErrorFetch';
import AppButton from "components/ui/app-button";

interface StepOneProps {
    onNext: () => void;
}

interface AIPredictionResult {
    success: boolean;
    data?: any;
    error?: string;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
    const { options } = useAppContext()
    const { dispatch } = useCommonDispatch()
    const { activeReport, data, error, loading } = useSelector(optimizerData);
    const [predictedLoading, setPredictedLoading] = useState(true)
    const [aiPredictionResult, setAiPredictionResult] = useState<AIPredictionResult | null>(null)
    const [aiPrediction, setAiPrediction] = useState<any>(null)
    const [performanceScore, setPerformanceScore] = useState(95)

    useEffect(() => {
        data && dispatch(getAiPrediction(options, options.optimizer_url, data.performance, data.grouped, data.metrics))
            .then(response => {

                setAiPredictionResult(response)
                setAiPrediction(response.data)
                setPredictedLoading(false);
            })
            .catch(error => {
                console.error('Error in AI Prediction:', error);
            });
    }, [data])

    useEffect(() => {
        if (aiPredictionResult && aiPredictionResult.success) {
            setPerformanceScore(aiPredictionResult.data.predictedScore.predictedPerformanceScore)
            dispatch(setCommonRootState('aiPredictionResult', aiPredictionResult.data))
        }
    }, [aiPredictionResult])

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <div className='px-2'>
                    <img className='w-22'
                        src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/rapidload-logo.svg`) : '/rapidload-logo.svg'}
                        alt='RapidLoad - #1 to unlock breakneck page speed' />
                </div>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-4xl font-bold'>Welcome to RapidLoad</h1>
                    <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                        We have analyzed your entire site and this is the current results.
                    </span>
                </div>


                <div className='border rounded-xl p-2 flex items-center gap-4'>
                    <div className='p-2 bg-brand-200/60 rounded-lg'>
                        <InformationCircleIcon className='w-10 h-10 text-purple-700/90' />
                    </div>
                    <span className='font-medium text-xs text-zinc-600 dark:text-brand-300'>
                        Your website ({options?.optimizer_url}) uses caching. We bypass it to <br /> reveal the unoptimized performance, showing RapidLoad's full <br /> impact.
                    </span>
                </div>
                <div className='bg-brand-100/30 border rounded-3xl p-2'>

                    {true &&
                        <TooltipText
                            text='Re-analyze the page'>
                            <AppButton asChild={true} data-tour='analyze'
                                className={cn(

                                    'border-r-0 border-l-0 border-t-0 border-b-0 bg-transparent hover:bg-transparent',
                                )}
                                onClick={() => {
                                    dispatch(fetchReport(options, options.optimizer_url, true))
                                }}
                                variant='outline'>
                                <div className={`flex flex-col gap-[1px] items-center`}>
                                    <RefreshCw className={cn(
                                        'w-4',
                                        loading && 'animate-spin'
                                    )} />
                                    {/*<span className='text-xxs font-normal text-brand-500'>Analyze </span>*/}
                                </div>
                            </AppButton>
                        </TooltipText>
                    }

                    <div
                        className="flex items-center justify-center text-md gap-2 overflow-hidden relative">
                        <div className="flex justify-center px-4 py-2 max-w-xl mx-auto w-full relative">
                            {/* Before Results */}

                            <div className="flex flex-col items-center gap-4 px-6 rounded-2xl w-[230px]">
                                <div className="">
                                    {error ?
                                        <Skeleton className="w-44 h-44 rounded-full" />
                                        :
                                        <PerformanceProgressBar
                                            className={cn('max-h-44')}
                                            performance={data ? data?.performance : 0}
                                            loading={loading}
                                        />
                                    }

                                </div>
                                <div className="text-sm font-semibold border rounded-3xl p-2 py-1">Your Current Score
                                </div>
                            </div>


                            {/* Optimized Score */}
                            <div className="flex flex-col items-center gap-4 px-6 rounded-2xl w-[230px]">

                                <div className="">
                                    {predictedLoading || error || loading ? (


                                        <div
                                            className="bg-gradient-to-r from-purple-100 via-purple-60 to-purple-100/10 relative flex items-center justify-center w-44 h-44 rounded-full"
                                        >
                                            <div
                                                className="flex flex-col items-center justify-center text-center text-brand-950">
                                                <AIButtonIcon className='w-10 h-10 animate-pulse' />
                                                <p className="text-lg">AI Analyzing</p>
                                                <p className="text-lg">your site...</p>
                                            </div>
                                        </div>

                                    ) : (
                                        <PerformanceProgressBar
                                            className={cn('max-h-44')}
                                            scoreClassName={"text-brand-950"}
                                            performance={performanceScore}
                                        />
                                    )}

                                </div>
                                <div
                                    className="items-center gap-1 text-sm font-semibold bg-brand-200/60 rounded-3xl p-2 py-1 flex">
                                    {predictedLoading || error || loading ?
                                        (
                                            <><Loader className='w-4 animate-spin' /> Hold on tight</>
                                        ) : (
                                            <><AIButtonIcon /> AI Predicted Score</>
                                        )
                                    }
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {error &&
                    <div className='border rounded-xl p-2 flex items-center gap-4'>
                        <div className='p-2 bg-brand-200/60 rounded-lg'>
                            <ExclamationCircleIcon className='w-10 h-10 text-red-500' />
                        </div>
                        <span className='font-medium text-xs text-zinc-600 dark:text-brand-300'>
                            <ErrorFetch className={"max-w-[420px] text-xs"} error={error} icon={false}></ErrorFetch>
                        </span>
                    </div>
                }

                <button
                    className={cn('flex items-center bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 hover:bg-gradient-to-br hover:from-[rgba(94,92,92,0.55)]  hover:to-brand-900/90 bg-brand-900/90',
                        predictedLoading && 'pointer-events-none cursor-default opacity-30')}
                    onClick={onNext}
                >
                    Let’s improve this score
                    <ArrowLongRightIcon className="w-6 h-6" />
                </button>

            </div>
        </div>
    );
};

export default StepOne;
