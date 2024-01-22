import Mode from "app/page-optimizer/components/Mode";
import {Popover, PopoverContent, PopoverTrigger} from "components/ui/popover";
import TooltipText from "components/ui/tooltip-text";
import {GraduationCapIcon, History} from "lucide-react";
import {cn, timeAgo} from "lib/utils";
import PerformanceProgressBar from "components/performance-progress-bar";
import ThemeSwitcher from "components/ui/theme-switcher";
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import AppButton from "components/ui/app-button";
import {setCommonRootState} from "../../../../store/common/commonActions";
import Card from "components/ui/card";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useRootContext} from "../../../../context/root";

const tourPromptKey = 'titan-tour-prompt'

const SideBarActions = () => {
    const { changeTheme } = useRootContext()

    const [tourPrompt, setTourPrompt] = useState(() => {
        const storedData = localStorage.getItem(tourPromptKey);
        return storedData ? JSON.parse(storedData) : true;
    })

    const {data, error, loading, revisions} = useSelector(optimizerData);
    const { dispatch, hoveredMetric, activeMetric} = useCommonDispatch()


    useEffect(() => {
        localStorage.setItem(tourPromptKey, JSON.stringify(tourPrompt));
    }, [tourPrompt])

    return <Card className='flex items-center justify-center gap-3 py-2'>
        <Mode>
            {revisions.length > 0 &&
                <Popover>
                    <PopoverTrigger className='hover:dark:text-brand-100' asChild={false}>
                        <AppButton
                                   className='transition-none h-12 px-3 rounded-2xl border-none bg-transparent' variant='outline'>
                            <div className='flex flex-col gap-1 items-center'>
                                <History className={cn(
                                    'w-5',
                                )}/>
                                <span className='text-xxs font-normal text-brand-500'>Revisions</span>
                            </div>


                        </AppButton>
                    </PopoverTrigger>
                    <PopoverContent className='pt-0 dark:bg-brand-800 dark:text-white'>
                        <div className='my-2 ml-4 font-medium '>Revisions</div>
                        <ul className='border rounded-lg'>
                            {revisions?.map((rev: Revision, index: number) => {
                                return <li className={cn(
                                    'flex items-center justify-between cursor-pointer px-4 py-1.5 text-sm hover:bg-brand-100 dark:hover:bg-brand-900',
                                    index === 0 ? 'border-none' : 'border-t'
                                )} key={rev.id}>
                                    <span className='text-xs text-brand-600 dark:text-brand-300'>{timeAgo(rev.timestamp * 1000)}</span>
                                    <PerformanceProgressBar background={false}
                                                            animate={false}
                                                            stroke={10}
                                                            scoreClassName='text-xxs'
                                                            className='h-7'
                                                            performance={rev.data.performance}></PerformanceProgressBar>
                                </li>
                            })}
                        </ul>
                    </PopoverContent>
                </Popover>
            }

        </Mode>




        {(data?.loadingExperience && !activeMetric) &&
            <>
                <AnimatePresence>
                    {tourPrompt &&
                        <ScaleUp className='flex cursor-pointer items-center w-fit '>
                            <div
                                onClick={e => setTourPrompt(false)}
                                className='absolute animate-bounce-horizontal text-sm left-[110px] text-brand-400 font-normal'>
                                👈 Ready to get Started? Take a quick tour
                            </div>
                        </ScaleUp>
                    }
                </AnimatePresence>

                <AppButton data-tour='analyze'
                           onClick={() => {
                               dispatch(setCommonRootState('isTourOpen', true))
                               setTourPrompt(false)
                           }}
                           className='transition-none h-12 px-3 rounded-2xl border-none bg-transparent' variant='outline'>
                    <div className='flex flex-col gap-1 items-center'>
                        <GraduationCapIcon className={cn(
                            'w-5',
                        )}/>
                        <span className='text-xxs font-normal text-brand-500'>Get Started</span>
                    </div>


                </AppButton>
            </>
        }

        <AppButton
            onClick={e => changeTheme()}
            className='transition-none h-12 px-3 rounded-2xl border-none bg-transparent' variant='outline'>
            <div className='flex flex-col gap-1 items-center'>
                <ThemeSwitcher></ThemeSwitcher>
                <span className='text-xxs font-normal text-brand-500'>Theme</span>
            </div>


        </AppButton>

    </Card>


}

export default SideBarActions