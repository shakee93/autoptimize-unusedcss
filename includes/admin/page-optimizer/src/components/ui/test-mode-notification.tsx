import {AnimatePresence, m, motion} from "framer-motion";
import React from "react";
import {cn, isAdminPage} from "lib/utils";

function TestModeNotification() {

    return (

        <AnimatePresence>
            <motion.div
                initial={{borderWidth: '0px'}}
                animate={{borderWidth: '5px'}}
                exit={{borderWidth: '0px'}}
                transition={{duration: 0.5}}
                className={cn(
                    'inset-0 z-[110002] pointer-events-none fixed',
                    'border-solid border-amber-500 rounded-none',
                    isAdminPage && 'ml-[160px] mt-8',
                )}>
                <div className={cn(
                    'absolute -inset-[3px] rounded-xl',
                    'border-[3px] border-amber-500'
                )}/>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{
                    ease: 'easeInOut',
                    duration: 0.5,
                }}
                className="w-full z-[999999] bottom-0 fixed text-[13px] bg-amber-500 items-center text-center py-0.5 dark:bg-brand-950"
            >
                <span className="font-semibold text-purple-900 dark:text-brand-300">Test Mode turned on,</span>
                optimizations are safely previewed without affecting your live website. Perfect for experimentation and
                fine-tuning.
            </motion.div>
        </AnimatePresence>

    );
}

export default TestModeNotification;
