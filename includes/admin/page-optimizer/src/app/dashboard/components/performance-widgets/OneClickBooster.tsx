import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Starter, Accelerate, TurboMax } from '../../../page-optimizer/components/icons/gear-icons';
import { cn } from '../../../../lib/utils';
import { CursorArrowRaysIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDown, LoaderIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {changeGear} from "../../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";

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

const OneClickBooster: React.FC = () => {
    const { activeGear, settings } = useSelector(optimizerData);
    const [activeLevel, setActiveLevel] = useState<PerformanceGear>(activeGear || 'accelerate');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [OptimizationSteps, setOptimizationSteps] = useState(Steps);
    const { dispatch} = useCommonDispatch()


    const startOptimization = useCallback((level: PerformanceGear) => {

        if (level !== activeLevel) {

            dispatch(changeGear(
                level as BasePerformanceGear
            )).then((options : any) => {
                setOptimizationSteps(options)
            });

            setActiveLevel(level);
            setIsOptimizing(true);
            setCurrentStep(0);

            // Simulate optimization steps
            const simulateSteps = (step: number) => {
                if (step < OptimizationSteps.length) {
                    setTimeout(() => {
                        setCurrentStep(step);
                        simulateSteps(step + 1);
                    }, 2000);
                } else {
                    setIsOptimizing(false);
                }
            };

            simulateSteps(0);
        }
    }, [activeLevel]);

    // Function to get filtered options
    const getFilteredOptions = (settings, optimizationSteps) => {
        return settings
            .filter((s) => optimizationSteps.includes(s.name)) // Filter based on OptimizationSteps
            .map((s) => ({
                category: s.category,
                name: s.name,
                inputs: s.inputs[0] ? {
                    control_label: s.inputs[0].control_label,
                    control_type: s.inputs[0].control_type,
                    key: s.inputs[0].key,
                    value: s.inputs[0].value,
                } : null
            }));
    };


    useEffect(() => {
        console.log(settings);
        const newOptions = getFilteredOptions(settings, OptimizationSteps);
        console.log(newOptions);
    }, [OptimizationSteps]);

    const toggleAccordion = useCallback(() => {
        setIsAccordionOpen(prev => !prev);
    }, []);

    const getIcon = useMemo(() => (level: PerformanceGear) => {
        const iconProps = {
            cls: `w-16 h-16 ${activeLevel === level ? 'text-purple-600' : 'text-gray-400'}`
        };
        switch (level) {
            case 'starter': return <Starter {...iconProps} />;
            case 'accelerate': return <Accelerate {...iconProps} />;
            case 'turboMax': return <TurboMax {...iconProps} />;
        }
    }, [activeLevel]);

    const getTriggerText = useMemo(() => () => {
        if (isAccordionOpen) return 'Optimization Progress';
        if (currentStep === -1) return 'Click a level to start optimization';
        if (currentStep === OptimizationSteps.length - 1) return 'All Optimizations are completed';
        return OptimizationSteps[currentStep] + '...';
    }, [isAccordionOpen, currentStep]);

    const renderBoosterLevel = useCallback((level: PerformanceGear) => (
        <div
            key={level}
            className={cn(
                'hover:bg-brand-100/50 relative flex flex-col gap-3 font-normal cursor-pointer w-[155px] h-[155px] rounded-3xl items-center justify-center',
                activeLevel === level ? 'text-brand-600 border-[3px] border-[#592d8d]' : ' border border-brand-200 dark:border-brand-700'
            )}
            onClick={() => startOptimization(level)}
        >
            <div>
                {getIcon(level)}
                {activeLevel === level && (
                    <div className="absolute top-2.5 right-2.5">
                        <CheckCircleIcon className="w-6 h-6 text-purple-800" />
                    </div>
                )}
            </div>
            <span className="capitalize">{level}</span>
        </div>
    ), [activeLevel, getIcon, startOptimization]);

    const renderOptimizationStep = useCallback((step: string, index: number) => (
        <div key={index} className="flex items-start gap-2 py-1 relative">
            <div className="w-5 flex flex-col items-center">
                {index === OptimizationSteps.length - 1 ? (
                    <CheckCircleIcon className={`w-5 h-5 ${index <= currentStep ? 'text-green-600' : 'text-gray-300'}`} />
                ) : (
                    <>
                        <div className="w-5 h-5 flex items-center justify-center relative z-10">
                            {index < currentStep && <div className="w-2 h-2 rounded-full bg-[#C1C1C1]" />}
                            {index === currentStep && isOptimizing && <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />}
                            {index > currentStep && <div className="w-2 h-2 rounded-full bg-[#C1C1C1]" />}
                        </div>
                        {index < OptimizationSteps.length - 1 && (
                            <motion.div
                                className="w-[1px] bg-[#C1C1C1] absolute top-[1.15rem] left-[.6rem] z-1"
                                initial={{ height: 0 }}
                                animate={{ height: index < currentStep ? '125%' : 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            />
                        )}
                    </>
                )}
            </div>
            <span className={`text-sm transition-colors ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
        </div>
    ), [currentStep, isOptimizing]);

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold ml-4 flex gap-2 items-center">
                One Click Booster <CursorArrowRaysIcon className="w-5 h-5" />
            </h4>
            <div className="flex flex-col text-md gap-2 bg-white rounded-3xl border w-full overflow-hidden">
                <div className="flex flex-col p-4 pb-1 gap-2 w-full">
                    <div className="flex gap-3 w-full">
                        {boosterLevels.map(renderBoosterLevel)}
                    </div>
                </div>
                <hr className="h-[1px] bg-gray-200" />
                <div className="flex flex-col pt-1 gap-2 w-full">
                    <div
                        className="flex gap-2 px-5 items-center justify-between text-sm cursor-pointer select-none"
                        onClick={toggleAccordion}
                    >
                        <div data-accordion-trigger className='flex gap-3.5 py-1 items-center overflow-hidden'>
                            {isOptimizing && <LoaderIcon className="w-5 h-5 animate-spin" />}
                            {!isOptimizing && currentStep === OptimizationSteps.length - 1 && (
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            )}
                            <div style={{ position: 'relative', height: '1.5em', perspective: '1000px', width: '400px' }}>
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={getTriggerText()}
                                        initial={{ rotateX: -90, y: '60%', opacity: 0 }}
                                        animate={{ rotateX: 0, y: 0, opacity: 1 }}
                                        exit={{ rotateX: 90, y: '-60%', opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                            opacity: { duration: .3 }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            transformOrigin: 'center',
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                        {getTriggerText()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: isAccordionOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </div>
                    <hr className="h-[1px] bg-gray-200" />
                    <AnimatePresence initial={false}>
                        {isAccordionOpen && (
                            <motion.div
                                className=""
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                    open: { opacity: 1, height: "auto" },
                                    collapsed: { opacity: 0, height: 0 }
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <motion.div
                                    variants={{ collapsed: { scale: 1 }, open: { scale: 1 } }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2 flex flex-col gap-3.5 px-5 pb-3"
                                >
                                    {OptimizationSteps.map(renderOptimizationStep)}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default React.memo(OneClickBooster);