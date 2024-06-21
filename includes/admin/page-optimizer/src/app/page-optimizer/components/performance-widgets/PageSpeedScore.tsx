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
import { useTestModeUtils } from 'hooks/testModeUtils';

// const Feedback = React.lazy(() =>
//     import('app/page-optimizer/components/performance-widgets/Feedback'))

interface PageSpeedScoreProps {
    pagespeed?: any;
    priority?: boolean;
}

const MetricValue = ({ metric }: {metric: Metric}) => {
    const [x,y,z, progressBarColorCode] = xusePerformanceColors(metric.score)

    return <div
        style={{
            color: y || '#515151'
        }}
        className='text-md font-medium text-brand-500'>
        {metric.displayValue}
    </div>
}


const PageSpeedScore = ({pagespeed, priority = true }: PageSpeedScoreProps) => {
    const [isCoreWebClicked, setCoreWebIsClicked] = useState(false);
    const [expanded, setExpanded] = useState(false)



    const {data, error, loading, revisions} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const [on, setOn] = useState<boolean>(false)

    const { dispatch, hoveredMetric, activeMetric} = useCommonDispatch()

    //Test Mode
    const {options} = useAppContext();
    const {settingsMode, testModeStatus, testModeLoading} = useCommonDispatch();
    const {testMode} = useSelector((state: RootState) => state.app);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [localSwitchState, setLocalSwitchState] = useState<boolean>(testMode?.status || false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const { handleTestModeSwitchChange } = useTestModeUtils();

    let url = options?.optimizer_url;

    useEffect(() => {
        if (testMode) {
            dispatch(setCommonState('testModeStatus', testMode.status || false));
        }

    }, [testMode]);



    const handleSwitchChange = async (isChecked: boolean) => {
       await handleTestModeSwitchChange( isChecked);
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

    const FirstLettersComponent = ({ text }: { text: string }) => {
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
            <div>
            <div className='flex gap-2 justify-center'>
                <div className='w-fit'>
                    <div data-tour='test-mode'
                         className='select-none relative flex dark:bg-brand-800 py-0.5 px-1.5 rounded-2xl cursor-pointer bg-brand-0'>
                        <div className={cn(
                            'absolute translate-x-0 left-0.5 w-[70px] rounded-[14px] -z-1 duration-300 h-[44px] text-sm flex flex-col gap-2 px-3 py-2.5 font-medium dark:bg-brand-950 bg-brand-200/80',
                            localSwitchState && 'w-[118px] -translate-x-1 left-[40%] bg-amber-500/80'
                        )}>
                        </div>

                        <div
                            onClick={async () => {
                                if (localSwitchState) {
                                    await handleSwitchChange(false);
                                }
                            }}
                            className={`relative z-1 items-center text-sm flex gap-2 px-3 py-2.5 font-medium rounded-2xl ${localSwitchState ? 'text-brand-500' : ''}`}
                        >
                            <Circle
                                className={cn(`w-1.5 stroke-0 ${localSwitchState ? 'fill-brand-300' : 'fill-green-600'} animate-ping absolute inline-flex opacity-75`)}/>
                            <Circle
                                className={cn(`w-1.5 stroke-0 ${localSwitchState ? 'fill-brand-300' : 'fill-green-600'} relative inline-flex`)}/>
                            Live
                        </div>

                        <div
                            onClick={async () => {
                                if (!localSwitchState) {
                                    await handleSwitchChange(true);
                                }
                            }}
                            className={`relative justify-center items-center z-1 text-sm flex pl-6 pr-5 py-2.5 whitespace-nowrap font-medium rounded-2xl ${localSwitchState ? 'text-brand-0' : 'text-brand-500'}`}
                        >
                            Test Mode
                        </div>
                    </div>
                </div>
                <TooltipText text={loadingStatus ? "loading" : "Preview"} >
                    <div
                        onClick={() => {
                            {!loadingStatus && window.open(options.optimizer_url + '?rapidload_preview_optimization', '_blank');}
                        }}
                        className={`flex gap-2 items-center text-sm h-12 rounded-[14px] bg-brand-0 dark:bg-primary dark:hover:bg-primary/90 px-4 py-2 ${
                            revisions.length > 0
                                ? '' : ''}`} data-tour="preview-button">

                        { loadingStatus ? <Loader className='w-5 animate-spin'/>    :  <ArrowTopRightOnSquareIcon className='w-5 text-gray-500'/>}
                    </div>
                </TooltipText>
            </div>
            <div className="relative mt-4 -mb-2 rotate-180 ">
                <TestModeLine width={localSwitchState? 110: 200} />
            </div>
            </div>
            <Card data-tour='speed-insights'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around',
                      expanded && 'border-brand-200 dark:border-brand-800'
                  )}>

                <div
                    className="content flex w-full sm:w-1/2 lg:w-full flex-col justify-center items-center gap-3 px-4 lg:px-4 lg:pb-0 xl:px-8 py-2.5">

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-3 px-4 items-center'>
                            <div className='mt-6'>
                                {loading || on ? (
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