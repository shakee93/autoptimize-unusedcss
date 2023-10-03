import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/ui/theme-switcher";
import {useEffect, useState} from "react";
import {useAppContext} from "../../../context/app";
import TooltipText from "components/ui/tooltip-text";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {changeReport, fetchData} from "../../../store/app/appActions";
import {optimizerData} from "../../../store/app/appSelector";
import {Button} from "components/ui/button";
import AppButton from "components/ui/app-button";
import {cn} from "lib/utils";
import {GraduationCap, GraduationCapIcon, Monitor} from "lucide-react";
import { useTour } from '@reactour/tour'
import Steps, {AuditSteps, FinalSteps} from "components/tour/steps";
import useCommonDispatch from "hooks/useCommonDispatch";
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import {setCommonState} from "../../../store/common/commonActions";

const Header = ({ url }: { url: string}) => {

    const tourPromptKey = 'titan-tour-prompt'
    const { setShowOptimizer , options, version, mode } = useAppContext()
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {data, loading} = useSelector(optimizerData);
    const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour()
    const { activeTab, activeMetric, dispatch: commonDispatch } = useCommonDispatch()
    const [tourPrompt, setTourPrompt] = useState(() => {
        const storedData = localStorage.getItem(tourPromptKey);
        return storedData ? JSON.parse(storedData) : true;
    })
    
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();

    useEffect(() => {

        let hasActions = true

        let tourAudit = data?.grouped.opportunities.find(audit => {
            return audit.settings.length > 0 && audit.files.items.length > 0;
        })

        if (!tourAudit) {
            tourAudit = data?.grouped.diagnostics.find(audit => {
                return audit.settings.length > 0 && audit.files.items.length > 0;
            })
        }

        if (!tourAudit && data?.grouped?.opportunities?.length && data?.grouped?.opportunities?.length > 0) {
            tourAudit = data?.grouped.opportunities[0]
            hasActions = false
        }

        if(!tourAudit && data?.grouped?.diagnostics?.length && data?.grouped?.diagnostics?.length > 0) {
            tourAudit = data?.grouped.diagnostics[0]
            hasActions = false
        }

        setSteps && setSteps(p => {

            let selector =
                document.getElementById('rapidload-optimizer-shadow-dom')

            let steps = [
                ...Steps,
                ...(tourAudit ? AuditSteps(tourAudit) : []),
                ...(mode === 'normal' ? FinalSteps : [])
            ].map(step => {

                if (selector) {
                    // @ts-ignore
                    step.shadowSelector = typeof step.selector === 'string' ? step.selector : step.shadowSelector;
                    // @ts-ignore
                    step.selector = selector.shadowRoot?.querySelector(step.shadowSelector);
                }
                return step
            })

            return steps
        });


    }, [activeReport, currentStep])

    useEffect(() => {
        localStorage.setItem(tourPromptKey, JSON.stringify(tourPrompt));
    }, [tourPrompt])

    useEffect(() => {

        if (!isOpen) {
            setCurrentStep(0);
        }

    }, [activeTab, activeReport])

    useEffect(() => {

        if (activeMetric) {
            commonDispatch(setCommonState('activeMetric', null))
        }

    }, [currentStep])


    useEffect(() => {

        const content =  document.getElementById('rapidload-page-optimizer-content')

        if (isOpen && content) {
            content.style.overflowY = 'hidden'
        } else {
            if(content) content.style.overflowY = 'auto'
        }

    }, [isOpen])

    return (

        <header className='z-[110000] w-full px-6 py-3 flex justify-between border-b backdrop-blur-sm dark:bg-brand-930/80 bg-brand-50/75 '>
            <div className='flex gap-12 items-center'>
                <div className='relative'>
                    <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                    {version && (
                        <span className='absolute text-xxs left-[72px] top-[1px] dark:text-brand-500 text-brand-400'>TITAN v{version}</span>
                    )}
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div data-tour='switch-report-strategy' className='relative flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer'>
                        <div className={cn(
                            'absolute dark:transition-none shadow-md translate-x-0 left-0.5 w-[110px] rounded-[14px] duration-400 -z-1  h-11 text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',
                            activeReport === 'desktop' && 'w-[115px] -translate-x-1.5 left-1/2'
                        )}>
                        </div>


                        <div onClick={() => dispatch(changeReport('mobile'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>
                            <DevicePhoneMobileIcon  className="h-5 w-5 font-medium dark:text-brand-500" /> Mobile
                        </div>

                        <div onClick={() => dispatch(changeReport('desktop'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-5 py-3 font-medium rounded-2xl`}>
                            <Monitor className="h-5 w-5 font-medium dark:text-brand-500 " /> Desktop
                        </div>
                    </div>
                    <div>
                        <TooltipText text='Analyze the page'>
                            <AppButton data-tour='analyze'
                                       onClick={() =>  {
                                           dispatch(fetchData(options, url, true))
                                           commonDispatch(setCommonState('openAudits', []))
                                       }}
                                       className='transition-none h-12 rounded-2xl border-none bg-transparent' variant='outline'>
                                <div className='flex flex-col gap-1 items-center'>
                                    <ArrowPathIcon className={cn(
                                        'w-5',
                                        loading && 'animate-spin'
                                    )}/>
                                    <span className='text-xxs font-normal text-brand-500'>Analyze</span>
                                </div>
                            </AppButton>
                        </TooltipText>
                    </div>
                </div>
            </div>


            <div className='flex relative gap-4 items-center'>



                {(data?.loadingExperience && !activeMetric) &&
                    <>
                        <AnimatePresence>
                            {tourPrompt &&
                                <ScaleUp className='flex cursor-pointer items-center'>
                                    <div
                                        onClick={e => setTourPrompt(false)}
                                        className='absolute animate-bounce-horizontal text-sm -left-[270px] text-brand-400 font-normal'>
                                        Ready to get Started? Take a quick tour 👉🏻
                                    </div>
                                </ScaleUp>
                            }
                        </AnimatePresence>

                        <AppButton data-tour='analyze'
                                   onClick={() => {
                                       setIsOpen(true)
                                       setTourPrompt(false)
                                   }}
                                   className='transition-none h-12 rounded-2xl border-none bg-transparent' variant='outline'>
                            <div className='flex flex-col gap-1 items-center'>
                                <GraduationCapIcon className={cn(
                                    'w-5',
                                )}/>
                                <span className='text-xxs font-normal text-brand-500'>Get Started</span>
                            </div>


                        </AppButton>
                    </>
                }

                <TooltipText onClick={() => { setShowOptimizer(false) }} text='Close Optimizer'>
                    <XMarkIcon className={cn(
                        'h-6 w-6 dark:text-brand-300 text-brand-600 transition-opacity',
                        isOpen && 'opacity-10'
                    )} />
                </TooltipText>
            </div>
        </header>

    )
}

export default Header