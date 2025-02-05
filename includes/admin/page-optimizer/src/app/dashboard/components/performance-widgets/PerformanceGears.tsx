import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Starter, Accelerate, TurboMax, Custom } from '../../../page-optimizer/components/icons/gear-icons';
import { cn } from '../../../../lib/utils';
import {CursorArrowRaysIcon, CheckCircleIcon, CheckIcon} from '@heroicons/react/24/solid';
import {ChevronDown, GaugeCircle, LoaderIcon} from 'lucide-react';
import {motion, AnimatePresence } from 'framer-motion';
import {changeGear} from "../../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {CustomCheckIcon} from "../icons/icon-svg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import {PlusIcon} from "@heroicons/react/24/outline";
import ComparisonTable from "components/ui/compare-table";
import AppButton from "components/ui/app-button";
import ComparisonDialog from '../ComparisonDialog';

const boosterLevels: PerformanceGear[] = ['starter', 'accelerate', 'turboMax'];

const Steps = [
    "Analyze with Google PageSpeed",
    "Change performance gear to TurboMax",
    "Apply DOM optimizations",
    "Generate Critical CSS",
    "Generate Unused CSS",
    "Optimize Images",
    "All Optimizations are completed",
];

const GEAR_FEATURES: Record<PerformanceGear, string[]> = {
    turboMax: [
        "Starter + Accelerator Optimizations",
        "Files served through CDN",
        "Images served in Next-Gen format",
        "Images Lazy-loaded",
        "JavaScript files Deferred",
        "Critical CSS files generated",
        "JavaScript files delayed",
    ],
    accelerate: [
        "Starter Optimizations",
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

interface PerformanceGearsProps {
    className: string;
}

const PerformanceGears: React.FC<PerformanceGearsProps> = ({className}) => {
    const { activeGear, settings } = useSelector(optimizerData);
    const [activeLevel, setActiveLevel] = useState<PerformanceGear>(activeGear || 'accelerate');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [OptimizationSteps, setOptimizationSteps] = useState(Steps);
    const { dispatch} = useCommonDispatch()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        //console.log(activeGear)

    }, [activeGear]);

    // const startOptimization = useCallback((level: PerformanceGear) => {
    //
    //     if (level !== activeLevel) {
    //
    //         dispatch(changeGear(
    //             level as BasePerformanceGear
    //         )).then((options : any) => {
    //             setOptimizationSteps(options)
    //         });
    //
    //         setActiveLevel(level);
    //         setIsOptimizing(true);
    //         setCurrentStep(0);
    //
    //         // Simulate optimization steps
    //         const simulateSteps = (step: number) => {
    //             if (step < OptimizationSteps.length) {
    //                 setTimeout(() => {
    //                     setCurrentStep(step);
    //                     simulateSteps(step + 1);
    //                 }, 2000);
    //             } else {
    //                 setIsOptimizing(false);
    //             }
    //         };
    //
    //         simulateSteps(0);
    //     }
    // }, [activeLevel]);

    // Function to get filtered options
    // const getFilteredOptions = (settings, optimizationSteps) => {
    //     return settings
    //         .filter((s) => optimizationSteps.includes(s.name)) // Filter based on OptimizationSteps
    //         .map((s) => ({
    //             category: s.category,
    //             name: s.name,
    //             inputs: s.inputs[0] ? {
    //                 control_label: s.inputs[0].control_label,
    //                 control_type: s.inputs[0].control_type,
    //                 key: s.inputs[0].key,
    //                 value: s.inputs[0].value,
    //             } : null
    //         }));
    // };


    // useEffect(() => {
    //     const newOptions = getFilteredOptions(settings, OptimizationSteps);
    //     console.log(newOptions);
    // }, [OptimizationSteps]);

    // const toggleAccordion = useCallback(() => {
    //     setIsAccordionOpen(prev => !prev);
    // }, []);

    const getIcon = useMemo(() => (level: PerformanceGear) => {
        const iconProps = {
            cls: `w-12 h-12 ${activeGear === level ? 'text-purple-600' : 'text-gray-400'}`
        };
        switch (level) {
            case 'starter': return <Starter {...iconProps} />;
            case 'accelerate': return <Accelerate {...iconProps} />;
            case 'turboMax': return <TurboMax {...iconProps} />;
            case 'custom': return <Custom {...iconProps} />;
        }
    }, [activeGear]);

    // const getTriggerText = useMemo(() => () => {
    //     if (isAccordionOpen) return 'Optimization Progress';
    //     if (currentStep === -1) return 'Click a level to start optimization';
    //     if (currentStep === OptimizationSteps.length - 1) return 'All Optimizations are completed';
    //     return OptimizationSteps[currentStep] + '...';
    // }, [isAccordionOpen, currentStep]);

    const renderBoosterLevel = useCallback((level: PerformanceGear, index: number) => {
        // // Don't render custom gear if it's not active
        // if (level === 'custom' && activeGear !== 'custom') {
        //     return null;
        // }

        return (
            <div
            key={level}
            className={cn(
                'relative flex flex-col gap-3 font-normal cursor-pointer w-[135px] h-[135px] rounded-3xl items-center justify-center',
                'hover:bg-brand-100/50 bg-brand-0',
                // index !== 0 && '-ml-11',
                // activeGear === level ? 'z-50' : `z-[${boosterLevels.length - index}]`,
                activeGear === level 
                    ? 'text-brand-600 border-[3px] border-[#592d8d]' 
                    : 'border border-brand-200 dark:border-brand-700'
            )}
            >
                <div className={cn('flex flex-col items-center justify-center', activeGear === level ? 'opacity-100' : 'opacity-20')}>
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
            </div>
        );
    }, [activeGear, getIcon]);



    // const renderOptimizationStep = useCallback((step: string, index: number) => (
    //     <div key={index} className="flex items-start gap-2 py-1 relative">
    //         <div className="w-5 flex flex-col items-center">
    //             {index === OptimizationSteps.length - 1 ? (
    //                 <CheckCircleIcon className={`w-5 h-5 ${index <= currentStep ? 'text-green-600' : 'text-gray-300'}`} />
    //             ) : (
    //                 <>
    //                     <div className="w-5 h-5 flex items-center justify-center relative z-10">
    //                         {index < currentStep && <div className="w-2 h-2 rounded-full bg-[#C1C1C1]" />}
    //                         {index === currentStep && isOptimizing && <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />}
    //                         {index > currentStep && <div className="w-2 h-2 rounded-full bg-[#C1C1C1]" />}
    //                     </div>
    //                     {index < OptimizationSteps.length - 1 && (
    //                         <motion.div
    //                             className="w-[1px] bg-[#C1C1C1] absolute top-[1.15rem] left-[.6rem] z-1"
    //                             initial={{ height: 0 }}
    //                             animate={{ height: index < currentStep ? '125%' : 0 }}
    //                             transition={{ duration: 0.25, ease: "easeInOut" }}
    //                         />
    //                     )}
    //                 </>
    //             )}
    //         </div>
    //         <span className={`text-sm transition-colors ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
    //     </div>
    // ), [currentStep, isOptimizing]);



    const GearFeatures: React.FC<{ gearName: PerformanceGear; features: string[] }> = ({ gearName, features }) => {
        // State to track if "See More" is clicked
        const [isExpanded, setIsExpanded] = useState(false);

        const displayFeatures = gearName === "custom"
            ? settings.filter(data => data.inputs[0]?.value).map(data => data.name)
            : features;

        const initialDisplayCount = 6;
        const shouldShowSeeMore = displayFeatures.length > initialDisplayCount;

        const handleSeeMoreClick = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className="relative">
                <h4 className="text-base font-semibold capitalize">{gearName} Features</h4>
                <ul className="space-y-1 py-2 text-sm font-medium">
                    {displayFeatures.slice(0, isExpanded ? displayFeatures.length : initialDisplayCount).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CustomCheckIcon className="h-3 w-3 text-brand-600" />
                            {feature}
                        </li>
                    ))}
                </ul>
                {shouldShowSeeMore && (
                    <div className={cn('w-full ' , isExpanded ? 'py-1' : 'py-4 absolute bg-gradient-to-b from-transparent to-brand-0 -mt-10')}>
                        <button
                            onClick={handleSeeMoreClick}
                            className="text-brand-950 text-sm mx-auto block underline"
                        >
                            <ChevronDown 
                                className={cn("w-4 h-4 transition-transform",isExpanded ? "rotate-180" : "")}
                            />
                        </button>
                    </div>
                    // <button onClick={handleSeeMoreClick} className={cn('text-sm z-10 w-full flex justify-center items-center underline', isExpanded ? 'h-8' : 'absolute bg-gradient-to-b from-transparent to-brand-0 transform -translate-y-[100%] h-14 ')}>{isExpanded ? "See Less" : "See More"}</button>
                )}
            </div>
        );
    };

    const GearDisplay: React.FC<{ activeGear: PerformanceGear }> = ({activeGear}) => {
        const features = GEAR_FEATURES[activeGear] || [];
        return <GearFeatures gearName={activeGear} features={features} />;
    };

    return (
        <div className={cn("flex flex-col items-center justify-between", className)}>
            <div className="flex flex-col p-6 pb-0 text-md gap-4 bg-white border-b-0 border-t-0 border w-full overflow-hidden relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                <h4 className={cn("text-base font-semibold flex gap-1", activeGear === 'custom' ? 'text-purple-900' : 'text-brand-400')}>
                    You’ve activated <span className="capitalize text-brand-950 ">{activeGear} {activeGear === 'custom' ? 'Settings' : 'Gear'}</span>
                </h4>
                <div className="flex flex-col w-full">
                    <div className="flex gap-3 w-full pointer-events-none	">
                        {boosterLevels.map(renderBoosterLevel)}
                    </div>
                </div>
                <div className="px-2">
                    <GearDisplay activeGear={activeGear} />
                </div>
                {/*<hr className="h-[1px] bg-gray-200"/>*/}
                {/*<div className="flex flex-col pt-1 gap-2 w-full">*/}
                {/*    <div*/}
                {/*        className="flex gap-2 px-5 items-center justify-between text-sm cursor-pointer select-none"*/}
                {/*        onClick={toggleAccordion}*/}
                {/*    >*/}
                {/*        <div data-accordion-trigger className='flex gap-3.5 py-1 items-center overflow-hidden'>*/}
                {/*            {isOptimizing && <LoaderIcon className="w-5 h-5 animate-spin"/>}*/}
                {/*            {!isOptimizing && currentStep === OptimizationSteps.length - 1 && (*/}
                {/*                <CheckCircleIcon className="w-5 h-5 text-green-600"/>*/}
                {/*            )}*/}
                {/*            <div style={{position: 'relative', height: '1.5em', perspective: '1000px', width: '400px'}}>*/}
                {/*                <AnimatePresence initial={false} mode="wait">*/}
                {/*                    <motion.div*/}
                {/*                        key={getTriggerText()}*/}
                {/*                        initial={{rotateX: -90, y: '60%', opacity: 0}}*/}
                {/*                        animate={{rotateX: 0, y: 0, opacity: 1}}*/}
                {/*                        exit={{rotateX: 90, y: '-60%', opacity: 0}}*/}
                {/*                        transition={{*/}
                {/*                            type: "spring",*/}
                {/*                            stiffness: 300,*/}
                {/*                            damping: 30,*/}
                {/*                            opacity: {duration: .3}*/}
                {/*                        }}*/}
                {/*                        style={{*/}
                {/*                            position: 'absolute',*/}
                {/*                            width: '100%',*/}
                {/*                            transformOrigin: 'center',*/}
                {/*                            backfaceVisibility: 'hidden'*/}
                {/*                        }}*/}
                {/*                    >*/}
                {/*                        {getTriggerText()}*/}
                {/*                    </motion.div>*/}
                {/*                </AnimatePresence>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <motion.div*/}
                {/*            animate={{rotate: isAccordionOpen ? 180 : 0}}*/}
                {/*            transition={{duration: 0.3}}*/}
                {/*        >*/}
                {/*            <ChevronDown className="w-4 h-4"/>*/}
                {/*        </motion.div>*/}
                {/*    </div>*/}
                {/*    <hr className="h-[1px] bg-gray-200"/>*/}
                {/*    <AnimatePresence initial={false}>*/}
                {/*        {isAccordionOpen && (*/}
                {/*            <motion.div*/}
                {/*                className=""*/}
                {/*                initial="collapsed"*/}
                {/*                animate="open"*/}
                {/*                exit="collapsed"*/}
                {/*                variants={{*/}
                {/*                    open: {opacity: 1, height: "auto"},*/}
                {/*                    collapsed: {opacity: 0, height: 0}*/}
                {/*                }}*/}
                {/*                transition={{duration: 0.3, ease: "easeInOut"}}*/}
                {/*            >*/}
                {/*                <motion.div*/}
                {/*                    variants={{collapsed: {scale: 1}, open: {scale: 1}}}*/}
                {/*                    transition={{duration: 0.3}}*/}
                {/*                    className="mt-2 flex flex-col gap-3.5 px-5 pb-3"*/}
                {/*                >*/}
                {/*                    {OptimizationSteps.map(renderOptimizationStep)}*/}
                {/*                </motion.div>*/}
                {/*            </motion.div>*/}
                {/*        )}*/}
                {/*    </AnimatePresence>*/}
                {/*</div>*/}
            </div>
            <div className="flex flex-col p-6 text-md gap-4 bg-white rounded-b-3xl border border-t-0 w-full overflow-hidden relative before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-white before:via-brand-200 before:to-white">
                <div className="flex gap-6 justify-end">
                    <button
                        className="cursor-pointer transition duration-300 text-sm font-semibold text-brand-500 py-1.5"
                        onClick={() => setOpen(true)}
                    >
                        Compare performance gears
                    </button>
                    <ComparisonDialog open={open} setOpen={setOpen} />
                    
                    <button onClick={() => (window.location.hash = '#/optimize')}
                            className="cursor-pointer transition duration-300 bg-brand-100/90 text-sm font-semibold py-1.5 px-4 rounded-lg">
                        Change Gear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PerformanceGears);