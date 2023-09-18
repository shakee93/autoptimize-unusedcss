import * as Tooltip from '@radix-ui/react-tooltip';
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {ArchiveBoxIcon, BoltIcon, CheckCircleIcon, DocumentMinusIcon} from "@heroicons/react/24/solid";
import SpeedInsightGroup from "./group";
import AppButton from "components/ui/app-button";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useAppContext} from "../../../context/app";
import {useDispatch, useSelector} from "react-redux";
import {Skeleton} from "components/ui/skeleton"
import {optimizerData} from "../../../store/app/appSelector";
import TooltipText from "components/ui/tooltip-text";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {HoverCardPortal} from "@radix-ui/react-hover-card";
import {Archive, Circle, Dot, FileCode2, FileMinus2, GaugeCircle, Monitor} from "lucide-react";
import {useToast} from "components/ui/use-toast";
import {ComputerDesktopIcon, DevicePhoneMobileIcon} from "@heroicons/react/24/outline";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../store/app/appTypes";
import {changeReport} from "../../../store/app/appActions";
import ThemeSwitcher from "components/ui/theme-switcher";
import {Toaster} from "components/ui/toaster";
import PerformanceProgressBar from "components/performance-progress-bar";

const Content = () => {

    const {setShowOptimizer, options, version} = useAppContext()
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



            return;

            try {
                setActions(prev => prev.map(a =>
                    a.icon === action.icon ? {
                        ...a,
                        loading: true
                    } : a
                ))

                let result = await fetch(action.href);

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
                        <AppButton onClick={e => triggerAction(action)} className='rounded-[15px]' variant='outline'>
                            {icons[action.icon]} {action.loading && <span>
                            <Circle className='w-2 absolute stroke-none fill-blue-500'/>
                            <Circle className='w-2 relative motion-safe:animate-ping stroke-none fill-blue-500'/>
                        </span>}
                        </AppButton>
                    </TooltipText>
                ))}
            </>
        );
    }

    return (
        <div
            className='relative text-base text-brand-950 dark:text-brand-50 flex flex-col justify-center  min-w-[565px] min-h-[295px]  shadow-xl border w-fit py-6 px-6 rounded-[40px] mx-16 my-2 bg-brand-50 dark:bg-brand-900'>
            <div className='flex gap-6'>
                <div className='flex flex-col gap-3 px-4 items-center'>
                    <div className='mt-2'>
                        {loading || on ? (
                            <Skeleton className="w-44 h-44 rounded-full"/>
                        ) : (
                            <PerformanceProgressBar performance={data?.performance}></PerformanceProgressBar>
                        )}
                    </div>

                    <div className='text-xs w-full flex justify-center'>
                        <TooltipText asChild text='Switch Report'>
                            <button onClick={() => dispatch(changeReport(activeReport === 'desktop' ? 'mobile' : 'desktop'))}
                                    className='capitalize inline-flex gap-2 justify-center items-center border rounded-full py-1 px-3'>
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
                </div>
                <div className='flex flex-col flex-grow'>
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
                    {loading || on ? (
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
                    <div className='flex gap-3 text-sm'>
                        <AppButton onClick={(e) => {
                            setShowOptimizer(true)
                        }}>
                            <BoltIcon className='w-4 text-white dark:text-brand-900 rounded-[15px]'/> Titan Optimizer
                        </AppButton>
                        <PopupActions/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SpeedInsights = ({children}: {
    children: ReactNode,
}) => {

    const {options} = useAppContext()
    const [open, setOpen] = useState<boolean>(false)

    const root = options?.plugin_url

    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
                <div
                    className={`${!root ? 'bg-gray-900 dark:bg-brand-900 py-1 cursor-pointer' : 'flex gap-1 items-center cursor-pointer text-white'}`}>
                    {children}
                </div>
            </HoverCardTrigger>
            <HoverCardContent id='rpo-popup-content' className="font-sans animate-rl-scale-in z-[99999]" sideOffset={5} >
                <Content/>
            </HoverCardContent>
        </HoverCard>
    );

}

export default SpeedInsights