import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/ui/theme-switcher";
import React, {useEffect, useMemo, useState} from "react";
import {useAppContext} from "../../../context/app";
import TooltipText from "components/ui/tooltip-text";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {changeReport, fetchData, getCSSStatus} from "../../../store/app/appActions";
import {optimizerData} from "../../../store/app/appSelector";
import {Button} from "components/ui/button";
import AppButton from "components/ui/app-button";
import {cn} from "lib/utils";
import {
    LogOut,
    Monitor,
    RefreshCw
} from "lucide-react";
import { useTour } from '@reactour/tour'
import Steps, {AuditSteps, FinalSteps} from "components/tour/steps";
import useCommonDispatch from "hooks/useCommonDispatch";
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import {setCommonRootState, setCommonState} from "../../../store/common/commonActions";
import equal from 'fast-deep-equal/es6/react'
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import UrlPreview from "app/page-optimizer/components/footer/url-preview";
import SaveChanges from "app/page-optimizer/components/footer/save-changes";
import {Switch} from "components/ui/switch";
import {getTestModeStatus} from "../../../store/app/appActions";


const Header = ({ url }: { url: string}) => {

    const tourPromptKey = 'titan-tour-prompt'

    const {
        setShowOptimizer ,
        options,
        version,
        mode,
        showInprogress,
        setShowInprogress
    } = useAppContext()

    const { activeReport,
        loading, error,
        settings
    } = useSelector(optimizerData);
    const {inProgress } = useCommonDispatch()
    const {
        activeTab,
        activeMetric,
        settingsMode,
        dispatch: commonDispatch
    } = useCommonDispatch()

    const {testMode} = useSelector((state: RootState) => state.app);

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [localSwitchState, setLocalSwitchState] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getTestModeStatus(options, url));
    }, [dispatch]);

    useEffect(() => {
        if(settingsMode==='turboMax' && !localSwitchState){
            handleSwitchChange(true)
        } else if(!testMode){
            setLocalSwitchState(false);
        }
    }, [settingsMode]);

    useEffect(() => {
        if (testMode) {
            setLocalSwitchState(testMode.status || false);
        }
    }, [testMode]);

    const handleSwitchChange = (isChecked: boolean) => {
        setLocalSwitchState(isChecked);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            dispatch(getTestModeStatus(options, url, String(isChecked)));
        }, 200);
        setTimeoutId(newTimeoutId);
    };

    return (

        <header className='z-[110000] w-full px-6 py-3 flex gap-3 justify-between border-b backdrop-blur-sm dark:bg-brand-930/80 bg-brand-50/75 '>
            <div className='flex gap-12 items-center'>
                <div className='relative'>
                    <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                    {version && (
                        <span className='absolute text-xxs w-[200px] left-[72px] top-[1px] dark:text-brand-500 text-brand-400'>TITAN v{version}</span>
                    )}
                </div>
                <div className='flex flex-column items-center gap-3'>
                    <div data-tour='switch-report-strategy' className='select-none relative  flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer'>
                        <div className={cn(
                            'absolute shadow-md translate-x-0 left-0.5 w-[55px] rounded-[14px] -z-1 duration-300 h-11 text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',
                            activeReport === 'desktop' && 'w-[55px] -translate-x-1 left-1/2'
                        )}>
                        </div>

                        <TooltipText text="Mobile">
                            <div onClick={() => dispatch(changeReport('mobile'))}
                                 className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>
                                <DevicePhoneMobileIcon  className="h-5 w-5 font-medium dark:text-brand-500" />
                            </div>
                        </TooltipText>

                        <TooltipText text='Desktop'>
                            <div onClick={() => dispatch(changeReport('desktop'))}
                                 className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-5 py-3 font-medium rounded-2xl`}>
                                <Monitor className="h-5 w-5 font-medium dark:text-brand-500 " />
                            </div>
                        </TooltipText>
                    </div>
                    <div className='flex overflow-hidden border rounded-2xl shadow'>
                        <UrlPreview/>
                        <UnsavedChanges
                            title='Analyze without applying optimization?'
                            description="Your changes are not saved yet. If you analyze now, your recent edits won't be included."
                            action='Apply Optimization'
                            cancel='Discard & Analyze'
                            onCancel={() => {
                                dispatch(fetchData(options, url, true))
                                commonDispatch(setCommonState('openAudits', []))
                            }}
                            onClick={() =>  {

                                if(!inProgress || !loading){
                                    dispatch(fetchData(options, url, true))
                                }
                                // dispatch(fetchData(options, url, true))
                               // dispatch(setCommonState('inProgress', true))
                                commonDispatch(setCommonState('openAudits', []))

                            }} >
                            <TooltipText
                                text='Analyze the page'>
                                <AppButton asChild={true} data-tour='analyze'

                                           className={cn(
                                               'transition-none rounded-none h-12 px-3 pr-3.5 ' +
                                               'border-r-0 border-l border-t-0 border-b-0 bg-transparent ',
                                           )}
                                           variant='outline'>
                                    <div className={`flex flex-col gap-[1px] items-center`}>
                                        <RefreshCw className={cn(
                                            'w-4 -mt-0.5',
                                            loading && 'animate-spin'
                                        )}/>
                                        <span className='text-xxs font-normal text-brand-500'>Analyze </span>
                                    </div>
                                </AppButton>
                            </TooltipText>
                        </UnsavedChanges>
                        {/*<TooltipText*/}
                        {/*    text='Switch URL to optimize'>*/}
                        {/*    <AppButton asChild={true} data-tour='analyze'*/}

                        {/*               className={cn(*/}
                        {/*                   'transition-none rounded-none h-12 pl-3 pr-3.5' +*/}
                        {/*                   ' border-l border-r-0 border-t-0 border-b-0 bg-transparent hover:opacity-100',*/}
                        {/*               )}*/}
                        {/*               variant='outline'>*/}
                        {/*        <div className='flex flex-col gap-[1px] items-center'>*/}
                        {/*            <ArrowDownUp className={cn(*/}
                        {/*                'w-4 -mt-0.5'*/}
                        {/*            )}/>*/}
                        {/*            <span className='text-xxs font-normal text-brand-500'>Switch</span>*/}
                        {/*        </div>*/}
                        {/*    </AppButton>*/}
                        {/*</TooltipText>*/}
                    </div>
                </div>
            </div>



            <div className='flex relative gap-4 items-center'>
                {!loading && !showInprogress && (
                    <>
                    {!error && (
                        <>

                            <div className="text-sm flex gap-1 items-center ml-4 text-left w-full dark:text-brand-300">
                                <div>Test Mode</div>
                                <p></p>
                                <Switch
                                    checked={localSwitchState}
                                    //onCheckedChange={(c: boolean) => dispatch(getTestModeStatus(options, url, String(c)))}
                                    onCheckedChange={(checked) => handleSwitchChange(checked)}

                                />
                            </div>
                            <SaveChanges />
                        </>
                    )}
                    </>
                )}

                <UnsavedChanges
                    onCancel={() => { setShowOptimizer(false) }}
                    cancel='Discard & Leave'
                    onClick={() => {
                        setShowOptimizer(false);
                        setShowInprogress(false);
                    }} >
                    <TooltipText text='Close Optimizer'>
                        <LogOut className={cn(
                            'h-5 w-5 dark:text-brand-300 text-brand-600 transition-opacity',
                        )} />
                    </TooltipText>
                </UnsavedChanges>
            </div>
        </header>

    )
}

export default Header