import React, {useState} from "react";
import { m } from "framer-motion";
import { cn } from "lib/utils";
import StepOne from "app/onboard/components/StepOne";
import StepTwo from "app/onboard/components/StepTwo";
import { AnimatePresence, motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import AppButton from "components/ui/app-button";

export default function Onboard() {
    const [open, setOpen] = useState(false);
    const [showStepTwo, setShowStepTwo] = useState(false);

    const handleNextStep = () => setShowStepTwo(true);

    return (
        <>

            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    ease: 'linear',
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
                            "relative container flex flex-col p-6 gap-4",
                        )}
                    >
                        <AnimatePresence mode="wait">


                            {showStepTwo ? (
                                <motion.div
                                    key="stepTwo"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 100, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <StepTwo />
                                </motion.div>
                            ): (
                                <motion.div
                                    key="stepOne"
                                    initial={{x: 0, opacity: 1}}
                                    animate={{x: showStepTwo ? -100 : 0, opacity: 1}}
                                    exit={{x: -100, opacity: 0}}
                                    transition={{duration: 0.2}}
                                >
                                    <StepOne onNext={handleNextStep}/>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </m.div>
        </>
    );
}
