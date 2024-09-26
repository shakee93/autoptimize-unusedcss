import * as Tooltip from '@radix-ui/react-tooltip';
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {ArchiveBoxIcon, BoltIcon, CheckCircleIcon, DocumentMinusIcon} from "@heroicons/react/24/solid";
import SpeedInsightGroup from "./group";
import AppButton from "components/ui/app-button";
import {useAppContext} from "../../../context/app";
import {useDispatch, useSelector} from "react-redux";
import {Skeleton} from "components/ui/skeleton"
import {optimizerData} from "../../../store/app/appSelector";
import TooltipText from "components/ui/tooltip-text";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {HoverCardPortal} from "@radix-ui/react-hover-card";
import {Archive, Circle, Dot, FileCode2, FileMinus2, GaugeCircle, Loader, Monitor} from "lucide-react";
import {useToast} from "components/ui/use-toast";
import {ComputerDesktopIcon, DevicePhoneMobileIcon} from "@heroicons/react/24/outline";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../store/app/appTypes";
import {changeReport} from "../../../store/app/appActions";
import ThemeSwitcher from "components/ui/theme-switcher";
import {Toaster} from "components/ui/toaster";
import PerformanceProgressBar from "components/performance-progress-bar";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";
import ErrorFetch from "components/ErrorFetch";
import {cn} from "lib/utils";
import PageSpeedWidget from "app/dashboard/components/performance-widgets/PageSpeedWidget";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../../../store/common/commonActions";

