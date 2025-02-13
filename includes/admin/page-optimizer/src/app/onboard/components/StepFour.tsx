import React, { useEffect, useState, useMemo } from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import { ArrowLongRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { AnimatePresence, motion } from 'framer-motion';
import { Circle, DownloadIcon, EyeIcon, Hourglass, InfoIcon, LayoutDashboard, Loader, LoaderCircle, MousePointerClick, MousePointerClickIcon, PaintRoller, PaintRollerIcon, Timer } from "lucide-react";
import PerformanceProgressBar from "components/performance-progress-bar";
import usePerformanceColors from "hooks/usePerformanceColors";
import useCommonDispatch from "hooks/useCommonDispatch";
import { setCommonRootState, setCommonState } from "../../../store/common/commonActions";
import { AIButtonIcon, PerformanceArrowIcon } from './icons/icon-svg';
import ErrorFetch from 'components/ErrorFetch';
import ApiService from '../../../services/api';


interface MetricWithAudits extends Metric {
    metric: string;
    audits: Audit[];
}
import { getHomePagePerformance } from '../../../store/app/appActions';
import { GearIcon } from '@radix-ui/react-icons';
import TooltipText from 'components/ui/tooltip-text';

interface Metric {
    name: string;
    before: number;
    after: number;
    unit?: string;
}

const StepFour = () => {
    const { options } = useAppContext()
    const { activeReport, data, homePerformance, settings } = useSelector(optimizerData);
    const [performance, setPerformance] = useState(homePerformance);
    const beforeColor = usePerformanceColors(performance.first_entry);
    const afterColor = usePerformanceColors(performance.last_entry);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const { dispatch, aiPredictionResult, HomePerformance_dummy } = useCommonDispatch()
    const [aiMessage, setAiMessage] = useState(false)

    // const metrics: Metric[] = useMemo(() => [
    //     {
    //         name: "First Contentful Paint",
    //         before: data?.metrics?.fcp?.before || 0,
    //         after: data?.metrics?.fcp?.after || 0,
    //         unit: "s"
    //     },
    //     {
    //         name: "Largest Contentful Paint", 
    //         before: data?.metrics?.lcp?.before || 0,
    //         after: data?.metrics?.lcp?.after || 0,
    //         unit: "s"
    //     },
    //     {
    //         name: "Total Blocking Time",
    //         before: data?.metrics?.tbt?.before || 0,
    //         after: data?.metrics?.tbt?.after || 0,
    //         unit: "ms"
    //     },
    //     {
    //         name: "Cumulative Layout Shift",
    //         before: data?.metrics?.cls?.before || 0,
    //         after: data?.metrics?.cls?.after || 0
    //     }
    // ], [data]);

    //  const metrics = useMemo(() => {
    //     if (!data?.metrics) return [];
    //     return data.metrics.filter(metric => 
    //         ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].includes(metric.id)
    //     );
    // }, [data]);
    
    const metrics = useMemo(() => {
        // Handle new data structure
        if(!homePerformance.first_entry_metrics || !homePerformance.last_entry_metrics) {
            return [];
        }
        return homePerformance.first_entry_metrics.filter(metric => 
            ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].includes(metric.id)
        ).map(metric => ({
            //...metric,
            id: metric.id,
            title: metric.title,
            before: metric.displayValue,
            after: homePerformance.last_entry_metrics.find(m => m.id === metric.id)?.displayValue || '0'
        }));
    }, [data]);

    useEffect(() => {
     //   console.log(metrics)
    }, [metrics, data])

    const calculateBoost = (before: number, after: number): JSX.Element => {
        if (before === 0 || before < after) return <span className='text-brand-900'>-</span>;
        const boost = before / after;
        if(boost > 99) {
           return <div className='flex flex-col text-sm'>More than <div><span className='text-purple-600 font-bold'>100 X</span> Faster</div></div>
        } else {
            return <span className='text-sm'><span className='text-purple-600 font-bold'>{boost.toFixed(1)} X</span> Faster</span>;
        }
    };

 const getIcon = (id: string) => {
    switch (id) {
      case 'first-contentful-paint':
        return <PaintRoller className='w-4 h-4'/>; 
      case 'largest-contentful-paint':
        return <EyeIcon className='w-4 h-4'/>;
      case 'total-blocking-time':
        return <DownloadIcon className='w-4 h-4'/>;
      case 'cumulative-layout-shift':
        return <LayoutDashboard className='w-5 h-5'/>;
      case 'speed-index':
        return <LoaderCircle className='w-4 h-4'/>;
      case 'first-input-delay':
        return <MousePointerClick className='w-4 h-4'/>;
      case 'time-to-first-byte':
        return <Hourglass className='w-4 h-4'/>;
      case 'page-load-time':
        return <Timer className='w-4 h-4'/>;
      default:
        return <GearIcon className='w-4 h-4'/>;
    }
  };

    const getShortName = (id: string) => {
        switch (id) {
            case 'first-contentful-paint': return '(FCP)';
            case 'largest-contentful-paint': return '(LCP)';
            case 'total-blocking-time': return '(TBT)';
            case 'cumulative-layout-shift': return '(CLS)';
            case 'first-input-delay': return '(FID)';
            case 'time-to-first-byte': return '(TTFB)';
            default: return '';
        }
    };

    const getTooltipText = (id: string) => {
        switch (id) {
            case 'first-contentful-paint':
                return 'How long it takes to display the first visible element of the page';
            case 'speed-index':
                return 'Time until the page is fully functional for the user';
            case 'total-blocking-time':
                return 'Measures the delay before the page becomes usable';
            case 'largest-contentful-paint':
                return 'Primary content display speed';
            case 'cumulative-layout-shift':
                return 'The visual stability measure of a page during loading';
            default:
                return '';
        }
    };

    const renderMetricsTable = () => (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 border border-brand-200 rounded-2xl overflow-hidden bg-brand-0 ">
                <thead>
                    <tr className="">
                        <th className="text-left p-4 font-semibold border-b border-brand-200">Key Metrics</th>
                        <th className="text-center p-4 font-semibold border-b border-brand-200">Before</th>
                        <th className="text-center p-4 font-semibold border-b border-brand-200">After</th>
                        <th className="text-center p-4 font-semibold border-b border-brand-200 w-1/4">Boosted</th>
                    </tr>
                </thead>
                {/* <tbody>
                    {metrics.map((metric, index) => (
                        <tr key={metric.id}>
                            <td className="p-4 border-b border-brand-200 gap-2 items-center flex">
                                <span>{getIcon(metric.id)}</span>
                                {metric.title} {getShortName(metric.id)} <span><TooltipText text={getTooltipText(metric.id)}><InfoIcon className='w-3 h-3 hover:cursor-pointer'/></TooltipText></span>
                            </td>
                            <td className="text-center border-b border-brand-200">
                                {metric.before}
                            </td>
                            <td className="text-center border-b border-brand-200">
                                {metric.after}
                            </td>
                            <td className="text-center border-b border-brand-200 font-medium">
                                {calculateBoost(parseFloat(metric.before), parseFloat(metric.after))}
                            </td>
                        </tr>
                    ))}
                </tbody> */}
                <tbody>
                    {metrics.map((metric, index) => {
                        // Skip rendering if after is greater than before
                        if (parseFloat(metric.after) > parseFloat(metric.before)) return null;

                        return (
                            <tr key={metric.id}>
                                <td className="p-4 border-b border-brand-200 gap-2 items-center flex">
                                    <span>{getIcon(metric.id)}</span>
                                    {metric.title} {getShortName(metric.id)} <span><TooltipText text={getTooltipText(metric.id)}><InfoIcon className='w-3 h-3 hover:cursor-pointer' /></TooltipText></span>
                                </td>
                                <td className="text-center border-b border-brand-200">
                                    {metric.before}
                                </td>
                                <td className="text-center border-b border-brand-200">
                                    {metric.after}
                                </td>
                                <td className="text-center border-b border-brand-200 font-medium">
                                    {calculateBoost(parseFloat(metric.before), parseFloat(metric.after))}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    

    const gotoDashbaord = () => {
        setIsFadingOut(true);

        setTimeout(() => {
            window.location.hash = '#/';
        }, 300);
    }
    useEffect(() => {
        dispatch(setCommonRootState('onboardCompleted', true));
    }, [dispatch]);

    useEffect(() => {
        if (homePerformance.last_entry < homePerformance.first_entry || homePerformance.last_entry < 1) {
            setAiMessage(false)
           // console.log(aiPredictionResult)
        } else {
            setPerformance(homePerformance)
            setAiMessage(false)
        }

       // dispatch(getHomePagePerformance(options))
    }, []);

   
    const calculateImprovement = () => {
        if (HomePerformance_dummy.first_entry === 0 || HomePerformance_dummy.last_entry === 0) {
            return 50; // Default value when entries are 0
        }
        const improvement = ((HomePerformance_dummy.last_entry - HomePerformance_dummy.first_entry) / HomePerformance_dummy.first_entry) * 100;
        return Math.round(improvement);
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className='w-full flex flex-col gap-4'>
            <div className="flex flex-col gap-8 p-16 items-center rounded-3xl">
                <>
                    <div className='px-2'>
                        <img className='w-22'
                            src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/rapidload-logo.svg`) : '/logo.svg'}
                            alt='RapidLoad - #1 to unlock breakneck page speed' />
                    </div>
                    <div className='flex flex-col gap-2 text-center'>
                        <h1 className='text-4xl font-bold'>{aiMessage ? 'Rapidload AI Analyzed Your site' : 'Your Site is FAST!'}</h1>
                        <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                            We have analyzed your entire site and this is the current results
                        </span>
                    </div>
                    <div className="flex justify-center p-4 mx-auto w-full relative items-center gap-4">
                        {aiMessage ? (
                            <div className='flex flex-col items-center gap-2 px-10 py-4 rounded-2xl min-w-[550px] '>


                                {(!data?.grouped?.opportunities?.length && !data?.grouped?.diagnostics?.length) ? (
                                    <div className='border-2 border-brand-500 rounded-xl flex items-start gap-4 p-4'>
                                        <div className='p-2 bg-brand-200/30 rounded-lg'>
                                            <ExclamationCircleIcon className='w-10 h-10 text-purple-800' />
                                        </div>
                                        <span className='font-medium text-zinc-600 dark:text-brand-300'>
                                            <p>We couldn't find any opportunities or diagnostics for your site. This is a good thing! It means your site is already performing well.</p>
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-lg font-semibold flex items-center gap-2"><AIButtonIcon /> AI Analysis</div>
                                        <div className="flex flex-col gap-4 w-full border border-brand-200 rounded-2xl bg-brand-0 ">
                                            {/* Opportunities Section - Only show if length > 0 */}
                                            {data?.grouped?.opportunities?.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-4 text-sm font-semibold text-brand-900 border-b border-brand-200 px-6 py-2">
                                                        <span>Opportunities</span>
                                                        <span className="flex text-xxs items-center text-brand-0 justify-center rounded-full w-6 h-6 border-2 border-orange-400 bg-orange-400">
                                                            {data?.grouped?.opportunities?.length || 0}
                                                        </span>
                                                    </div>
                                                    <div className='p-6 py-2'>
                                                        {data?.grouped?.opportunities?.map((audit: Audit, index: number) => (
                                                            <div key={index} className="text-xs text-brand-600 flex justify-between py-0.5">
                                                                <span>{audit.name}</span>
                                                                <span className="font-medium">{audit.displayValue}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Diagnostics Section - Only show if length > 0 */}
                                            {data?.grouped?.diagnostics?.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-4 text-sm font-semibold text-brand-900 border-b border-brand-200 px-6 py-2">
                                                        <span>Diagnostics</span>
                                                        <span className="flex text-xxs items-center text-brand-0 justify-center rounded-full w-6 h-6 border-2 border-yellow-400 bg-yellow-400">
                                                            {data?.grouped?.diagnostics?.length || 0}
                                                        </span>
                                                    </div>
                                                    <div className='p-6 pt-2'>
                                                        {data?.grouped?.diagnostics?.map((audit: Audit, index: number) => (
                                                            <div key={index} className="text-xs text-brand-600 flex justify-between py-0.5">
                                                                <span>{audit.name}</span>
                                                                <span className="font-medium">{audit.displayValue}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Before Results */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-lg font-semibold">Before Score</div>
                                    <div className="">
                                        <PerformanceProgressBar
                                            className={cn('max-h-[180px]')}
                                            background={false}
                                            stroke={6}
                                            loading={performance.first_entry < 1}
                                            performance={HomePerformance_dummy.first_entry}
                                           // performance={50}
                                        />
                                    </div>
                                    <div className="text-sm font-semibold flex items-center gap-1">
                                        <Circle
                                            className={cn(
                                                `w-2 stroke-0 transition-all relative inline-flex`,
                                            )}
                                            style={{ fill: beforeColor[1] }}
                                        /> Performance Score
                                    </div>
                                </div>
                                {/* Divider with BoltIcon */}
                                {/* <ArrowLongRightIcon className="w-6 h-6" /> */}
                                <div className='flex items-center gap-2 relative'>
                                    <PerformanceArrowIcon className='text-brand-900' fill={beforeColor[1]}/>
                                    <div className='text-brand-900 font-bold text-2xl text-center'>
                                        <span className='absolute -top-8 left-0 right-0 text-brand-900 font-normal text-xl'>
                                            Boosted with 
                                        </span>
                                        {calculateImprovement()}%
                                    </div>
                                    <PerformanceArrowIcon className='text-brand-900' fill={afterColor[1]}/>
                                </div>

                                <div
                                    className="flex flex-col items-center gap-4">
                                    <div className="text-lg font-semibold">Current Score</div>
                                    <div className="">
                                        <PerformanceProgressBar
                                            className={cn('max-h-[180px]')}
                                            scoreClassName={"text-brand-950"}
                                            background={false}
                                            stroke={6}
                                            loading={performance.last_entry < 1}
                                            performance={HomePerformance_dummy.last_entry}
                                           // performance={90}
                                        />
                                    </div>
                                    <div className="text-sm font-semibold flex items-center gap-1">
                                        <Circle
                                            className={cn(
                                                `w-2 stroke-0 transition-all relative inline-flex`,
                                            )}
                                            style={{ fill: afterColor[1] }}
                                        /> Performance Score
                                    </div>
                                </div>
                               
                            </>
                        )}
                    </div>
                    {!aiMessage && (
                                <div className="flex justify-center p-4 mx-auto w-full relative items-center gap-4 ">
                                    <div className="w-full max-w-2xl ">
                                    {renderMetricsTable()}
                                    
                                    </div>
                                </div>
                    )}
                    {/* <div className="flex flex-col gap-2 items-center justify-center">
                        <div className="text-lg font-semibold">
                            content
                        </div>
                        <button
                            className="flex items-center bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 "
                            onClick={doAnalysis}
                        >
                            RUN AI PREDICTION
                            <ArrowLongRightIcon className="w-6 h-6" />
                        </button>
                    </div> */}
                    <button
                        className="flex items-center bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 "
                        onClick={gotoDashbaord}
                    >
                        Go to Dashboard
                        <ArrowLongRightIcon className="w-6 h-6" />
                    </button>
                </>
            </div>
        </motion.div>
    );
};

export default StepFour;
