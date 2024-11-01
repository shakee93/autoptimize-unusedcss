import React, { useMemo, useCallback } from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import { CheckCircleIcon, InformationCircleIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { changeGear } from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import useSubmitSettings from "hooks/useSubmitSettings";
import {useTestModeUtils} from "hooks/testModeUtils";
import { Starter, Accelerate, TurboMax } from "app/page-optimizer/components/icons/gear-icons";
import {CustomCheckIcon} from "app/dashboard/components/icons/icon-svg";
import {AIButtonIcon} from "app/onboard/components/icons/icon-svg";

type PerformanceGear = 'starter' | 'accelerate' | 'turboMax';

const boosterLevels: PerformanceGear[] = ['starter', 'accelerate', 'turboMax'];

const GEAR_FEATURES: Record<PerformanceGear, string[]> = {
    turboMax: [
        "Unused CSS generation",
        "Minifying CSS",
        "Minifying JavaScript",
        "Page Cache Generated",
        "Google Fonts self-hosted",
        "Files served through CDN",
        "Images served in Next-Gen",
        "Images Lazy-loaded",
        "JavaScript files Deferred",
        "Critical CSS files generated",
        "JavaScript files delayed",
    ],
    accelerate: [
        "Unused CSS generation",
        "Minifying CSS",
        "Minifying JavaScript",
        "Page Cache Generated",
        "Google Fonts self-hosted",
        "Files served through CDN",
        "Images served in Next-Gen format",
        "Images Lazy-loaded",
        "JavaScript files Deferred",
    ],
    starter: [
        "Unused CSS generation",
        "Minifying CSS",
        "Minifying JavaScript",
        "Page Cache Generated",
        "Google Fonts self-hosted",
    ],

};
const StepTwo = () => {
    const { options } = useAppContext();
    const { dispatch } = useCommonDispatch();
    const { activeGear } = useSelector(optimizerData);
    const { submitSettings } = useSubmitSettings();
    const { handleTestModeSwitchChange } = useTestModeUtils();

    const getIcon = useMemo(() => (level: PerformanceGear) => {
        const iconProps = {
            cls: `w-16 h-16 mt-[16px] ${activeGear === level ? 'text-purple-600' : 'text-gray-400'}`
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
                'relative hover:bg-brand-100/50 flex flex-col gap-3.5 font-normal cursor-pointer w-[166px] h-[166px] rounded-3xl items-center justify-center',
                level === activeGear ? 'text-brand-600 border-[3px] border-[#592d8d]' : 'border border-brand-200 dark:border-brand-700',
                activeGear === 'turboMax' && level === 'turboMax' && 'gap-1 pt-4'
            )}
            onClick={() => settingsModeOnChange(level)}
        >
            <div>
                {getIcon(level)}
                {activeGear === level && (
                    level === 'turboMax' ? (
                        <div
                            className="absolute right-1.5 top-2 gap-1 text-[10px] items-center font-semibold bg-purple-100 rounded-3xl p-1 pl-2 flex">
                            <AIButtonIcon/> AI Recommended <CheckCircleIcon className="w-6 h-6 text-purple-800"/>
                        </div>
                    ) : (
                        <div className="absolute top-2.5 right-2.5">
                            <CheckCircleIcon className="w-6 h-6 text-purple-800"/>
                        </div>
                    )
                )}
            </div>
            <div className="items-center flex flex-col">
                <span className="capitalize font-semibold">{level}</span>
                {level === 'turboMax' && (<span className="font-normal text-[10px] leading-none">Test Mode Recommended</span>)}
            </div>

        </div>
    ), [activeGear, getIcon]);

    const settingsModeOnChange = async (level: PerformanceGear) => {
        console.log("Setting mode to:", level);
        dispatch(changeGear(level));
        submitSettings(true);
        await handleTestModeSwitchChange(level === 'turboMax');
    };


    const GearFeatures: React.FC<{ gearName: PerformanceGear; features: string[] }> = ({gearName, features}) => {
        // Split the features into groups of 4
        const chunkedFeatures = [];
        const length = gearName === 'turboMax'? 4 : 3;
        for (let i = 0; i < features.length; i += length) {
            chunkedFeatures.push(features.slice(i, i + length));
        }

        return (
            <div className="relative">
                <h4 className="text-base font-semibold capitalize text-center">{gearName} Gear Performance Features</h4>
                <div className="flex space-x-4">
                    {chunkedFeatures.map((chunk, columnIndex) => (
                        <div key={columnIndex} className="flex-1">
                            <ul className="space-y-1 py-2 text-sm font-medium">
                                {chunk.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 truncate">
                                        <CustomCheckIcon className="h-3 w-3 text-brand-600" />
                                        <span className="whitespace-nowrap">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    const GearDisplay: React.FC<{ activeGear: PerformanceGear }> = ({ activeGear }) => {
        const features = GEAR_FEATURES[activeGear] || [];
        return <GearFeatures gearName={activeGear} features={features} />;
    };


    return (
        <div className="w-full flex flex-col gap-4">
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <div className="px-2">
                    <img
                        className="w-22"
                        src={options?.page_optimizer_base ? `${options.page_optimizer_base}/logo.svg` : '/logo.svg'}
                        alt="RapidLoad - #1 to unlock breakneck page speed"
                    />
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-4xl font-bold">Select a Performance Gear</h1>
                    <span className="font-medium text-base text-zinc-600 dark:text-brand-300">
                        Pick your Performance Mode: Starter, Accelerate or TurboMax to fine-tune your site's speed.
                    </span>
                </div>

                <div className="flex flex-col">
                    <div className="flex gap-3 w-full">
                        {boosterLevels.map(renderBoosterLevel)}
                    </div>
                </div>

                <GearDisplay activeGear={activeGear as PerformanceGear}/>

                <div className="flex flex-col gap-6">
                <h6 className="text-base font-semibold capitalize text-center">Connect Your Account to Optimize </h6>

                <div className="flex gap-4 items-center">
                    <button
                        className="items-center bg-brand-300 text-brand-950 hover:bg-brand-900/90 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2"
                    >
                        Connect with License key
                    </button>
                    <span className="font-semibold">or</span>
                    <button
                        className="items-center bg-brand-900/90 text-white font-medium py-2 px-4 rounded-lg hover:bg-brand-300 hover:text-brand-950 transition-all gap-2"
                    >
                        Connect Account
                    </button>
                </div>
                <h6 className="text-base font-semibold capitalize text-center">Compare Performance Gears</h6>
                </div>
            </div>
        </div>
    );
};

export default StepTwo;