const Content = ({ dashboard = false }) => {

    const { options, version} = useAppContext()
    const {data, error, loading, activeReport} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)
    const { toast } = useToast()
    const [progressbarColor, setProgressbarColor] = useState('#ECECED');
    const [on, setOn] = useState<boolean>(false)

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();

    const progressBarColor = () => {
        const performance = data?.performance?? 0;

        if (performance < 50) {
            setProgressbarColor('#FF3333');
        } else if (performance < 90) {
            setProgressbarColor('#FFAA33');
        } else if (performance < 101) {
            setProgressbarColor('#09B42F');
        }
    };


    useEffect(() => {
        progressBarColor();
        if (!loading && data) {
            let currentNumber = 0;

            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <=data.performance) {
                    setPerformance(currentNumber)
                } else {
                    clearInterval(timer);
                }
            }, 10); // Change the delay (in milliseconds) as desired

            return () => clearInterval(timer);
        }

    }, [data, loading])

    const calculateOpacity = () => {

        if (!data) {
            return 0;
        }

        const targetNumber =data.performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    };

    const PopupActions = () => {

        if (!options.actions) {
            return <></>
        }

        let [actions, setActions] = useState<RapidLoadGlobalAction[]>(options.actions.map((a :WordPressOptions['actions'][0]) => ({
            ...a,
            loading: false
        })))
        
        let icons = {
            clear_cache :  <Archive className='w-4'/>,
            clear_page_cache : <FileMinus2 className='w-4'/>,
            clear_optimization : <FileCode2 className='w-4'/>
        }

        const triggerAction = async (action: RapidLoadGlobalAction) => {

            try {
                setActions(prev => prev.map(a =>
                    a.icon === action.icon ? {
                        ...a,
                        loading: true
                    } : a
                ))

                let result = await fetch(action.href.replace(/&amp;/g, '&'));

                toast({

                    description: <div className='flex w-full gap-2 text-center'>Successfully completed <CheckCircleIcon className='w-5 text-green-600'/> </div>
                })

            } catch (e) {
                console.error(e);
            }

            setActions(prev => prev.map(a =>
                a.icon === action.icon ? {
                    ...a,
                    loading: false
                } : a
            ))
        }

        return (
            <>
                {actions.map(action => (
                    <TooltipText key={action.icon} text={action.tooltip}>
                        <AppButton
                            disabled={action.loading}
                            onClick={e => triggerAction(action)}
                            className='rounded-[15px] dark:bg-brand-950/50 bg-brand-100/50' variant='outline'>
                            {action.loading &&
                                <span>
                                    <Loader className='motion-safe:animate-spin w-4'/>
                                </span>
                            }
                            {icons[action.icon]}
                        </AppButton>
                    </TooltipText>
                ))}
            </>
        );
    }

    return (
        <div
            className={cn(
                'relative text-base text-brand-950 dark:text-brand-50 flex flex-col justify-center min-h-[295px] w-fit py-6 px-6  ',
                'backdrop-blur-md  dark:bg-brand-900/95 border border-brand-500/20 ',
                dashboard? 'w-auto rounded-3xl bg-brand-0':'mx-16 my-2 shadow-xl min-w-[565px] rounded-[50px] bg-brand-100/90'
            )}>
            <div className='flex gap-6'>

                <div className={`flex flex-col gap-3 items-center ${dashboard ? '' : 'px-4'}`}>
                    {dashboard && (
                        <>

                            <div data-tour='switch-report-strategy' className='select-none flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer left-4 absolute mx-2 ' >
                                <div className={cn(
                                    'absolute shadow-md translate-x-0 left-0.5 w-[45px] rounded-[14px] -z-1 duration-300 h-[39px] text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',
                                    activeReport === 'desktop' && 'w-[45px] -translate-x-1 left-1/2'
                                )}>
                                </div>

                                <TooltipText text="Mobile">
                                    <div onClick={() => dispatch(changeReport('mobile'))}
                                         className={`relative z-1 text-sm flex flex-column gap-2 px-4 py-3 font-medium rounded-2xl`}>
                                        <DevicePhoneMobileIcon  className="h-4 w-4 font-medium dark:text-brand-500" />
                                    </div>
                                </TooltipText>

                                <TooltipText text='Desktop'>
                                    <div onClick={() => dispatch(changeReport('desktop'))}
                                         className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-4 py-3 font-medium rounded-2xl`}>
                                        <Monitor className="h-4 w-4 font-medium dark:text-brand-500 " />
                                    </div>
                                </TooltipText>
                            </div>
                        </>


                    )}

                    <div className='mt-2'>
                        {loading || on || error ? (
                            <Skeleton className="w-44 h-44 rounded-full"/>
                        ) : (
                            dashboard ? (
                                <PageSpeedWidget dashboardMode={true}/>
                            ) : (
                                <PerformanceProgressBar className='h-[176px]' performance={data?.performance}></PerformanceProgressBar>
                            )
                        )}
                    </div>

                    {!dashboard && (
                        <>
                            <div className='text-xs w-full flex justify-center'>
                                <TooltipText asChild text='Switch Report'>
                                    <button onClick={() => dispatch(changeReport(activeReport === 'desktop' ? 'mobile' : 'desktop'))}
                                            className='backdrop-blur-md dark:bg-brand-950/10 bg-brand-50/50 capitalize inline-flex gap-2 justify-center items-center border rounded-full py-1 px-3'>
                                        {activeReport === 'desktop' ?
                                            <Monitor className="w-4 h-5" /> :
                                            <DevicePhoneMobileIcon  className="h-5" />
                                        }
                                        <span>{activeReport}</span>
                                    </button>
                                </TooltipText>
                            </div>

                            <div className="flex justify-around text-sm text-brand-700 dark:text-brand-300 gap-4 font-light w-full">
                                <div className='flex items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                                        <polygon points="5,0 0,10 10,10" fill="red"/>
                                    </svg>
                                    0-49
                                </div>
                                <div className='flex items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                                        <rect width="10" height="10" fill="orange"/>
                                    </svg>
                                    50-89
                                </div>
                                <div className='flex items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                                        <circle cx="5" cy="5" r="5" fill="green"/>
                                    </svg>
                                    89-100
                                </div>
                            </div>
                        </>

                    )}

                </div>
                <div className={`flex flex-col flex-grow ${dashboard? 'border border-brand-200 dark:border-brand-800 rounded-xl px-4 py-4 h-fit': ''}`}>
                    <div className='flex gap-2 text-md justify-between items-center font-medium text-left mb-3 px-3'>
                        <div className='flex gap-2 items-center'>Speed insights <span className='text-xxs leading-tight text-brand-400'>v{version}</span></div>
                        <div className='flex gap-2 text-brand-600 dark:text-brand-400'>
                            <TooltipText text='Go to Plugin Dashboard'>
                                <a className='flex hover:dark:text-brand-100 justify-center rounded-full w-7 h-7 p-0.5 text-xs items-center gap-2' href={options?.dashboard_url ? options?.dashboard_url : '#'}>
                                    <GaugeCircle className='w-5'/>
                                </a>
                            </TooltipText>
                            <TooltipText text='Switch theme'>
                                <div className='hover:dark:text-brand-100'>
                                    <ThemeSwitcher></ThemeSwitcher>
                                </div>
                            </TooltipText>
                        </div>
                    </div>
                    {error ?
                        <div className='flex flex-col gap-2'>
                           <ErrorFetch error={error}/>
                        </div>
                    : <>
                            {loading || on  ? (
                                <div className='flex flex-col gap-2'>
                                    <Skeleton className="w-full h-[48px] rounded-[18px]"/>
                                    <Skeleton className="w-full h-[48px] rounded-[18px]"/>
                                    <Skeleton className="w-full h-[48px] rounded-[18px]"/>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <SpeedInsightGroup title='Opportunities' items={data?.grouped?.opportunities}/>
                                    <SpeedInsightGroup title='Diagnostics' items={data?.grouped?.diagnostics}/>
                                    <SpeedInsightGroup title='Passed Audits' success={true}
                                                       items={data?.grouped?.passed_audits}/>
                                </div>
                            )}
                            <hr className='my-3 mx-6'/>
                        </>
                    }



                    <div className={cn('flex gap-3 text-sm ', dashboard? 'flex-row-reverse': '')}>

                        <a href={`${options.dashboard_url}#/optimize&optimize-url=${options.optimizer_url}`}>
                            <AppButton>
                                <BoltIcon className='w-4 text-white dark:text-brand-900 rounded-[15px]'/> Titan Optimizer
                            </AppButton>
                        </a>

                        <PopupActions/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SpeedInsights = ({children, dashboardMode  }: {
    children?: ReactNode,
    dashboardMode?: boolean,
}) => {

    const {options} = useAppContext()

    const root = options?.plugin_url

    if (dashboardMode) {
        return <Content dashboard={dashboardMode} />;
    }

    return (
        <HoverCard
            // open={true}
            openDelay={0}>
            <a href={options?.dashboard_url ? options?.dashboard_url : '#'}>
                <HoverCardTrigger asChild>
                    <div className={`${!root ? 'bg-gray-900 dark:bg-brand-900 py-1 cursor-pointer' : 'flex gap-1 items-center cursor-pointer text-white'}`}>
                        {children && children}
                    </div>
                </HoverCardTrigger>
            </a>
            <HoverCardContent id='rpo-popup-content' className="font-sans animate-rl-scale-in z-[99999]" sideOffset={5} >
                <Content />
            </HoverCardContent>
        </HoverCard>
    );

}

export default SpeedInsights


