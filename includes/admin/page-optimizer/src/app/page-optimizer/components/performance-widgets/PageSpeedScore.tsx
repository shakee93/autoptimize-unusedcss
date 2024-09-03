import React, {ReactNode, Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PerformanceIcons from 'app/page-optimizer/components/performance-widgets/PerformanceIcons';
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {useAppContext} from "../../../../context/app";
import {Skeleton} from "components/ui/skeleton"
import {cn, timeAgo} from "lib/utils";
import Card from "components/ui/card";
import PerformanceProgressBar from "components/performance-progress-bar";
import Metrics from "app/page-optimizer/components/performance-widgets/Metrics";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonRootState, setCommonState} from "../../../../store/common/commonActions";
import {
    Circle, GraduationCapIcon,
    Hash, History, Loader, Monitor,
} from "lucide-react";
import SideBarActions from "app/page-optimizer/components/performance-widgets/SideBarActions";
import xusePerformanceColors from "hooks/usePerformanceColors";
import AppButton from "components/ui/app-button";
import Feedback from "app/page-optimizer/components/performance-widgets/Feedback";
import TooltipText from "components/ui/tooltip-text";
import {changeReport} from "../../../../store/app/appActions";
import {ArrowTopRightOnSquareIcon, DevicePhoneMobileIcon, InformationCircleIcon} from "@heroicons/react/24/outline";
import {getTestModeStatus} from "../../../../store/app/appActions";
import {useToast} from "components/ui/use-toast";
import {RootState} from "../../../../store/app/appTypes";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {TestModeLine} from "app/page-optimizer/components/icons/line-icons";
import {useTestModeUtils} from 'hooks/testModeUtils';
import {AnimatePresence, m} from "framer-motion";
import ErrorFetch from "components/ErrorFetch";
import TestModeSwitcher from "app/page-optimizer/components/TestModeSwitcher";
// const Feedback = React.lazy(() =>
//     import('app/page-optimizer/components/performance-widgets/Feedback'))

interface PageSpeedScoreProps {
    pagespeed?: any;
    priority?: boolean;
}

const MetricValue = ({metric}: { metric: Metric }) => {
    const [x, y, z, progressBarColorCode] = xusePerformanceColors(metric.score)

    return <div
        style={{
            color: y || '#515151'
        }}
        className='text-md font-medium text-brand-500'>
        {metric.displayValue}
    </div>
}


