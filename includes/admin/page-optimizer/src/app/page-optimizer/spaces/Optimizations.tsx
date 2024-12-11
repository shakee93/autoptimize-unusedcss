import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import AppButton from "components/ui/app-button";
import { AnimatePresence, m, motion } from "framer-motion"
import useCommonDispatch from "hooks/useCommonDispatch";
import { changeGear } from '../../../store/app/appActions';  
import { LoaderIcon, ChevronDown, GaugeCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../store/app/appSelector";
import {CheckCircleIcon} from '@heroicons/react/24/solid';
import OptimizationsProgress from '../../../components/optimizations-progress';

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
    const { dispatch} = useCommonDispatch()

    
  
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

                <div className="flex space-x-4">
                    <div className='w-1/3 bg-brand-0 rounded-lg p-4'>
                    
                        <div className="flex flex-col pt-1 gap-2 w-full">
                            {/* {getFilteredSettings(settings).map(renderOptimizationStep)} */}
                        
                            <OptimizationsProgress />
                        </div>

                    </div>
                
                    <div className='w-2/3 bg-brand-0 rounded-lg p-10 items-center justify-center flex flex-col gap-4 text-center'>
                        <h3 className="font-semibold text-lg">Test Your Optimizations</h3>
                        <span className="font-normal text-sm text-zinc-600 dark:text-brand-300">Your optimizations are complete! However, changes might not take effect due to factors like caching, conflicts with plugins or themes, or dynamic content. Let’s test to ensure everything is working smoothly and identify any bottlenecks.</span>
                        <AppButton className="rounded-xl px-8 py-4">
                            Run Optimization Test
                        </AppButton>
                        <span className="font-normal text-xs text-zinc-600 dark:text-brand-300">Disabled: All Optimizations needs to be completed to run the test</span>
                    </div>
                </div>
            </div>
        </m.div>
        </AnimatePresence>
    )
}

export default Optimizations;   