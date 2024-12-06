import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { cn } from "lib/utils";
import { useAppContext } from "../../../context/app";
import Lottie from 'lottie-react';
import rocketAnimation from 'components/animation/rocket.json';
import useSubmitSettings from "hooks/useSubmitSettings";
import {changeGear, fetchSettings, getCSSStatus, getHomePagePerformance} from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import CountdownTimer from "components/ui/CountdownTimer";
import {Skeleton} from "components/ui/skeleton";
import ComparisonTable from 'components/ui/compare-table';

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
    const [update, setUpdate] = useState(false)
    const { settings, activeGear, cssStatus, touched } = useSelector(optimizerData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

    const currentStepData = useMemo(() => steps[currentStep - 1] || steps[0], [currentStep]);

    useEffect(() => {
        const localGear = localStorage.getItem('rapidLoadGear')
        if (localGear) {
            dispatch(changeGear(
                localGear as BasePerformanceGear
            ))
           // localStorage.removeItem('rapidLoadGear');
        }
    },[activeGear]);

    useEffect(() => {
        settings.length > 0 && setUpdate(true);
    },[settings]);

    useEffect(() => {
        if (update) {
            setIsSubmitting(true);
            submitSettings(true)
                .then(() => {
                    setIsSubmitting(false);
                    setCurrentStep(1);
                    const url = options?.optimizer_url;
                    if (url) {
                        dispatch(getCSSStatus(options, url, ['uucss', 'cpcss']));
                    }
                    
                })
                .catch((error) => {
                    setIsSubmitting(false);
                    console.error('Submit settings failed:', error);
                });
        }
    },[update]);

    useEffect(() => {
        if (isCompleted && !isSubmitting && onNext) {
            const timer = setTimeout(() => {
                onNext();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isCompleted, isSubmitting, onNext]);


    useEffect(() => {

        if(cssStatus != null) {
            setCurrentStep(2);
            dispatch(getHomePagePerformance(options)).then(() => {
                setCurrentStep(3);
                setIsCompleted(true);
            }).catch((error) => {
                console.error('Fetching home page performance failed:', error);
            });
        }
    }, [cssStatus, savingData, invalidatingCache]);

    useEffect(() => {
        setCurrentDetailIndex(0);

        const rotateDetails = setInterval(() => {
            setCurrentDetailIndex((prevIndex) => {
                if (prevIndex >= (currentStepData.details.length - 1)) {
                    return 0;
                }
                return prevIndex + 1;
            });
        }, 2000);

        return () => clearInterval(rotateDetails);
    }, [currentStep, currentStepData]);

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
                    <div className="text-gray-600/50 font-bold"><CountdownTimer timerOnly={true}/></div>
                    <h4 className="text-xl font-bold capitalize text-center">
                        {currentStepData.description}
                    </h4>
                    <p className="text-gray-600 mb-2 text-center">
                        {currentStepData.details[currentDetailIndex]}
                    </p>
                    {/* Progress bar */}
                    <div className="flex items-center w-64">
                        {[0, 1, 2].map(step => (
                            currentStep > step ? (
                                <div key={step} className="h-2 flex-grow bg-gray-300 rounded-lg mr-2">
                                    <div
                                        className="h-2 bg-purple-600 rounded-lg"
                                        style={{width: '100%'}}
                                    ></div>
                                </div>
                            ) : (
                                <Skeleton
                                    key={step}
                                    className="h-2 flex-grow bg-gray-300 rounded-lg mr-2"
                                >
                                </Skeleton>
                            )
                        ))}
                    </div>


                    <p className="text-sm text-gray-500 mt-2">Step {Math.min(currentStep + 1, 3)} of 3</p>
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
