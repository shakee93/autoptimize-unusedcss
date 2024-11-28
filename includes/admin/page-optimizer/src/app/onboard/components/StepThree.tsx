import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import Lottie from 'lottie-react';
import rocketAnimation from 'components/animation/rocket.json';
import useSubmitSettings from "hooks/useSubmitSettings";
import {changeGear, fetchSettings, getHomePagePerformance} from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";


const steps = [
    {
        title: "Step 1",
        description: "Launch Preparation Stage (Basic Optimizations)",
        details: [
            "A sleek rocket on a launch pad with animated checkmarks appearing around it",
            "Each quick optimization (JS, fonts, minification, cache) lights up a different engine part",
            "Progress shown through subtle blue pulse animations",
            'Small tooltips pop up: "Compressing JS... Done!" "Optimizing Fonts... Done!"',
            "Very quick transitions to maintain excitement",
        ],
    },
    {
        title: "Step 2",
        description: "Lift-Off Stage (Critical CSS & UnusedCSS)",
        details: [
            "Rocket starts to lift off slowly with gentle smoke effects",
            'Two prominent progress bars styled as "fuel gauges":',
            'Critical CSS Generation: "Building Core Systems..."',
            'UnusedCSS Removal: "Shedding Extra Weight..."',
            '"Time to Lift-Off" countdown timer',
            'Engaging messages like "Preparing for maximum speed..."',
        ],
    },
    {
        title: "Step 3",
        description: "Speed Check Stage (PageSpeed Analysis)",
        details: [
            'Rocket reaches "testing altitude"',
            "A circular speedometer appears with the Google PageSpeed score",
            "Real-time needle movement as the score calculates",
            "Subtle particle effects showing speed trails",
            "Progress shown through orbital rings filling up",
            "Mission Success/Diagnosis Stage",
        ],
    },
];

interface StepThreeProps {
    onNext?: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ onNext }) => {
    const { options, savingData, invalidatingCache } = useAppContext()
    const [currentStep, setCurrentStep] = useState(0);
    const [currentDetail, setCurrentDetail] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const { submitSettings } = useSubmitSettings()
    const { dispatch, headerUrl} = useCommonDispatch()


    useEffect(() => {
        // Change details within the current step
        const detailInterval = setInterval(() => {
            setCurrentDetail((prevDetail) =>
                (prevDetail + 1) % steps[currentStep].details.length
            );
        }, 2000); // seconds for each detail

        // Change steps seconds, but loop only after Step 3
        // const stepInterval = setInterval(() => {
        //     setCurrentStep((prevStep) => {
        //         if (prevStep === 2) {
        //             setIsCompleted(true); // Mark as completed after the last step
        //             return prevStep; // Keep Step 3
        //         }
        //         return (prevStep + 1) % steps.length;
        //     });
        //     setCurrentDetail(0);
        // }, 10000);

        const stepInterval = setInterval(() => {
            if (savingData || invalidatingCache) {
                setCurrentStep(1);
                setCurrentDetail(0);
                setIsCompleted(true);  // Mark as completed
                clearInterval(stepInterval);  // Stop the step interval
            } else {
                setCurrentStep((prevStep) => {
                    if (prevStep === 2) {
                        setIsCompleted(true); // Mark as completed after the last step
                        return prevStep; // Keep Step 3
                    }
                    return (prevStep + 1) % steps.length;
                });
                setCurrentDetail(0);
            }
        }, 10000);

        return () => {
            clearInterval(detailInterval);
            clearInterval(stepInterval);
        };
    }, [currentStep]);

    useEffect(() => {
        const localGear = localStorage.getItem('rapidLoadGear')
        if (localGear) {
            dispatch(changeGear(
                localGear as BasePerformanceGear
            ))
            localStorage.removeItem('rapidLoadGear');
        }
        submitSettings(true);
    },[]);

    useEffect(() => {
        if (isCompleted && onNext) {
            onNext();
            dispatch(getHomePagePerformance(options));

        }
    }, [isCompleted, onNext]);

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 flex flex-col gap-8 p-16 items-center rounded-3xl">
                <div className='px-2'>
                    <img className='w-22'
                         src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'}
                         alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-4xl font-bold'>Optimizing Your Site</h1>
                    <span className='font-medium text-base text-zinc-600 dark:text-brand-300'>
                        Hold on your site is almost ready...
                    </span>
                </div>

                <div className='flex items-center'>
                    <div style={{ width: 300, height: 200 }}>
                        <Lottie
                            animationData={rocketAnimation}
                            loop={true}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-gray-600/50 font-bold">10s</p>
                    <h4 className="text-xl font-bold capitalize text-center">{steps[currentStep].description}</h4>
                    <p className="text-gray-600 mb-2">
                        {steps[currentStep].details[currentDetail]}
                    </p>
                    {/* Progress bar */}
                    <div className="flex items-center w-64">
                        {[0, 1, 2].map(step => (
                            <div key={step} className="h-2 flex-grow bg-gray-300 rounded-lg mr-2">
                                <div
                                    className="h-2 bg-purple-600 rounded-lg"
                                    style={{width: currentStep >= step ? '100%' : '0%'}}
                                ></div>
                            </div>
                        ))}
                    </div>


                    <p className="text-sm text-gray-500 mt-2">Step {currentStep + 1} of 3</p>
                    {/*{(savingData || invalidatingCache) && (*/}
                    {/*    <div className='fixed inset-0 flex justify-center items-center z-[110000] bg-brand-50/80 dark:bg-brand-950/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'>*/}
                    {/*        <div className='fixed top-1/2 flex gap-2 items-center justify-center'>*/}
                    {/*            <Loader className='w-5 animate-spin' />*/}
                    {/*            {savingData && 'Saving Changes...'}*/}
                    {/*            {invalidatingCache && 'Flushing Cache...'}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    )
        ;
}

export default StepThree;
