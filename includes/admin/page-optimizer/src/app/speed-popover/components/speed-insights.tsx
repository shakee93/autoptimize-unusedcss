import * as Tooltip from '@radix-ui/react-tooltip';
import {ReactNode, useEffect, useRef, useState} from "react";
import {ArchiveBoxIcon, BoltIcon, DocumentMinusIcon} from "@heroicons/react/24/solid";
import SpeedInsightGroup from "./group";
import AppButton from "components/ui/app-button";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useOptimizerContext} from "../../../context/root";
import {useSelector} from "react-redux";
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
import {Archive, Circle, Dot, FileCode2, FileMinus2} from "lucide-react";

const Content = () => {

    const {setShowOptimizer, options} = useOptimizerContext()
    const {data, error, loading} = useSelector(optimizerData);
    const [performance, setPerformance] = useState<number>(0)

    const [on, setOn] = useState<boolean>(false)

    useEffect(() => {

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

        let [actions, setActions] = useState(options.actions.map(a => ({
            ...a,
            loading: false
        })))
        
        let icons = {
            clear_cache :  <Archive className='w-4'/>,
            clear_page_cache : <FileMinus2 className='w-4'/>,
            clear_optimization : <FileCode2 className='w-4'/>
        }

        const triggerAction = async (action: any) => {
            try {
                setActions(prev => prev.map(a =>
                    a.icon === action.icon ? {
                        ...a,
                        loading: true
                    } : a
                ))

                let result = await fetch(action.href);
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
                        <AppButton onClick={e => triggerAction(action)} className='rounded-[15px]' dark={false}>
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
            className='relative flex flex-col justify-center  min-w-[565px] min-h-[295px]  shadow-xl border w-fit py-6 px-6 rounded-[40px] mx-16 my-2 bg-brand-50 dark:bg-brand-900'>
            {/*<div className='absolute -top-8 text-white'>*/}
            {/*    <label htmlFor="on">*/}
            {/*        <input id='on' onClick={() => setOn(p => !p)} type="checkbox"/>*/}
            {/*        Loading*/}
            {/*    </label>*/}
            {/*</div>*/}
            <div className='flex gap-6'>
                <div className='flex flex-col gap-3 px-4 items-center'>

                    <div className='mt-6'>
                        {loading || on ? (
                            <Skeleton className="w-44 h-44 rounded-full"/>
                        ) : (
                            <CircularProgressbarWithChildren strokeWidth={4} className='w-44 h-44 relative' styles={buildStyles({
                                pathColor: `#0bb42f`,
                                pathTransitionDuration: .5,
                            })} value={performance}>
                                <span
                                    style={{
                                        opacity: calculateOpacity()
                                    }}
                                    className='text-5xl transition-all ease-out duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'
                                >{performance}</span>
                            </CircularProgressbarWithChildren>
                        )}
                    </div>

                    <div className="flex justify-around text-sm gap-4 font-light w-full mt-5">
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
                <div className='flex flex-col'>
                    <div className='text-md font-medium text-left mb-3 ml-3'>Speed insights</div>
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
                            <BoltIcon className='w-4 text-white dark:text-brand-900 rounded-[15px]'/> Page Optimizer
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

    const {options} = useOptimizerContext()
    const [open, setOpen] = useState<boolean>(false)

    const root = options?.plugin_url

    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
                <div
                    className={`${!root ? 'bg-gray-900 py-1 text-sm cursor-pointer' : 'flex gap-1 items-center'}`}>
                    {children}
                </div>
            </HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent className="font-sans animate-rl-scale-in z-[99999]" sideOffset={5} >
                    <Content/>
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );

}

export default SpeedInsights