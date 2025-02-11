import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import {cn, hasQueryParam, removeQueryParam} from "lib/utils";
import StepOne from "app/onboard/components/StepOne";
import StepTwo from "app/onboard/components/StepTwo";
import StepThree from "app/onboard/components/StepThree";
import StepFour from "app/onboard/components/StepFour";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../../context/app";

export default function Onboard() {
    const [currentStep, setCurrentStep] = useState(0);
    const { uucssGlobal } = useAppContext();

    useEffect(() => {
        const hasNonce = hasQueryParam("nonce");
        if (hasNonce) {
            setCurrentStep(2);
            removeQueryParam("nonce");
        } 
    }, []);


    const steps = [
        { component: <StepOne onNext={() => setCurrentStep(1)} />, key: "stepOne" },
        { component: <StepTwo onNext={() => setCurrentStep(2)} />, key: "stepTwo" },
        { component: <StepThree onNext={() => setCurrentStep(3)}/>, key: "stepThree" },
        { component: <StepFour />, key: "stepFour" },
    ];
    // Update URL when currentStep changes
    useEffect(() => {
        const stepInUrl = currentStep + 1;
        const newUrl = `#/onboard/${stepInUrl}`;
        window.history.replaceState(null, "", newUrl);
    }, [currentStep]);

    return (
        <div
            id="rapidload-page-optimizer-wrapper"
            className={cn(
                "h-fit font-sans overflow-hidden flex flex-col text-base items-center"
            )}
        >
            <div
                id="onboard-content"
                className={cn(
                    "overflow-y-auto w-full min-h-screen flex items-center justify-center",
                    "dark:bg-brand-900"
                )}
            >
                <section
                    className={cn(
                        "relative container flex flex-col p-6 gap-4",
                        "max-w-7xl mx-auto",
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
        </div>
    );
}
