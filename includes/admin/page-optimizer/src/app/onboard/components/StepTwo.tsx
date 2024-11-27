import React, {useMemo, useCallback, useState, useEffect} from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import { CheckCircleIcon, InformationCircleIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import {changeGear, updateLicense} from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import useSubmitSettings from "hooks/useSubmitSettings";
import {useTestModeUtils} from "hooks/testModeUtils";
import { Starter, Accelerate, TurboMax } from "app/page-optimizer/components/icons/gear-icons";
import {CustomCheckIcon} from "app/dashboard/components/icons/icon-svg";
import {AIButtonIcon} from "app/onboard/components/icons/icon-svg";
import {Input} from "components/ui/input";
import { AnimatePresence, motion } from 'framer-motion';
import {Loader} from "lucide-react";
import ComparisonDialog from "app/dashboard/components/ComparisonDialog";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";
import LettersPullUp from "components/ui/letterUpAnimation";

// type PerformanceGear = 'starter' | 'accelerate' | 'turboMax';

const boosterLevels: PerformanceGear[] = ['starter', 'accelerate', 'turboMax'];

type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

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
    custom: [
        // "Unlock peak performance potential",
        // "Utilize Accelerator mode",
        // "Generate critical CSS for faster rendering",
        // "Implement advanced JavaScript handling methods",
        // "Delay execution for improved speed and efficiency",
    ],

};

