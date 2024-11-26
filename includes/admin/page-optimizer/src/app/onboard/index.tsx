import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import { cn } from "lib/utils";
import StepOne from "app/onboard/components/StepOne";
import StepTwo from "app/onboard/components/StepTwo";
import StepThree from "app/onboard/components/StepThree";
import StepFour from "app/onboard/components/StepFour";
import { AnimatePresence, motion } from "framer-motion";


export default function Onboard() {
    const [currentStep, setCurrentStep] = useState(0);


    const steps = [
        { component: <StepOne onNext={() => setCurrentStep(1)} />, key: "stepOne" },
        { component: <StepTwo onNext={() => setCurrentStep(2)} />, key: "stepTwo" },
        { component: <StepThree onNext={() => setCurrentStep(3)}/>, key: "stepThree" },
        { component: <StepFour />, key: "stepFour" },
    ];
    useEffect(() => {
        // navigate(`#/onboard/${currentStep + 1}`);
    }, [currentStep]);

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                ease: "linear",
                duration: 0.04,
            }}
            id="rapidload-page-optimizer-wrapper"
            className={cn(
                "h-fit font-sans overflow-hidden flex flex-col text-base items-center"
            )}
        >
            <div
                id="onboard-content"
                className={cn(
                    "overflow-y-auto w-full pb-20 min-h-[780px] flex items-center",
                    "dark:bg-brand-900"
                )}
            >
                <section
                    className={cn(
                        "relative container flex flex-col p-6 gap-4"
                    )}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={steps[currentStep].key}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {steps[currentStep].component}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </div>
        </m.div>
    );
}
