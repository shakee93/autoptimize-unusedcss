import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import AppButton from "components/ui/app-button";
import { AnimatePresence, m, motion } from "framer-motion"
import useCommonDispatch from "hooks/useCommonDispatch";
import { changeGear } from '../../../store/app/appActions';
import { LoaderIcon, ChevronDown, GaugeCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import OptimizationsProgress from '../../../components/optimizations-progress';
import { useAppContext } from "../../../context/app";

const Steps = [
    "Analyze with Google PageSpeed",
    "Change performance gear to TurboMax",
    "Apply DOM optimizations",
    "Generate Critical CSS",
    "Generate Unused CSS",
    "Optimize Images",
    "All Optimizations are completed",
];

const Optimizations = ({ }) => {
    const { activeGear, settings } = useSelector(optimizerData);
    const [activeLevel, setActiveLevel] = useState<PerformanceGear>('accelerate');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [OptimizationSteps, setOptimizationSteps] = useState(Steps);
    const { dispatch } = useCommonDispatch()
    const { options } = useAppContext()
    const optimizerUrl = options?.optimizer_url;
    const [showIframe, setShowIframe] = useState(false);

    // useEffect(() => {
    //         console.log('window', window)
    //         window.addEventListener("message", (event) => {
    //             console.log('event', event.data)
    //             if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
    //                 console.log("Received data from iframe:", event.data);
    //             }
    //         });
    // }, [window]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "RAPIDLOAD_CHECK_RESULTS") {
                console.log("Received data from iframe:", event.data);

                // Compare received data with settings
                const receivedData = event.data.data;
                settings.forEach((setting: AuditSetting) => {

                    const mainInput = setting.inputs[0];
                    if (!mainInput) return;

                    Object.entries(receivedData).forEach(([category, data]: [string, any]) => {
                        if (data.key === mainInput.key) {
                            console.log(`Match found for ${category}:`, {
                                settingName: setting.name,
                                settingKey: mainInput.key,
                                settingValue: mainInput.value,
                                receivedStatus: data.status,
                                nonOptimizedItems: data.non_optimized_css || data.non_minified_css || data.non_minified_js || data.non_deferred_js || data.non_delayed_js
                            });
                        }
                    });
                });
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [settings]);

    const getFilteredSettings = (settings: any) => {
        return settings.filter((setting: any) => setting.inputs.some((input: any) => input.value === true));
    };
    ;

    const renderOptimizationStep = useCallback((step: string, index: number) => (
        <div key={index} className="flex items-start gap-2 py-1 relative">
            <div className=" bg-gray-100 rounded-full flex items-center justify-center p-1">
                <LoaderIcon className="h-4 w-4 text-gray-600 animate-spin" />
            </div>
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className={`text-sm transition-colors text-gray-900`}>{step.name}</span>
        </div>
    ), []);

    return (
        <AnimatePresence>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className=''
            >
                <div className='px-11 py-4'>
                    <div className="pb-4">
                        {false &&
                            <div>loading...</div>
                        }
                        <h3 className="font-semibold text-lg">Optimizations Summary</h3>
                        <span className="font-normal text-sm text-zinc-600 dark:text-brand-300">Let’s confirm that all optimizations are working as expected...</span>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        <div className='col-span-2 bg-brand-0 rounded-2xl p-4'>

                            <div className="flex flex-col pt-1 gap-2 w-full">
                                {/* {getFilteredSettings(settings).map(renderOptimizationStep)} */}

                                <OptimizationsProgress />
                            </div>

                        </div>

                        <div className='col-span-3 bg-brand-0 rounded-2xl p-10 items-center justify-center flex flex-col gap-4 text-center'>
                            <h3 className="font-semibold text-lg">Test Your Optimizations</h3>
                            <span className="font-normal text-sm text-zinc-600 dark:text-brand-300">Your optimizations are complete! However, changes might not take effect due to factors like caching, conflicts with plugins or themes, or dynamic content. Let's test to ensure everything is working smoothly and identify any bottlenecks.</span>
                            <AppButton
                                className="rounded-xl px-8 py-4"
                                onClick={() => setShowIframe(true)}
                            >
                                Run Optimization Test
                            </AppButton>
                            <span className="font-normal text-xs text-zinc-600 dark:text-brand-300">Disabled: All Optimizations needs to be completed to run the test</span>
                        </div>
                    </div>

                    {/* Iframe Section */}
                    <AnimatePresence>
                        {showIframe && (
                            <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6"
                            >
                                <div className="relative w-full rounded-xl overflow-hidden bg-white shadow-lg">
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => setShowIframe(false)}
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <iframe
                                        src={`${optimizerUrl}/?rapidload_preview`}
                                        // src={`${window.uucss_global.home_url}/?rapidload_preview`} 
                                        className="w-full h-[600px] border-0"
                                        title="Optimization Test"
                                    />
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </m.div>
        </AnimatePresence>
    )
}

export default Optimizations;   