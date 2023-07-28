import * as Tooltip from '@radix-ui/react-tooltip';
import {ReactNode, useEffect, useState} from "react";
import {ArchiveBoxIcon, BoltIcon, DocumentMinusIcon} from "@heroicons/react/24/solid";
import SpeedInsightGroup from "./group";
import Button from "components/ui/button";
import {buildStyles, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useOptimizerContext} from "../../../context/root";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Skeleton} from "components/ui/skeleton"

const Content = () => {

    const {setShowOptimizer} = useOptimizerContext()
    const {data, error, loading} = useSelector((state: RootState) => state.app);
    const [performance, setPerformance] = useState<number>(0)

    const [on, setOn] = useState<boolean>(false)

    useEffect(() => {
        
        if (!loading && data) {
            let currentNumber = 0;

            const timer = setInterval(() => {
                currentNumber += 1;
                if (currentNumber <= data.data.performance) {
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

        const targetNumber = data.data.performance;
        const maxOpacity = 1;
        const minOpacity = 0;
        const opacityIncrement = (maxOpacity - minOpacity) / targetNumber;
        return minOpacity + opacityIncrement * performance;
    };

    return (
        <div
            className='relative flex flex-col justify-center  min-w-[565px] min-h-[295px]  shadow-xl border w-fit py-6 px-6 rounded-[40px] mx-16 my-2 bg-slate-50'>
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
                            <SpeedInsightGroup title='Opportunities' items={data?.data?.grouped?.opportunities}/>
                            <SpeedInsightGroup title='Diagnostics' items={data?.data?.grouped?.diagnostics}/>
                            <SpeedInsightGroup title='Passed Audits' success={true}
                                               items={data?.data?.grouped?.passed_audits}/>
                        </div>
                    )}
                    <hr className='my-3 mx-6'/>
                    <div className='flex gap-3 text-sm'>
                        <Button onClick={(e) => {
                            setShowOptimizer(true)
                        }}>
                            <BoltIcon className='w-4 text-white rounded-[15px]'/> Page Optimizer
                        </Button>
                        <Button className='rounded-[15px]' dark={false}>
                            <DocumentMinusIcon className='w-4'/>
                        </Button>
                        <Button className='rounded-[15px]' dark={false}>
                            <ArchiveBoxIcon className='w-4'/>
                        </Button>
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

    const root = options?.plugin_url

    return (
        <div>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div
                        className={`${!root ? 'bg-gray-900 text-white py-1 text-sm cursor-pointer' : 'flex gap-1 items-center'}`}>
                        {children}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="font-sans animate-rl-scale-in" sideOffset={5}>
                        <Content/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
            {/*{!root && (*/}
            {/*    <Content/>*/}
            {/*)}*/}
        </div>

    );

}

export default SpeedInsights