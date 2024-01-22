import ThemeSwitcher from "components/ui/theme-switcher";
import {
    CopyMinus,
    Eraser, GraduationCapIcon,
    History,
} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import React, {useEffect, useState} from "react";
import {cn, timeAgo} from "lib/utils";
import { useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Mode from "app/page-optimizer/components/Mode";

import PerformanceProgressBar from "components/performance-progress-bar";
import UrlPreview from "app/page-optimizer/components/footer/url-preview";
import SaveChanges from "app/page-optimizer/components/footer/save-changes";
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import AppButton from "components/ui/app-button";
import {setCommonRootState} from "../../../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";

interface FooterProps {
}

const tourPromptKey = 'titan-tour-prompt'

const Footer = ({ } : FooterProps) => {

    const {  loading, revisions , data   } =
        useSelector(optimizerData)
    const {
        activeMetric,
        dispatch: commonDispatch
    } = useCommonDispatch()

    const [tourPrompt, setTourPrompt] = useState(() => {
        const storedData = localStorage.getItem(tourPromptKey);
        return storedData ? JSON.parse(storedData) : true;
    })

    useEffect(() => {
        localStorage.setItem(tourPromptKey, JSON.stringify(tourPrompt));
    }, [tourPrompt])

    if (loading) {
        return  <></>
    }

    const resetSettings = () => {

        console.log('implement reset settings');


    }

    return (
        <footer className='fixed z-[110000] flex items-center justify-between left-0 bottom-0 pl-3 pr-6 py-2 dark:bg-brand-950 bg-brand-50 border-t w-full'>
           <div className='flex items-center'>
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
                                      commonDispatch(setCommonRootState('isTourOpen', true))
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
           </div>

            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-brand-600 dark:text-brand-400 '>
                    <Mode>
                        {revisions.length > 0 &&
                            <Popover>
                                <PopoverTrigger className='hover:dark:text-brand-100' asChild={false}>
                                    <TooltipText asChild text='Show Revisions'>
                                        <History className='w-5 ' />
                                    </TooltipText>
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


                    <TooltipText text='Switch theme'>
                        <div className='hover:dark:text-brand-100'>
                            <ThemeSwitcher></ThemeSwitcher>
                        </div>
                    </TooltipText>

                    {/*<TooltipText text='Reset Settings to Default'>*/}
                    {/*    <div */}
                    {/*        onClick={e => resetSettings()}*/}
                    {/*        className='hover:dark:text-brand-100'>*/}
                    {/*        <CopyMinus className='w-4'/>*/}
                    {/*    </div>*/}
                    {/*</TooltipText>*/}
                </div>



            </div>
        </footer>
    );
}

export default Footer