interface StepTwoProps {
    reconnect?: boolean;
    onNext?: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ reconnect, onNext }) => {
    const { options, uucssGlobal} = useAppContext();
    const { dispatch, settingsMode } = useCommonDispatch();
    const { activeGear, license } = useSelector(optimizerData);
    const [activeLevel, setActiveLevel] = useState<PerformanceGear>('turboMax');
    const [inputLicense, setInputLicense] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [licenseMessage, setLicenseMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const LicenseInputChange: InputChangeHandler =
        (event) => {
        setInputLicense(event.target.value);
    };
    const connectRapidloadLicense = async () => {
        setLoading(true);
        const response = await dispatch(updateLicense(options, inputLicense));
        setLoading(false);
        if (response.success) {
            dispatch(updateLicense(options));
            // setIsFadingOut(true);
            //
            // setTimeout(() => {
            //     window.location.hash = '#/';
            // }, 300);
            if(onNext){
                onNext();
            }

        }else{
            setLicenseMessage(response?.error?? '');
        }
    };


    useEffect(() => {
        setLicenseMessage("");
    },[inputLicense]);

    useEffect(() => {
        console.log('Mode : ',activeGear)
    },[activeGear]);

    const settingsModeOnChange = (mode: PerformanceGear) => {
        setActiveLevel(mode)
        localStorage.setItem('rapidLoadGear', JSON.stringify(mode));
        dispatch(changeGear(
            mode as BasePerformanceGear
        ))
    };


    const getIcon = useMemo(() => (level: PerformanceGear) => {
        const iconProps = {
            cls: `w-16 h-16 mt-[16px] ${activeLevel === level ? 'text-purple-600' : 'text-gray-400'}`
        };
        switch (level) {
            case 'starter': return <Starter {...iconProps} />;
            case 'accelerate': return <Accelerate {...iconProps} />;
            case 'turboMax': return <TurboMax {...iconProps} />;
        }
    }, [activeLevel]);

    const renderBoosterLevel = useCallback((level: PerformanceGear) => {
        const isActive = activeLevel === level;
        const isTurboMax = activeLevel === 'turboMax' && level === 'turboMax';
        return (
            <div
                key={level}
                className={cn(
                    'relative hover:bg-brand-100/50 flex flex-col gap-3.5 font-normal w-[166px] h-[166px] cursor-pointer rounded-3xl items-center justify-center',
                    isActive ? 'text-brand-600 border-[3px] border-[#592d8d]' : 'border border-brand-200 dark:border-brand-700',
                    isTurboMax && 'gap-1 pt-4',
                )}
                onClick={() => settingsModeOnChange(level)}
            >
                <div>
                    {getIcon(level)}
                    {isActive && (
                        <div className={cn("absolute", level === "turboMax" ? "right-[7px] top-2 gap-1 text-[10px] items-center font-semibold bg-purple-100 rounded-3xl p-1 pl-2 flex" : "top-2.5 right-2.5")}>
                            {level === 'turboMax' && (<><AIButtonIcon />  AI Recommended </>)}
                            <CheckCircleIcon className={`w-6 h-6 text-purple-800 `} />
                        </div>
                    )}
                </div>
                <div className="items-center flex flex-col">
                    <span className="capitalize font-semibold">{level}</span>
                    {level === 'turboMax' && (
                        <span className="font-normal text-[10px] leading-none">Test Mode Recommended</span>)}
                </div>
            </div>
        );
    }, [activeLevel, getIcon]);




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
                                        {/*<LettersPullUp text={feature} />*/}
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
        <div
            className="w-full flex flex-col gap-4">
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <div className="px-2">
                    <img
                        className="w-22"
                        src={options?.page_optimizer_base ? `${options.page_optimizer_base}/logo.svg` : '/logo.svg'}
                        alt="RapidLoad - #1 to unlock breakneck page speed"
                    />
                </div>
                { !reconnect ? (
                    <>
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

                        <GearDisplay activeGear={activeLevel as PerformanceGear}/>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-4xl font-bold">Connect Your Account</h1>
                        <span className="font-medium text-base text-zinc-600 dark:text-brand-300">
                        Pick your Performance Mode: Starter, Accelerate or TurboMax to fine-tune your site's speed.
                    </span>
                    </div>
                )}


                <div className="flex flex-col gap-6 items-center">
                    <h6 className="text-base font-semibold capitalize text-center">Connect Your Account to
                        Optimize </h6>

                    <AnimatePresence mode="wait">
                        {showInput ? (
                            <motion.div
                                key="inputDiv"
                                initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                transition={{duration: 0.2}}
                                className="flex flex-col border rounded-2xl w-[500px]"
                            >
                                <div
                                    className="flex justify-between items-center bg-brand-100/60 px-4 py-2 rounded-t-2xl">
                                    {licenseMessage.length > 0 ? (
                                        <h3 className="text-sm font-medium text-amber-700">{licenseMessage}</h3>
                                    ) : loading ?
                                        (
                                            <div className="flex gap-2 items-center">
                                                <Loader className='w-5 animate-spin'/><h3
                                                className="text-sm font-medium">Connecting please wait...</h3>
                                            </div>
                                        )
                                        : (
                                            <h3 className="text-sm font-medium">Connect with License key</h3>
                                        )}

                                    <button
                                        className="items-center text-amber-700 font-medium text-sm py-2 px-4 rounded-lg"
                                        onClick={() => setShowInput(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="flex gap-4 bg-brand-0 px-4 py-2 rounded-b-2xl">
                                    <Input
                                        id="licenseKey"
                                        type="text"
                                        placeholder={'Enter you license key'}
                                        className="text-sm flex-grow border-none focus:outline-none focus-visible:ring-0 dark:text-brand-300 focus-visible:ring-offset-0"
                                        value={inputLicense}
                                        onChange={LicenseInputChange}
                                    />
                                    {inputLicense.length > 0 &&
                                        <button
                                            className="items-center text-sm text-brand-950 font-medium py-2 px-4 rounded-lg"
                                            onClick={connectRapidloadLicense}
                                        >
                                            Connect
                                        </button>
                                    }
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="connectDiv"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{duration: 0.2}}
                                className="flex gap-4 items-center"
                            >
                                <button
                                    className="items-center bg-brand-300 text-brand-950 hover:bg-brand-900/90 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2"
                                    onClick={() => {
                                        setShowInput(true)
                                    }}
                                >
                                    Connect with License key
                                </button>
                                <span className="font-semibold">or</span>
                            <button
                                className="items-center bg-brand-900/90 text-white font-medium py-2 px-4 rounded-lg hover:bg-brand-300 hover:text-brand-950 transition-all gap-2"
                                onClick={() => window.location.href = uucssGlobal?.activation_url}
                            >
                                Connect Account
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {!reconnect &&
                        <>
                            <button className="text-base font-semibold capitalize text-center"
                                    onClick={() => setOpen(true)}
                            >Compare Performance Gears
                            </button>
                            <ComparisonDialog open={open} setOpen={setOpen}/>
                            <button
                                className="flex bg-gradient-to-r from-brand-900/90 to-brand-950 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-all gap-2 w-fit"
                                onClick={onNext}
                            >
                                Next Step
                                <ArrowLongRightIcon className="w-6 h-6"/>
                            </button>
                        </>

                    }

                </div>
            </div>
        </div>
    )
        ;
};

export default StepTwo;