const PageSpeedScore = ({pagespeed, priority = true}: PageSpeedScoreProps) => {
    const [isCoreWebClicked, setCoreWebIsClicked] = useState(false);
    const [expanded, setExpanded] = useState(false)


    const {data, error, reanalyze, revisions} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const [on, setOn] = useState<boolean>(false)

    const {dispatch, hoveredMetric, activeMetric} = useCommonDispatch()

    //Test Mode
    const {options} = useAppContext();
    const {settingsMode, testModeStatus, testModeLoading} = useCommonDispatch();
    const {testMode} = useSelector((state: RootState) => state.app);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [localSwitchState, setLocalSwitchState] = useState<boolean>(testMode?.status || false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const {handleTestModeSwitchChange} = useTestModeUtils();

    let url = options?.optimizer_url;

    useEffect(() => {
        if (testMode) {
            dispatch(setCommonState('testModeStatus', testMode.status || false));
        }

    }, [testMode]);


    const handleSwitchChange = async (isChecked: boolean) => {
        await handleTestModeSwitchChange(isChecked);
    };

    useEffect(() => {
        setLocalSwitchState(testModeStatus);
        setLoadingStatus(testModeLoading);
    }, [testModeStatus, testModeLoading]);

    const handleCoreWebClick = useCallback(() => {
        setCoreWebIsClicked(!isCoreWebClicked);
    }, [isCoreWebClicked]);

    // reorder experience start
    const metricNameMappings: Record<string, string> = {
        "LARGEST_CONTENTFUL_PAINT_MS": "LCP",
        "FIRST_INPUT_DELAY_MS": "FID",
        "CUMULATIVE_LAYOUT_SHIFT_SCORE": "CLS",
        "FIRST_CONTENTFUL_PAINT_MS": "FCP",
        "INTERACTION_TO_NEXT_PAINT": "INP",
        "EXPERIMENTAL_TIME_TO_FIRST_BYTE": "TTFB",

    };

    const experianceOrder: string[] = [
        "LARGEST_CONTENTFUL_PAINT_MS",
        "FIRST_INPUT_DELAY_MS",
        "CUMULATIVE_LAYOUT_SHIFT_SCORE",
        "FIRST_CONTENTFUL_PAINT_MS",
        "INTERACTION_TO_NEXT_PAINT",
        "EXPERIMENTAL_TIME_TO_FIRST_BYTE",

    ];

    const getAbbreviation = (metricName: string): string => metricNameMappings[metricName] || metricName;

    const sortedExperience = experianceOrder.map(metricName => ({
        metricName: getAbbreviation(metricName),
        metric: data?.loadingExperience?.metrics ? data?.loadingExperience?.metrics[metricName] : null,
    }));

    const FirstLettersComponent = ({text}: { text: string }) => {
        const replacedText = getAbbreviation(text);
        return <>{replacedText}</>;
    };

    let metric = hoveredMetric

    let gain = Number((metric?.potentialGain ? metric?.potentialGain : 0)?.toFixed(0))

    const [key, setKey] = useState(1);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, []);

    useEffect(() => {

        if (!expanded) {
            dispatch(setCommonState('activeMetric', null));
        }

    }, [expanded])


    return <>
        {/*min-w-[310px]*/}

        <div className='w-full flex flex-col gap-4'>
            <TestModeSwitcher/>
            <Card data-tour='speed-insights'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around',
                      expanded && 'border-brand-200 dark:border-brand-800'
                  )}>

                <div className={cn(
                    "content px-4 relative flex w-full sm:w-1/2 lg:w-full flex-col justify-center items-center gap-3  py-2.5",
                    !error && "px-4 lg:px-4 lg:pb-0 xl:px-8"
                )}>

                    {error ?
                        <ErrorFetch error={error}></ErrorFetch>
                        : <>
                            <AnimatePresence>
                                {reanalyze &&
                                    <m.div
                                        initial={{opacity: 0, x: -10}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -10}}
                                        className='absolute border px-2 rounded-full top-2 left-2.5 flex bg-brand-100 items-center gap-1.5'>
                                        <Loader className='w-4 animate-spin text-brand-700'/>
                                        <div className='text-xs text-brand-700'>
                                            Analyzing..
                                        </div>
                                    </m.div>
                                }
                            </AnimatePresence>

                            <div className='flex gap-6'>


                                <div className='relative flex flex-col gap-3 px-4 items-center'>

                                    <div className='mt-6'>
                                        {!data || on ? (
                                            <Skeleton className="w-44 h-44 rounded-full"/>
                                        ) : (
                                            <PerformanceProgressBar

                                                performance={(data?.performance && gain && metric) ?
                                                    (data.performance + gain >= 99) ? 99 :
                                                        data.performance + gain : data?.performance}>
                                                {!!(metric && gain) && (
                                                    <div className='flex gap-1 flex-col text-xxs font-normal'>
                                                <span>
                                                    {metric?.title}
                                                </span>
                                                        <span className='text-sm text-green-600 -ml-1'>+{gain}</span>
                                                    </div>
                                                )}
                                            </PerformanceProgressBar>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col text-center gap-1">
                                <div>{metric ? 'Forecasted Score' : 'Performance'} </div>
                                <div className='text-xs text-brand-500 dark:text-brand-300 font-light'>
                                    Values are estimated and may vary with Google Page Speed Insights.
                                </div>
                            </div>
                            <div
                                className="flex justify-around text-sm gap-4 font-normal w-full mb-5 text-brand-700 dark:text-brand-300">
                                <div className="flex lg:flex-col xl:flex-row items-center gap-1">
                                    <PerformanceIcons icon={'fail'}/>
                                    0-49
                                </div>
                                <div className="flex lg:flex-col xl:flex-row items-center gap-1">
                                    <PerformanceIcons icon={'average'}/>
                                    50-89
                                </div>
                                <div className="flex lg:flex-col xl:flex-row items-center gap-1">
                                    <PerformanceIcons icon={'pass'}/>
                                    89-100
                                </div>
                            </div>


                        </>
                    }

                </div>

                <div className='border-t'>
                    <AppButton
                        onClick={e => setExpanded(p => !p)}
                        variant='outline'
                        className={cn(
                            'select-none border-b border-l-0 border-t-0 border-r-0 rounded-none bg-transparent hover:bg-transparent text-center text-xs text-brand-600 py-2',
                            expanded && 'border-b-0'
                        )}
                        data-tour="expand-metrics">
                        {expanded ? 'Collapse' : 'Expand'} Metrics
                    </AppButton>

                    {(data?.metrics && !expanded) && (
                        <>
                            <div className='flex justify-around my-2  px-2'
                                 onMouseLeave={() => dispatch(setCommonState('hoveredMetric', null))}
                            >
                                {data.metrics.map(metric => (
                                    <div key={metric.id}
                                         onMouseEnter={() => dispatch(setCommonState('hoveredMetric', metric))}

                                         className='text-xs text-center flex flex-col
                             gap-0.5 px-2 py-2 bg-brand-100/20 hover:bg-brand-100 cursor-default rounded-[14px]'>
                                        <div className='font-medium tracking-wider '>{metric.refs.acronym}</div>
                                        <MetricValue metric={metric}/>
                                    </div>
                                ))}
                            </div>

                        </>
                    )}

                </div>

                {(data?.metrics && expanded) && (
                    <div className={cn(
                        'sticky top-0 w-full sm:w-1/2 lg:w-full border-l lg:border-l-0'
                    )
                    } data-tour='metrics'>
                        <div
                            onClick={e => dispatch(setCommonState('activeMetric', null))}
                            className={cn(
                                'flex gap-3 items-center font-medium dark:hover:bg-brand-900/70  px-6 py-3 border-b lg:border-b-0 lg:border-t cursor-pointer text-sm',
                                !activeMetric && 'bg-brand-100/80 dark:bg-brand-900/80 '
                            )
                            }>
                            <span><Hash className='w-4 text-brand-400'/></span> All Audits
                        </div>
                        <Metrics performance={data?.performance} metrics={data.metrics}/>
                    </div>
                )}
            </Card>

            <SideBarActions/>

            <Suspense>
                <Feedback key={key}/>
            </Suspense>

        </div>
    </>
}

export default React.memo(PageSpeedScore)