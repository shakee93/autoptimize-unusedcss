import React from "react";
import { m } from "framer-motion";
import { cn } from "lib/utils";
import StepOne from "app/onboard/components/StepOne";
import StepTwo from "app/onboard/components/StepTwo";


export default function Onboard() {
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
                id="onboard-wrapper"
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
                        <StepTwo/>
                    </section>
                </div>
            </m.div>
        </>
    );
}
