import React, {useState, useEffect, useCallback, useMemo} from 'react';
import { cn } from "lib/utils";
import {useAppContext} from "../../../context/app";
import {BoltIcon, CheckCircleIcon, InformationCircleIcon} from "@heroicons/react/24/solid";
import TooltipText from "components/ui/tooltip-text";
import {changeGear, changeReport, fetchReport, getSummary} from "../../../store/app/appActions";
import {ArrowTopRightOnSquareIcon, DevicePhoneMobileIcon, ArrowLongRightIcon} from "@heroicons/react/24/outline";
import {Monitor, RefreshCw} from "lucide-react";
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import {setCommonState} from "../../../store/common/commonActions";
import AppButton from "components/ui/app-button";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import PerformanceProgressBar from "components/performance-progress-bar";
import usePerformanceColors from "hooks/usePerformanceColors";
import {AIButtonIcon} from "app/onboard/components/icons/icon-svg";
import {Accelerate, Starter, TurboMax} from "app/page-optimizer/components/icons/gear-icons";
import useSubmitSettings from "hooks/useSubmitSettings";
import {useTestModeUtils} from "hooks/testModeUtils";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";

const boosterLevels: PerformanceGear[] = ['starter', 'accelerate', 'turboMax'];

const StepOne = () => {
    const { options, savingData, invalidatingCache  } = useAppContext()
    const { dispatch} = useCommonDispatch()
    const { activeGear } = useSelector(optimizerData);
    const { submitSettings } = useSubmitSettings()
    const { handleTestModeSwitchChange } = useTestModeUtils();

    const getIcon = useMemo(() => (level: PerformanceGear) => {
        const iconProps = {
            cls: `w-12 h-12 ${activeGear === level ? 'text-purple-600' : 'text-gray-400'}`
        };
        switch (level) {
            case 'starter': return <Starter {...iconProps} />;
            case 'accelerate': return <Accelerate {...iconProps} />;
            case 'turboMax': return <TurboMax {...iconProps} />;
        }
    }, [activeGear]);


    const renderBoosterLevel = useCallback((level: PerformanceGear) => (
        <div
            key={level}
            className={cn(
                'hover:bg-brand-100/50 relative flex flex-col gap-3 font-normal cursor-pointer w-[135px] h-[135px] rounded-3xl items-center justify-center',
                activeGear === level ? 'text-brand-600 border-[3px] border-[#592d8d]' : ' border border-brand-200 dark:border-brand-700'
            )}
            onClick={()=> {
                settingsModeOnChange(level);
            }}
        >
            <div>
                {getIcon(level)}
                {activeGear === level && (
                    <div className="absolute top-2.5 right-2.5">
                        <CheckCircleIcon className="w-6 h-6 text-purple-800" />
                    </div>
                )}
            </div>
            <span className="capitalize">{level}</span>
        </div>
    ), [activeGear, getIcon]);

    const settingsModeOnChange = async (level: PerformanceGear) => {
        console.log("Setting mode to:", level);
        if (level === 'turboMax') {
            await handleTestModeSwitchChange(true)
        } else {
            await handleTestModeSwitchChange(false)
        }

        dispatch(changeGear(
            level as BasePerformanceGear
        ))

        submitSettings(true);

    };

    // useEffect(() => {
    //    console.log(activeGear)
    //
    // }, [activeGear]);

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <div className='px-2'>
                    <img className='w-22'
                         src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'}
                         alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-4xl font-bold'>Select a Performance Gear</h1>
                    <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                        Pick your Performance Mode: Starter, Accelerate or TurboMax to fine-tune your site's speed.
                    </span>
                </div>


                <div className='border rounded-xl p-2 flex items-center gap-4'>
                    <div className='p-2 bg-brand-200/60 rounded-lg'>
                        <InformationCircleIcon className='w-10 h-10 text-purple-700/90'/>
                    </div>
                    <span className='font-medium text-xs text-zinc-600 dark:text-brand-300'>
                        Your website ({options?.optimizer_url}) uses caching. We bypass it to <br/> reveal the unoptimized performance, showing RapidLoad's full <br/> impact.
                    </span>
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-3 w-full">
                        {boosterLevels.map(renderBoosterLevel)}
                    </div>
                </div>

                <button
                    className="flex items-center bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 ">
                    Let’s improve this score
                    <ArrowLongRightIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

export default StepOne;
