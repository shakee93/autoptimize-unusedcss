import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {AnimatePresence, m, motion} from 'framer-motion';
import {cn} from "lib/utils";

interface AccordionProps{
    isOpen: boolean;
    initialRender?: boolean
    onAnimationComplete?: () => void
    onHeightChange?: () => void
    children: ReactNode,
    className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
                                                        isOpen,
                                                        initialRender = false,
                                                        children,
                                                        onAnimationComplete,
                                                        onHeightChange,
    className,
                                                        ...props
                                                    }) => {
    const [isFirstRender, setIsFirstRender] = useState(!initialRender);
    const divRef = useRef(null); // Reference for the m.div
    const variants = {
        open: { height: 'auto', opacity: 1, overflow: 'visible' },
        closed: { height: 0, opacity: 0.5, overflow: 'hidden' },
    };

    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <m.div

                    ref={divRef}
                    className={cn(
                        'w-full', className
                    )}
                    variants={variants}
                    key="auditContent"
                    transition={{
                        duration: 0.2,
                        ease: [0.04, 0.62, 0.23, 0.98]
                    }}
                    initial={isFirstRender ? "open" : "closed"}
                    animate='open'
                    exit='closed'
                    onAnimationComplete={() => onAnimationComplete && onAnimationComplete()}
                    {...props}
                >
                    { children }
                </m.div>
            )}
        </AnimatePresence>
    );
}
